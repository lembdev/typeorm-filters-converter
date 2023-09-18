import type { ITimeOperator } from '../filters.types';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TimeRangeInput } from './time-range.input';
import { hasOtherValues } from '../helpers/has-other-values';

export class TimeInput implements ITimeOperator {
  @Type(() => String)
  @IsString()
  @ValidateIf((obj) => !hasOtherValues(obj, 'eq'))
  @ApiProperty({ type: String, nullable: true })
  readonly eq?: string | null;

  @Type(() => String)
  @IsString()
  @ValidateIf((obj) => !hasOtherValues(obj, 'notEq'))
  @ApiProperty({ type: String, nullable: true })
  readonly notEq?: string | null;

  @Type(() => String)
  @IsString()
  @ValidateIf((obj) => !hasOtherValues(obj, 'before'))
  @ApiProperty({ type: String, nullable: true })
  readonly before?: string;

  @Type(() => String)
  @IsString()
  @ValidateIf((obj) => !hasOtherValues(obj, 'beforeOrEq'))
  @ApiProperty({ type: String, nullable: true })
  readonly beforeOrEq?: string;

  @Type(() => String)
  @IsString()
  @ValidateIf((obj) => !hasOtherValues(obj, 'after'))
  @ApiProperty({ type: String, nullable: true })
  readonly after?: string;

  @Type(() => String)
  @IsString()
  @ValidateIf((obj) => !hasOtherValues(obj, 'afterOrEq'))
  @ApiProperty({ type: String, nullable: true })
  readonly afterOrEq?: string;

  @Type(() => TimeRangeInput)
  @ValidateIf((obj) => !hasOtherValues(obj, 'between'))
  @ApiProperty({ type: String, nullable: true })
  @ValidateNested()
  readonly between?: TimeRangeInput;

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
