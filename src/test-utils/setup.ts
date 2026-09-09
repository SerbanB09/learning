import request from 'supertest';
import app from '../index';
import { prisma } from '../manager/prisma';

export interface TestAccountContext {
    accountId: string;
    userId: string;
    email: string;
    password: string;
    token: string;
}

export async function createTestAccount(label: string): Promise<TestAccountContext> {
    const accountRes = await request(app)
        .post('/accounts')
        .send({ name: `Test Account ${label} ${Date.now()}` });

    const accountId = accountRes.body.id;

    const email = `test-${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
    const password = 'testpass123';

    await request(app)
        .post('/users')
        .send({
            account_id: accountId,
            first_name: 'Test',
            last_name: label,
            email,
            password
        });

    const loginRes = await request(app)
        .post('/users/login')
        .send({ email, password });

    return {
        accountId,
        userId: loginRes.body.user.id,
        email,
        password,
        token: loginRes.body.token
    };
}

export async function cleanupTestAccount(accountId: string) {
    const venues = await prisma.venues.findMany({ where: { account_id: accountId }, select: { id: true } });
    const venueIds = venues.map(v => v.id);

    const areas = await prisma.areas.findMany({ where: { venue_id: { in: venueIds } }, select: { id: true } });
    const areaIds = areas.map(a => a.id);

    const tables = await prisma.tables.findMany({ where: { area_id: { in: areaIds } }, select: { id: true } });
    const tableIds = tables.map(t => t.id);

    await prisma.bookings.deleteMany({ where: { table_id: { in: tableIds } } });
    await prisma.tables.deleteMany({ where: { id: { in: tableIds } } });
    await prisma.areas.deleteMany({ where: { id: { in: areaIds } } });
    await prisma.table_types.deleteMany({ where: { account_id: accountId } });
    await prisma.venues.deleteMany({ where: { account_id: accountId } });
    await prisma.users.deleteMany({ where: { account_id: accountId } });
    await prisma.accounts.deleteMany({ where: { id: accountId } });
}

export interface BookableTable {
    venueId: string;
    areaId: string;
    tableTypeId: string;
    tableId: string;
}

export async function createBookableTable(ctx: TestAccountContext): Promise<BookableTable> {
    const venueRes = await request(app)
        .post('/venues')
        .set('Authorization', `Bearer ${ctx.token}`)
        .send({ name: `Venue ${Date.now()}`, address: 'Test address' });
    const venueId = venueRes.body.id;

    const areaRes = await request(app)
        .post('/areas')
        .set('Authorization', `Bearer ${ctx.token}`)
        .send({ venue_id: venueId, name: 'Test area', width: 100, height: 100 });
    const areaId = areaRes.body.id;

    const tableTypeRes = await request(app)
        .post('/table_types')
        .set('Authorization', `Bearer ${ctx.token}`)
        .send({ name: 'Test table type', width: 80, height: 80 });
    const tableTypeId = tableTypeRes.body.id;

    const tableRes = await request(app)
        .post('/tables')
        .set('Authorization', `Bearer ${ctx.token}`)
        .send({ area_id: areaId, table_type_id: tableTypeId, name: 'T1', seat_count: 4, position_x: 0, position_y: 0 });
    const tableId = tableRes.body.id;

    return { venueId, areaId, tableTypeId, tableId };
}