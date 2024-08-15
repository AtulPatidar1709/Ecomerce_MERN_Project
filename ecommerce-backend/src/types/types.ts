import { NextFunction, Request, Response } from "express";

export interface newUserRequestBody {
    name: string;
    email: string;
    photo: string;
    gender: string;
    role: string;
    _id: string;
    dob: Date;
}

export interface newProductRequestBody {
    name: string;
    category: string;
    price: number;
    stock: number;
}

export type ControllerType = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export type SearchRequestQuery = {
    search?: string;
    price?: string;
    category?: string;
    sort?: string;
    page?: string;
}

export interface BaseQuery {
    name?: {
        $regex: string,
        $options: string,
    }
    price?: {
        $lte: number,
    },
    category?: string | undefined;
}

export type InvalidateCacheProps = {
    product?: boolean;
    order?: boolean;
    admin?: boolean;
    userId?: string;
    orderId?: string;
    productId?: string | string[];
}

export type shippingInfoType = {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: number;
}


export type OrderItemType = {
    name: string;
    photo: string;
    price: number;
    quantity: number;
    productId: string;
}

export interface NewOrderRequestBody {
    shippingInfo: shippingInfoType;
    user: string;
    subTotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    status: number;
    total: number;
    orderItems: OrderItemType[];

}