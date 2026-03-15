import React, { useState, useEffect } from 'react'
import PublicLayout from '../components/PublicLayout'
import '../styles/home.css'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useWishlist } from '../context/WishlistContext'
import { API_URL } from "../config";

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([])
    const { wishlistCount, setWishlistCount } = useWishlist();

    const userId = localStorage.getItem("userId")

    const fetchWishlist = async () => {

        if (!userId) return

        const res = await fetch(`${API_URL}/api/wishlist/${userId}/`);
        const data = await res.json();
        setWishlist(data);


    }

    const removeFromWishlist = async (foodId) => {

        try {
            const response = await fetch(`${API_URL}/api/wishlist/remove/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    food_id: foodId,
                })

            })

            if (response.ok) {
                setWishlistCount(prevCount => prevCount - 1);

                toast.success("Removed from Wishlist");
                fetchWishlist();
            } else {
                toast.error("Failed to update wishlist")
            }

        } catch (error) {
            console.error("Wishlist error:", error);
            toast.error("Something went wrong")
        }
    }

    useEffect(() => {

        fetchWishlist();

    }, [])

    return (
        <PublicLayout>
            <ToastContainer position='top-center' autoClose={1500} />
            <div className='container py-4'>
                <h2 className='mb-4 text-secondary text-center '>My Wishlist</h2>
                <div className='row mt-4'>
                    {wishlist.length === 0 ? (<p className='text-center'> No  Items in Wishlist</p>) :
                        (

                            wishlist.map((item, index) => (
                                <div key={index} className='col-md-4  mb-4 d-flex align-items-stretch'>
                                    <div className='card card-effect  shadow-sm rounded-4 h-100 overflow-hidden w-100'>

                                        {/* Image & Wishlist Button Container */}
                                        <div className='position-relative'>
                                            <img
                                                src={`${API_URL}${item.image}`}
                                                className='card-img-top'
                                                alt={item.item_name}
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />

                                            {/* Wishlist Heart Icon */}
                                            <div
                                                className='position-absolute top-0 end-0 m-3 bg-white rounded-circle shadow-sm d-flex justify-content-center align-items-center heart-hover'
                                                style={{ width: '38px', height: '38px', cursor: 'pointer' }}
                                                title="Add to wishlist"
                                            >
                                                <i className='fas fa-heart text-danger' style={{ fontSize: '18px' }}
                                                    onClick={() => removeFromWishlist(item.food_id)}
                                                ></i>
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <div className='card-body d-flex flex-column'>

                                            {/* Title */}
                                            <h5 className='card-title fw-semi-bold mb-1'>
                                                <Link to={`/foods/${item.food_id}`} className='text-dark text-decoration-none  d-block'>
                                                    {item.item_name} <span className="text-muted ">({item.item_quantity})</span>
                                                </Link>
                                            </h5>

                                            {/* Description */}
                                            <p className='card-text text-muted small mb-3'>
                                                {item.item_description?.length > 40
                                                    ? item.item_description.slice(0, 40) + '...'
                                                    : item.item_description}
                                            </p>

                                            {/* Price & Action Button (pushed to bottom using mt-auto) */}
                                            <div className='mt-auto d-flex justify-content-between align-items-center'>
                                                <span className='fw-bold text-success fs-5'>&#8377; {item.item_price}</span>

                                                {/* Restored Outline Buttons */}
                                                {item.is_available ? (
                                                    <Link to={`/foods/${item.food_id}`} className='btn btn-outline-secondary btn-sm'>
                                                        <i className='fas fa-shopping-basket me-1'></i>Order Now
                                                    </Link>
                                                ) : (
                                                    <button disabled className='btn btn-outline-primary btn-sm'>
                                                        <i className='fas fa-times-circle me-1'></i>Currently Unavailable
                                                    </button>
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                </div>
            </div>

        </PublicLayout>
    )
}

export default Wishlist