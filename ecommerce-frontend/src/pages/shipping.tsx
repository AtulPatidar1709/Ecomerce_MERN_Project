import { ChangeEvent, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Shipping = () => {

    const navigate = useNavigate();

    const [shippingInfo, setShippingInfo] = useState({
        address: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
    })

    const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    return (
        <div className="shipping">
            <button className="back-btn" onClick={() => navigate("/cart")}><BiArrowBack /></button>
            <form action="">
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

                <button type="submit">Submit</button>

            </form>
        </div>
    )
}

export default Shipping;