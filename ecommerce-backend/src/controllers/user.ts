import { Response } from 'express';
import { newUserRequestBody } from './../types/types.js';
import { NextFunction, Request } from "express"
import { User } from "../models/user.js";
import { TryCatch } from '../middlewares/error.js';
import errorHandler from '../utils/utility-class.js';

export const newUser = TryCatch(
    async (
        req: Request<{}, {}, newUserRequestBody>,
        res: Response,
        next: NextFunction
    ) => {
        const { name, email, photo, gender, dob, _id } = req.body;

        const user = await User.create({ name, email, photo, gender, dob: new Date(dob), _id });

        return res.status(200).json(
            {
                success: true,
                message: `Welcome, ${user.name}`,
            }
        )
    });

export const getAllUsers = TryCatch(
    async (req, res, next) => {
        const users = await User.find({});

        return res.status(200).json({
            success: true,
            users,
        })
    }
)

export const getUser = TryCatch(
    async (req, res, next) => {

        const id = req.params.id;
        const user = await User.findById(id);

        if (!user) return next(new errorHandler("Invalid Id", 400))

        return res.status(200).json({
            success: true,
            user,
        })
    }
)

export const deleteUser = TryCatch(
    async (req, res, next) => {

        const id = req.params.id;
        const user = await User.findById(id);

        if (!user) return next(new errorHandler("Invalid Id", 400))

        await user.deleteOne();

        return res.status(200).json({
            success: true,
            message: "User Deleted Successfully",
        })
    }
)