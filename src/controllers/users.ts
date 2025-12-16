import {prisma} from "../manager/prisma";
import express from "express";

async function findMany(req: express.Request, res: express.Response) {
    const users = await prisma.users.findMany();

    res.status(200).send(users);
}

async function getOne(req: express.Request, res: express.Response) {
    try {
        const user = await prisma.users.findUnique({
            where: {
                id: req.params.id
            }
        });

        res.send(user);
    } catch (e) {
        res.status(404).send({
            "error": "Resource not found"
        });
    }
}

async function updateOne(req: express.Request, res: express.Response) {
    let data = req.body;

    try {
        const user = await prisma.users.update({
            where: {
                id: req.params.id
            },
            data
        });

        res.status(200).send(user);
    } catch (e) {
        res.status(404).send({
            "error": "Resource not found"
        });
    }
}

async function deleteOne(req: express.Request, res: express.Response) {
    try {
        await prisma.users.delete({
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

    const user = await prisma.users.create({
        data
    })

    res.status(201).send(user);
}

export {findMany, getOne, deleteOne, createOne, updateOne}