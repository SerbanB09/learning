import {prisma} from "../manager/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../errors/AppError";

export const findMany = asyncHandler(async (req, res) => {
    const venues = await prisma.venues.findMany({
        where: { account_id: req.user.account_id }
    });

    res.status(200).send(venues);
});

export const getOne = asyncHandler(async (req, res) => {
    const venue = await prisma.venues.findUnique({
        where: {
            id: req.params.id,
            account_id: req.user.account_id
        }
    });

    if (!venue) {
        throw new AppError('Venue not found', 404);
    }

    res.send(venue);
});

export const updateOne = asyncHandler(async (req, res) => {
    const { account_id, ...data } = req.body;

    const venue = await prisma.venues.update({
        where: {
            id: req.params.id,
            account_id: req.user.account_id
        },
        data
    }).catch(() => null);

    if (!venue) {
        throw new AppError('Venue not found', 404);
    }

    res.status(200).send(venue);
});

export const deleteOne = asyncHandler(async (req, res) => {
    const venue = await prisma.venues.delete({
        where: {
            id: req.params.id,
            account_id: req.user.account_id
        }
    }).catch(() => null);

    if (!venue) {
        throw new AppError('Venue not found', 404);
    }

    res.status(204).send();
});

export const createOne = asyncHandler(async (req, res) => {
    const { account_id, ...data } = req.body;

    const venue = await prisma.venues.create({
        data: { ...data, account_id: req.user.account_id }
    });

    res.status(201).send(venue);
});