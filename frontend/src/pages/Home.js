import React, { useState, useEffect } from 'react'
import PublicLayout from '../components/PublicLayout'
import '../styles/home.css'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useWishlist } from '../context/WishlistContext'

const Home = () => {

    const [foods, setFoods] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const { wishlistCount, setWishlistCount } = useWishlist();
    const [ratings, setRatings] = useState({});
    const [hovered, setHovered] = useState(null);

    const userId = localStorage.getItem("userId")

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/random-foods/`)
            .then(res => res.json())
            .then(data => {
                setFoods(data)
            })
    }, []);


    useEffect(() => {
        if (userId) {
            fetch(`http://127.0.0.1:8000/api/wishlist/${userId}/`)
                .then(res => res.json())
                .then(data => {
                    const wishlistIds = data.map(item => item.food_id);
                    setWishlist(wishlistIds);
                })

        }
    }, [userId]);


    //  useEffect(() => {
    //     const fetchAllRatings = async () => {
    //         const allRatings = {};
    //         for (let food of foods){
    //             const res = await fetch(`http://127.0.0.1:8000/api/food_rating_summary/${food.id}/`);

    //             const data = await res.json();
    //             allRatings[food.id] = data;
    //         }
    //         setRatings(allRatings);
    //     }
    //     if(foods.length > 0){
    //         fetchAllRatings();
    //     }
    // }, [foods]);

    useEffect(() => {
        let isMounted = true;

        const fetchAllRatings = async () => {
            try {
                const fetchPromises = foods.map(async (food) => {
                    const res = await fetch(`http://127.0.0.1:8000/api/food_rating_summary/${food.id}/`);

                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }

                    const data = await res.json();
                    return { id: food.id, data };
                });

                const results = await Promise.all(fetchPromises);

                const allRatings = results.reduce((acc, current) => {
                    acc[current.id] = current.data;
                    return acc;
                }, {});

                if (isMounted) {
                    setRatings(allRatings);
                }
            } catch (error) {
                console.error("Failed to fetch food ratings:", error);
            }
        };

        if (foods && foods.length > 0) {
            fetchAllRatings();
        }

        return () => {
            isMounted = false;
        };
    }, [foods]);


    const toggleWishlist = async (foodId) => {
        if (!userId) {
            toast.info("Please login to use wishlist.");
            return;
        }

        const isWishlisted = wishlist.includes(foodId);

        const endpoint = isWishlisted ? 'remove' : 'add';

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/wishlist/${endpoint}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    food_id: foodId,
                })

            })

            if (response.ok) {
                setWishlist(prev => isWishlisted ? prev.filter(id => id !== foodId) : [...prev, foodId]);


                setWishlistCount(prevCount => isWishlisted ? prevCount - 1 : prevCount + 1);

                toast.success(isWishlisted ? "Removed from Wishlist" : "Added to Wishlist");
            } else {
                toast.error("Failed to update wishlist")
            }

        } catch (error) {
            console.error("Wishlist error:", error);
            toast.error("Something went wrong")
        }
    }

    return (
        <PublicLayout>
            <ToastContainer position='top-center' autoClose={1500} />
            <section
                className="hero position-relative py-5 text-center text-white"
                style={{
                    backgroundImage: "url('/images/adminbg.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                <div className="container py-5">
                    <div className="row justify-content-center">
                        {/* The dark, semi-transparent overlay box */}
                        <div className="col-11 col-md-9 col-lg-7 bg-dark bg-opacity-50 p-5 rounded-4 shadow">

                            <h1 className="display-4 fw-bold mb-3">Quick & Hot Food, Delivered To You</h1>
                            <p className="lead mb-4 fw-medium">Craving something tasty? Let's get it to your door.</p>

                            {/* Form centered using grid columns */}
                            <form method="GET" action="/search" className="col-md-10 mx-auto">

                                {/* input-group automatically connects the input and button */}
                                <div className="input-group input-group-lg shadow-sm">
                                    <input
                                        type="text"
                                        name="q"
                                        placeholder="I would like to eat..."
                                        className="form-control border-0"
                                        aria-label="Search food"
                                    />
                                    <button className="btn btn-warning px-4 fw-bold text-dark" type="submit">
                                        Search
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <section className='py-5'>
                <div className='container'>
                    <h2 className='text-center mb-4'>
                        Most Loved Dishes This Month
                        <span className='badge bg-danger ms-2'>Top Pics</span>
                    </h2>


                    <div className='row mt-4'>
                        {foods.length === 0 ? (<p className='text-center'> Loading...</p>) :
                            (

                                foods.map((food, index) => (
                                    <div key={food.id} className='col-md-4  mb-4 d-flex align-items-stretch'>
                                        <div className='card card-effect  shadow-sm rounded-4 h-100 overflow-hidden w-100'>

                                            {/* Image & Wishlist Button Container */}
                                            <div className='position-relative'>
                                                <img
                                                    src={food.image}
                                                    className='card-img-top'
                                                    alt={food.item_name}
                                                    style={{ height: '200px', objectFit: 'cover' }}
                                                />

                                                {/* Wishlist Heart Icon */}
                                                <div
                                                    className='position-absolute top-0 end-0 m-3 bg-white rounded-circle shadow-sm d-flex justify-content-center align-items-center heart-hover'
                                                    style={{ width: '38px', height: '38px', cursor: 'pointer' }}
                                                    title="Add to wishlist"
                                                >
                                                    <i className={`${wishlist.includes(food.id) ? 'fas' : 'far'} fa-heart text-danger`} style={{ fontSize: '18px' }}
                                                        onClick={() => toggleWishlist(food.id)}
                                                    ></i>
                                                </div>
                                            </div>

                                            {/* Card Content */}
                                            <div className='card-body d-flex flex-column'>

                                                {/* Title */}
                                                <h5 className='card-title fw-semi-bold mb-1'>
                                                    <Link to={`/foods/${food.id}`} className='text-dark text-decoration-none  d-block'>
                                                        {food.item_name} <span className="text-muted ">({food.item_quantity})</span>
                                                    </Link>
                                                </h5>

                                                {/* Description */}
                                                <p className='card-text text-muted small mb-3'>
                                                    {food.item_description?.length > 40
                                                        ? food.item_description.slice(0, 40) + '...'
                                                        : food.item_description}
                                                </p>


                                                {ratings[food.id] && (
                                                    <div
                                                        className='mb-2 rating-summary-wrapper position-relative'
                                                        onMouseEnter={() => setHovered(food.id)}
                                                        onMouseLeave={() => setHovered(null)}
                                                    >
                                                        <div>
                                                            <span className='text-warning'>
                                                                {[...Array(5)].map((_, i) => {
                                                                    const ratingValue = ratings[food.id].average;
                                                                    const starNumber = i + 1;

                                                                    if (ratingValue >= starNumber) {
                                                                        return <i key={i} className='fas fa-star'></i>;
                                                                    } else if (ratingValue >= starNumber - 0.5) {
                                                                        return <i key={i} className='fas fa-star-half-alt'></i>;
                                                                    } else {
                                                                        return <i key={i} className='far fa-star'></i>;
                                                                    }
                                                                })}
                                                            </span>
                                                            <small className='text-muted ms-2'>
                                                                {ratings[food.id].average} ({ratings[food.id].total_reviews} ratings)
                                                            </small>
                                                        </div>
                                                        {hovered === food.id && ratings[food.id].breakdown && (
                                                            <div
                                                                className='hover-popup p-3 border rounded shadow position-absolute mb-2 bg-white'
                                                                style={{ bottom: "100%", width: '100%' }}
                                                            >
                                                                {[5, 4, 3, 2, 1].map((star) => {
                                                                    const count = ratings[food.id].breakdown[star] || 0;

                                                                    const percentage = ratings[food.id].total_reviews ?
                                                                        (count / ratings[food.id].total_reviews) * 100
                                                                        : 0;

                                                                    return (
                                                                        <div key={star} className='mb-2 d-flex align-items-center'>
                                                                            <small className='me-2' style={{ width: '50px' }}>{star} star</small>
                                                                            <div className='progress flex-grow-1'>
                                                                                <div
                                                                                    className='progress-bar bg-warning'
                                                                                    style={{ width: `${percentage}%` }}

                                                                                >
                                                                                </div>
                                                                            </div>
                                                                            <small className='ms-2'
                                                                                style={{ width: '20px', textAlign: 'right' }}
                                                                            >
                                                                                {count}
                                                                            </small>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}



                                                <div className='mt-auto d-flex justify-content-between align-items-center'>
                                                    <span className='fw-bold text-success fs-5'>&#8377; {food.item_price}</span>

                                                    {/* Restored Outline Buttons */}
                                                    {food.is_available ? (
                                                        <Link to={`/foods/${food.id}`} className='btn btn-outline-secondary btn-sm'>
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
            </section>

            <section className='py-5 text-white bg-dark'>
                <div className='container text-center'>
                    <h2>Ordering in 3 Simple Steps</h2>
                    <div className='row mt-4'>
                        <div className='col-md-4'>
                            <h4>1. Pick a dish you love</h4>
                            <p>Explore hundreds of mouth-watering options and what you crave!</p>
                        </div>
                        <div className='col-md-4'>
                            <h4>2. Share your location</h4>
                            <p>Tell us where you are, and we'll handle the rest</p>
                        </div>
                        <div className='col-md-4'>
                            <h4>3. Enjoy doorstep delivery</h4>
                            <p>Relax while your meal arrives fast and fresh -- pay when it's delivered!</p>
                        </div>
                    </div>

                    <p>Pay easily with Cash on Delivery -- hassle -free!</p>
                </div>
            </section>

            <section className='py-5 text-dark text-center bg-warning'>
                <h4>Ready to Satisfy Your Hunger</h4>
                <Link to="" className='btn btn-dark btn-lg'>Browse Full Menu</Link>
            </section>
        </PublicLayout>
    )
}

export default Home