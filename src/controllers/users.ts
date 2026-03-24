import {prisma} from "../manager/prisma";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

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
    const {password, ...rest_of_data} = req.body;
    const hashed_password = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
        data: {
            ...rest_of_data,
            password: hashed_password
        }
    })

    res.status(201).send(user);
}

async function login(req: express.Request, res: express.Response) {
    const {email, password} = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        });

        if (user == null) {
            res.status(401).send({
                "error": "User not found"
            });
            return;
        }

        const valid_password = await bcrypt.compare(password, user.password);
        if (valid_password) {
            const token = jwt.sign({ id: user.id, account_id: user.account_id},
                process.env.JWT_SECRET as string, { expiresIn: '1d' });
            res.status(200).send({ token });
        } else {
            res.status(401).send({
                "error": "User not found"
            });
        }
    } catch (e) {
        res.status(404).send({
            "error": "Resource not found"
        });
    }
}

export {findMany, getOne, deleteOne, createOne, updateOne, login}