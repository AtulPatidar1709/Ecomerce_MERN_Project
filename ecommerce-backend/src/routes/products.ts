import { singleUpload } from './../middlewares/multer.js';
import express from "express";
import { AdminOnly } from "../middlewares/auth.js";
import { deleteProduct, getAdminProducts, getAllCategories, getAllProducts, getLatestProduct, getSingleProducts, newProduct, updateProduct } from "../controllers/product.js";

const app = express.Router();

app.post("/new", AdminOnly, singleUpload, newProduct);

app.get("/all", getAllProducts);

app.get("/latest", getLatestProduct);

app.get("/categories", getAllCategories);

app.get("/admin-products", AdminOnly, getAdminProducts);

app.route("/:id").get(getSingleProducts).put(AdminOnly, singleUpload, updateProduct).delete(AdminOnly, deleteProduct);

export default app;