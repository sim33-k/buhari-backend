import Joi from "joi";


// instead of creating dtos and validation seperately, i have combined it in classy way
export class CreateOrderItemDto{
    public menuId: number;
    public quantity: number;

    constructor(menuId: number,quantity: number) {
        this.menuId = menuId;
        this.quantity = quantity;
    }


    public static schema = Joi.object({
        menuId: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().min(1).required()
    });

    public static validate(data: any) {
        return this.schema.validate(data);
    }

}


// similarly, for create order
export class CreateOrderDto{
    public items: CreateOrderItemDto[];

    constructor(items: CreateOrderItemDto[]) {
        this.items = items;
    }

    public static schema = Joi.object({
        items: Joi.array().items(CreateOrderItemDto.schema).required().min(1)
    });

    public static validate(data: any) {
        return this.schema.validate(data);
    }

}

// export interface createOrderItem {
//     menuItemId: number;
//     quantity: number;
// }

// export interface createOrder {
//     items: createOrderItem[];
// }