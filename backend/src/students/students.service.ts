import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student, StudentStatus } from './student.entity.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { ListStudentsQueryDto } from './dto/list-students-query.dto.js';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  async findAll(query: ListStudentsQueryDto): Promise<Student[]> {
    const queryBuilder = this.studentsRepository.createQueryBuilder('student');

    if (query.q) {
      queryBuilder.andWhere('(student.name ILIKE :q OR student.course ILIKE :q)', {
        q: `%${query.q}%`,
      });
    }
    if (query.course) {
      queryBuilder.andWhere('student.course = :course', { course: query.course });
    }
    if (query.status) {
      queryBuilder.andWhere('student.status = :status', { status: query.status });
    }
    if (query.minGpa !== undefined) {
      queryBuilder.andWhere('student.gpa >= :minGpa', { minGpa: query.minGpa });
    }
    if (query.maxGpa !== undefined) {
      queryBuilder.andWhere('student.gpa < :maxGpa', { maxGpa: query.maxGpa });
    }

    return queryBuilder.orderBy('student.name', 'ASC').getMany();
  }

  async findOne(id: number): Promise<Student> {
    const student = await this.studentsRepository.findOneBy({ id });
    if (!student) {
      throw new NotFoundException(`Student #${id} not found`);
    }
    return student;
  }

  async create(dto: CreateStudentDto): Promise<Student> {
    const student = new Student();
    student.name = dto.name;
    student.email = dto.email;
    student.course = dto.course;
    student.gpa = dto.gpa;
    student.status = dto.status ?? 'Active';
    return this.studentsRepository.save(student);
  }

  async updateStatus(id: number, status: StudentStatus): Promise<Student> {
    const student = await this.findOne(id);
    student.status = status;
    return this.studentsRepository.save(student);
  }

  async remove(id: number): Promise<void> {
    const result = await this.studentsRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Student #${id} not found`);
    }
  }
}