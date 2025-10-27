import { supabase } from "../../lib/SupabaseClient";
import { IOrderRepository } from "../interfaces/IOrderRepository";
import { MenuItem, Order } from "../../../generated/prisma";
import { CreateOrderDto } from "../../dtos/order/CreateOrderDto";

export class SupabaseOrderRepository implements IOrderRepository {

    public async createOrder(order: CreateOrderDto): Promise<Order> {
        // Fetch all menu items for validation and price calculation
        const { data: menuItems, error: menuError } = await supabase
            .from("MenuItem")
            .select("*");

        if (menuError) {
            throw new Error(`Failed to fetch menu items: ${menuError.message}`);
        }

        if (!menuItems || menuItems.length === 0) {
            throw new Error("No menu items found");
        }

        // Calculate total and prepare order items
        let total = 0;
        const orderItems = [];

        for (const item of order.items) {
            const menuItem = menuItems.find(m => m.id === item.menuId);
            if (!menuItem) {
                throw new Error("Menu item not found!");
            }
            const price = item.quantity * Number(menuItem.price);
            total += price;

            orderItems.push({
                menuId: item.menuId,
                quantity: item.quantity,
                price: price
            });
        }

        // Insert order record
        const { data: createdOrder, error: orderError } = await supabase
            .from("Order")
            .insert({ total: total, date: new Date().toISOString() })
            .select()
            .single();

        if (orderError || !createdOrder) {
            throw new Error(`Failed to create order: ${orderError?.message}`);
        }

        // Insert order items in batch
        const orderItemsWithOrderId = orderItems.map(item => ({
            ...item,
            orderId: createdOrder.id
        }));

        const { error: itemsError } = await supabase
            .from("OrderItem")
            .insert(orderItemsWithOrderId);

        if (itemsError) {
            throw new Error(`Failed to create order items: ${itemsError.message}`);
        }

        // Query and return complete order with nested OrderItem array
        const { data: completeOrder, error: fetchError } = await supabase
            .from("Order")
            .select("*, OrderItem(*)")
            .eq("id", createdOrder.id)
            .single();

        if (fetchError || !completeOrder) {
            throw new Error(`Failed to fetch complete order: ${fetchError?.message}`);
        }

        // Convert date string to Date object to match Prisma structure
        return {
            ...completeOrder,
            date: new Date(completeOrder.date)
        };
    }

    public async getOrders(): Promise<Order[]> {
        // Query orders with nested OrderItem, MenuItem, and Type using Supabase's nested select
        const { data: orders, error } = await supabase
            .from("Order")
            .select(`
                *,
                OrderItem (
                    *,
                    menu:MenuItem (
                        *,
                        type:Type (*)
                    )
                )
            `)
            .order("id");

        if (error) {
            throw new Error(`Failed to fetch orders: ${error.message}`);
        }

        if (!orders) {
            return [];
        }

        // Convert date strings to Date objects to match Prisma structure
        return orders.map(order => ({
            ...order,
            date: new Date(order.date)
        }));
    }

    public async getOrderById(orderId: number): Promise<Order | null> {
        // Query single order with nested OrderItem, MenuItem, and Type
        const { data: order, error } = await supabase
            .from("Order")
            .select(`
                *,
                OrderItem (
                    *,
                    menu:MenuItem (
                        *,
                        type:Type (*)
                    )
                )
            `)
            .eq("id", orderId)
            .single();

        if (error) {
            // Return null if order not found (PGRST116 is Supabase's "not found" error code)
            if (error.code === "PGRST116") {
                return null;
            }
            throw new Error(`Failed to fetch order: ${error.message}`);
        }

        if (!order) {
            return null;
        }

        // Convert date string to Date object to match Prisma structure
        return {
            ...order,
            date: new Date(order.date)
        };
    }

    public async getMenuItemsWithTypes(): Promise<MenuItem[]> {
        // Query MenuItem with JOIN to Type table
        const { data: menuItems, error } = await supabase
            .from("MenuItem")
            .select("*, type:Type(*)");

        if (error) {
            throw new Error(`Failed to fetch menu items: ${error.message}`);
        }

        if (!menuItems || menuItems.length === 0) {
            throw new Error("No menu items found");
        }

        return menuItems;
    }
}

export default SupabaseOrderRepository;
