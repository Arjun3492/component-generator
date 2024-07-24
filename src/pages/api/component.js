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

    if (req.method === "POST") {
        const { variant, styles } = req.body;
        if (!variant || !styles) {
            return res.status(400).json({ error: "Missing variant or styles" });
        }
        const prisma = new PrismaClient();

        try {
            const newComponent = await prisma.component.create({
                data: {
                    variant,
                    projectId: Number(projectId),
                    type,
                    styles: {
                        create: {
                            ...styles
                        }
                    }
                },
                include: {
                    styles: true
                }
            });
            return res.status(201).json(newComponent);
        } catch (error) {
            console.error("error", error);
            return res.status(500).json({ error: "Failed to create component" });
        } finally {
            await prisma.$disconnect();
        }

    }
    else if (req.method === "PUT") {
        const { id, variant, styles } = req.body;
        if (!id || !variant || !styles) {
            return res.status(400).json({ error: "Missing id, variant or styles" });
        }
        const prisma = new PrismaClient();

        try {
            console.log("_id", id);
            const updatedComponent = await prisma.componentStyle.update({
                where: {
                    componentId: Number(id),
                },
                data: {
                    ...styles
                },
            });
            console.log("updatedComponent", updatedComponent);
            return res.status(200).json(updatedComponent);
        } catch (error) {
            console.error("error", error);
            return res.status(500).json({ error: "Failed to update component" });
        } finally {
            await prisma.$disconnect();
        }
    }

}