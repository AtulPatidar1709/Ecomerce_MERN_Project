import express from "express";
import { AdminOnly } from "../middlewares/auth.js";
import { allCoupons, applyDiscount, createPaymentIntent, deleteCoupon, getCoupon, newCoupom, updateCoupon } from "../controllers/payment.js";

const app = express.Router();


//create order Route- /api/v1/payment/create
app.post("/create", createPaymentIntent);

//create order Route- /api/v1/payment/coupon/
app.get("/discount", applyDiscount);

//create order Route- /api/v1/payment/coupon/new
app.post("/coupon/new", AdminOnly, newCoupom);

//create order Route- /api/v1/payment/coupon/all
app.get("/coupon/all", AdminOnly, allCoupons);

//create order Route- /api/v1/payment/coupon/all
app.route("/coupon/:id")
    .get(AdminOnly, getCoupon)
    .put(AdminOnly, updateCoupon)
    .delete(AdminOnly, deleteCoupon);
export default app;