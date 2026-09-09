import {prisma} from "../manager/prisma";
import express from "express";

async function findMany(req: express.Request, res: express.Response) {
    const venues = await prisma.venues.findMany({
        where: { account_id: req.user.account_id },
        select: { id: true }
    });
    const venueIds = venues.map(v => v.id);

    const areas = await prisma.areas.findMany({
        where: { venue_id: { in: venueIds } }
    });

    res.status(200).send(areas);
}

async function getOne(req: express.Request, res: express.Response) {
    try {
        const area = await prisma.areas.findUnique({
            where: { id: req.params.id }
        });

        if (!area) {
            res.status(404).send({ "error": "Resource not found" });
            return;
        }

        const venue = await prisma.venues.findUnique({
            where: { id: area.venue_id, account_id: req.user.account_id }
        });

        if (!venue) {
            res.status(404).send({ "error": "Resource not found" });
            return;
        }

        res.send(area);
    } catch (e) {
        res.status(404).send({
            "error": "Resource not found"
        });
    }
}

async function updateOne(req: express.Request, res: express.Response) {
    const { venue_id, ...data } = req.body;

    try {
        const existing = await prisma.areas.findUnique({
            where: { id: req.params.id }
        });

        if (!existing) {
            res.status(404).send({ "error": "Resource not found" });
            return;
        }

        const venue = await prisma.venues.findUnique({
            where: { id: existing.venue_id, account_id: req.user.account_id }
        });

        if (!venue) {
            res.status(404).send({ "error": "Resource not found" });
            return;
        }

        const area = await prisma.areas.update({
            where: { id: req.params.id },
            data
        });

        res.status(200).send(area);
    } catch (e) {
        res.status(404).send({
            "error": "Resource not found"
        });
    }
}

async function deleteOne(req: express.Request, res: express.Response) {
    try {
        const existing = await prisma.areas.findUnique({
            where: { id: req.params.id }
        });

        if (!existing) {
            res.status(404).send({ "error": "Resource not found" });
            return;
        }

        const venue = await prisma.venues.findUnique({
            where: { id: existing.venue_id, account_id: req.user.account_id }
        });

        if (!venue) {
            res.status(404).send({ "error": "Resource not found" });
            return;
        }

        await prisma.areas.delete({
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
    const { venue_id, ...data } = req.body;

    const venue = await prisma.venues.findUnique({
        where: { id: venue_id, account_id: req.user.account_id }
    });

    if (!venue) {
        res.status(400).send({ "error": "Invalid venue_id" });
        return;
    }

    const area = await prisma.areas.create({
        data: { ...data, venue_id }
    })

    res.status(201).send(area);
}

export {findMany, getOne, deleteOne, createOne, updateOne}