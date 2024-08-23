import { useState } from "react"
import ProductCard from "../components/product-card"
import { useCategoriesQuery, useSearchProductsQuery } from "../redux/api/productAPI"
import { CustomError } from "../types/api-types"
import toast from "react-hot-toast"
import { Skeleton } from "../components/loader"

const Search = () => {

    const {
        data: categoriesResponse,
        isLoading: lodingCategories,
        isError,
        error
    } = useCategoriesQuery("")

    const [search, setSearch] = useState("")
    const [sort, setSort] = useState("")
    const [maxPrice, setMaxPrice] = useState(1000000)
    const [category, setCategory] = useState("")
    const [page, setPage] = useState(1)

    const {
        isLoading: productLoading,
        data: searchedData,
        isError: productIsError,
        error: productError
    } = useSearchProductsQuery({
        search,
        sort,
        category,
        page,
        price: maxPrice,
    });

    const addtoCartHandler = () => {

    }

    const isNextPage = page < 4;

    const isPrevPage = page > 1;

    if (isError) toast.error((error as CustomError).data.message)

    if (productIsError) toast.error((productError as CustomError).data.message)

    return (
        <div className="product-search-name">
            <aside>
                <h2>Filters</h2>
                <div>
                    <h4>Sort</h4>
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="">None</option>
                        <option value="asc">Price (Low to High)</option>
                        <option value="dsc">Price (High to Low)</option>
                    </select>
                </div>
                <div>
                    <h4>Max Price: {maxPrice || " "}</h4>
                    <input
                        type="range"
                        defaultValue={0}
                        min={100}
                        max={2000000}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                    />
                </div>
                <div>
                    <h4>Category</h4>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">All</option>
                        {(lodingCategories === false) &&
                            categoriesResponse?.categories.map((i) => (
                                <option key={i} value={i}>{i.toUpperCase()}</option>
                            ))}
                    </select>
                </div>
            </aside>
            <main>
                <h1>Products</h1>
                <input
                    type="text"
                    placeholder="Search by Name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {
                    productLoading ? <Skeleton length={10} /> :
                        <div className="search_product-list">
                            {
                                searchedData?.products.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        name={product.name}
                                        productId={product._id}
                                        photo={product.photo}
                                        stock={product.stock}
                                        handler={addtoCartHandler}
                                        price={product.price}
                                    />
                                ))
                            }
                        </div>
                }

                {searchedData && searchedData?.totalPage > 1 && (
                    <article>
                        <button disabled={!isPrevPage} onClick={() => setPage(prev => prev - 1)}>Prev</button>
                        <span>{page} of {searchedData.totalPage}</span>
                        <button disabled={!isNextPage} onClick={() => setPage(prev => prev + 1)}>Next</button>
                    </article>
                )}
            </main>
        </div>
    )
}

export default Search