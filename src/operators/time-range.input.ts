import type { ITimeRange } from '../filters.types';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TimeRangeInput implements ITimeRange {
  @Type(() => String)
  @IsString()
  @ApiProperty({ type: String })
  readonly start!: string;

  @Type(() => String)
  @IsString()
  @ApiProperty({ type: String })
  readonly end!: string;
}
