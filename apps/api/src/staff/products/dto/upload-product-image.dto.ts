import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UploadProductImageDto {
  @ApiProperty({ description: 'Base64 data URL or raw base64 payload.' })
  @IsString()
  data: string;

  @ApiProperty({ example: 'serum.jpg' })
  @IsString()
  fileName: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  altText?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  sortOrder?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}
