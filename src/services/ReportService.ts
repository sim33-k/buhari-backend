// I will not be extending the base service, because this service is specific to reports,

import { IReportRepository } from "repositories/interfaces/IReportRepository";
import { database } from "../lib/Database";

// Daily sales revenue
// Most famous main dish
// Most famous side dish
// Which side dish is consumed most with which main dish
// API endpoints (where applicable)
// getDailySalesRevenue(date: String): Promise<any>;
// getFamousMainDish(): Promise<any>;
// getFamousSideDish(): Promise<any>;
// getMostPopularSideDishForEachMainDish(): Promise<any>;



// and will not be used for normal cruds
export class ReportService {
    private repository: IReportRepository;

    constructor(reportRepository: IReportRepository) {
        this.repository = reportRepository;

    }

    public async getDailySalesRevenue(date: String): Promise<any> {
        return this.repository.getDailySalesRevenue(date);
    }

    public async getFamousMainDish(): Promise<any> {
        const result = await this.repository.getFamousMainDish();
        if (result.length > 0) {
            const menuItem = await database.menuItem.findUnique({ where: { id: result[0].menuId } });
            return { name: menuItem?.name, totalQuantity: result[0]._sum.quantity };
        }
        return null;
    }

    public async getFamousSideDish(): Promise<any> {
        const result = await this.repository.getFamousSideDish();
        if (result.length > 0) {
            const menuItem = await database.menuItem.findUnique({ where: { id: result[0].menuId } });
            return { name: menuItem?.name, totalQuantity: result[0]._sum.quantity };
        }
        return null;
    }

    public async getFamousDessert(): Promise<any> {
        const result = await this.repository.getFamousDessert();
        if (result.length > 0) {
            const menuItem = await database.menuItem.findUnique({ where: { id: result[0].menuId } });
            return { name: menuItem?.name, totalQuantity: result[0]._sum.quantity };
        }
        return null;
    }

    public async getMostPopularSideDishForEachMainDish(): Promise<any> {
        return this.repository.getMostPopularSideDishForEachMainDish();
    }

    public async getSalesHistory(startDate: string, endDate: string): Promise<any> {
        return this.repository.getSalesHistory(startDate, endDate);
    }
}