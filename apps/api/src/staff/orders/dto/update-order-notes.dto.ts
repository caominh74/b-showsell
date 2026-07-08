import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateOrderNotesDto {
  @ApiProperty()
  @IsString()
  notes: string;
}
