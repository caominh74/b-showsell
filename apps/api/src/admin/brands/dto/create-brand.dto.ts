import { ApiProperty } from '@nestjs/swagger';
import { BrandStatus } from '@prisma/client';
import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  contactName?: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  contactPhone?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  websiteUrl?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  facebookUrl?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  tiktokUrl?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  defaultCommissionRate?: number;

  @ApiProperty({ enum: BrandStatus, required: false })
  @IsEnum(BrandStatus)
  @IsOptional()
  status?: BrandStatus;
}
