import React, {useState, useEffect} from 'react'
import PublicLayout from '../components/PublicLayout'
import { Link, useLocation } from 'react-router-dom'
import '../styles/search.css'
import { API_URL } from "../config";

const SearchPage = () => {

    const query = new URLSearchParams(useLocation().search).get('q') || ''
    const [foods, setFoods] = useState([])

    useEffect(()=>{
            if (query) {
                fetch(`${API_URL}/api/food-search/?q=${query}`)
                .then(res => res.json())
                .then(data => {
                    setFoods(data)
                })
            }
        }, [query])

  return (
    <PublicLayout>
        <div className='container py-4'>
            <h3 className='text-primary text-center'>Results for: {query}</h3>
            <div className='row mt-4'>
                {foods.length === 0 ? (<p className='text-center'> No foods found</p>) : 
                (

                    foods.map((food, index)=> (
                        <div key={food.id} className='col-md-4 mb-4'>
                            <div className='card card-effect'>
                                <img src={food.image} className='card-img-top' alt="" />
                                <div className='card-body'>
                                    <h5 className='card-title'>
                                        <Link to='#'>{food.item_name} ({food.item_quantity})</Link>
                                    </h5>
                                    <p className='card-text text-muted'>{food.item_description?.slice(0,40)}</p>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <span className='fw-bold'>&#8377; {food.item_price}</span>

                                        {food.is_available ? (
                                            <Link to='' className='btn btn-outline-secondary btn-sm'>
                                            <i className='fas fa-shopping-basket me-1'></i>Order Now
                                            </Link>
                                        ) : (
                                        
                                            <button to='' className='btn btn-outline-primary btn-sm'>
                                            <i className='fas fa-times-circle me-1'></i>Currentluy Unavailable
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

export default SearchPage