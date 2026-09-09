import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/manager/prisma";

async function main() {
    console.log("Cleaning existing data...");
    await prisma.bookings.deleteMany({});
    await prisma.tables.deleteMany({});
    await prisma.areas.deleteMany({});
    await prisma.table_types.deleteMany({});
    await prisma.venues.deleteMany({});
    await prisma.users.deleteMany({});
    await prisma.accounts.deleteMany({});

    console.log("Seeding...");

    const account = await prisma.accounts.create({
        data: { name: "Demo Restaurant SRL" }
    });

    const hashedPassword = await bcrypt.hash("password123", 10);

    const admin = await prisma.users.create({
        data: {
            account_id: account.id,
            first_name: "Andrei",
            last_name: "Admin",
            email: "admin@demo.com",
            password: hashedPassword,
            roles: ["admin", "member"]
        }
    });

    const member = await prisma.users.create({
        data: {
            account_id: account.id,
            first_name: "Maria",
            last_name: "Membru",
            email: "member@demo.com",
            password: hashedPassword,
            roles: ["member"]
        }
    });

    const venue = await prisma.venues.create({
        data: {
            account_id: account.id,
            name: "Downtown Bistro",
            address: "Strada Exemplu 10, Bacău"
        }
    });

    const tableType = await prisma.table_types.create({
        data: {
            account_id: account.id,
            name: "Standard 4-top",
            width: 80,
            height: 80
        }
    });

    const area = await prisma.areas.create({
        data: {
            venue_id: venue.id,
            name: "Sala principală",
            width: 500,
            height: 400
        }
    });

    const table = await prisma.tables.create({
        data: {
            area_id: area.id,
            table_type_id: tableType.id,
            name: "T1",
            seat_count: 4,
            position_x: 50,
            position_y: 50
        }
    });

    const bookingDate = new Date();
    bookingDate.setDate(bookingDate.getDate() + 1);
    bookingDate.setHours(19, 0, 0, 0);

    await prisma.bookings.create({
        data: {
            user_id: admin.id,
            venue_id: venue.id,
            table_id: table.id,
            person_count: 2,
            date: bookingDate,
            note: "Seed data — rezervare de test"
        }
    });

    console.log("Done. Login credentials:");
    console.log("  Admin:  admin@demo.com / password123");
    console.log("  Member: member@demo.com / password123");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });