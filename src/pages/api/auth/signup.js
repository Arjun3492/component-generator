import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";
const prisma = new PrismaClient();


export default async function handler(req, res) {
    if (req.method === "POST") {
        const { username, email, password } = req.body;

        const userExists = await prisma.user.findUnique({
            where: { email },
        });

        if (userExists) {
            res.status(400).json({ error: "User already exists" });
        } else {
            const newUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: bcrypt.hashSync(password, 10),
                },
            });
            res.status(201).json(newUser);
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
