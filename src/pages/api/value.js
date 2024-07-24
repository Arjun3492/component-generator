import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";


export default async function handler(req, res) {
    const session = await getServerSession(req, res);

    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { type, projectId } = req.query;
    if (!type) {
        return res.status(400).json({ error: "Missing type" });
    }
    if (!projectId) {
        return res.status(400).json({ error: "Missing projectId" });
    }


    if (req.method === "GET") {
        const prisma = new PrismaClient();

        try {

            const values = await prisma[type].findMany({
                where: {
                    projectId: Number(projectId),
                },
            });
            return res.status(200).json(values);
        } catch (error) {
            console.error("error", error);
            return res.status(500).json({ error: "Failed to fetch values" });
        } finally {
            await prisma.$disconnect();
        }
    }


    if (req.method === "POST") {
        const { label, value } = req.body;

        if (!label || !value) {
            return res.status(400).json({ error: "Missing label or value" });
        }
        const prisma = new PrismaClient();


        try {
            const newValue = await prisma[type].create({
                data: {
                    label,
                    value,
                    projectId: Number(projectId),
                },
            });
            return res.status(201).json(newValue);
        } catch (error) {
            console.error("error", error);
            return res.status(500).json({ error: "Failed to create value" });
        }
        finally {
            await prisma.$disconnect();
        }
    }


    if (req.method === "PUT") {
        const { id, label, value } = req.body;

        if (!id || !label || !value) {
            return res.status(400).json({ error: "Missing id, label or value" });
        }
        const prisma = new PrismaClient();

        try {
            const updatedValue = await prisma[type].update({
                where: {
                    id: Number(id),
                },
                data: {
                    label,
                    value,
                },
            });
            return res.status(200).json(updatedValue);
        } catch (error) {
            console.error("error", error);
            return res.status(500).json({ error: "Failed to update value" });
        }
        finally {
            await prisma.$disconnect();
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
