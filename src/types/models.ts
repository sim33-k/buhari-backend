export interface Type {
    id: number;
    name: string;
}

export interface MenuItem {
    id: number;
    name: string;
    price: number;
    typeId: number;
    type?: Type;
}

export interface Order {
    id: number;
    date: Date;
    total: number;
    OrderItem?: OrderItem[];
}

export interface OrderItem {
    id: number;
    orderId: number;
    menuId: number;
    quantity: number;
    price: number;
    order?: Order;
    menu?: MenuItem;
}
