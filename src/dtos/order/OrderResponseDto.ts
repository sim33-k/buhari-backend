export class OrderResposneDto {
    public orderId: number;
    public total: number;

    // An array of order items
    //menuId: ID of the menu item (ill add the menu name later)
    public items: { menuId: number; quantity: number; price: number}[];

    constructor(orderId: number, total: number, items: { menuId: number; quantity: number; price: number}[]) {
        this.orderId = orderId;
        this.total = total;
        this.items = items;
    }

}