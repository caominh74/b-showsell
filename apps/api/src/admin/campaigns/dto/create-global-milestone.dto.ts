import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateMilestoneDto } from './create-milestone.dto';

export class CreateGlobalMilestoneDto extends CreateMilestoneDto {
  @ApiProperty()
  @IsString()
  campaignId: string;
}
