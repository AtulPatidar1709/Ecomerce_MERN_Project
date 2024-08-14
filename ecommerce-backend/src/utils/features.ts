import mongoose from "mongoose";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/products.js";
import { Order } from "../models/order.js";

export const connectDB = (uri: string) => {
    mongoose.connect(uri, {
        dbName: "Ecommerce_MERN"
    }).then((c) => console.log(`DB Connected to ${c.connection.host}`))
        .catch((e) => console.log(e));
}

export const invalidateCache = async ({
    product,
    order,
    admin,
    userId
}: InvalidateCacheProps) => {

    if (product) {
        const productKeys: string[] = ["latest-products", "categories", "all-products"];


        // product - ${ id }
        const products = await Product.find({}).select("_id")

        products.forEach(i => {
            productKeys.push(`product-${i._id}`);
        });

        myCache.del(productKeys);
    } if (order) {
        const orderKeys: string[] = ["all-orders", `my-orders-${userId}`];
        const orders = await Order.find({}).select("_id")

        orders.forEach(i => {
            orderKeys.push(`order-${i._id}`);
        });

        myCache.del(orderKeys);

    } if (admin) {

    }

}


export const reduceStock = async (orderItems: OrderItemType[]) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product) throw new Error("Product Not Found");
        product.stock! -= order.quantity;
        await product.save();
    }
}