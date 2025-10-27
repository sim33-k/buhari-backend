import { CreateOrderDto } from "../../dtos/order/CreateOrderDto";
import { MenuItem, Order } from "../../../generated/prisma";

// i have added this repository pattern because I had an issue previously with prisma client + supabase
// so if I face the same issue again, i can easily swap it out with supabase client

export interface IOrderRepository {
    createOrder(order: CreateOrderDto): Promise<Order>;
    getOrders(): Promise<Order[]>;
    getOrderById(orderId: number): Promise<Order | null>;
    getMenuItemsWithTypes(): Promise<MenuItem[]>;
    // getOrdersWithDetails(): Promise<Order[]>;
    // didnt add update and delete, because the question doesnt require them

}
