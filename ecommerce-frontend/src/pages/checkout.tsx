import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useNewOrderMutation } from '../redux/api/orderAPI';
import { resetCart } from '../redux/reducer/cartReducer';
import { RootState } from '../redux/store';
import { NewOrderRequest } from '../types/api-types';
import { responseToast } from '../utils/features';
import "./../styles/app.scss"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state: RootState) => state.userReducer);

    const {
        shippingInfo,
        cartItems,
        subTotal,
        tax,
        discount,
        shippingCharges,
        total
    } = useSelector((state: RootState) => state.cartReducer);

    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const [newOrder] = useNewOrderMutation();

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return toast.error("Stripe has not loaded correctly. Please try again.");
        }

        setIsProcessing(true);

        const orderData: NewOrderRequest = {
            shippingInfo,
            orderItems: cartItems,
            subTotal,
            tax,
            discount,
            shippingCharges,
            total,
            user: user?._id || ''
        };

        // console.log("Order Data: ", orderData);

        try {
            const { paymentIntent, error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: window.location.origin, // Redirect URL for payment confirmation
                },
                redirect: "if_required",
            });

            if (error) {
                toast.error(error.message || "Payment failed. Please try again.");
                return;
            }

            if (paymentIntent && paymentIntent.status === "succeeded") {
                // console.log("Payment Intent: ", paymentIntent);

                // Create the order on the backend
                const res = await newOrder(orderData);

                // If the order creation is successful
                if ('data' in res) {
                    dispatch(resetCart());
                    responseToast(res, navigate, "/orders"); // Navigate to orders page
                } else {
                    toast.error("Order creation failed.");
                }
            } else {
                toast.error("Payment was not successful.");
            }
        } catch (err) {
            // console.error("Payment Error: ", err);
            toast.error("Something went wrong during the payment process.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className='checkout-container'>
            <form onSubmit={submitHandler}>
                <PaymentElement />
                <button className='pay-btn' type='submit' disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Pay"}
                </button>
            </form>
        </div>
    );
};


const Checkout = () => {

    const location = useLocation();
    const clientSecret: string | undefined = location.state;

    if (!clientSecret) return <Navigate to={"/shipping"} />;

    const options = {
        clientSecret
    };

    return <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
    </Elements >
}

export default Checkout