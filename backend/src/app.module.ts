import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { SeedService } from './database/seed.service.js';
import { Student } from './students/student.entity.js';
import { StudentsModule } from './students/students.module.js';

function databasePath(): string {
  if (process.env.DB_PATH) {
    return process.env.DB_PATH;
  }
  const file = resolve(process.cwd(), 'data', 'students.sqlite');
  mkdirSync(dirname(file), { recursive: true });
  return file;
}

const DB_PATH = databasePath();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: DB_PATH,
      entities: [Student],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Student]),
    StudentsModule,
  ],
  providers: [SeedService],
})
export class AppModule {}