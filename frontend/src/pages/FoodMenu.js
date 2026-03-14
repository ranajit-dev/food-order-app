import React, { useState, useEffect } from 'react'
import PublicLayout from '../components/PublicLayout'
import '../styles/home.css'
import { Link } from 'react-router-dom'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useWishlist } from '../context/WishlistContext'

const FoodMenu = () => {
    const [foods, setFoods] = useState([])
    const [filteredFoods, setFilteredFoods] = useState([])

    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(500);

    const [sortBy, setSortBy] = useState("relevance");

    const [currentPage, setCurrentPage] = useState(1);
    const foodsPerPage = 9;

    // Rating
    const [ratings, setRatings] = useState({});
    const [hovered, setHovered] = useState(null);

    // Wishlist
    const userId = localStorage.getItem("userId");
    const [wishlist, setWishlist] = useState([]);
    const { setWishlistCount } = useWishlist();

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/foods/`)
            .then(res => res.json())
            .then(data => {
                setFoods(data)
                setFilteredFoods(data)
            })

        fetch(`http://127.0.0.1:8000/api/categories/`)
            .then(res => res.json())
            .then(data => {
                setCategories(data);
            })
    }, [])


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


    const handleSearch = (e) => {
        e.preventDefault();

        applyFilters(search, selectedCategory)
    }

    const sortFoods = (list, sortValue) => {

        const sorted = [...list];

        switch (sortValue) {
            case "priceLowHigh":
                sorted.sort(
                    (a, b) => a.item_price - b.item_price
                );
                break;

            case "priceHighLow":
                sorted.sort(
                    (a, b) => b.item_price - a.item_price
                );
                break;

            case "nameAZ":
                sorted.sort(
                    (a, b) => a.item_name.localeCompare(b.item_name)
                );
                break;

            case "nameZA":
                sorted.sort(
                    (a, b) => b.item_name.localeCompare(a.item_name)
                );
                break;

            default:
                //relevancce = keep backend order
                break;
        }

        return sorted;
    }

    const handleCategoryChange = (e) => {
        const category = e.target.value;

        setSelectedCategory(category);
        applyFilters(search, category)
    }



    const applyFilters = (searchTerm, category, priceMin, priceMax, sortOverride) => {
        let result = [...foods];

        const min = typeof priceMin === "number" ? priceMin : minPrice;
        const max = typeof priceMax === "number" ? priceMax : maxPrice;
        const sortValue = sortOverride || sortBy;

        if (searchTerm) {
            result = result.filter(food => food.item_name.toLowerCase().includes(searchTerm.toLowerCase()))
        }

        if (category !== "All") {
            result = result.filter(food => food.category_name === category)

        }

        result = result.filter(food => food.item_price >= min && food.item_price <= max)

        result = sortFoods(result, sortValue)

        setFilteredFoods(result);
        setCurrentPage(1);
    }

    // Fetch user's wishlist on load
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

    // Handle clicking the heart
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
            });

            if (response.ok) {
                setWishlist(prev => isWishlisted ? prev.filter(id => id !== foodId) : [...prev, foodId]);
                setWishlistCount(prevCount => isWishlisted ? prevCount - 1 : prevCount + 1);
                toast.success(isWishlisted ? "Removed from Wishlist" : "Added to Wishlist");
            } else {
                toast.error("Failed to update wishlist");
            }
        } catch (error) {
            console.error("Wishlist error:", error);
            toast.error("Something went wrong");
        }
    };

    //Pagination Logic      //     1    *    9 
    const indexOfLastFood = currentPage * foodsPerPage;
    const indexOfFirstFood = indexOfLastFood - foodsPerPage; // 9 - 9 =0

    const currentFoods = filteredFoods.slice(indexOfFirstFood, indexOfLastFood)

    const totalPages = Math.ceil(filteredFoods.length / foodsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleMinPriceInput = (e) => {
        const value = Number(e.target.value);

        if (value > maxPrice) {
            setMinPrice(value);
            setMaxPrice(value);   // keep max >= min
            applyFilters(search, selectedCategory, value, value);
        } else {
            setMinPrice(value);
            applyFilters(search, selectedCategory, value, maxPrice);
        }
    }

    const handleMaxPriceInput = (e) => {
        const value = Number(e.target.value);

        if (value < minPrice) {
            setMaxPrice(minPrice); // prevent max < min
            applyFilters(search, selectedCategory, minPrice, minPrice);
        } else {
            setMaxPrice(value);
            applyFilters(search, selectedCategory, minPrice, value);
        }
    }

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortBy(value);
        applyFilters(search, selectedCategory, minPrice, maxPrice, value)

    }



    return (
        <PublicLayout>
            <ToastContainer position='top-center' autoClose={1500} />
            <div className='container py-4'>
                <h2 className='text-center mb-4 text-secondary'>
                    Find Your Delicious Food Here.
                </h2>

                <div className="row g-3 mt-4">
                    {/* Search Input Column */}
                    <div className="col-md-8">
                        <form onSubmit={handleSearch} className="h-100">
                            <div className="input-group bg-white rounded-pill shadow-sm p-1 border h-100">
                                <span className="input-group-text bg-transparent border-0 text-secondary ms-2">
                                    <i className="fas fa-search"></i>
                                </span>

                                <input
                                    type="text"
                                    className="form-control border-0 shadow-none bg-transparent py-2"
                                    placeholder="Search your favourite food..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    aria-label="Search your favourite food"
                                />

                                <button className="btn btn-secondary rounded-pill px-4 fw-medium" type="submit">
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Category Dropdown Column */}
                    <div className="col-md-4">
                        {/* Wrapper to match the search bar's styling and height perfectly */}
                        <div className="bg-white rounded-pill shadow-sm border h-100 d-flex align-items-center">
                            <select
                                className="form-select border-0 shadow-none bg-transparent rounded-pill px-4 text-secondary py-2"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                style={{ cursor: 'pointer' }}
                            >
                                <option value="All">All Categories</option>
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat.category_name}>
                                        {cat.category_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className='card mt-4 border-0 shadow-sm'>
                    <div className='card-body py-2'>
                        <div className='row g-2'>
                            <div className='col-md-4 '>
                                <label className='form-label small mb-1'>Sort</label>
                                <select
                                    className='form-select form-select-sm rounded-pill' value={sortBy}
                                    onChange={handleSortChange}
                                >
                                    <option value="relevance">Relevance</option>
                                    <option value="priceLowHigh">Price: Low to High</option>
                                    <option value="priceHighLow">Price: High to Low</option>
                                    <option value="nameAZ">Name: A - Z</option>
                                    <option value="nameZA">Name: Z - A</option>
                                </select>
                            </div>

                            <div className='col-md-4'>
                                <label className='form-label small mb-1 me-sm-2'>Min Price (₹)</label>
                                <input
                                    type='number'
                                    className='form-control form-control-sm rounded-pill'
                                    value={minPrice}
                                    onChange={handleMinPriceInput}
                                    min="0"
                                />
                            </div>
                            <div className='col-md-4'>
                                <label className='form-label small mb-1 me-sm-2'>Max Price (₹)</label>
                                <input
                                    type='number'
                                    className='form-control form-control-sm rounded-pill'
                                    value={maxPrice}
                                    onChange={handleMaxPriceInput}
                                    min="500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row mt-4'>
                    <div className='col-md-12'>
                        <label className='form-label fw-bold my-2'>
                            Filter by price: ₹{minPrice} - ₹{maxPrice}
                        </label>
                        <Slider
                            range
                            min={0}
                            max={500}
                            value={[minPrice, maxPrice]}
                            onChange={(value) => {
                                const [min, max] = value;
                                // setMinPrice(value[0]);
                                // setMaxPrice(value[1]);
                                setMinPrice(min);
                                setMaxPrice(max);
                                applyFilters(search, selectedCategory, min, max)
                            }}
                        >

                        </Slider>
                    </div>
                </div>

                <div>
                    <button className='btn btn-outline-secondary btn-sm mt-3 shadow-sm  rounded'
                        onClick={() => {
                            setSearch("");
                            setMinPrice(0);
                            setMaxPrice(500);
                            setSortBy("relevance");
                            setFilteredFoods(foods);
                            setCurrentPage(1)
                            setSelectedCategory("All");
                        }}
                    >
                        Clear Filters
                    </button>
                </div>

                <div className='row mt-4'>
                    {currentFoods.length === 0 ? (
                        <p className='text-center'>
                            No foods found
                        </p>
                    ) :
                        (

                            currentFoods.map((food) => (
                                <div key={food} className='col-md-4 mb-4'>
                                    <div className='card card-effect  shadow-sm rounded-4 h-100 overflow-hidden'>
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

                                        <div className='card-body d-flex flex-column'>
                                            <h5 className='card-title fw-bold mb-1'>
                                                <Link to={`/foods/${food.id}`} className='text-dark text-decoration-none'>
                                                    {food.item_name} <span className="fs-6 text-muted fw-normal">({food.item_quantity})</span>
                                                </Link>
                                            </h5>

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
                {totalPages > 1 && (
                    <nav className="modern-pagination-container mt-4 d-flex justify-content-center" aria-label="Pagination">
                        <ul className="modern-pagination">
                            {/* First Page */}
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => paginate(1)}
                                    disabled={currentPage === 1}
                                    aria-label="Go to first page"
                                >
                                    <span aria-hidden="true">&laquo;&laquo;</span>
                                </button>
                            </li>

                            {/* Previous Page */}
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    aria-label="Go to previous page"
                                >
                                    <span aria-hidden="true">&laquo; Prev</span>
                                </button>
                            </li>

                            {/* Current Page Indicator */}
                            <li className="page-item current-page-info">
                                <span className="page-link">
                                    Page <strong>{currentPage}</strong>
                                    {/* of <strong>{totalPages}</strong> */}
                                </span>
                            </li>

                            {/* Next Page */}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    aria-label="Go to next page"
                                >
                                    <span aria-hidden="true">Next &raquo;</span>
                                </button>
                            </li>

                            {/* Last Page */}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => paginate(totalPages)}
                                    disabled={currentPage === totalPages}
                                    aria-label="Go to last page"
                                >
                                    <span aria-hidden="true">&raquo;&raquo;</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>
        </PublicLayout>
    )
}

export default FoodMenu