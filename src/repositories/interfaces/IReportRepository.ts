// Daily sales revenue
// Most famous main dish
// Most famous side dish
// Which side dish is consumed most with which main dish
// API endpoints (where applicable)

export interface IReportRepository {
    getDailySalesRevenue(date: String): Promise<any>;
    getFamousMainDish(): Promise<any>;
    getFamousSideDish(): Promise<any>;
    getFamousDessert(): Promise<any>;
    getMostPopularSideDishForEachMainDish(): Promise<any>;
    getSalesHistory(startDate: string,endDate: string): Promise<any>;
}