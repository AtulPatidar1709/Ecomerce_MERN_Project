import { Link } from "react-router-dom"
import ProductCard from "../components/product-card"

const Home = () => {
    const addtoCartHandler = () => {

    }
    return (
        <div className="home">
            <section>

            </section>
            <h1>Latest Products
                <Link to={"/search"} className="findmore">More</Link>
            </h1>
            <main>
                <ProductCard name="Mackbook" productId="jaskfd" photo="" stock={999} handler={addtoCartHandler} price={69999} />
            </main>
        </div>
    )
}

export default Home