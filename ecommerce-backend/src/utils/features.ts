import mongoose from "mongoose";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/products.js";
import { Order } from "../models/order.js";
import { Document } from "mongoose";

export const connectDB = (uri: string) => {
    mongoose.connect(uri, {
        dbName: "Ecommerce_MERN"
    }).then((c) => console.log(`DB Connected to ${c.connection.host}`))
        .catch((e) => console.log(e));
}

export const invalidateCache = ({
    product,
    order,
    admin,
    userId,
    orderId,
    productId
}: InvalidateCacheProps) => {

    if (product) {

        const productKeys: string[] = ["latest-products", "categories", "all-products"];

        if (typeof productId === "string") productKeys.push(`product-${productId}`);

        if (typeof productId === "object") productId.forEach((i) => productKeys.push(`product-${i}`));

        myCache.del(productKeys)

    } if (order) {
        const orderKeys: string[] = ["all-orders", `my-orders-${userId}`, `order-${orderId}`];

        myCache.del(orderKeys);

    } if (admin) {
        myCache.del([
            "admin-stats",
            "admin-pie-charts",
            "admin-bar-charts",
            "admin-line-charts"
        ])
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

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {

    if (lastMonth === 0) return thisMonth * 100;

    const percentage = (thisMonth / lastMonth) * 100;

    return Number(percentage.toFixed(0));
}

export const getInventories = async ({ categories, productCount }: { categories: (string | null)[], productCount: number }) => {

    const categoriesCountPromise = categories.map((category) =>
        category !== null ? Product.countDocuments({ category }) : Promise.resolve(0)
    );

    const categoriesCount = await Promise.all(categoriesCountPromise);

    const categoryCount: Record<string, number>[] = [];

    categories.forEach((category, i) => {
        if (category !== null) {
            categoryCount.push({
                [category]: categoriesCount[i],
            });
        }
    });

    return categoryCount;
};

interface MyDocument extends Document {
    createdAt: Date;
    discount?: number;
    total?: number;
}

export const getChartData = ({ length, docArr, today, property }: { length: number, docArr: MyDocument[], today: Date, property?: "discount" | "total" }) => {

    const data = new Array(length).fill(0);

    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

        if (monthDiff < length) {
            data[length - monthDiff - 1] += property ? i[property]! : 1;
        }
    })
    return data;
}