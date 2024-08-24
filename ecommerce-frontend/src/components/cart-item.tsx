import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { server } from "../redux/store";
import { CartItem } from "../types/types";

type CartItemProps = {
    cartItem: CartItem;
    addtoCartHandler: (cartItem: CartItem) => void;
    decrementCartHandler: (cartItem: CartItem) => void;
    removeHandler: (id: string) => void;
}

const Cartitem = ({ cartItem, addtoCartHandler, decrementCartHandler, removeHandler }: CartItemProps) => {

    const { photo, productId, name, price, quantity } = cartItem;

    return (
        <div className="cart-item">
            <img src={`${server}/${photo}`} alt={name} />
            <article>
                <Link to={`/product/${productId}`}>
                    {name}
                </Link>
                <span>₹{price}</span>
            </article>
            <div>
                <button onClick={() => decrementCartHandler(cartItem)}>-</button>
                <p>{quantity}</p>
                <button onClick={() => addtoCartHandler(cartItem)}>+</button>
            </div>
            <button onClick={() => removeHandler(productId)}>
                <FaTrash />
            </button>
        </div>
    )
}

export default Cartitem;