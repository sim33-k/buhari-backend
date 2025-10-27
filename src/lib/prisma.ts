// import { PrismaClient } from "@prisma/client";

// // im trying to achieve a singleton pattern for prisma client, so that this single client can handle multiple connection pools
// // i will be setting this prisma variable to the global object
// declare global {
//     var prisma: PrismaClient | undefined;
// }

// // if the client doesnt exist, we create it
// export const prisma = global.prisma || new PrismaClient();

