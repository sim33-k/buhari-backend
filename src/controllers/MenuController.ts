import { Request, Response } from "express";
import { MenuService } from "services/MenuService";
import { BaseController } from "./BaseController";


export class MenuController extends BaseController {
    private menuService: MenuService;

    constructor(menuService: MenuService) {
        super();
        this.menuService = menuService;
    }

    public async getMenuItems(request: Request, response: Response): Promise<void> {
        try {
            const menuItems = await this.menuService.getMenuItems();
            this.sendSuccess(response, menuItems, 200);
        } catch (error) {
            return this.sendError(response, 'error', 500);
        }
    }
}