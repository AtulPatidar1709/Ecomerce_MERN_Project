// controllers/orderController.js

import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import errorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";

export const myOrders = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id: user } = req.query;

        const key = `my-orders-${user}`;
        let orders;

        if (myCache.has(key)) {
            orders = JSON.parse(myCache.get(key) as string);
        } else {
            orders = await Order.find({ user });
            myCache.set(key, JSON.stringify(orders));
        }

        return res.status(200).json({
            success: true,
            orders
        });
    }
);

export const allOrders = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const key = `all-orders`;
        let orders;

        if (myCache.has(key)) {
            orders = JSON.parse(myCache.get(key) as string);
        } else {
            orders = await Order.find().populate("user", "name");
            myCache.set(key, JSON.stringify(orders));
        }

        return res.status(200).json({
            success: true,
            orders
        });
    }
);

export const getSingleOrder = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const key = `order-${id}`;
        let order;

        if (myCache.has(key)) {
            order = JSON.parse(myCache.get(key) as string);
        } else {
            order = await Order.findById(id).populate("user", "name");
            if (!order) return next(new errorHandler("Order Not Found", 404));
            myCache.set(key, JSON.stringify(order));
        }

        return res.status(200).json({
            success: true,
            order
        });
    }
);

export const newOrder = TryCatch(
    async (req: Request<{}, {}, NewOrderRequestBody>, res: Response, next: NextFunction) => {
        console.log("Request Body:", req.body); // Log the request body for debugging

        const {
            shippingInfo,
            orderItems,
            user,
            subTotal,
            tax,
            shippingCharges,
            discount,
            total,
            status
        } = req.body;

        // Validate fields
        if (!shippingInfo || !orderItems || !user || !subTotal || !tax || !total) {
            return next(new errorHandler("Please Enter All Fields", 400));
        }

        // Log validated data
        console.log("Validated Data:", {
            shippingInfo,
            orderItems,
            user,
            subTotal,
            tax,
            shippingCharges,
            discount,
            total,
            status
        });

        try {
            // Create the order
            const order = await Order.create({
                shippingInfo,
                orderItems,
                user,
                subTotal,
                tax,
                shippingCharges,
                discount,
                total,
                status
            });

            console.log("Order Created:", order);

            // Reduce stock
            await reduceStock(orderItems);

            // Invalidate cache
            invalidateCache({
                product: true,
                order: true,
                admin: true,
                userId: user,
                productId: order.orderItems.map(i => String(i.productId))
            });

            return res.status(201).json({
                success: true,
                message: "Order Placed Successfully",
            });
        } catch (error) {
            console.error("Order Creation Error:", error);
            return next(new errorHandler("Failed to create order", 500));
        }
    }
);

export const processOrder = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) return next(new errorHandler("Order Not Found", 404));

        switch (order.status) {
            case "Processing":
                order.status = "Shipped";
                break;
            case "Shipped":
                order.status = "Delivered";
                break;
            default:
                order.status = "Delivered";
                break;
        }

        await order.save();

        try {
            invalidateCache({
                product: false,
                order: true,
                admin: true,
                userId: order.user,
                orderId: String(order._id)
            });
        } catch (error) {
            console.error('Error invalidating cache:', error);
            return next(new errorHandler("Failed to invalidate cache", 500));
        }

        return res.status(200).json({
            success: true,
            message: "Order Processed Successfully",
        });
    }
);

export const deleteOrder = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) return next(new errorHandler("Order Not Found", 404));

        await order.deleteOne();

        try {
            invalidateCache({
                product: false,
                order: true,
                admin: true,
                userId: order.user,
                orderId: String(order._id)
            });
        } catch (error) {
            console.error('Error invalidating cache:', error);
            return next(new errorHandler("Failed to invalidate cache", 500));
        }

        return res.status(200).json({
            success: true,
            message: "Order Deleted Successfully",
        });
    }
);
