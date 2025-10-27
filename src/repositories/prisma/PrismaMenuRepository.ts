import { IMenuRepository } from "repositories/interfaces/IMenuRepository";
import { database } from "../../lib/Database";
import { Prisma } from "generated/prisma/browser";

export class PrismaMenuRepository implements IMenuRepository {

    async getMenuItems(): Promise<any> {
        const result = await database.menuItem.findMany({
            include: {
                type: true
            }
        })

        return result;
    }
}

export default PrismaMenuRepository;