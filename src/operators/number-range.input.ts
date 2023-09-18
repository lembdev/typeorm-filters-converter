import type { INumberRange } from '../filters.types';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class NumberRangeInput implements INumberRange {
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ type: Number })
  readonly start!: number;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ type: Number })
  readonly end!: number;
}
