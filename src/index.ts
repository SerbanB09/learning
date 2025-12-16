`use strict`

import express from 'express';
import dotenv from 'dotenv';
import * as accounts from "./controllers/accounts";
import * as users from "./controllers/users";
import * as venues from "./controllers/venues";

dotenv.config();

const app = express()
const port = process.env.PORT

app.use(express.json());

// Accounts
app.get('/accounts', accounts.findMany)
app.get('/accounts/:id', accounts.getOne)
app.patch('/accounts/:id', accounts.updateOne)
app.delete('/accounts/:id', accounts.deleteOne)
app.put('/accounts', accounts.createOne)

// Users
app.get('/users', users.findMany)
app.get('/users/:id', users.getOne)
app.patch('/users/:id', users.updateOne)
app.delete('/users/:id', users.deleteOne)
app.put('/users', users.createOne)

// Venues
app.get('/venues', venues.findMany)
app.get('/venues/:id', venues.getOne)
app.patch('/venues/:id', venues.updateOne)
app.delete('/venues/:id', venues.deleteOne)
app.put('/venues', venues.createOne)

app.listen(
    port,
    () => {
        console.log(`Example app listening on port ${port}`)
    }
)