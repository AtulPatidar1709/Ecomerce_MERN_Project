import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/products.js";
import errorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { myCache } from '../app.js';
import { invalidateCache } from '../utils/features.js';
//Revalidate on new,update,delete, & on new order
export const getLatestProduct = TryCatch(async (req, res, next) => {
    let products;
    if (myCache.has("latest-products"))
        products = JSON.parse(myCache.get("latest-products"));
    else {
        products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        myCache.set("latest-products", JSON.stringify(products));
    }
    return res.status(200).json({
        success: true,
        products,
    });
});
//Revalidate on new,update,delete, & on new order
export const getAllCategories = TryCatch(async (req, res, next) => {
    let categories;
    if (myCache.has("categories"))
        categories = JSON.parse(myCache.get("categories"));
    else {
        categories = await Product.distinct("category");
        myCache.set("categories", JSON.stringify(categories));
    }
    return res.status(200).json({
        success: true,
        categories,
    });
});
//Revalidate on new,update,delete, & on new order
export const getAdminProducts = TryCatch(async (req, res, next) => {
    let products;
    if (myCache.has("all-products"))
        products = JSON.parse(myCache.get("all-products"));
    else {
        products = await Product.find({});
        myCache.set("all-products", JSON.stringify(products));
    }
    return res.status(200).json({
        success: true,
        products,
    });
});
export const getSingleProducts = TryCatch(async (req, res, next) => {
    let product;
    const id = req.params.id;
    if (myCache.has(`product-${id}`))
        product = JSON.parse(myCache.get(`product-${id}`));
    else {
        if (!product)
            return next(new errorHandler("Product Not Found", 400));
        product = await Product.findById(req.params.id);
        myCache.set(`product-${id}`, JSON.stringify(product));
    }
    return res.status(200).json({
        success: true,
        product,
    });
});
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new errorHandler("Please add Photo", 400));
    if (!name || !price || !stock || !category) {
        rm(photo.path, () => {
            console.log("Deleted");
        });
        return next(new errorHandler("Please enter All Fields", 400));
    }
    await Product.create({
        name, price, stock,
        category: category.toLowerCase(),
        photo: photo.path,
    });
    await invalidateCache({ product: true });
    return res.status(200).json({
        success: true,
        message: "Product created Successfully"
    });
});
export const updateProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);
    if (!product)
        return next(new errorHandler("Product Not Found", 400));
    if (photo) {
        rm(product.photo, () => {
            console.log("Old Photo Deleted");
        });
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category;
    await product.save();
    await invalidateCache({ product: true, productId: String(product._id) });
    return res.status(200).json({
        success: true,
        message: "Produc updated Successfully"
    });
});
export const deleteProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product)
        return next(new errorHandler("Product Not Found", 400));
    rm(product.photo, () => {
        console.log("Photo Deleted");
    });
    await product.deleteOne();
    await invalidateCache({ product: true, productId: String(product._id) });
    return res.status(200).json({
        success: true,
        message: "Produc Deleted Successfully"
    });
});
export const getAllProducts = TryCatch(async (req, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = limit * (page - 1);
    const baseQuery = {};
    if (search)
        baseQuery.name = {
            $regex: search,
            $options: "i",
        };
    if (price)
        baseQuery.price = {
            $lte: Number(price),
        };
    if (category)
        baseQuery.category = category;
    const productPromise = Product.find(baseQuery).sort(sort && { price: sort === "asc" ? 1 : -1 }).limit(limit).skip(skip);
    const [products, filterdOnlyProduct] = await Promise.all([
        productPromise,
        Product.find(baseQuery)
    ]);
    const totalPage = Math.ceil(filterdOnlyProduct.length / limit);
    return res.status(200).json({
        success: true,
        totalPage,
        products,
    });
});
// create Random Projects
// const generateRandomProducts = async (count: number = 10) => {
//     const products = [];
//     for (let i = 0; i < count; i++) {
//         const product = {
//             name: faker.commerce.productName(),
//             photo: "uploads\abff5df6-fabc-4830-bd25-ffc84cf50c7d.jpg",
//             price: faker.commerce.price({ min: 999, max: 99000, dec: 0 }),
//             stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//             category: faker.commerce.department(),
//             createdUp: new Date(faker.date.past()),
//             updatedAt: new Date(faker.date.recent()),
//             _v: 0,
//         };
//         products.push(product);
//     }
//     await Product.create(products);
//     console.log({ success: true })
// }
// generateRandomProducts(48);
//Delete Random Products
// const deleteRandomProducts = async (count: number = 10) => {
//     const products = await Product.find({}).skip(2);
//     for (let i = 0; i < products.length; i++) {
//         const product = products[i];
//         await product.deleteOne();
//     }
//     console.log({ success: true })
// };
// deleteRandomProducts(8);
