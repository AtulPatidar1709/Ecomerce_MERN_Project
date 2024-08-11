import { User } from "../models/user.js";
import errorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";
//middle ware to make sure Admin is allowed
export const AdminOnly = TryCatch(async (req, res, next) => {
    const { id } = req.query;
    if (!id) {
        return next(new errorHandler("Please LogIn First", 401));
    }
    const user = await User.findById(id);
    if (!user) {
        return next(new errorHandler("Your Login Id is wrong", 401));
    }
    if (user.role !== "admin") {
        return next(new errorHandler("Your are not an Admin", 401));
    }
    next();
});
