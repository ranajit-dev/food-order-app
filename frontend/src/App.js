import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AddCategory from './pages/AddCategory';
import ManageCategory from './pages/ManageCategory';
import AddFood from './pages/AddFood';
import ManageFood from './pages/ManageFood';
import SearchPage from './pages/SearchPage';
import Register from './components/Register';
import Login from './components/Login';
import FoodDetail from './pages/FoodDetail';
import Cart from './pages/Cart';
import PaymentPage from './pages/PaymentPage';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import ProfilePage from './pages/ProfilePage';
import ChangePassword from './pages/ChangePassword';
import OrdersNotConfirmed from './pages/OrdersNotConfirmed';
import OrdersConfirmed from './pages/OrdersConfirmed';
import FoodBeingPrepared from './pages/FoodBeingPrepared';
import FoodPickup from './pages/FoodPickup';
import FoodDelivered from './pages/FoodDelivered';
import OrderCancelled from './pages/OrderCancelled';
import AllOrders from './pages/AllOrders';
import OrderReport from './pages/OrderReport';
import ViewFoodOrder from './pages/ViewFoodOrder';
import SearchOrder from './pages/SearchOrder';
import EditCategory from './pages/EditCategory';
import EditFood from './pages/EditFood';
import ManageUser from './pages/ManageUser';
import { CartProvider } from './context/CartContext';
import FoodMenu from './pages/FoodMenu';
import { WishlistProvider } from './context/WishlistContext';
import Wishlist from './pages/Wishlist';
import TrackOrder from './pages/TrackOrder';
import ManageReviews from './pages/ManageReviews';
 

function App() {
  return (
      <WishlistProvider>
      <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/admin-login' element={<AdminLogin />}></Route>
          <Route path='/admin-dashboard' element={<AdminDashboard />}></Route>
          <Route path='/add-category' element={<AddCategory />}></Route>
          <Route path='/manage-category' element={<ManageCategory />}></Route>
          <Route path='/add-food' element={<AddFood />}></Route>
          <Route path='/manage-food' element={<ManageFood />}></Route>
          <Route path='/order-not-confirmed' element={<OrdersNotConfirmed />}></Route>
          <Route path='/orders-confirmed' element={<OrdersConfirmed />}></Route>
          <Route path='/food-being-prepared' element={<FoodBeingPrepared />}></Route>
          <Route path='/food-pickup' element={<FoodPickup />}></Route>
          <Route path='/food-delivered' element={<FoodDelivered />}></Route>
          <Route path='/order-cancelled' element={<OrderCancelled />}></Route>
          <Route path='/all-orders' element={<AllOrders />}></Route>
          <Route path='/order-report' element={<OrderReport />}></Route>
          <Route path='/admin-view-order-detail/:orderNumber' element={<ViewFoodOrder />}></Route>
          <Route path='/search-order' element={<SearchOrder />}></Route>
          <Route path='/edit-category/:id' element={<EditCategory />}></Route>
          <Route path='/edit-food/:id' element={<EditFood />}></Route>
          <Route path='/manage-users' element={<ManageUser />}></Route>
          <Route path='/manage-reviews' element={<ManageReviews />}></Route>

          <Route path='/search' element={<SearchPage />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/foods/:id' element={<FoodDetail />}></Route>
          <Route path='/cart' element={<Cart />}></Route>
          <Route path='/payment' element={<PaymentPage />}></Route>
          <Route path='/my-orders' element={<MyOrders />}></Route>
          <Route path='/order-details/:order_number' element={<OrderDetails />}></Route>
          <Route path='/profile' element={<ProfilePage />}></Route>
          <Route path='/change-password' element={<ChangePassword />}></Route>
          <Route path='/food-menu' element={<FoodMenu />}></Route>
          <Route path='/wishlist' element={<Wishlist />}></Route>
          <Route path='/track' element={<TrackOrder />}></Route>
          <Route path='/track-order/:paramOrderNumber' element={<TrackOrder />}></Route>

        </Routes>
      </BrowserRouter>
      </CartProvider>
      </WishlistProvider>

  );
}

export default App;

