import mongoose from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../models/products.js";
export const connectDB = (uri) => {
    mongoose.connect(uri, {
        dbName: "Ecommerce_MERN"
    }).then((c) => console.log(`DB Connected to ${c.connection.host}`))
        .catch((e) => console.log(e));
};
export const invalidateCache = ({ product, order, admin, userId, orderId, productId }) => {
    if (product) {
        const productKeys = ["latest-products", "categories", "all-products"];
        if (typeof productId === "string")
            productKeys.push(`product-${productId}`);
        if (typeof productId === "object")
            productId.forEach((i) => productKeys.push(`product-${i}`));
        myCache.del(productKeys);
    }
    if (order) {
        const orderKeys = ["all-orders", `my-orders-${userId}`, `order-${orderId}`];
        myCache.del(orderKeys);
    }
    if (admin) {
        myCache.del([
            "admin-stats",
            "admin-pie-charts",
            "admin-bar-charts",
            "admin-line-charts"
        ]);
    }
};
export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product)
            throw new Error("Product Not Found");
        product.stock -= order.quantity;
        await product.save();
    }
};
export const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0)
        return thisMonth * 100;
    const percentage = (thisMonth / lastMonth) * 100;
    return Number(percentage.toFixed(0));
};
export const getInventories = async ({ categories, productCount }) => {
    const categoriesCountPromise = categories.map((category) => category !== null ? Product.countDocuments({ category }) : Promise.resolve(0));
    const categoriesCount = await Promise.all(categoriesCountPromise);
    const categoryCount = [];
    categories.forEach((category, i) => {
        if (category !== null) {
            categoryCount.push({
                [category]: categoriesCount[i],
            });
        }
    });
    return categoryCount;
};
export const getChartData = ({ length, docArr, today, property }) => {
    const data = new Array(length).fill(0);
    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < length) {
            data[length - monthDiff - 1] += property ? i[property] : 1;
        }
    });
    return data;
};
