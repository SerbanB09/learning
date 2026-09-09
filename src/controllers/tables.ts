import {prisma} from "../manager/prisma";
import express from "express";

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

async function findMany(req: express.Request, res: express.Response) {
    const areaIds = await getAccountAreaIds(req.user.account_id);

    const tables = await prisma.tables.findMany({
        where: { area_id: { in: areaIds } }
    });

    res.status(200).send(tables);
}

async function getOne(req: express.Request, res: express.Response) {
    try {
        const table = await prisma.tables.findUnique({
            where: { id: req.params.id }
        });

        if (!table) {
            res.status(404).send({ "error": "Resource not found" });
            return;
        }

        const areaIds = await getAccountAreaIds(req.user.account_id);

        if (!areaIds.includes(table.area_id)) {
            res.status(404).send({ "error": "Resource not found" });
            return;
        }

        res.send(table);
    } catch (e) {
        res.status(404).send({
            "error": "Resource not found"
        });
    }
}

async function updateOne(req: express.Request, res: express.Response) {
    const { area_id, table_type_id, ...data } = req.body;

    try {
        const existing = await prisma.tables.findUnique({
            where: { id: req.params.id }
        });

        if (!existing) {
            res.status(404).send({ "error": "Resource not found" });
            return;
        }

        const areaIds = await getAccountAreaIds(req.user.account_id);

        if (!areaIds.includes(existing.area_id)) {
            res.status(404).send({ "error": "Resource not found" });
            return;
        }

        const table = await prisma.tables.update({
            where: { id: req.params.id },
            data
        });

        res.status(200).send(table);
    } catch (e) {
        res.status(404).send({
            "error": "Resource not found"
        });
    }
}

async function deleteOne(req: express.Request, res: express.Response) {
    try {
        const existing = await prisma.tables.findUnique({
            where: { id: req.params.id }
        });

        if (!existing) {
            res.status(404).send({ "error": "Resource not found" });
            return;
        }

        const areaIds = await getAccountAreaIds(req.user.account_id);

        if (!areaIds.includes(existing.area_id)) {
            res.status(404).send({ "error": "Resource not found" });
            return;
        }

        await prisma.tables.delete({
            where: { id: req.params.id }
        });

        res.status(204).send('');
    } catch (e) {
        res.status(404).send({
            "error": "Resource not found"
        });
    }
}

async function createOne(req: express.Request, res: express.Response) {
    const { area_id, table_type_id, ...data } = req.body;

    const areaIds = await getAccountAreaIds(req.user.account_id);

    if (!areaIds.includes(area_id)) {
        res.status(400).send({ "error": "Invalid area_id" });
        return;
    }

    const tableType = await prisma.table_types.findUnique({
        where: { id: table_type_id, account_id: req.user.account_id }
    });

    if (!tableType) {
        res.status(400).send({ "error": "Invalid table_type_id" });
        return;
    }

    const table = await prisma.tables.create({
        data: { ...data, area_id, table_type_id }
    })

    res.status(201).send(table);
}

export {findMany, getOne, deleteOne, createOne, updateOne}