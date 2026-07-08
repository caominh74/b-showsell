import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { toSlug } from '../../common/slug';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  list(status?: string) {
    return this.prisma.brand.findMany({
      where: { status: status as never },
      include: { _count: { select: { campaigns: true, products: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(dto: CreateBrandDto) {
    return this.prisma.brand.create({
      data: {
        ...dto,
        slug: dto.slug ? toSlug(dto.slug) : toSlug(dto.name),
      },
    });
  }

  async findOne(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: { campaigns: true, products: true },
    });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand;
  }

  async update(id: string, dto: UpdateBrandDto) {
    await this.findOne(id);
    return this.prisma.brand.update({
      where: { id },
      data: {
        ...dto,
        slug: dto.slug ? toSlug(dto.slug) : undefined,
      },
    });
  }
}
