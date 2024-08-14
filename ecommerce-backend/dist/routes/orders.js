import express from "express";
import { AdminOnly } from "../middlewares/auth.js";
import { allOrders, deleteOrder, getSingleOrder, myOrders, newOrder, processOrder } from "../controllers/order.js";
const app = express.Router();
//create order Route- /api/v1/order/new
app.post("/new", newOrder);
//get my order Route- /api/v1/order/my
app.get("/my", myOrders);
//admin all order Route- /api/v1/order/all
app.get("/all", AdminOnly, allOrders);
//get single user single order Route- /api/v1/order/:id
app.route("/:id").get(getSingleOrder).put(AdminOnly, processOrder).delete(AdminOnly, deleteOrder);
export default app;
