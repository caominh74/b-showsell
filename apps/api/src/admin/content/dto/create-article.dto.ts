import { ApiProperty } from '@nestjs/swagger';
import { ArticleStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  campaignId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  brandId?: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiProperty()
  @IsString()
  bodyMarkdown: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  coverImageUrl?: string;

  @ApiProperty({ enum: ArticleStatus, required: false })
  @IsEnum(ArticleStatus)
  @IsOptional()
  status?: ArticleStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  scheduledAt?: string;
}
