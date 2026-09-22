import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../students/student.entity.js';
import { SEED_STUDENTS } from './seed-data.js';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (SEED_STUDENTS.length === 0) {
      return;
    }
    const count = await this.studentsRepository.count();
    if (count > 0) {
      return;
    }
    await this.studentsRepository.insert(SEED_STUDENTS);
    this.logger.log(`Seeded database with ${SEED_STUDENTS.length} students.`);
  }
}