import express from "express";
import { ReportController } from "../controllers/ReportController";
import { ReportService } from "../services/ReportService";
import PrismaReportRepository from "../repositories/prisma/PrismaReportRepository";


const router = express.Router(); 
const reportRepository = new PrismaReportRepository();
const reportService = new ReportService(reportRepository);
const reportController = new ReportController(reportService);


router.get("/daily-sales-revenue", reportController.getDailySalesRevenue.bind(reportController));
router.get("/famous-main-dish", reportController.getFamousMainDish.bind(reportController));
router.get("/famous-side-dish", reportController.getFamousSideDish.bind(reportController));
router.get("/famous-dessert", reportController.getFamousDessert.bind(reportController));
router.get("/side-dish-combinations", reportController.getMostPopularSideDishForEachMainDish.bind(reportController));
router.get("/sales-history", reportController.getSalesHistory.bind(reportController));
export default router;