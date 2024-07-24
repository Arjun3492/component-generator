import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

export const handler = async (req, res) => {
    const session = await getServerSession(req, res);

    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: "Missing id" });
    }

    if (req.method === "GET") {
        const prisma = new PrismaClient();

        try {


            const project = await prisma.project.findFirst({
                where: {
                    id: Number(id),
                },
                include: {
                    colors: true,
                    radii: true,
                    spacings: true,
                    components: {
                        include: {
                            styles: true
                        }
                    }
                }
            });
            return res.status(200).json(project);
        } catch (error) {
            console.error("error", error);
            return res.status(500).json({ error: "Failed to fetch project" });
        } finally {
            await prisma.$disconnect();
        }
    }
}

export default handler;