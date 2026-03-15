import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import {FaChevronDown, FaChevronUp, FaEdit, FaFile, FaList, FaSearch, FaStar, FaThLarge, FaUsers} from 'react-icons/fa'


const AdminSidebar = () => {

        const [openMenus, setOpenMenus] = useState({
            category: false,
            food: false,
            orders: false
        })

        const toggleMenu = (menu) => {
            setOpenMenus((previous)=>({...previous, [menu]:!previous[menu]}))
        }
  return (
    <div className='bg-dark text-white sidebar'>
        <div className='text-center p-3 border-bottom'>
            <img src='/images/admin2.png' className='img-fluid rounded-circle mb-2' width='70'  alt='Admin-Img'/>
            {/* <i className="fas fa-user-circle"style={{
                    fontSize: "5rem",
                    opacity: 0.85,
                    color: "#ff660d",

                }}></i> */}
            <h6 className='mb-0'>Admin</h6>
        </div>

        <div className='list-group list-group-flush '>
            <Link to='/admin-dashboard' className='list-group-item list-group-item-action bg-dark text-white d-flex align-items-center border-0'>
                <FaThLarge className='me-2'/> Dashboard
            </Link>

            
            <Link to='/manage-users' className='list-group-item list-group-item-action bg-dark text-white d-flex align-items-center border-0'>
                <FaUsers className='me-2'/> Reg Users
            </Link>
        
        {/* Category */}
        
            <button onClick={()=>toggleMenu('category')} className='list-group-item list-group-item-action bg-dark text-white d-flex align-items-center border-0 w-100'>
                <FaEdit className='me-2'/> Food Category <span>{openMenus.category ? <FaChevronUp className=''/>: <FaChevronDown/>}</span>
            </button>
        
            {openMenus.category && (
            <div className='ps-4'>
                <Link to='/add-category' className='list-group-item list-group-item-action bg-dark text-white d-flex align-items-center border-0'>
                    Add Category
                </Link>

                <Link to='/manage-category' className='list-group-item list-group-item-action bg-dark text-white d-flex align-items-center border-0'>
                    Manage Category
                </Link>
            </div>
            )}
            
        

         {/* Food */}
            <button onClick={()=>toggleMenu('food')} className='list-group-item list-group-item-action bg-dark text-white d-flex align-items-center border-0'>
                <FaEdit className='me-2'/>Food Menu <span>{openMenus.food ? <FaChevronUp className=''/>: <FaChevronDown/>}</span>
            </button>
            
            {openMenus.food && (
            <div className='ps-4'>
                <Link to = '/add-food' className='list-group-item list-group-item-action bg-dark text-white d-flex align-items-center border-0'>
                    Add Food 
                </Link>
                <Link to='/manage-food' className='list-group-item list-group-item-action bg-dark text-white d-flex align-items-center border-0'>
                    Manage Food 
                </Link>
            </div>
            )}

         {/* Orders */}
            <button onClick={()=>toggleMenu('orders')} className='list-group-item list-group-item-action bg-dark text-white d-flex align-items-center border-0'>
                <FaList className='me-2'/>Orders <span>{openMenus.orders ? <FaChevronUp className=''/>: <FaChevronDown/>}</span>
            </button>
            
            {openMenus.orders && (
            <div className='ps-4'>
                <Link to='/order-not-confirmed' className='list-group-item list-group-item-action bg-dark text-white d-flex align-items-center border-0'>
                    Not Confirmed 
                </Link>
                <Link to='/orders-confirmed' className='list-group-item list-group-item-action bg-dark text-white d-flex align-items-center border-0'>
                    Confirmed 
                </Link>
                <Link to='/food-being-prepared' className='list-group-item list-group-item-action bg-dark text-white d-flex align-items-center border-0'>
                    Bring Prepared 
                </Link>
                <Link to='/food-pickup' className='list-group-item list-group-item-action bg-dark text-white d-flex align-items-center border-0'>
                    Food Pickup 
                </Link>
                <Link to='/food-delivered' className='list-group-item list-group-item-action bg-dark text-white d-flex align-items-center border-0'>
                    Delivered 
                </Link>
                <Link to='/order-cancelled' className='list-group-item list-group-item-action bg-dark text-white d-flex align-items-center border-0'>
                    Cancelled 
                </Link>
                <Link to='/all-orders' className='list-group-item list-group-item-action bg-dark text-white d-flex align-items-center border-0'>
                    All Orders 
                </Link>
            </div>
            )}
            
        
        
            <Link to='/order-report' className='list-group-item list-group-item-action bg-dark text-white d-flex align-items-center border-0'>
                <FaFile className='me-2'/> B/w Dates Reports
            </Link>
            <Link to='/search-order' className='list-group-item list-group-item-action bg-dark text-white d-flex align-items-center border-0'>
                <FaSearch className='me-2'/> Search
            </Link>
        
            <Link to='/manage-reviews' className='list-group-item list-group-item-action bg-dark text-white d-flex align-items-center border-0'>
                <FaStar className='me-2'/> Manage Reviews
            </Link>


        </div>
        
    </div>
  )
}

export default AdminSidebar