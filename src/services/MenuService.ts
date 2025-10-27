import { BaseService } from "./BaseService";
import { IMenuRepository } from "repositories/interfaces/IMenuRepository";

export class MenuService {
    private repository: IMenuRepository;

    constructor(menuRepository: IMenuRepository) {
        this.repository = menuRepository;
    }
    public async getMenuItems(): Promise<any> {
        return this.repository.getMenuItems();
    }
} 