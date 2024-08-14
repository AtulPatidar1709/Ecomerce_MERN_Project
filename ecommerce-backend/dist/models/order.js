import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: [true, "Please enter Address"]
        },
        city: {
            type: String,
            required: [true, "Please enter City"]
        },
        state: {
            type: String,
            required: [true, "Please enter State"]
        },
        country: {
            type: String,
            require: [true, "Please enter Country"]
        },
        pinCode: {
            type: Number,
            required: [true, "Please enter PinCode"]
        }
    },
    user: {
        type: String,
        ref: "User",
        required: true,
    },
    subTotal: {
        type: Number,
        required: true,
    },
    tax: {
        type: Number,
        required: true,
    },
    shippingCharges: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["Processing", "Shipped", "Delivered"],
        default: "Processing"
    },
    orderItems: [
        {
            name: String,
            photo: String,
            price: Number,
            quantity: Number,
            productId: {
                type: mongoose.Types.ObjectId,
                ref: "Product",
            }
        }
    ]
}, {
    timestamps: true,
});
export const Order = mongoose.model("Order", orderSchema);
