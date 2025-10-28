import { IReportRepository } from "repositories/interfaces/IReportRepository";
import { supabase } from "../../lib/SupabaseClient";

export class SupabaseReportRepository implements IReportRepository {

    async getDailySalesRevenue(date: String): Promise<any> {
        const startDate = new Date(`${date}T00:00:00.000Z`);
        const endDate = new Date(`${date}T23:59:59.999Z`);

        const { data, error } = await supabase
            .from('Order')
            .select('total')
            .gte('date', startDate.toISOString())
            .lte('date', endDate.toISOString());

        if (error) {
            throw new Error(`Error fetching daily sales revenue: ${error.message}`);
        }

        const total = data?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

        return {
            _sum: {
                total: total
            }
        };
    }

    async getFamousMainDish(): Promise<any> {
        // Get all order items with menu items that are main dishes
        const { data: orderItems, error } = await supabase
            .from('OrderItem')
            .select('menuId, quantity, menu:MenuItem!inner(*, type:Type!inner(*))')
            .eq('menu.type.name', 'Main Dish');

        if (error) {
            throw new Error(`Error fetching famous main dish: ${error.message}`);
        }

        if (!orderItems || orderItems.length === 0) {
            return [];
        }

        // Aggregate quantities by menuId
        const aggregated: { [key: number]: number } = {};
        for (const item of orderItems) {
            if (aggregated[item.menuId]) {
                aggregated[item.menuId] += item.quantity;
            } else {
                aggregated[item.menuId] = item.quantity;
            }
        }

        // Find the menuId with the highest quantity
        let maxMenuId = 0;
        let maxQuantity = 0;
        for (const menuId in aggregated) {
            if (aggregated[menuId] > maxQuantity) {
                maxQuantity = aggregated[menuId];
                maxMenuId = parseInt(menuId);
            }
        }

        return [{
            menuId: maxMenuId,
            _sum: {
                quantity: maxQuantity
            }
        }];
    }

    async getFamousSideDish(): Promise<any> {
        // Get all order items with menu items that are side dishes
        const { data: orderItems, error } = await supabase
            .from('OrderItem')
            .select('menuId, quantity, menu:MenuItem!inner(*, type:Type!inner(*))')
            .eq('menu.type.name', 'Side Dish');

        if (error) {
            throw new Error(`Error fetching famous side dish: ${error.message}`);
        }

        if (!orderItems || orderItems.length === 0) {
            return [];
        }

        // Aggregate quantities by menuId
        const aggregated: { [key: number]: number } = {};
        for (const item of orderItems) {
            if (aggregated[item.menuId]) {
                aggregated[item.menuId] += item.quantity;
            } else {
                aggregated[item.menuId] = item.quantity;
            }
        }

        // Find the menuId with the highest quantity
        let maxMenuId = 0;
        let maxQuantity = 0;
        for (const menuId in aggregated) {
            if (aggregated[menuId] > maxQuantity) {
                maxQuantity = aggregated[menuId];
                maxMenuId = parseInt(menuId);
            }
        }

        return [{
            menuId: maxMenuId,
            _sum: {
                quantity: maxQuantity
            }
        }];
    }

    async getFamousDessert(): Promise<any> {
        // Get all order items with menu items that are desserts
        const { data: orderItems, error } = await supabase
            .from('OrderItem')
            .select('menuId, quantity, menu:MenuItem!inner(*, type:Type!inner(*))')
            .eq('menu.type.name', 'Dessert');

        if (error) {
            throw new Error(`Error fetching famous dessert: ${error.message}`);
        }

        if (!orderItems || orderItems.length === 0) {
            return [];
        }

        // Aggregate quantities by menuId
        const aggregated: { [key: number]: number } = {};
        for (const item of orderItems) {
            if (aggregated[item.menuId]) {
                aggregated[item.menuId] += item.quantity;
            } else {
                aggregated[item.menuId] = item.quantity;
            }
        }

        // Find the menuId with the highest quantity
        let maxMenuId = 0;
        let maxQuantity = 0;
        for (const menuId in aggregated) {
            if (aggregated[menuId] > maxQuantity) {
                maxQuantity = aggregated[menuId];
                maxMenuId = parseInt(menuId);
            }
        }

        return [{
            menuId: maxMenuId,
            _sum: {
                quantity: maxQuantity
            }
        }];
    }

    async getMostPopularSideDishForEachMainDish(): Promise<any> {
        // Get all main dishes
        const { data: mainDishes, error: mainDishError } = await supabase
            .from('MenuItem')
            .select('*, type:Type!inner(*)')
            .eq('type.name', 'Main Dish');

        if (mainDishError) {
            throw new Error(`Error fetching main dishes: ${mainDishError.message}`);
        }

        const result = [];

        for (const mainDish of mainDishes || []) {
            // Find all orders containing this main dish
            const { data: orders, error: ordersError } = await supabase
                .from('OrderItem')
                .select('orderId, menu:MenuItem(*)')
                .eq('menuId', mainDish.id);

            if (ordersError) {
                throw new Error(`Error fetching orders for main dish: ${ordersError.message}`);
            }

            if (!orders || orders.length === 0) {
                result.push({
                    mainDish: mainDish,
                    mostPopularSideDish: {
                        name: "",
                        totalQuantity: 0
                    }
                });
                continue;
            }

            const orderIds = orders.map(order => order.orderId);

            // Find side dishes in those orders
            const { data: sideDishOrders, error: sideDishError } = await supabase
                .from('OrderItem')
                .select('quantity, menu:MenuItem!inner(*, type:Type!inner(*))')
                .in('orderId', orderIds)
                .eq('menu.type.name', 'Side Dish');

            if (sideDishError) {
                throw new Error(`Error fetching side dishes: ${sideDishError.message}`);
            }

            // Aggregate quantities
            const counts: any = {};

            for (const item of sideDishOrders || []) {
                const dishName = (item as any).menu.name;
                if (counts[dishName]) {
                    counts[dishName] += item.quantity;
                } else {
                    counts[dishName] = item.quantity;
                }
            }

            let maxName: string = "";
            let maxCount: number = 0;

            for (const dishName in counts) {
                if (counts[dishName] > maxCount) {
                    maxCount = counts[dishName];
                    maxName = dishName;
                }
            }

            result.push({
                mainDish: mainDish,
                mostPopularSideDish: {
                    name: maxName,
                    totalQuantity: maxCount
                }
            });
        }

        return result;
    }

    async getSalesHistory(startDate: string, endDate: string): Promise<any> {
        // Fetch all orders in the date range
        const { data: orders, error } = await supabase
            .from('Order')
            .select('date, total')
            .gte('date', `${startDate}T00:00:00.000Z`)
            .lt('date', new Date(new Date(`${endDate}T00:00:00.000Z`).getTime() + 86400000).toISOString());

        if (error) {
            throw new Error(`Error fetching sales history: ${error.message}`);
        }

        // Group by day and sum totals
        const grouped: { [key: string]: number } = {};
        for (const order of orders || []) {
            const date = new Date(order.date);
            const dayKey = date.toISOString().split('T')[0]; // Get YYYY-MM-DD
            if (grouped[dayKey]) {
                grouped[dayKey] += order.total;
            } else {
                grouped[dayKey] = order.total;
            }
        }

        // Fill in missing dates with 0 sales
        const start = new Date(startDate);
        const end = new Date(endDate);
        const result = [];
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateKey = d.toISOString().split('T')[0];
            result.push({
                date: new Date(dateKey),
                total: grouped[dateKey] || 0
            });
        }

        return result;
    }
}

export default SupabaseReportRepository;
