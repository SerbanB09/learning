import {prisma} from "../manager/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../errors/AppError";
import express from "express";

export const findMany = asyncHandler(async (req, res) => {
    const account = await prisma.accounts.findUnique({
        where: { id: req.user.account_id }
    });

    res.status(200).send(account ? [account] : []);
});

export const getOne = asyncHandler(async (req, res) => {
    if (req.params.id !== req.user.account_id) {
        throw new AppError("Forbidden", 403);
    }

    const account = await prisma.accounts.findUnique({
        where: { id: req.params.id }
    });

    if (!account) {
        throw new AppError("Account not found", 404);
    }

    res.send(account);
});

export const updateOne = asyncHandler(async (req, res) => {
    if (req.params.id !== req.user.account_id) {
        throw new AppError("Forbidden", 403);
    }

    const { id, ...data } = req.body;

    const account = await prisma.accounts.update({
        where: { id: req.params.id },
        data
    });

    res.status(200).send(account);
});

export const deleteOne = asyncHandler(async (req, res) => {
    if (req.params.id !== req.user.account_id) {
        throw new AppError("Forbidden", 403);
    }

    await prisma.accounts.delete({
        where: { id: req.params.id }
    });

    res.status(204).send();
});

export const createOne = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name || typeof name !== "string") {
        throw new AppError("Account name is required", 400);
    }

    const account = await prisma.accounts.create({
        data: { name }
    });

    res.status(201).send(account);
});
