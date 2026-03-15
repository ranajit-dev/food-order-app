import React, { useState, useEffect } from 'react'
import { FaCogs, FaHeart, FaHome, FaShoppingCart, FaSignInAlt, FaSignOutAlt, FaTruck, FaUser, FaUserCircle, FaUserPlus, FaUserShield, FaUtensils } from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../styles/layout.css'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { API_URL } from "../config";

const PublicLayout = ({ children }) => {

  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const { cartCount, setCartCount } = useCart();
  const { wishlistCount, setWishlistCount } = useWishlist();
  const location = useLocation()

  const fetchCartCount = async () => {
    const userId = localStorage.getItem("userId")
    if (!userId) return

    const res = await fetch(`${API_URL}/api/cart/${userId}/`);
    const data = await res.json();
    setCartCount(data.length)

  }

  const fetchWishlistCount = async () => {
    const userId = localStorage.getItem("userId")
    if (!userId) return

    const res = await fetch(`${API_URL}/api/wishlist/${userId}/`);
    const data = await res.json();
    setWishlistCount(data.length)

  }

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    const name = localStorage.getItem("userName")

    if (userId) {
      setUserName(name);
      fetchCartCount();
      fetchWishlistCount();
    }
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    setUserName("")
    setCartCount(0)
    setWishlistCount(0)
    navigate("/login")
  }

  // const isLoggedIn = !!userName
  const isLoggedIn = userName !== "" //true

  return (
    <div className='d-flex flex-column min-vh-100'>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold " >
            <FaUtensils className='me-1' />Food Ordering System
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto ">
              <li className="nav-item mx-1">
                <Link to='/' className={`nav-link ${location.pathname === "/" ? 'active-nav-link' : ""}`}  >
                  <FaHome className='me-1' />Home
                </Link>
              </li>

              <li className="nav-item mx-1">
                <Link to='/food-menu' className={`nav-link ${location.pathname === "/food-menu" ? 'active-nav-link' : ""}`}  >
                  <FaUtensils className='me-1' />Menu
                </Link>
              </li>
              <li className="nav-item mx-1">
                <Link to='/track' className={`nav-link ${location.pathname === "/track" ? 'active-nav-link' : ""}`}  >
                  <FaTruck className='me-1' />Track
                </Link>
              </li>

              {!isLoggedIn ? (
                <>
                  <li className="nav-item mx-1">
                    <Link to='/register' className={`nav-link ${location.pathname === "/register" ? 'active-nav-link' : ""}`} >
                      <FaUserPlus className='me-1' />Register
                    </Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link to="/login" className={`nav-link ${location.pathname === "/login" ? 'active-nav-link' : ""}`}  >
                      <FaSignInAlt className='me-1' />Login
                    </Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link to='/admin-login' className={`nav-link ${location.pathname === "/admin-login" ? 'active-nav-link' : ""}`}  >
                      <FaUserShield className='me-1' />Admin
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item mx-1">
                    <Link to='/my-orders' className={`nav-link ${location.pathname === "/my-orders" ? 'active-nav-link' : ""}`}  >
                      <FaUser className='me-1' />My Orders
                    </Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link to='/cart' className={`nav-link ${location.pathname === "/cart" ? 'active-nav-link' : ""}`}  >
                      <FaShoppingCart className='me-1' />
                      Cart
                      {cartCount > 0 && (
                        <span className='badge bg-light text-dark ms-1 border-rounded '>({cartCount})</span>
                      )}
                    </Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link to='/wishlist' className={`nav-link ${location.pathname === "/wishlist" ? 'active-nav-link' : ""}`}  >
                      <FaHeart className='me-1' />
                      Wishlist
                      {wishlistCount > 0 && (
                        <span className='badge bg-light text-dark ms-1 border-rounded'>({wishlistCount})</span>
                      )}
                    </Link>
                  </li>

                  <li class="nav-item mx-1 dropdown">
                    <Link class="nav-link dropdown-toggle text-capitalize" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" >
                      <FaUserCircle className='me-1' />{userName}
                    </Link>

                    <ul class="dropdown-menu" >
                      <li><Link className={`dropdown-item mb-1 ${location.pathname === "/profile" ? 'active-dropdown' : ""}`} to="/profile"><FaUser className='me-1' />Profile</Link></li>
                      
                      <li><Link class={`dropdown-item ${location.pathname === "/change-password" ? 'active-dropdown' : ""}`} to="/change-password"><FaCogs className='me-1' />Settings</Link></li>

                      <li><hr class="dropdown-divider" /></li>
                      <li><button class="dropdown-item" onClick={handleLogout}><FaSignOutAlt className='me-1' />Logout</button></li>
                    </ul>
                  </li>
                </>
              )}


            </ul>

          </div>
        </div>
      </nav>


      <div className='flex-grow-1'>
        {children}
      </div>

      <footer className='text-center py-3 mt-4'>
        <div className='container'>
          <p className=''>&copy; 2026 Food Ordering System. All rights reserved</p>
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout