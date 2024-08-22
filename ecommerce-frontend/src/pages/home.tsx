import { Link } from "react-router-dom"
import ProductCard from "../components/product-card"
import { useLatestProductsQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { Skeleton } from "../components/loader";

const Home = () => {

    const { data, isLoading, isError } = useLatestProductsQuery("");

    const addtoCartHandler = () => {

    }

    if (isError) toast.error("Cannot Fetch the Products");

    return (
        <div className="home">
            <section>

            </section>
            <h1>Latest Products
                <Link to={"/search"} className="findmore">More</Link>
            </h1>
            <main>
                {
                    isLoading ? <Skeleton width="80vw" /> : data?.products.map((product) => (
                        <ProductCard key={product._id} name={product.name} productId={product._id} photo={product.photo} stock={product.stock} handler={addtoCartHandler} price={product.price} />
                    ))
                }
            </main>
        </div>
    )
}

export default Home