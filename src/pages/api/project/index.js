import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";



export default async function handler(req, res) {
    const session = await getServerSession(req, res);

    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "GET") {
        const prisma = new PrismaClient();
        try {

            const projects = await prisma.project.findMany({
                where: {
                    user: {
                        email: session.user.email
                    }
                },
            });
            return res.status(200).json(projects);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Failed to fetch projects" });
        } finally {
            await prisma.$disconnect();
        }
    }

    if (req.method === "POST") {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Missing name " });
        }

        const prisma = new PrismaClient();
        try {

            const newProject = await prisma.project.create({
                data: {
                    name,
                    user: {
                        connect: {
                            email: session.user.email
                        }
                    }
                },
            });
            return res.status(201).json(newProject);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Failed to create project" });
        }
        finally {
            console.log("Disconnecting Prisma Client");
            await prisma.$disconnect();
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}