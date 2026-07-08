import { ApiProperty } from '@nestjs/swagger';
import { MilestoneStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateMilestoneDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsDateString()
  dueAt: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  reminderAt?: string;

  @ApiProperty({ enum: MilestoneStatus, required: false })
  @IsEnum(MilestoneStatus)
  @IsOptional()
  status?: MilestoneStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  assignedToId?: string;
}
