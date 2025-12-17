import {prisma} from "../manager/prisma";
import express from "express";

async function findMany(req: express.Request, res: express.Response) {
    const areas = await prisma.areas.findMany();

    res.status(200).send(areas);
}

async function getOne(req: express.Request, res: express.Response) {
    try {
        const area = await prisma.areas.findUnique({
            where: {
                id: req.params.id
            }
        });

        res.send(area);
    } catch (e) {
        res.status(404).send({
            "error": "Resource not found"
        });
    }
}

async function updateOne(req: express.Request, res: express.Response) {
    let data = req.body;

    try {
        const area = await prisma.areas.update({
            where: {
                id: req.params.id
            },
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
        await prisma.areas.delete({
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

    const area = await prisma.areas.create({
        data
    })

    res.status(201).send(area);
}

export {findMany, getOne, deleteOne, createOne, updateOne}