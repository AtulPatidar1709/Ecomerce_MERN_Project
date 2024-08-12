import mongoose from "mongoose";
import { trim } from "validator";

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, "Please Enter Name"],
        },
        photo: {
            type: String,
            require: [true, "Please Enter Photo}"],
        },
        price: {
            type: Number,
            require: [true, "Please Enter Price"],
        },
        stock: {
            type: Number,
            require: [true, "Please Enter Stock"],
        },
        category: {
            type: String,
            require: [true, "Please Enter Category"],
            trim: true,
        },
    },
    {
        timestamps: true,
    },
)


export const Product = mongoose.model("Product", schema);
