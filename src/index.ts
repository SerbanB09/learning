`use strict`

import express from 'express';
import dotenv from 'dotenv';
import * as accounts from "./controllers/accounts";
import * as users from "./controllers/users";
import * as venues from "./controllers/venues";
import * as table_types from "./controllers/table_types";
import * as areas from "./controllers/areas";

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

// Table types
app.get('/table_types', table_types.findMany)
app.get('/table_types/:id', table_types.getOne)
app.patch('/table_types/:id', table_types.updateOne)
app.delete('/table_types/:id', table_types.deleteOne)
app.put('/table_types', table_types.createOne)

// Areas
app.get('/areas', areas.findMany)
app.get('/areas/:id', areas.getOne)
app.patch('/areas/:id', areas.updateOne)
app.delete('/areas/:id', areas.deleteOne)
app.put('/areas', areas.createOne)

app.listen(
    port,
    () => {
        console.log(`Example app listening on port ${port}`)
    }
)