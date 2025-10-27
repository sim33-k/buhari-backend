import { Request, Response } from "express";
import { ReportService } from "services/ReportService";
import { BaseController } from "./BaseController";

export class ReportController extends BaseController {
    private reportService: ReportService;

    // export interface IReportRepository {
    //     getDailySalesRevenue(date: String): Promise<any>;
    //     getFamousMainDish(): Promise<any>;
    //     getFamousSideDish(): Promise<any>;
    //     getMostPopularSideDishForEachMainDish(): Promise<any>;
    // }



    constructor(reportService: ReportService) {
        super();
        this.reportService = reportService;
    }

    public async getDailySalesRevenue(request: Request, response: Response): Promise<void> {

        if(typeof request.query.date !== 'string') {
            return this.sendError(response, 'error', 400);
        } 

        const date: string = request.query.date;


        try {
            const dailySalesRevenue = await this.reportService.getDailySalesRevenue(date);
            this.sendSuccess(response, dailySalesRevenue, 200);
        } catch (error) {
            return this.sendError(response, 'error', 500);
        }

    }

    public async getFamousMainDish(request: Request, response: Response): Promise<void> {
        try {
            const famousMainDish = await this.reportService.getFamousMainDish();
            this.sendSuccess(response, famousMainDish, 200);
        } catch (error) {
            return this.sendError(response, 'error', 500);
        }
    }

    public async getFamousSideDish(request: Request, response: Response): Promise<void> {
        try {
            const famousSideDish = await this.reportService.getFamousSideDish();
            this.sendSuccess(response, famousSideDish, 200);
        } catch (error) {
            return this.sendError(response, 'error', 500);
        }
    }

    public async getFamousDessert(request: Request, response: Response): Promise<void> {
        try {
            const result = await this.reportService.getFamousDessert();
            this.sendSuccess(response, result, 200);
        } catch (error) {
            return this.sendError(response,'error', 500);
        }
    }

    public async getMostPopularSideDishForEachMainDish(request: Request, response: Response): Promise<void> {
        try {
            const result = await this.reportService.getMostPopularSideDishForEachMainDish();
            this.sendSuccess(response, result, 200);
        } catch (error) {
            return this.sendError(response, 'error', 500);
        }
    }

    public async getSalesHistory(request: Request, response: Response): Promise<void> {
        const { startDate, endDate } = request.query;
        try {
            const result = await this.reportService.getSalesHistory(startDate as string, endDate as string);
            this.sendSuccess(response, result, 200);
        } catch (error) {
            return this.sendError(response, 'error', 500);
        }
    }

}