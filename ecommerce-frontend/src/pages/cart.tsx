import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import Cartitem from "../components/cart-item";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cartReducerInitialState } from "../types/reducer-types";
import { addToCart, calculatePrice, discountApplied, removeCart } from "../redux/reducer/cartReducer";
import toast from "react-hot-toast";
import { CartItem } from "../types/types";
import axios from "axios";
import { server } from "../redux/store";

// const cartItems = [{
//     productId: "adfkslj",
//     photo: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mba13-midnight-config-202402?wid=820&hei=498&fmt=jpeg&qlt=90&.v=1708371033110",
//     name: "Mackbook",
//     price: 69999,
//     quantity: 4,
//     stock: 999,

// }];

const Cart = () => {

    const { cartItems, subTotal, tax, total, shippingCharges, discount } = useSelector((state: { cartReducer: cartReducerInitialState }) => state.cartReducer);

    const dispatch = useDispatch();

    const [couponCode, setCouponCode] = useState<string>("");
    const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

    const addtoCartHandler = (cartItem: CartItem) => {
        if (cartItem.quantity >= cartItem.stock) return toast.error("Out of Stock");

        dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }))
    }

    const decrementCartHandler = (cartItem: CartItem) => {
        if (cartItem.quantity <= 1) return toast.error("Please Remove Item From Cart");
        dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }))
    }

    const removeHandler = (productId: string) => {
        dispatch(removeCart(productId));
    }

    useEffect(() => {

        const { token, cancel } = axios.CancelToken.source();

        const timeOutId = setTimeout(() => {

            axios.get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, { cancelToken: token })
                .then((res) => {
                    dispatch(discountApplied(res.data.discount))
                    setIsValidCouponCode(true)
                    dispatch(calculatePrice())
                })
                .catch(() => {
                    dispatch(discountApplied(0))
                    setIsValidCouponCode(false)
                    dispatch(calculatePrice())
                });
        }, 1000);

        return () => {
            clearTimeout(timeOutId);
            cancel();
            setIsValidCouponCode(false);
        }
    }, [couponCode, dispatch])

    useEffect(() => {
        dispatch(calculatePrice())
    }, [cartItems, dispatch])


    return (
        <div className="cart">
            <main>
                {
                    cartItems.length > 0 ?
                        cartItems.map((item, index) =>
                            < Cartitem
                                addtoCartHandler={addtoCartHandler}
                                decrementCartHandler={decrementCartHandler}
                                removeHandler={removeHandler}
                                cartItem={item}
                                key={index} />
                        ) : <h1>No Items Aded</h1>
                }
            </main>
            <aside>
                <p>subtotal: ₹{subTotal}</p>
                <p>Shipping Charges : ₹{shippingCharges}</p>
                <p>Tax : ₹{tax}</p>
                <p>
                    Discount: <em className="red">- ₹{discount}</em>
                </p>
                <p>
                    <b>Total: ₹{total}</b>
                </p>
                <input type="text" value={couponCode} placeholder="Coupon Code" onChange={(e) => setCouponCode(e.target.value)} />

                {
                    couponCode &&
                    (isValidCouponCode ? <span className="green">₹{discount} off using the <code>{couponCode}</code></span>
                        : <span className="red">Invalid Coupon <VscError /></span>
                    )}

                {
                    cartItems.length > 0 && <Link to={"/shipping"}>Checkout</Link>

                }
            </aside>
        </div>
    )
}

export default Cart