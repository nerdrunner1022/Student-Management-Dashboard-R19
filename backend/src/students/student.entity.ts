import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type StudentStatus = 'Active' | 'Suspended';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  course: string;

  @Column('real')
  gpa: number;

  @Column('text')
  status: StudentStatus;
}