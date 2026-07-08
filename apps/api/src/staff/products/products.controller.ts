import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UploadProductImageDto } from './dto/upload-product-image.dto';
import { ProductsService } from './products.service';

@ApiTags('staff products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.STAFF)
@Controller('staff')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products')
  listProducts(@Query('status') status?: string, @Query('categoryId') categoryId?: string) {
    return this.productsService.listProducts(status, categoryId);
  }

  @Post('products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @Get('products/:id')
  findProduct(@Param('id') id: string) {
    return this.productsService.findProduct(id);
  }

  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(id, dto);
  }

  @Post('products/:id/images')
  addImage(@Param('id') id: string, @Body() dto: UploadProductImageDto) {
    return this.productsService.addImage(id, dto);
  }

  @Patch('product-images/:id')
  updateImage(@Param('id') id: string, @Body() dto: Partial<UploadProductImageDto>) {
    return this.productsService.updateImage(id, dto);
  }

  @Delete('product-images/:id')
  removeImage(@Param('id') id: string) {
    return this.productsService.removeImage(id);
  }

  @Get('categories')
  listCategories() {
    return this.productsService.listCategories();
  }

  @Post('categories')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.productsService.createCategory(dto);
  }

  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.productsService.updateCategory(id, dto);
  }
}
