import type { INumberOperator } from '../filters.types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { hasOtherValues } from '../helpers/has-other-values';
import { NumberRangeInput } from './number-range.input';
import { Type } from 'class-transformer';

export class NumberInput implements INumberOperator {
  @Type(() => Number)
  @IsNumber()
  @ValidateIf((obj) => !hasOtherValues(obj, 'eq'))
  @ApiProperty({ type: Number, nullable: true })
  readonly eq?: number | null;

  @Type(() => Number)
  @IsNumber()
  @ValidateIf((obj) => !hasOtherValues(obj, 'notEq'))
  @ApiProperty({ type: Number, nullable: true })
  readonly notEq?: number | null;

  @Type(() => Number)
  @IsNumber()
  @ValidateIf((obj) => !hasOtherValues(obj, 'lt'))
  @ApiProperty({ type: Number, nullable: true })
  readonly lt?: number;

  @Type(() => Number)
  @IsNumber()
  @ValidateIf((obj) => !hasOtherValues(obj, 'lte'))
  @ApiProperty({ type: Number, nullable: true })
  readonly lte?: number;

  @Type(() => Number)
  @IsNumber()
  @ValidateIf((obj) => !hasOtherValues(obj, 'gt'))
  @ApiProperty({ type: Number, nullable: true })
  readonly gt?: number;

  @Type(() => Number)
  @IsNumber()
  @ValidateIf((obj) => !hasOtherValues(obj, 'gte'))
  @ApiProperty({ type: Number, nullable: true })
  readonly gte?: number;

  @Type(() => Number)
  @IsNumber({}, { each: true })
  @ValidateIf((obj) => !hasOtherValues(obj, 'in'))
  @ApiProperty({ type: [Number], nullable: true })
  readonly in?: number[];

  @Type(() => Number)
  @IsNumber({}, { each: true })
  @ValidateIf((obj) => !hasOtherValues(obj, 'notIn'))
  @ApiProperty({ type: [Number], nullable: true })
  readonly notIn?: number[];

  @Type(() => NumberRangeInput)
  @ValidateIf((obj) => !hasOtherValues(obj, 'between'))
  @ValidateNested()
  @ApiProperty({ type: Number, nullable: true })
  readonly between?: NumberRangeInput;

  @Type(() => Boolean)
  @IsBoolean()
  @ValidateIf((obj) => !hasOtherValues(obj, 'isNull'))
  @ApiProperty({ type: Boolean, nullable: true })
  readonly isNull?: boolean;

  @Type(() => Boolean)
  @IsBoolean()
  @ValidateIf((obj) => !hasOtherValues(obj, 'isNotNull'))
  @ApiProperty({ type: Boolean, nullable: true })
  readonly isNotNull?: boolean;
}
