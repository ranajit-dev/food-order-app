import React, { useState, useEffect } from 'react'
import PublicLayout from '../components/PublicLayout'
import { useParams, useNavigate } from 'react-router-dom'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { toast, ToastContainer } from 'react-toastify'

const FoodDetail = () => {

    const userId = localStorage.getItem("userId")
    const [food, setFood] = useState(null)
    const { id } = useParams()
    const [reviews, setReviews] = useState([])
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [hoverRating, setHoverRating] = useState(0)
    const [editId, setEditId] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/foods/${id}/`)
            .then(res => res.json())
            .then(data => {
                setFood(data)
            })

        fetch(`http://127.0.0.1:8000/api/reviews/${id}/`)
            .then(res => res.json())
            .then(data => {
                setReviews(data)
            })
    }, [id])


    const handleAddToCart = async () => {
        if (!userId) {
            toast.info("Please login first");

            setTimeout(() => {
                navigate("/login");
            }, 1500)

            return;
        }


        try {
            const response = await fetch('http://127.0.0.1:8000/api/cart/add/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    foodId: food.id
                })
            })

            const result = await response.json()

            if (response.status === 200) {
                toast.success(result.message || "Item added to cart")

                setTimeout(() => {
                    navigate("/cart");
                }, 1500);


            } else {
                toast.error(result.message || "Something went wrong")
            }
        } catch (error) {
            console.error(error)
            toast.error("Error connecting to server")
        }
    }

    const handleReviewSubmit = async () => {
        if (!userId) {
            toast.warning("Please login first to submit review.");

            setTimeout(() => {
                navigate("/login");
            }, 1500)

            return;
        }

        if (rating < 1 || rating > 5) {
            toast.error("Please select a rating from 1 to 5");
            return;
        }

        const payload = {
            user_id: userId,
            food: id,
            rating,
            comment
        };

        const url = editId ? `http://127.0.0.1:8000/api/review_edit/${editId}/` : `http://127.0.0.1:8000/api/reviews/add/${id}/`;

        const method = editId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (response.ok) {
                toast.success(editId ? "Review updated" : "Review submitted")
                setComment('');
                setRating(0);
                setEditId(null);

                const updatedReviews = await fetch(`http://127.0.0.1:8000/api/reviews/${id}/`).then(res => res.json());
                setReviews(updatedReviews);

            } else {
                toast.error("Something went wrong")
            }
        } catch (error) {
            console.error(error)
            toast.error("Error connecting to server")
        }
    };

    const fetchReviews = async () => {
        const res = await fetch(`http://127.0.0.1:8000/api/reviews/${id}/`)
        const data = await res.json();
        setReviews(data);
    };

    const handleDeleteReview = async (id) => {
        const confirmDelete = window.confirm("Are you sure to delete this review?")
        if (!confirmDelete) return;

        const res = await fetch(`http://127.0.0.1:8000/api/review_edit/${id}/`, {
            method: 'DELETE',
        })
        if (res.ok) {
            toast.success("Review deleted");
            fetchReviews(); //Reload
        } else {
            toast.error("Failed to delete");
        }
    };

    const renderStars = (count, clickable = false) => {
        const stars = [];

        const activeRating = clickable ? (hoverRating || count) : count;

        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i
                    key={i}
                    className={`fa-star ${i <= activeRating ? 'fas text-warning' : 'far text-secondary'}`}
                    style={{cursor: clickable ? 'pointer' : 'default', fontSize: '20px', marginRight: '4px'}}
                    onClick={clickable ? ()=> setRating(i) : undefined}
                    onMouseEnter={clickable ? ()=> setHoverRating(i) : undefined}
                    onMouseLeave={clickable ? ()=> setHoverRating(0) : undefined}
                >

                </i>
            )
        }
        return stars;
    }

    const handleEditReview = (rev)=>{
        setRating(rev.rating);
        setComment(rev.comment);
        setEditId(rev.id);
    }

     // Date  Formatting
    const formatDateTime = (date) => {
        const formatted = new Date(date).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true

        })

        return formatted.replace(/am|pm/i, m => m.toUpperCase())
    }

    if (!food) return <div className='text-center'>loading..</div>
    

    return (

        <PublicLayout>
            <ToastContainer position='top-right' autoClose={1500} />

            <div className='container py-5'>
                <div className='row'>
                    <div className='col-md-5 text-center '>
                        <Zoom>
                            <img src={food.image} className='w-100 ' alt="food-img" style={{ maxHeight: "300px" }} />
                        </Zoom>

                    </div>

                    <div className='col-md-7 '>
                        <h2>{food.item_name}</h2>
                        <p className='text-muted'>{food.item_description}</p>
                        <p className=''><strong>Category:</strong> {food.category_name}</p>
                        <h4>&#8377; {food.item_price}</h4>
                        <p className='mt-3'>Shipping: <strong>Free</strong></p>

                        {food.is_available ? (
                            <button className='btn btn-warning btn-md mt-3 px-4' onClick={handleAddToCart}>
                                <i className='fas fa-cart-plus me-1'></i>Add to Cart
                            </button>
                        ) : (

                            <button className='btn btn-outline-primary btn-sm'>
                                <i className='fas fa-times-circle me-1'></i>Currently Unavailable
                            </button>
                        )}
                    </div>
                </div>

                <hr/>
                <div className='mt-5'>
                    <h4 className='text-secondary'>Customer Reviews</h4>
                    {reviews.length === 0 ? (
                        <p className='text-muted fst-italic'>No reviews yet. Be the first to share your thoughts!</p>
                    ) : (
                        reviews.map((rev, index) => (
                            <div key={index} className='border-bottom mb-3 pb-2'>
                                <div className='d-flex justify-content-between'>
                                    <div>
                                        <strong>{rev.user_name}</strong> <span className='ms-2'>{renderStars(rev.rating)}</span>
                                    </div>
                                    {rev.user === parseInt(userId) && (
                                        <div className=''>
                                            <i 
                                                className='fas fa-edit text-primary me-3'
                                                style={{cursor: 'pointer', fontSize: '14px'}}
                                                title='Edit'
                                                onClick={()=> handleEditReview(rev)}
                                            ></i>
                                            <i 
                                                className='fas fa-trash-alt text-danger me-3'
                                                style={{cursor: 'pointer', fontSize: '14px'}}
                                                title='Delete'
                                                onClick={()=> handleDeleteReview(rev.id)}
                                            ></i>
                                        </div>
                                    ) }
                                </div>
                                <div className=''>
                                    <p className='mb-1'>{rev.comment}</p>
                                    <p className='text-muted'>{formatDateTime(rev.created_at)}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className='mt-5'>
                    <h5 className='mb-3 text-primary'>
                        <i className='fas fa-pen me-1 '></i> Write a Review
                    </h5>
                        <div className='mb-3'>
                            <label className='frm-label mb-1 '>Your Rating</label>
                            <div>{renderStars(rating, true)}</div>
                        </div>

                        <div className='mb-3'>
                            <textarea 
                                className='form-control'
                                placeholder='Write your review...'
                                rows="3"
                                value={comment}
                                onChange={(e)=> setComment(e.target.value)}
                            ></textarea>
                        </div>

                        <button 
                            type='submit' 
                            className='btn btn-success '
                            onClick={handleReviewSubmit}
                        >
                            <i className='fas fa-paper-plane'></i> Submit Review
                        </button>
                            
                    
                </div>

            </div>
        </PublicLayout>
    )
}

export default FoodDetail