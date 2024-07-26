import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

async function validateSession(req, res) {
    const session = await getServerSession(req, res);
    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    return null;
}

async function createComponent(req, res) {
    const prisma = new PrismaClient();
    const { type, projectId } = req.query;

    if (!type || !projectId) {
        await prisma.$disconnect();
        return res.status(400).json({ error: "Missing type or projectId" });
    }

    const { variant, styles } = req.body;
    if (!variant || !styles) {
        await prisma.$disconnect();
        return res.status(400).json({ error: "Missing variant or styles" });
    }

    try {
        const newComponent = await prisma.component.create({
            data: {
                variant,
                projectId: Number(projectId),
                type,
                styles: {
                    create: {
                        bgColor: { connect: { id: Number(styles.backgroundColor) } },
                        txtColor: { connect: { id: Number(styles.textColor) } },
                        brdrColor: { connect: { id: Number(styles.borderColor) } },
                        radius: { connect: { id: Number(styles.borderRadius) } },
                        pdX: { connect: { id: Number(styles.paddingX) } },
                        pdY: { connect: { id: Number(styles.paddingY) } }
                    }
                }
            },
            include: {
                styles: {
                    include: {
                        bgColor: true,
                        txtColor: true,
                        brdrColor: true,
                        radius: true,
                        pdX: true,
                        pdY: true,
                    }
                }
            }
        });
        return res.status(201).json(newComponent);
    } catch (error) {
        console.error("Error creating component:", error);
        return res.status(500).json({ error: "Failed to create component" });
    } finally {
        await prisma.$disconnect();
    }
}

async function updateComponent(req, res) {
    const prisma = new PrismaClient();
    const { id, variant, styles } = req.body;

    if (!id || !variant || !styles) {
        await prisma.$disconnect();
        return res.status(400).json({ error: "Missing id, variant, or styles" });
    }

    try {
        const updatedComponent = await prisma.componentStyle.update({
            where: { componentId: Number(id) },
            data: {
                bgColor: { connect: { id: Number(styles.backgroundColor) } },
                txtColor: { connect: { id: Number(styles.textColor) } },
                brdrColor: { connect: { id: Number(styles.borderColor) } },
                radius: { connect: { id: Number(styles.borderRadius) } },
                pdX: { connect: { id: Number(styles.paddingX) } },
                pdY: { connect: { id: Number(styles.paddingY) } }
            },
            include: {
                bgColor: true,
                txtColor: true,
                brdrColor: true,
                radius: true,
                pdX: true,
                pdY: true,
            }
        });
        return res.status(200).json(updatedComponent);
    } catch (error) {
        console.error("Error updating component:", error);
        return res.status(500).json({ error: "Failed to update component" });
    } finally {
        await prisma.$disconnect();
    }
}

export default async function handler(req, res) {
    const sessionValidationError = await validateSession(req, res);
    if (sessionValidationError) return sessionValidationError;

    if (req.method === "POST") {
        return createComponent(req, res);
    } else if (req.method === "PUT") {
        return updateComponent(req, res);
    } else {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
}
