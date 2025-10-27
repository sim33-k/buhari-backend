import express from "express";
import { MenuController } from "../controllers/MenuController";
import { MenuService } from "../services/MenuService";
import MenuOrderRepository from "../repositories/prisma/PrismaMenuRepository";

const router = express.Router();
const menuRepository = new MenuOrderRepository();
const menuService = new MenuService(menuRepository);
const menuController = new MenuController(menuService);

router.get("/", menuController.getMenuItems.bind(menuController));
export default router;
