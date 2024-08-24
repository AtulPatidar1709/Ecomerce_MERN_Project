import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cartReducerInitialState } from '../../types/reducer-types';
import { CartItem } from '../../types/types';

const initialState: cartReducerInitialState = {
    loading: false,
    cartItems: [],
    subtotal: 0,
    tax: 0,
    discount: 0,
    shippingCharges: 0,
    shippingInfo: {
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: ""
    },
    total: 0,
};

export const cartReducer = createSlice({
    name: "cartReducer",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            state.loading = true;

            const index = state.cartItems.findIndex(i => i.productId === action.payload.productId);

            if (index !== -1) state.cartItems[index] = action.payload;

            else state.cartItems.push(action.payload);
            state.loading = false;


        },

        removeCart: (state, action: PayloadAction<string>) => {
            state.loading = true;
            state.cartItems = state.cartItems.filter(i => i.productId !== action.payload);
            state.loading = false;
        },

        calculatePrice: (state) => {
            const subTotal = state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

            state.subtotal = subTotal;
            state.shippingCharges = state.subtotal > 1000 ? 0 : 200;
            state.tax = Math.round(state.subtotal * 0.18);
            state.total = state.subtotal + state.tax + state.shippingCharges - state.discount;
        },

        discountApplied: (state, action: PayloadAction<number>) => {
            state.discount = action.payload;
        },
    },
})

export const { addToCart, removeCart, calculatePrice, discountApplied } = cartReducer.actions;