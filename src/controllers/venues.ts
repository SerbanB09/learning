import {prisma} from "../manager/prisma";
import express from "express";

async function findMany(req: express.Request, res: express.Response) {
    const venues = await prisma.venues.findMany();

    res.status(200).send(venues);
}

async function getOne(req: express.Request, res: express.Response) {
    try {
        const venue = await prisma.venues.findUnique({
            where: {
                id: req.params.id
            }
        });

        res.send(venue);
    } catch (e) {
        res.status(404).send({
            "error": "Resource not found"
        });
    }
}

async function updateOne(req: express.Request, res: express.Response) {
    let data = req.body;

    try {
        const venue = await prisma.venues.update({
            where: {
                id: req.params.id
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
                id: req.params.id
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
    let data = req.body

    const user = await prisma.venues.create({
        data
    })

    res.status(201).send(user);
}

export {findMany, getOne, deleteOne, createOne, updateOne}