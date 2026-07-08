import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'node:fs';
import { extname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { toSlug } from '../../common/slug';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UploadProductImageDto } from './dto/upload-product-image.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  listProducts(status?: string, categoryId?: string) {
    return this.prisma.product.findMany({
      where: { status: status as never, categoryId },
      include: { brand: true, category: true, images: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  createProduct(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...dto,
        slug: dto.slug ? toSlug(dto.slug) : toSlug(dto.name),
        costPrice: dto.costPrice ?? 0,
      },
      include: { brand: true, category: true },
    });
  }

  async findProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { brand: true, category: true, images: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    await this.findProduct(id);
    return this.prisma.product.update({
      where: { id },
      data: {
        ...dto,
        slug: dto.slug ? toSlug(dto.slug) : undefined,
      },
      include: { brand: true, category: true, images: true },
    });
  }

  listCategories() {
    return this.prisma.productCategory.findMany({
      include: { parent: true, _count: { select: { products: true, children: true } } },
      orderBy: { name: 'asc' },
    });
  }

  createCategory(dto: CreateCategoryDto) {
    return this.prisma.productCategory.create({
      data: {
        ...dto,
        slug: dto.slug ? toSlug(dto.slug) : toSlug(dto.name),
      },
    });
  }

  updateCategory(id: string, dto: UpdateCategoryDto) {
    return this.prisma.productCategory.update({
      where: { id },
      data: {
        ...dto,
        slug: dto.slug ? toSlug(dto.slug) : undefined,
      },
    });
  }

  async addImage(productId: string, dto: UploadProductImageDto) {
    await this.findProduct(productId);
    const url = await this.saveLocalImage(dto);
    if (dto.isPrimary) {
      await this.prisma.productImage.updateMany({ where: { productId }, data: { isPrimary: false } });
    }
    return this.prisma.productImage.create({
      data: {
        productId,
        url,
        altText: dto.altText,
        sortOrder: dto.sortOrder ?? 0,
        isPrimary: dto.isPrimary ?? false,
      },
    });
  }

  async updateImage(id: string, dto: Partial<UploadProductImageDto>) {
    const image = await this.prisma.productImage.findUnique({ where: { id } });
    if (!image) {
      throw new NotFoundException('Product image not found');
    }
    if (dto.isPrimary) {
      await this.prisma.productImage.updateMany({
        where: { productId: image.productId },
        data: { isPrimary: false },
      });
    }
    return this.prisma.productImage.update({
      where: { id },
      data: {
        altText: dto.altText,
        sortOrder: dto.sortOrder,
        isPrimary: dto.isPrimary,
      },
    });
  }

  removeImage(id: string) {
    return this.prisma.productImage.delete({ where: { id } });
  }

  private async saveLocalImage(dto: UploadProductImageDto) {
    const [, metadata, payload] = dto.data.match(/^data:(.*?);base64,(.*)$/) ?? [];
    const base64 = payload ?? dto.data;
    const extension = extname(dto.fileName) || this.extensionFromMime(metadata);
    if (!base64 || !extension) {
      throw new BadRequestException('Invalid image upload payload');
    }
    const uploadDir = join(process.cwd(), 'uploads', 'products');
    await fs.mkdir(uploadDir, { recursive: true });
    const fileName = `${randomUUID()}${extension}`;
    await fs.writeFile(join(uploadDir, fileName), Buffer.from(base64, 'base64'));
    return `/uploads/products/${fileName}`;
  }

  private extensionFromMime(mime?: string) {
    if (mime === 'image/png') return '.png';
    if (mime === 'image/webp') return '.webp';
    if (mime === 'image/jpeg' || mime === 'image/jpg') return '.jpg';
    return '';
  }
}
