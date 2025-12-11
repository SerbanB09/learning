import {prisma} from "../manager/prisma";
import express from "express";

async function findMany(req: express.Request, res: express.Response) {
    const accounts = await prisma.accounts.findMany();

    res.send(accounts);
}

async function getOne(req: express.Request, res: express.Response) {
    try {
        const account = await prisma.accounts.findUnique({
            where: {
                id: req.params.id
            }
        });

        res.send(account);
    } catch (e) {
        res.status(404).send({
            "error": "Resource not found"
        });
    }
}
async function updateOne(req: express.Request, res: express.Response) {
    let data = req.body;

    const account = await prisma.accounts.update({
        where: {
            id: req.params.id
        },
        data
    });

    res.send(account);
}

async function deleteOne(req: express.Request, res: express.Response) {
    await prisma.accounts.delete({
        where: {
            id: req.params.id
        }
    });

    res.status(204).send('');
}

async function createOne(req: express.Request, res: express.Response) {
    let data = req.body;

    const account = await prisma.accounts.create({
        data
    })

    res.status(201).send(account);
}

export {findMany, getOne, updateOne, deleteOne, createOne}