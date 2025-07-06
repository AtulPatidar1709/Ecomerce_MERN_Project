import express from 'express';

import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';

import NodeCache from 'node-cache';

import { config } from 'dotenv';
import morgan from 'morgan';
import Stripe from 'stripe';
import cors from "cors";

import userRoute from "./routes/user.js";
import productRoute from "./routes/products.js";
import orderRoute from "./routes/orders.js";
import paymentRoute from "./routes/payment.js";
import dashboardRoute from "./routes/stats.js";

config({ path: "./.env" });

const port = process.env.PORT || 3000;

const mongoURI = process.env.MONGO_URI || "";
const stripekey = process.env.STRIPE_KEY || "";

connectDB(mongoURI);

export const myCache = new NodeCache();

export const stripe = new Stripe(stripekey);

const app = express();

app.use(express.json());
app.use(morgan("dev"));

const allowedOrigins = [
  'http://localhost:3000',
  'https://ecomerce-project-mern.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.get("/", (req, res) => {
    res.send("API Working with /api/v1");
})

//  using routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);

app.use("/api/v1/dashboard", dashboardRoute);


app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is working on ${port}`)
})
