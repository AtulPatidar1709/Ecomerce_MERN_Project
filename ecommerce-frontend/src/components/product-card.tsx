import { FaPlus } from "react-icons/fa";

type ProductCardProps = {
    productId: string;
    photo: string;
    name: string;
    price: number;
    stock: number;
    handler: () => void;
}

const server = "asfffffff";

const ProductCard = ({
    productId,
    photo,
    name,
    price,
    stock,
    handler
}: ProductCardProps) => {
    return (
        <div className="product-card">
            <img src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mba13-midnight-config-202402?wid=820&hei=498&fmt=jpeg&qlt=90&.v=1708371033110" alt={name} />
            <p>{name}</p>
            <span>₹{price}</span>
            <div>
                <button onClick={() => handler()}>
                    <FaPlus />
                </button>
            </div>
        </div>
    )
}

export default ProductCard;