import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import errorHandler from "../utils/utility-class.js";

export const createPaymentIntent = TryCatch(async (req, res, next) => {
    const { amount, shippingInfo, userId } = req.body;

    // Validate required fields
    if (!amount) return next(new errorHandler("Please Enter Amount", 400));
    if (!shippingInfo) return next(new errorHandler("Please Enter Shipping Information", 400));
    if (!userId) return next(new errorHandler("User ID is required", 400));

    try {
        // Example description for Indian export regulations
        const description = `Order for ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country} - ${new Date().toLocaleDateString()}`;

        // Create payment intent with the customer details and description
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to the smallest currency unit (e.g., paise for INR)
            currency: "inr",
            description: description,
            shipping: {
                name: shippingInfo.address,
                address: {
                    line1: shippingInfo.address,
                    city: shippingInfo.city,
                    state: shippingInfo.state,
                    postal_code: shippingInfo.pinCode,
                    country: shippingInfo.country,
                },
            },
            metadata: {
                userId: userId, // Include user ID for tracking purposes
            },
        });

        return res.status(201).json({
            success: true,
            clientSecret: paymentIntent.client_secret, // Return the client secret to the frontend
        });
    } catch (error) {
        console.error("Stripe Error:", error);
        return next(new errorHandler("Payment processing failed. Please try again.", 500));
    }
});

export const newCoupom = TryCatch(
    async (req, res, next) => {
        const { coupon, amount } = req.body;

        if (!coupon || !amount) return next(new errorHandler("Please Enter All Fields", 400))

        await Coupon.create({ code: coupon, amount });

        return res.status(201).json({
            success: true,
            message: `Coupon ${coupon} Created Successfully`,
        })
    }
)

export const applyDiscount = TryCatch(
    async (req, res, next) => {
        const { coupon } = req.query;

        const discount = await Coupon.findOne({ code: coupon });

        if (!discount) return next(new errorHandler("Invalid Coupon Code", 400));

        return res.status(200).json({
            success: true,
            discount: discount.amount,
        })
    }
)

export const allCoupons = TryCatch(
    async (req, res, next) => {

        const coupons = await Coupon.find({});

        return res.status(200).json({
            success: true,
            coupons
        })
    }
)

export const getCoupon = TryCatch(async (req, res, next) => {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);

    if (!coupon) return next(new errorHandler("Invalid Coupon ID", 400));

    return res.status(200).json({
        success: true,
        coupon,
    });
});

export const updateCoupon = TryCatch(async (req, res, next) => {
    const { id } = req.params;

    const { code, amount } = req.body;

    const coupon = await Coupon.findById(id);

    if (!coupon) return next(new errorHandler("Invalid Coupon ID", 400));

    if (code) coupon.code = code;
    if (amount) coupon.amount = amount;

    await coupon.save();

    return res.status(200).json({
        success: true,
        message: `Coupon ${coupon.code} Updated Successfully`,
    });
});

export const deleteCoupon = TryCatch(
    async (req, res, next) => {

        const { id } = req.params;

        const coupon = await Coupon.findByIdAndDelete(id);

        if (!coupon) return next(new errorHandler("Invalid Coupon ID", 400));

        return res.status(200).json({
            success: true,
            message: `Coupon ${coupon?.code} Deleted Successfully`
        })
    }
)