import request from 'supertest';
import app from '../index'; // Importăm aplicația Express configurată curat

describe('POST /users/login', () => {
    it('ar trebui să returneze 400 dacă datele trimise sunt invalide (Zod Validation)', async () => {
        const response = await request(app)
            .post('/users/login')
            .send({
                email: 'email-invalid-fara-at',
                password: '123' // Parolă prea scurtă (minim 6 în schema Zod)
            });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
        expect(response.body.message).toBeDefined();
    });
});