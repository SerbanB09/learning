`use strict`

import express from 'express';
import {prisma} from "./manager/prisma";
import dotenv from 'dotenv';

dotenv.config();

const app = express()
const port = process.env.PORT

app.use(express.json());

app.put('/accounts', (req, res) => {
    let data = req.body;

    const account = prisma.accounts.create({
        data
    })

    console.log(account)

    res.send(account);
})

app.listen(
    port,
    () => {
        console.log(`Example app listening on port ${port}`)
    }
)