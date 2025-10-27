import { database } from "../../lib/Database";
import { IOrderRepository } from "repositories/interfaces/IOrderRepository";
import { MenuItem, Order } from "generated/prisma";
import { CreateOrderDto, CreateOrderItemDto } from "../../dtos/order/CreateOrderDto";


export class PrismaOrderRepository implements IOrderRepository {

    public async createOrder(order: CreateOrderDto): Promise<Order> {
        // since the total is stored in the order table, it is set to zero
        let total = 0;
        const orderItems = [];

        // the order dto has the order items inside it
        // since there are few menu items, we can fetch them all at the same time

        const menuItems =  await database.menuItem.findMany({});
        // ill add the error handlers later

        for (const item of order.items) {
            const menuItem = menuItems.find(menuItem => menuItem.id === item.menuId);
            if (!menuItem) {
                throw new Error("Menu item not found!");
            }   
            const price = item.quantity * Number(menuItem.price); // must convert to number because of type
            total += price;

            // now we can add the order items to the array
            orderItems.push({
                menuId: item.menuId,
                quantity: item.quantity,
                price: price
            });
        }

        // now we can create an order with the items

        const createdOrder = await database.order.create({
            data: {
                total: total,
                OrderItem: {
                    createMany: {
                        data: orderItems
                    }
                }
            },
            include: {
                OrderItem: true
            }
        })

        return createdOrder;

    }

    public async getOrders(): Promise<Order[]> {
        const orders = await database.order.findMany({
            include: {
                OrderItem: {
                    include: {
                        menu: {
                            include: {
                                type: true
                            }
                        }
                    }
                }
            }
        })
        return orders;
    }

    public async getOrderById(orderId: number): Promise<Order | null>{
        const order = await database.order.findUnique({
            where: {
                id: orderId
            },
            include: {
                OrderItem: {
                    include: {
                        menu: {
                            include: {
                                type: true
                            }
                        }
                    }
                }
            }
        })
        return order;
    }

    public async getMenuItemsWithTypes(): Promise<MenuItem[]> {
        const menuItems = await database.menuItem.findMany({
            include: { type: true }
        });

        if(!menuItems || menuItems.length == 0) {
            throw new Error("No menu items found");
        }
        return menuItems;
    }
}

export default PrismaOrderRepository
