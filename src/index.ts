`use strict`

import express from 'express';
import {prisma} from "./manager/prisma";
import dotenv from 'dotenv';
import {createOne, deleteOne, findMany, getOne, updateOne} from "./controllers/accounts";

dotenv.config();

const app = express()
const port = process.env.PORT

app.use(express.json());

// Accounts
app.get('/accounts', findMany)
app.get('/accounts/:id', getOne)
app.patch('/accounts/:id', updateOne)
app.delete('/accounts/:id', deleteOne)
app.put('/accounts', createOne)

//Users

app.listen(
    port,
    () => {
        console.log(`Example app listening on port ${port}`)
    }
)