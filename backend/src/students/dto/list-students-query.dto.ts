import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import type { StudentStatus } from '../student.entity.js';

export class ListStudentsQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  course?: string;

  @IsOptional()
  @IsIn(['Active', 'Suspended'])
  status?: StudentStatus;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minGpa?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxGpa?: number;
}