import type { IStringOperator } from '../filters.types';
import { IsBoolean, IsString, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { hasOtherValues } from '../helpers/has-other-values';

export class StringInput implements IStringOperator {
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
  @ValidateIf((obj) => !hasOtherValues(obj, 'contains'))
  @ApiProperty({ type: String, nullable: true })
  readonly contains?: string;

  @Type(() => String)
  @IsString()
  @ValidateIf((obj) => !hasOtherValues(obj, 'notContains'))
  @ApiProperty({ type: String, nullable: true })
  readonly notContains?: string;

  @Type(() => String)
  @IsString()
  @ValidateIf((obj) => !hasOtherValues(obj, 'startsWith'))
  @ApiProperty({ type: String, nullable: true })
  readonly startsWith?: string;

  @Type(() => String)
  @IsString()
  @ValidateIf((obj) => !hasOtherValues(obj, 'notStartsWith'))
  @ApiProperty({ type: String, nullable: true })
  readonly notStartsWith?: string;

  @Type(() => String)
  @IsString()
  @ValidateIf((obj) => !hasOtherValues(obj, 'endsWith'))
  @ApiProperty({ type: String, nullable: true })
  readonly endsWith?: string;

  @Type(() => String)
  @IsString()
  @ValidateIf((obj) => !hasOtherValues(obj, 'notEndsWith'))
  @ApiProperty({ type: String, nullable: true })
  readonly notEndsWith?: string;

  @Type(() => String)
  @IsString({ each: true })
  @ValidateIf((obj) => !hasOtherValues(obj, 'in'))
  @ApiProperty({ type: [String], nullable: true })
  readonly in?: string[];

  @Type(() => String)
  @IsString({ each: true })
  @ValidateIf((obj) => !hasOtherValues(obj, 'notIn'))
  @ApiProperty({ type: [String], nullable: true })
  readonly notIn?: string[];

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
