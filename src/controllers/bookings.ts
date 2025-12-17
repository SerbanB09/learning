import {prisma} from "../manager/prisma";
import express from "express";

async function findMany(req: express.Request, res: express.Response) {
    const bookings = await prisma.bookings.findMany();

    res.status(200).send(bookings);
}

async function getOne(req: express.Request, res: express.Response) {
    try {
        const booking = await prisma.bookings.findUnique({
            where: {
                id: req.params.id
            }
        });

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
        const booking = await prisma.bookings.update({
            where: {
                id: req.params.id
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

    const booking = await prisma.bookings.create({
        data
    })

    res.status(201).send(booking);
}

export {findMany, getOne, deleteOne, createOne, updateOne}