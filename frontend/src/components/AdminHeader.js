import React from 'react'
import { FaBars, FaBell, FaChevronLeft, FaChevronRight, FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const AdminHeader = ({ toggleSidebar, sidebarOpen, newOrders }) => {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("adminUser")
        navigate("/admin-login")
    }

    return (
        <nav className='navbar navbar-expand-lg  navbar-light bg-white border-bottom px-3 shadow-sm sticky-top '>
            {/* Left Section */}
            <div className='d-flex align-items-center'>
                <button className='btn btn-outline-dark me-3' onClick={toggleSidebar}>
                    {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}

                </button>

                <span className='navbar-brand fw-semibold'><i className='fas fa-utensils me-2'></i>Food Ordering System</span>

            </div>

            {/* Mobile Toggle */}
            <button
                className='navbar-toggler border-0 ms-auto'
                type='button'
                data-bs-toggle='collapse'
                data-bs-target='#adminNavbar'
            >
                <FaBars />
            </button>

            {/* Right Section */}
            <div className='collapse navbar-collapse ' id='adminNavbar'>
                <ul className='navbar-nav ms-auto d-flex align-items-center gap-3'>
                    <li className='nav-item'>
                        <button className='btn btn-outline-secondary position-relative' onClick={() => {
                            if(newOrders > 0 ){
                                navigate("/order-not-confirmed");
                            }
                        }}
                        title={newOrders > 0 ? 'View New Orders' : "No New Orders"}
                        >
                            <FaBell />
                            <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger mt-1'>{newOrders}</span>
                        </button>
                    </li>

                    <li className='nav-item'>
                        <button className='btn btn-outline-danger' onClick={handleLogout}>
                            <FaSignOutAlt className='me-2' /> Logout
                        </button>
                    </li>

                </ul>
            </div>

        </nav>
    )
}

export default AdminHeader