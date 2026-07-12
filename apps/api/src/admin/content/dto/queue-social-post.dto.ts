import { ApiProperty } from '@nestjs/swagger';
import { SocialPlatform } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class QueueSocialPostDto {
  @ApiProperty()
  @IsString()
  campaignId: string;

  @ApiProperty({ enum: SocialPlatform })
  @IsEnum(SocialPlatform)
  platform: SocialPlatform;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  scheduledAt?: string;
}
