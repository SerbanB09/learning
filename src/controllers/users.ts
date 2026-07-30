import { prisma } from "../manager/prisma";
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../errors/AppError';
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

function excludePassword<User extends { password?: string }>(user: User) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

async function findMany(req: express.Request, res: express.Response) {
    const users = await prisma.users.findMany();
    const safeUsers = users.map(user => excludePassword(user));

    res.status(200).send(safeUsers);
}

export const getOne = asyncHandler(async (req, res) => {
    const user = await prisma.users.findUnique({
        where: { id: req.params.id }
    });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    res.status(200).json(user);
});

async function updateOne(req: express.Request, res: express.Response) {
    let { password, ...data } = req.body;

    if (password) {
        data.password = await bcrypt.hash(password, 10);
    }

    try {
        const user = await prisma.users.update({
            where: {
                id: req.params.id
            },
            data
        });

        res.status(200).send(excludePassword(user));
    } catch (e) {
        res.status(404).send({
            error: "User not found or update failed"
        });
    }
}

export const deleteOne = asyncHandler(async (req, res) => {
    const existingUser = await prisma.users.findUnique({
        where: { id: req.params.id }
    });

    if (!existingUser) {
        throw new AppError('User not found', 404);
    }

    await prisma.users.delete({
        where: { id: req.params.id }
    });

    res.status(204).send();
});

async function createOne(req: express.Request, res: express.Response) {
    try {
        const {password, ...rest_of_data} = req.body;
        const hashed_password = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
            data: {
                ...rest_of_data,
                password: hashed_password
            }
        });;

        res.status(201).send(excludePassword(user));
    } catch(e) {
        res.status(400).send({ error: "Could not create user" });
    }
}

export const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    const user = await prisma.users.findUnique({
        where: {
            email: email
        }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new AppError('Invalid email or password', 401);
    }

    const token = jwt.sign({ id: user.id, account_id: user.account_id },
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' }
    );

    res.status(200).send({ token, user: excludePassword(user) });
});

export {findMany, createOne, updateOne}