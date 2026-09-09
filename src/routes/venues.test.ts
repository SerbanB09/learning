import request from 'supertest';
import app from '../index';
import { createTestAccount, cleanupTestAccount, TestAccountContext } from '../test-utils/setup';

describe('Venues — account isolation', () => {
    let accountA: TestAccountContext;
    let accountB: TestAccountContext;
    let venueA: any;

    beforeAll(async () => {
        accountA = await createTestAccount('venuesA');
        accountB = await createTestAccount('venuesB');

        const res = await request(app)
            .post('/venues')
            .set('Authorization', `Bearer ${accountA.token}`)
            .send({ name: 'Venue A', address: 'Strada A' });

        venueA = res.body;
    });

    afterAll(async () => {
        await cleanupTestAccount(accountA.accountId);
        await cleanupTestAccount(accountB.accountId);
    });

    it("should not include account A's venue in account B's list", async () => {
        const response = await request(app)
            .get('/venues')
            .set('Authorization', `Bearer ${accountB.token}`);

        expect(response.status).toBe(200);
        expect(response.body.some((v: any) => v.id === venueA.id)).toBe(false);
    });

    it("should return 404 when account B fetches account A's venue", async () => {
        const response = await request(app)
            .get(`/venues/${venueA.id}`)
            .set('Authorization', `Bearer ${accountB.token}`);

        expect(response.status).toBe(404);
    });

    it("should return 404 when account B tries to update account A's venue", async () => {
        const response = await request(app)
            .patch(`/venues/${venueA.id}`)
            .set('Authorization', `Bearer ${accountB.token}`)
            .send({ name: 'Hacked' });

        expect(response.status).toBe(404);
    });

    it("should return 404 when account B tries to delete account A's venue", async () => {
        const response = await request(app)
            .delete(`/venues/${venueA.id}`)
            .set('Authorization', `Bearer ${accountB.token}`);

        expect(response.status).toBe(404);
    });

    it("should leave account A's venue unchanged after account B's attempts", async () => {
        const response = await request(app)
            .get(`/venues/${venueA.id}`)
            .set('Authorization', `Bearer ${accountA.token}`);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Venue A');
    });

    it("should return 400 when account B creates an area referencing account A's venue_id", async () => {
        const response = await request(app)
            .post('/areas')
            .set('Authorization', `Bearer ${accountB.token}`)
            .send({ venue_id: venueA.id, name: 'Stolen area', width: 100, height: 100 });

        expect(response.status).toBe(400);
    });
});