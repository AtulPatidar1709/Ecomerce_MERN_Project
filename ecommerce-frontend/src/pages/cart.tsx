import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import Cartitem from "../components/cart-item";
import { Link } from "react-router-dom";

const cartItems = [{
    productId: "adfkslj",
    photo: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mba13-midnight-config-202402?wid=820&hei=498&fmt=jpeg&qlt=90&.v=1708371033110",
    name: "Mackbook",
    price: 69999,
    quantity: 4,
    stock: 999,

}];
const subtotal = 4000;
const tax = Math.round(subtotal * 0.18);
const shippingCharges = 200;
const discount = 400;
const total = subtotal + tax + shippingCharges;

const Cart = () => {
    const [couponCode, setCouponCode] = useState<string>("");
    const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

    useEffect(() => {
        const timeOutId = setTimeout(() => {
            if (Math.random() > 0.5) setIsValidCouponCode(true);
            else setIsValidCouponCode(false);
        }, 1000)

        return () => {
            clearTimeout(timeOutId);
            setIsValidCouponCode(false);
        }
    }, [couponCode])

    return (
        <div className="cart">
            <main>
                {
                    cartItems.length > 0 ?
                        cartItems.map((item, index) =>
                            < Cartitem cartItem={item} key={index} />
                        ) : <h1>No Items Aded</h1>
                }
            </main>
            <aside>
                <p>Subtotal: ₹{subtotal}</p>
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