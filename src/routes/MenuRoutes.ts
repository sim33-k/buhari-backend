import express from "express";
import { MenuController } from "../controllers/MenuController";
import { MenuService } from "../services/MenuService";
import PrismaMenuRepository from "../repositories/prisma/PrismaMenuRepository";

const router = express.Router();
const menuRepository = new PrismaMenuRepository();
const menuService = new MenuService(menuRepository);
const menuController = new MenuController(menuService);

router.get("/", menuController.getMenuItems.bind(menuController));
export default router;
