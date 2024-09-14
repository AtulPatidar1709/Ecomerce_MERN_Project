import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
import { cartReducerInitialState } from "../types/reducer-types";
import { server } from "../redux/store";

// Initial shipping info function for reusability and maintainability
const initialShippingInfo = {
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
};

const Shipping = () => {
    const { cartItems, total } = useSelector((state: { cartReducer: cartReducerInitialState }) => state.cartReducer);
    const { user } = useSelector((state: { userReducer: { user: { _id: string } } }) => state.userReducer);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [shippingInfo, setShippingInfo] = useState(initialShippingInfo);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle input changes for form fields
    const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setShippingInfo((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Submit form data and create payment intent
    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateShippingInfo()) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);
        dispatch(saveShippingInfo(shippingInfo));

        try {
            const { data } = await axios.post(
                `${server}/api/v1/payment/create`,
                {
                    amount: total,
                    shippingInfo,
                    userId: user._id,  // Include the user ID in the request
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            navigate("/pay", {
                state: data.clientSecret,
            });
        } catch (error) {
            console.error("Error creating payment:", error);
            toast.error("Failed to initiate payment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Redirect user to cart if no items in cart
    useEffect(() => {
        if (cartItems.length <= 0) {
            navigate("/cart");
        }
    }, [cartItems, navigate]);

    // Simple validation for shipping form
    const validateShippingInfo = () => {
        const { address, city, state, country, pinCode } = shippingInfo;
        return address && city && state && country && pinCode;
    };

    return (
        <div className="shipping">
            <button className="back-btn" onClick={() => navigate("/cart")}>
                <BiArrowBack /> Back to Cart
            </button>
            <form onSubmit={submitHandler}>
                <h1>Shipping Address</h1>

                <input
                    type="text"
                    required
                    placeholder="Address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={changeHandler}
                />

                <input
                    type="text"
                    required
                    placeholder="City"
                    name="city"
                    value={shippingInfo.city}
                    onChange={changeHandler}
                />

                <input
                    type="text"
                    required
                    placeholder="State"
                    name="state"
                    value={shippingInfo.state}
                    onChange={changeHandler}
                />

                <select
                    required
                    name="country"
                    value={shippingInfo.country}
                    onChange={changeHandler}
                >
                    <option value="">Choose Country</option>
                    <option value="india">India</option>
                    <option value="us">US</option>
                    <option value="uk">UK</option>
                </select>

                <input
                    type="number"
                    required
                    placeholder="Pincode"
                    name="pinCode"
                    value={shippingInfo.pinCode}
                    onChange={changeHandler}
                />

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default Shipping;
