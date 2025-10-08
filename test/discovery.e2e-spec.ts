import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Discovery (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns aggregated services when called without params', async () => {
    // cast getHttpServer to any to satisfy the type-checker in tests
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer())
      .get('/registry/discovery')
      .expect(200);
    const body = res.body as unknown;

    expect(typeof body === 'object' && body !== null).toBe(true);
    // test-only unsafe accesses — explicitly disable the no-unsafe rules here
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const maybeServices = (body as any).services;

    expect(Array.isArray(maybeServices)).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(maybeServices.length).toBeGreaterThan(0);
  });
});
