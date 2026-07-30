import { prisma } from "../manager/prisma";
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../errors/AppError';
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

function excludePassword<User extends { password?: string }>(user: User) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

function isAdmin(req: express.Request) {
    return Array.isArray(req.user?.roles) && req.user.roles.includes('admin');
}

export const findMany = asyncHandler(async (req, res) => {
    const users = await prisma.users.findMany({
        where: { account_id: req.user.account_id }
    });

    res.status(200).send(users.map(excludePassword));
});

export const getOne = asyncHandler(async (req, res) => {
    const user = await prisma.users.findUnique({
        where: { id: req.params.id }
    });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    res.status(200).json(excludePassword(user));
});

export const updateOne = asyncHandler(async (req, res) => {
    if (!isAdmin(req) && req.params.id !== req.user.id) {
        throw new AppError('Forbidden', 403);
    }

    // account_id and roles can never be set by the client directly;
    // roles may only be changed by an admin, handled explicitly below.
    let { password, account_id, roles, ...data } = req.body;

    if (password) {
        data.password = await bcrypt.hash(password, 10);
    }

    if (roles && isAdmin(req)) {
        data.roles = roles;
    }

    const user = await prisma.users.update({
        where: { id: req.params.id, account_id: req.user.account_id },
        data
    }).catch(() => null);

    if (!user) {
        throw new AppError('User not found or update failed', 404);
    }

    res.status(200).send(excludePassword(user));
});

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

export const createOne = asyncHandler(async (req, res) => {
    const { password, roles, ...rest_of_data } = req.body;

    if (!password || typeof password !== 'string') {
        throw new AppError('Password is required', 400);
    }

    const hashed_password = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
        data: {
            ...rest_of_data,
            roles: ['member'],
            password: hashed_password
        }
    }).catch(() => null);

    if (!user) {
        throw new AppError('Could not create user', 400);
    }

    res.status(201).send(excludePassword(user));
});

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
