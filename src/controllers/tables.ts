import {prisma} from "../manager/prisma";
import express from "express";

async function findMany(req: express.Request, res: express.Response) {
    const tables = await prisma.tables.findMany();

    res.status(200).send(tables);
}

async function getOne(req: express.Request, res: express.Response) {
    try {
        const table = await prisma.tables.findUnique({
            where: {
                id: req.params.id
            }
        });

        res.send(table);
    } catch (e) {
        res.status(404).send({
            "error": "Resource not found"
        });
    }
}

async function updateOne(req: express.Request, res: express.Response) {
    let data = req.body;

    try {
        const table = await prisma.tables.update({
            where: {
                id: req.params.id
            },
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
        await prisma.tables.delete({
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

    const table = await prisma.tables.create({
        data
    })

    res.status(201).send(table);
}

export {findMany, getOne, deleteOne, createOne, updateOne}