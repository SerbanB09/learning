import {prisma} from "../manager/prisma";
import express from "express";

const BOOKING_DURATION_MS = 2 * 60 * 60 * 1000; // durată presupusă per rezervare, pentru verificarea de suprapunere

async function getAccountAreaIds(account_id: string): Promise<string[]> {
    const venues = await prisma.venues.findMany({
        where: { account_id },
        select: { id: true }
    });
    const venueIds = venues.map(v => v.id);

    const areas = await prisma.areas.findMany({
        where: { venue_id: { in: venueIds } },
        select: { id: true }
    });

    return areas.map(a => a.id);
}

async function hasConflict(table_id: string, date: Date, excludeBookingId?: string): Promise<boolean> {
    const windowStart = new Date(date.getTime() - BOOKING_DURATION_MS);
    const windowEnd = new Date(date.getTime() + BOOKING_DURATION_MS);

    const overlapping = await prisma.bookings.findMany({
        where: {
            table_id,
            date: { gte: windowStart, lte: windowEnd },
            ...(excludeBookingId ? { id: { not: excludeBookingId } } : {})
        }
    });

    return overlapping.length > 0;
}

async function findMany(req: express.Request, res: express.Response) {
    const bookings = await prisma.bookings.findMany({
        where: {
            user_id: req.user.id
        }
    });

    res.status(200).send(bookings);
}

async function getOne(req: express.Request, res: express.Response) {
    try {
        const booking = await prisma.bookings.findUnique({
            where: {
                id: req.params.id,
                user_id: req.user.id
            }
        });

        if (!booking) {
            res.status(404).send({ "error": "Resource not found" });
            return;
        }

        res.send(booking);
    } catch (e) {
        res.status(404).send({
            "error": "Resource not found"
        });
    }
}

async function updateOne(req: express.Request, res: express.Response) {
    let data = req.body;

    try {
        const existing = await prisma.bookings.findUnique({
            where: {
                id: req.params.id,
                user_id: req.user.id
            }
        });

        if (!existing) {
            res.status(404).send({ "error": "Resource not found" });
            return;
        }

        const table_id = data.table_id ?? existing.table_id;
        const date = data.date ? new Date(data.date) : existing.date;

        if (data.table_id || data.date) {
            const conflict = await hasConflict(table_id, date, existing.id);
            if (conflict) {
                res.status(409).send({ "error": "Table already booked around this time" });
                return;
            }
        }

        const booking = await prisma.bookings.update({
            where: {
                id: req.params.id,
                user_id: req.user.id
            },
            data
        });

        res.status(200).send(booking);
    } catch (e) {
        res.status(404).send({
            "error": "Resource not found"
        });
    }
}

async function deleteOne(req: express.Request, res: express.Response) {
    try {
        await prisma.bookings.delete({
            where: {
                id: req.params.id,
                user_id: req.user.id
            }
        });

        res.status(204).send('');
    } catch (e) {
        res.status(404).send({
            "error": "Resource not found"
        });
    }
}

async function createOne(req: express.Request, res: express.Response) {
    let {user_id, ...rest_of_data} = req.body;

    const areaIds = await getAccountAreaIds(req.user.account_id);

    const table = await prisma.tables.findUnique({
        where: { id: rest_of_data.table_id }
    });

    if (!table || !areaIds.includes(table.area_id)) {
        res.status(400).send({ "error": "Invalid table_id" });
        return;
    }

    const date = new Date(rest_of_data.date);

    const conflict = await hasConflict(rest_of_data.table_id, date);
    if (conflict) {
        res.status(409).send({ "error": "Table already booked around this time" });
        return;
    }

    const booking = await prisma.bookings.create({
        data: {
            ...rest_of_data,
            date,
            user_id: req.user.id
        }
    })

    res.status(201).send(booking);
}

export {findMany, getOne, deleteOne, createOne, updateOne}