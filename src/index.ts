`use strict`

import express from 'express';
import dotenv from 'dotenv';
import * as accounts from "./controllers/accounts";
import * as users from "./controllers/users";
import * as venues from "./controllers/venues";
import * as table_types from "./controllers/table_types";
import * as areas from "./controllers/areas";
import * as tables from "./controllers/tables";
import * as bookings from "./controllers/bookings";
import { authenticate } from "./middleware/auth.middleware";

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
app.get('/users', authenticate, users.findMany)
app.get('/users/:id', authenticate, users.getOne)
app.patch('/users/:id', authenticate, users.updateOne)
app.delete('/users/:id', authenticate, users.deleteOne)
app.put('/users', users.createOne)
app.post('/users/login', users.login)

// Venues
app.get('/venues', authenticate, venues.findMany)
app.get('/venues/:id', authenticate, venues.getOne)
app.patch('/venues/:id', authenticate, venues.updateOne)
app.delete('/venues/:id', authenticate, venues.deleteOne)
app.put('/venues', authenticate, venues.createOne)

// Table types
app.get('/table_types', authenticate, table_types.findMany)
app.get('/table_types/:id', authenticate, table_types.getOne)
app.patch('/table_types/:id', authenticate, table_types.updateOne)
app.delete('/table_types/:id', authenticate, table_types.deleteOne)
app.put('/table_types', authenticate, table_types.createOne)

// Areas
app.get('/areas', authenticate, areas.findMany)
app.get('/areas/:id', authenticate, areas.getOne)
app.patch('/areas/:id', authenticate, areas.updateOne)
app.delete('/areas/:id', authenticate, areas.deleteOne)
app.put('/areas', authenticate, areas.createOne)

// Tables
app.get('/tables', authenticate, tables.findMany)
app.get('/tables/:id', authenticate, tables.getOne)
app.patch('/tables/:id', authenticate, tables.updateOne)
app.delete('/tables/:id', authenticate, tables.deleteOne)
app.put('/tables', authenticate, tables.createOne)

// Bookings
app.get('/bookings', authenticate, bookings.findMany)
app.get('/bookings/:id', authenticate, bookings.getOne)
app.patch('/bookings/:id', authenticate, bookings.updateOne)
app.delete('/bookings/:id', authenticate, bookings.deleteOne)
app.put('/bookings', authenticate, bookings.createOne)

app.listen(
    port,
    () => {
        console.log(`Example app listening on port ${port}`)
    }
)