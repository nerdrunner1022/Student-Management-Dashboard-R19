import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';
import type { StudentStatus } from '../student.entity.js';

export class CreateStudentDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  course: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(4)
  gpa: number;

  @IsOptional()
  @IsIn(['Active', 'Suspended'])
  status?: StudentStatus;
}