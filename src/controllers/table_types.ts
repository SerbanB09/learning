import {prisma} from "../manager/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../errors/AppError";

export const findMany = asyncHandler(async (req, res) => {
    const table_types = await prisma.table_types.findMany({
        where: { account_id: req.user.account_id }
    });

    res.status(200).send(table_types);
});

export const getOne = asyncHandler(async (req, res) => {
    const table_type = await prisma.table_types.findUnique({
        where: {
            id: req.params.id,
            account_id: req.user.account_id
        }
    });

    if (!table_type) {
        throw new AppError('Table type not found', 404);
    }

    res.send(table_type);
});

export const updateOne = asyncHandler(async (req, res) => {
    const { account_id, ...data } = req.body;

    const table_type = await prisma.table_types.update({
        where: {
            id: req.params.id,
            account_id: req.user.account_id
        },
        data
    }).catch(() => null);

    if (!table_type) {
        throw new AppError('Table type not found', 404);
    }

    res.status(200).send(table_type);
});

export const deleteOne = asyncHandler(async (req, res) => {
    const table_type = await prisma.table_types.delete({
        where: {
            id: req.params.id,
            account_id: req.user.account_id
        }
    }).catch(() => null);

    if (!table_type) {
        throw new AppError('Table type not found', 404);
    }

    res.status(204).send();
});

export const createOne = asyncHandler(async (req, res) => {
    const { account_id, ...data } = req.body;

    const table_type = await prisma.table_types.create({
        data: { ...data, account_id: req.user.account_id }
    });

    res.status(201).send(table_type);
});