import { singleUpload } from './../middlewares/multer.js';
import express from "express";
import { AdminOnly } from "../middlewares/auth.js";
import { getAdminProducts, getAllCategories, getLatestProduct, getSingleProducts, newProduct, updateProduct } from "../controllers/product.js";

const app = express.Router();

app.post("/new", AdminOnly, singleUpload, newProduct);

app.get("/latest", getLatestProduct);

app.get("/categories", getAllCategories);

app.get("/admin-products", getAdminProducts);

app.route("/:id").get(getSingleProducts).put(singleUpload, updateProduct)

export default app;