import { SEED_STUDENTS } from './seed-data.js';

describe('SEED_STUDENTS', () => {
  it('contains the 14 original records', () => {
    expect(SEED_STUDENTS).toHaveLength(14);
  });

  it('every record has a valid shape', () => {
    for (const student of SEED_STUDENTS) {
      expect(typeof student.name).toBe('string');
      expect(student.name.length).toBeGreaterThan(0);
      expect(typeof student.email).toBe('string');
      expect(student.email).toContain('@');
      expect(typeof student.course).toBe('string');
      expect(student.course.length).toBeGreaterThan(0);
      expect(typeof student.gpa).toBe('number');
      expect(student.gpa).toBeGreaterThanOrEqual(0);
      expect(student.gpa).toBeLessThanOrEqual(4);
      expect(['Active', 'Suspended']).toContain(student.status);
    }
  });
});