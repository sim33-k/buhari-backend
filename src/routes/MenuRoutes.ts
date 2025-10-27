import express from "express";
import { MenuController } from "../controllers/MenuController";
import { MenuService } from "../services/MenuService";
import SupabaseMenuRepository from "../repositories/supabase/SupabaseMenuRepository";

const router = express.Router();
const menuRepository = new SupabaseMenuRepository();
const menuService = new MenuService(menuRepository);
const menuController = new MenuController(menuService);

router.get("/", menuController.getMenuItems.bind(menuController));
export default router;
