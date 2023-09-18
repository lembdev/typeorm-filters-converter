import type { IDateRange } from '../filters.types';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DateRangeInput implements IDateRange {
  @Type(() => Date)
  @IsDate()
  @ApiProperty({ type: Date })
  readonly start!: Date;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({ type: Date })
  readonly end!: Date;
}
