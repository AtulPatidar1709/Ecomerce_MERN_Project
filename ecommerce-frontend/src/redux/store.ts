import { configureStore } from "@reduxjs/toolkit";
import { productAPI } from "./api/productAPI.ts";
import { userAPI } from "./api/userAPI";
import { userReducer } from "./reducer/userReducer.ts";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
    reducer: {
        [userAPI.reducerPath]: userAPI.reducer,
        [productAPI.reducerPath]: productAPI.reducer,
        [userReducer.name]: userReducer.reducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userAPI.middleware, productAPI.middleware),
});



