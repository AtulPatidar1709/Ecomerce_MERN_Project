import { Product } from './../models/products.js';
import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { User } from "../models/user.js";
import { calculatePercentage, getInventories } from "../utils/features.js";

export const getDashboardStats = TryCatch(
    async (req, res, next) => {
        let stats;

        if (myCache.has("admin-stats")) stats = JSON.parse(myCache.get("admin-stats") as string);

        else {
            const today = new Date();

            const sixMonthsAgo = new Date();

            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            const thisMonth = {
                start: new Date(today.getFullYear(), today.getMonth(), 1),
                end: today
            }

            const lastMonth = {
                start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
                end: new Date(today.getFullYear(), today.getMonth(), 0)
            }

            const thisMonthProductPromise = Product.find({
                createdAt: {
                    $gte: thisMonth.start,
                    $lte: thisMonth.end
                }
            })

            const lastMonthProductPromise = Product.find({
                createdAt: {
                    $gte: lastMonth.start,
                    $lte: lastMonth.end
                }
            })


            const thisMonthUsersPromise = User.find({
                createdAt: {
                    $gte: thisMonth.start,
                    $lte: thisMonth.end
                }
            })

            const lastMonthUsersPromise = User.find({
                createdAt: {
                    $gte: lastMonth.start,
                    $lte: lastMonth.end
                }
            })

            const thisMonthOrdersPromise = Order.find({
                createdAt: {
                    $gte: thisMonth.start,
                    $lte: thisMonth.end
                }
            })

            const lastMonthOrdersPromise = Order.find({
                createdAt: {
                    $gte: lastMonth.start,
                    $lte: lastMonth.end
                }
            })

            const lastSixMonthsOrdersPromise = Order.find({
                createdAt: {
                    $gte: sixMonthsAgo,
                    $lte: today
                }
            })

            const lastestTransactionPromise = Order.find({}).select(["orderItems", "discount", "total", "status"]).limit(4);

            const [
                thisMonthProduct,
                thisMonthUsers,
                thisMonthOrders,
                lastMonthProduct,
                lastMonthUsers,
                lastMonthOrders,
                productCount,
                userCount,
                allOrders,
                lastSixMonthsOrders,
                categories,
                femaleUserCount,
                lastestTransaction
            ] = await Promise.all([
                thisMonthProductPromise,
                thisMonthUsersPromise,
                thisMonthOrdersPromise,
                lastMonthProductPromise,
                lastMonthUsersPromise,
                lastMonthOrdersPromise,
                Product.countDocuments(),
                User.countDocuments(),
                Order.find({}).select("total"),
                lastSixMonthsOrdersPromise,
                Product.distinct("category"),
                User.countDocuments({ gender: "female" }),
                lastestTransactionPromise
            ]);

            const thisMonthRevenue = thisMonthOrders.reduce((total, order) => total + (order.total || 0), 0);

            const lastMonthRevenue = lastMonthOrders.reduce((total, order) => total + (order.total || 0), 0);

            const changePercent = {

                revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),

                product: calculatePercentage(thisMonthProduct.length, lastMonthProduct.length),

                user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),

                order: calculatePercentage(thisMonthOrders.length, lastMonthOrders.length)
            }

            const revenue = allOrders.reduce((total, order) => total + (order.total || 0), 0);

            const count = {
                revenue: revenue,
                product: productCount,
                user: userCount,
                order: allOrders.length,
            };

            const orderMonthCounts = new Array(6).fill(0);
            const orderMonthRevenue = new Array(6).fill(0);

            lastSixMonthsOrders.forEach((order) => {
                const creationDate = order.createdAt;
                const monthDiff = today.getMonth() - creationDate.getMonth();

                if (monthDiff < 6) {
                    orderMonthCounts[6 - monthDiff - 1] += 1;
                    orderMonthRevenue[6 - monthDiff - 1] += order.total;
                }
            })

            const categoryCount = await getInventories({ categories, productCount, });

            const UserRatio = {
                male: userCount - femaleUserCount,
                female: femaleUserCount
            }

            const modifiedLatestTransection = lastestTransaction.map(i => ({
                _id: i._id,
                discount: i.discount,
                amount: i.total,
                quantity: i.orderItems.length,
                status: i.status,
            }))

            stats = {
                categoryCount,
                changePercent,
                count,
                chart: {
                    order: orderMonthCounts,
                    revenue: orderMonthRevenue,
                },
                UserRatio,
                lastestTransaction: modifiedLatestTransection,
            }

            myCache.set("admin-stats", JSON.stringify(stats));

        }
        return res.status(200).json({
            success: true,
            stats
        })
    })

export const getPieCharts = TryCatch(
    async (req, res, next) => {
        let charts;

        if (myCache.has("admin-pie-charts"))
            charts = JSON.parse(myCache.get("admin-pie-charts") as string);

        else {

            const allOrderPromise = Order.find({}).select(["total", "discount", "subTotal", "tax", "shippingCharges"])

            const [
                processingOrder,
                shippedOrder,
                deliveredOrder,
                categories,
                productCount,
                productsOutOfStock,
                allOrders
            ] = await Promise.all([
                Order.countDocuments({ status: "Processing" }),
                Order.countDocuments({ status: "Shipped" }),
                Order.countDocuments({ status: "Delivered" }),
                Product.distinct("category"),
                Product.countDocuments(),
                Product.countDocuments({
                    stock: 0
                }),
                allOrderPromise
            ]);

            const orderFullFillment = {
                processing: processingOrder,
                shipped: shippedOrder,
                delivered: deliveredOrder,
            }

            const productCategories = await getInventories({ categories, productCount });

            const stockAvailability = {
                inStock: productCount - productsOutOfStock,
                outOfStock: productsOutOfStock,
            }

            const totalGrossIncome = allOrders.reduce(
                (prev, order) => prev + (order.total || 0), 0
            );

            const discount = allOrders.reduce(
                (prev, order) => prev + (order.discount || 0), 0
            );

            const productionCost = allOrders.reduce(
                (prev, order) => prev + (order.shippingCharges || 0), 0
            );

            const burnt = allOrders.reduce(
                (prev, order) => prev + (order.tax || 0), 0
            );

            const marketingCost = Math.round(totalGrossIncome * (30 / 100));

            const netMargin = totalGrossIncome - discount - productionCost - burnt - marketingCost;

            const revenueDistribution = {
                totalGrossIncome,
                netMargin,
                discount,
                productionCost,
                burnt,
                marketingCost,
            }

            charts = {
                orderFullFillment,
                productCategories,
                stockAvailability,
                revenueDistribution
            };

            myCache.set("admin-pie-charts", JSON.stringify(charts))
        }

        return res.status(200).json({
            success: true,
            charts
        })
    }
)

export const getBarCharts = TryCatch(
    async () => {

    }
)

export const getLineCharts = TryCatch(
    async () => {

    }
)

