import {prisma} from "../manager/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../errors/AppError";

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

export const findMany = asyncHandler(async (req, res) => {
    const areaIds = await getAccountAreaIds(req.user.account_id);

    const tables = await prisma.tables.findMany({
        where: { area_id: { in: areaIds } }
    });

    res.status(200).send(tables);
});

export const getOne = asyncHandler(async (req, res) => {
    const table = await prisma.tables.findUnique({
        where: { id: req.params.id }
    });

    if (!table) {
        throw new AppError('Table not found', 404);
    }

    const areaIds = await getAccountAreaIds(req.user.account_id);

    if (!areaIds.includes(table.area_id)) {
        throw new AppError('Table not found', 404);
    }

    res.send(table);
});

export const updateOne = asyncHandler(async (req, res) => {
    const { area_id, table_type_id, ...data } = req.body;

    const existing = await prisma.tables.findUnique({
        where: { id: req.params.id }
    });

    if (!existing) {
        throw new AppError('Table not found', 404);
    }

    const areaIds = await getAccountAreaIds(req.user.account_id);

    if (!areaIds.includes(existing.area_id)) {
        throw new AppError('Table not found', 404);
    }

    const table = await prisma.tables.update({
        where: { id: req.params.id },
        data
    });

    res.status(200).send(table);
});

export const deleteOne = asyncHandler(async (req, res) => {
    const existing = await prisma.tables.findUnique({
        where: { id: req.params.id }
    });

    if (!existing) {
        throw new AppError('Table not found', 404);
    }

    const areaIds = await getAccountAreaIds(req.user.account_id);

    if (!areaIds.includes(existing.area_id)) {
        throw new AppError('Table not found', 404);
    }

    await prisma.tables.delete({
        where: { id: req.params.id }
    });

    res.status(204).send();
});

export const createOne = asyncHandler(async (req, res) => {
    const { area_id, table_type_id, ...data } = req.body;

    const areaIds = await getAccountAreaIds(req.user.account_id);

    if (!areaIds.includes(area_id)) {
        throw new AppError('Invalid area_id', 400);
    }

    const tableType = await prisma.table_types.findUnique({
        where: { id: table_type_id, account_id: req.user.account_id }
    });

    if (!tableType) {
        throw new AppError('Invalid table_type_id', 400);
    }

    const table = await prisma.tables.create({
        data: { ...data, area_id, table_type_id }
    });

    res.status(201).send(table);
});