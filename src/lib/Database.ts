import { PrismaClient } from "../../generated/prisma";

class Database {
    private static instance: Database;
    public client: PrismaClient;

    private constructor() {
        this.client = new PrismaClient();
    }

    public static getInstance(): Database {
        if(Database.instance == null) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

export const database = Database.getInstance().client; 