import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

describe('Students API (e2e)', () => {
  let app: INestApplication<App>;
  let createdId: number;

  beforeAll(async () => {
    process.env.DB_PATH = ':memory:';
    const { AppModule } = await import('../src/app.module.js');

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/students returns seeded students', async () => {
    const res = await request(app.getHttpServer()).get('/api/students').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(14);
  });

  it('GET /api/students filters by search term q', async () => {
    const res = await request(app.getHttpServer()).get('/api/students').query({ q: 'marine' }).expect(200);
    expect(res.body.length).toBeGreaterThan(0);
    for (const student of res.body) {
      const haystack = `${student.name} ${student.course}`.toLowerCase();
      expect(haystack).toContain('marine');
    }
  });

  it('GET /api/students filters by status and GPA range', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/students')
      .query({ status: 'Active', minGpa: '3.5' })
      .expect(200);
    expect(res.body.length).toBeGreaterThan(0);
    for (const student of res.body) {
      expect(student.status).toBe('Active');
      expect(student.gpa).toBeGreaterThanOrEqual(3.5);
    }
  });

  it('GET /api/students with no matches returns an empty array', async () => {
    const res = await request(app.getHttpServer()).get('/api/students').query({ q: 'zzzz-no-match' }).expect(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/students creates a new student', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/students')
      .send({ name: 'Test Student', email: 'test@example.com', course: 'Testing', gpa: 3.5 })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('Test Student');
    expect(res.body.status).toBe('Active');
    createdId = res.body.id;
  });

  it('POST /api/students rejects an invalid GPA', async () => {
    await request(app.getHttpServer())
      .post('/api/students')
      .send({ name: 'Bad GPA', email: 'bad@example.com', course: 'Testing', gpa: 9 })
      .expect(400);
  });

  it('POST /api/students rejects an invalid email', async () => {
    await request(app.getHttpServer())
      .post('/api/students')
      .send({ name: 'Bad Email', email: 'not-an-email', course: 'Testing', gpa: 3.0 })
      .expect(400);
  });

  it('PATCH /api/students/:id/status suspends a student', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/students/${createdId}/status`)
      .send({ status: 'Suspended' })
      .expect(200);
    expect(res.body.status).toBe('Suspended');
  });

  it('PATCH /api/students/:id/status rejects an invalid status', async () => {
    await request(app.getHttpServer())
      .patch(`/api/students/${createdId}/status`)
      .send({ status: 'Banana' })
      .expect(400);
  });

  it('DELETE /api/students/:id removes the student', async () => {
    await request(app.getHttpServer()).delete(`/api/students/${createdId}`).expect(204);
    await request(app.getHttpServer()).get(`/api/students/${createdId}`).expect(404);
  });

  it('PATCH /api/students/:id/status on a missing student returns 404', async () => {
    await request(app.getHttpServer())
      .patch('/api/students/999999/status')
      .send({ status: 'Active' })
      .expect(404);
  });
});