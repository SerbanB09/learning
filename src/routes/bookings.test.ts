import request from 'supertest';
import app from '../index';
import {
    createTestAccount,
    createBookableTable,
    cleanupTestAccount,
    TestAccountContext,
    BookableTable
} from '../test-utils/setup';

describe('Bookings — conflict detection', () => {
    let account: TestAccountContext;
    let table: BookableTable;

    beforeAll(async () => {
        account = await createTestAccount('bookingsConflict');
        table = await createBookableTable(account);
    });

    afterAll(async () => {
        await cleanupTestAccount(account.accountId);
    });

    it('should create a booking successfully', async () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(19, 0, 0, 0);

        const response = await request(app)
            .post('/bookings')
            .set('Authorization', `Bearer ${account.token}`)
            .send({
                table_id: table.tableId,
                venue_id: table.venueId,
                person_count: 2,
                date: date.toISOString()
            });

        expect(response.status).toBe(201);
    });

    it('should reject a second booking on the same table within the 2-hour window', async () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(20, 0, 0, 0); // 1 hour after the first booking — inside the conflict window

        const response = await request(app)
            .post('/bookings')
            .set('Authorization', `Bearer ${account.token}`)
            .send({
                table_id: table.tableId,
                venue_id: table.venueId,
                person_count: 2,
                date: date.toISOString()
            });

        expect(response.status).toBe(409);
    });

    it('should allow a booking on the same table outside the conflict window', async () => {
        const date = new Date();
        date.setDate(date.getDate() + 2); // a full day later
        date.setHours(19, 0, 0, 0);

        const response = await request(app)
            .post('/bookings')
            .set('Authorization', `Bearer ${account.token}`)
            .send({
                table_id: table.tableId,
                venue_id: table.venueId,
                person_count: 2,
                date: date.toISOString()
            });

        expect(response.status).toBe(201);
    });
});

describe('Bookings — cross-account table_id', () => {
    let accountA: TestAccountContext;
    let accountB: TestAccountContext;
    let tableA: BookableTable;

    beforeAll(async () => {
        accountA = await createTestAccount('bookingsCrossA');
        accountB = await createTestAccount('bookingsCrossB');
        tableA = await createBookableTable(accountA);
    });

    afterAll(async () => {
        await cleanupTestAccount(accountA.accountId);
        await cleanupTestAccount(accountB.accountId);
    });

    it("should reject a booking from account B on account A's table", async () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(19, 0, 0, 0);

        const response = await request(app)
            .post('/bookings')
            .set('Authorization', `Bearer ${accountB.token}`)
            .send({
                table_id: tableA.tableId,
                venue_id: tableA.venueId,
                person_count: 2,
                date: date.toISOString()
            });

        expect(response.status).toBe(400);
    });
});