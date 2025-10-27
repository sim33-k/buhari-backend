import { CreateOrderDto } from "../dtos/order/CreateOrderDto";
import { BaseService } from "./BaseService";
import { MenuItem, Order } from "../../generated/prisma";
import { IOrderRepository } from "../repositories/interfaces/IOrderRepository";

export class OrderService extends BaseService<CreateOrderDto, Order> {
    constructor(orderRepository: IOrderRepository) {
        super(orderRepository);
    }

    // we need to write the business logic.
    // the current business logic is that
    // when ordering a main dish is required
    // there has to be one or more side dishes
    // dessert is optional
    // we implement a helper function to do this check

    private async checkOrderLogic(orderDto: CreateOrderDto): Promise<void> {
        // we can fetch the menu items with the getMenuItemsWithTypes method

        // had to change it to any because even though we have included
        // 'type' in the query, its still a relation name. So we have to use any type here
        const menuItems: any[] = await this.repository.getMenuItemsWithTypes();

        // the question doesnt state if two main dishes can be added in the order or not
        // since it wasnt mentioned, ill go with the simplest way
        // where one order has only 1 main dish

        let mainDishCount = 0;
        let sideDishCount = 0;
        let dessertCount = 0;

        for(const item of orderDto.items) {
            // find which menu item it is
            const menuItem = menuItems.find(menuItem => (menuItem.id === item.menuId));

            // error handler to be implemented :)

            if(!menuItem) {
                throw new Error("Menu item not found!");
            }

            if (menuItem.type.name === "Main Dish") {
                mainDishCount += 1; 
            } else if (menuItem.type.name === "Side Dish") {
                sideDishCount += item.quantity;
            } else if (menuItem.type.name === "Dessert") {
                dessertCount += item.quantity;
            }

        }

        // Check after processing all items
        if(mainDishCount < 1) {
            throw new Error("Need at least one main dish");
        }

        // question states only a main dish is allowed
        if(mainDishCount > 1) {
            throw new Error("Only 1 main dish type allowed");
        }

        if(sideDishCount < 1) {
            throw new Error("need at least one side dish");
        }
    }


    public async createOrder(dto: CreateOrderDto): Promise<Order> {
        // first we need to check the business logic
        // if there are no errors, the order can be made
        await this.checkOrderLogic(dto);
        return this.repository.createOrder(dto);
    }

    public async getAll(): Promise<Order[]>{
        return this.repository.getOrders();
    }
}