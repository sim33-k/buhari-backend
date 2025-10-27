
import { Request, Response } from "express";
import { CreateOrderDto } from "../dtos/order/CreateOrderDto";
import { BaseController } from "./BaseController";
import { OrderService } from "services/OrderService";

export class OrderController extends BaseController {
    private orderService: OrderService;

    constructor(orderService: OrderService) {
        super();
        this.orderService = orderService;
    }

    // there a small issue here, but not writing this as an arrow function, we will lose
    // the reference to this, so I have to bind every method to its controller in the route level

    public async createOrder(request: Request, response: Response): Promise<void> {
        // we now make use the dto class we made, that also includes the validation rule
        const { error, value } = CreateOrderDto.validate(request.body);

        if (error) {
            return this.sendError(response, error.details[0].message, 400);
        }

        try {
            const createdOrder = await this.orderService.createOrder(value);
            this.sendSuccess(response, createdOrder, 201);
        } catch (error) {
            this.sendError(response, (error as Error).message, 400);
        }
    }

    public async getAllOrders(request: Request, response: Response): Promise<void> {
        try {
            const result = await this.orderService.getAll();
            this.sendSuccess(response, result, 200);
        } catch (error) {
            this.sendError(response, (error as Error).message, 500);
        }
    }

}