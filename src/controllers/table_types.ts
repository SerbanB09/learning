import {prisma} from "../manager/prisma";
import express from "express";

async function findMany(req: express.Request, res: express.Response) {
    const table_types = await prisma.table_types.findMany({
        where: { account_id: req.user.account_id }
    });

    res.status(200).send(table_types);
}

async function getOne(req: express.Request, res: express.Response) {
    try {
        const table_type = await prisma.table_types.findUnique({
            where: {
                id: req.params.id,
                account_id: req.user.account_id
            }
        });

        if (!table_type) {
            res.status(404).send({ "error": "Resource not found" });
            return;
        }

        res.send(table_type);
    } catch (e) {
        res.status(404).send({
            "error": "Resource not found"
        });
    }
}

async function updateOne(req: express.Request, res: express.Response) {
    const { account_id, ...data } = req.body;

    try {
        const table_type = await prisma.table_types.update({
            where: {
                id: req.params.id,
                account_id: req.user.account_id
            },
            data
        });

        res.status(200).send(table_type);
    } catch (e) {
        res.status(404).send({
            "error": "Resource not found"
        });
    }
}

async function deleteOne(req: express.Request, res: express.Response) {
    try {
        await prisma.table_types.delete({
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

    const table_type = await prisma.table_types.create({
        data: { ...data, account_id: req.user.account_id }
    })

    res.status(201).send(table_type);
}

export {findMany, getOne, deleteOne, createOne, updateOne}