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
        const res = await request(app.getHttpServer()).get('/registry/discovery').expect(200);

        expect(res.body).toHaveProperty('services');
        expect(Array.isArray(res.body.services)).toBe(true);
        expect(res.body.services.length).toBeGreaterThan(0);
    });
});
