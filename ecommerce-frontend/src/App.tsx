import { lazy, Suspense, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes, } from "react-router-dom";
import Loader from "./components/loader";
import Header from "./components/header";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./redux/api/userAPI";
import { userReducerInitialState } from "./types/reducer-types";
import ProtectedRoute from "./components/protected-route";

const Home = lazy(() => import("./pages/home"));
const Search = lazy(() => import("./pages/search"));
const Cart = lazy(() => import("./pages/cart"));
const Shipping = lazy(() => import("./pages/shipping"))

const Login = lazy(() => import("./pages/login"))
const Orders = lazy(() => import("./pages/orders"))
const Orderdetails = lazy(() => import("./pages/order-details"))



//Admin Imports 

const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement")
);

function App() {

  const { user, loading } = useSelector((state: { userReducer: userReducerInitialState }) => state.userReducer)

  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUser(user.uid)
        dispatch(userExist(data.user));
      }
      else dispatch(userNotExist());
    })
  }, [])


  return loading ? <Loader /> : (
    <Router>
      {/* Header Section */}
      <Header user={user} />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Search />} path="/search" />
          <Route element={<Cart />} path="/cart" />

          {/* not loggedin route */}
          <Route element={<ProtectedRoute isAuthenticated={user ? false : true}><Login /></ProtectedRoute>} path="/login" />

          {/* protected Logged in user routes */}
          <Route element={<ProtectedRoute isAuthenticated={user ? true : false} />}>
            <Route element={<Shipping />} path="/shipping" />
            <Route element={<Orders />} path="/orders" />
            <Route element={<Orderdetails />} path="/orders/:id" />
          </Route>

          {/* Admin Routes */}

          <Route
            element={
              <ProtectedRoute isAuthenticated={true} adminRoute={true} isAdmin={user?.role === "admin" ? true : false} />
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/product" element={<Products />} />
            <Route path="/admin/customer" element={<Customers />} />
            <Route path="/admin/transaction" element={<Transaction />} />
            {/* Charts */}
            <Route path="/admin/chart/bar" element={<Barcharts />} />
            <Route path="/admin/chart/pie" element={<Piecharts />} />
            <Route path="/admin/chart/line" element={<Linecharts />} />
            {/* Apps */}
            <Route path="/admin/app/coupon" element={<Coupon />} />
            <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
            <Route path="/admin/app/toss" element={<Toss />} />

            {/* Management */}
            <Route path="/admin/product/new" element={<NewProduct />} />

            <Route path="/admin/product/:id" element={<ProductManagement />} />

            <Route path="/admin/transaction/:id" element={<TransactionManagement />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </Router >
  )
}

export default App
