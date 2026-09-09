import {prisma} from "../manager/prisma";
import express from "express";

async function findMany(req: express.Request, res: express.Response) {
    const venues = await prisma.venues.findMany({
        where: { account_id: req.user.account_id }
    });

    res.status(200).send(venues);
}

async function getOne(req: express.Request, res: express.Response) {
    try {
        const venue = await prisma.venues.findUnique({
            where: {
                id: req.params.id,
                account_id: req.user.account_id
            }
        });

        if (!venue) {
            res.status(404).send({ "error": "Resource not found" });
            return;
        }

        res.send(venue);
    } catch (e) {
        res.status(404).send({
            "error": "Resource not found"
        });
    }
}

async function updateOne(req: express.Request, res: express.Response) {
    const { account_id, ...data } = req.body;

    try {
        const venue = await prisma.venues.update({
            where: {
                id: req.params.id,
                account_id: req.user.account_id
            },
            data
        });

        res.status(200).send(venue);
    } catch (e) {
        res.status(404).send({
            "error": "Resource not found"
        });
    }
}

async function deleteOne(req: express.Request, res: express.Response) {
    try {
        await prisma.venues.delete({
            where: {
                id: req.params.id,
                account_id: req.user.account_id
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
    const { account_id, ...data } = req.body;

    const venue = await prisma.venues.create({
        data: { ...data, account_id: req.user.account_id }
    })

    res.status(201).send(venue);
}

export {findMany, getOne, deleteOne, createOne, updateOne}