import { configureStore } from "@reduxjs/toolkit";
import { productAPI } from "./api/productAPI.ts";
import { userAPI } from "./api/userAPI";
import { userReducer } from "./reducer/userReducer.ts";
import { cartReducer } from "./reducer/cartReducer.ts";
import { orderApi } from "./api/orderAPI.ts";
import { dashboardApi } from "./api/dashboardAPI.ts";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
    reducer: {
        [userAPI.reducerPath]: userAPI.reducer,
        [productAPI.reducerPath]: productAPI.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [userReducer.name]: userReducer.reducer,
        [cartReducer.name]: cartReducer.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(
                userAPI.middleware,
                productAPI.middleware,
                orderApi.middleware,
                dashboardApi.middleware,
            ),
});

export type RootState = ReturnType<typeof store.getState>;


