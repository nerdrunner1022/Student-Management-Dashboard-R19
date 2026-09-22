import { IsIn } from 'class-validator';
import type { StudentStatus } from '../student.entity.js';

export class UpdateStudentStatusDto {
  @IsIn(['Active', 'Suspended'])
  status: StudentStatus;
}