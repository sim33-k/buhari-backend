import express from "express";
import { OrderController } from "../controllers/OrderController";
import { OrderService } from "../services/OrderService";
import { SupabaseOrderRepository } from "../repositories/supabase/SupabaseOrderRepository";

const router = express.Router();
const orderRepository = new SupabaseOrderRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

// since i didnt add the arrow function in the method inside the controller,
// the this reference is lost, so i will have to add the bind method every time
router.post("/", orderController.createOrder.bind(orderController));
router.get("/", orderController.getAllOrders.bind(orderController));
export default router;
