import request from 'supertest';
import app from '../index';
import { createTestAccount, cleanupTestAccount, TestAccountContext } from '../test-utils/setup';

describe('POST /users/login', () => {
    it('should return 400 if data sent is invalid (Zod Validation)', async () => {
        const response = await request(app)
            .post('/users/login')
            .send({
                email: 'invalid-email-without-at',
                password: '123'
            });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
        expect(response.body.message).toBeDefined();
    });
});

describe('Authentication middleware', () => {
    let ctx: TestAccountContext;

    beforeAll(async () => {
        ctx = await createTestAccount('auth');
    });

    afterAll(async () => {
        await cleanupTestAccount(ctx.accountId);
    });

    it('should return 401 on GET /users without token', async () => {
        const response = await request(app).get('/users');

        expect(response.status).toBe(401);
    });

    it('should return 401 with an invalid token', async () => {
        const response = await request(app)
            .get('/users')
            .set('Authorization', 'Bearer an-invalid-token');

        expect(response.status).toBe(401);
    });

    it('should return 200 and the created user, with a valid token', async () => {
        const response = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${ctx.token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.some((u: any) => u.id === ctx.userId)).toBe(true);
    });
});