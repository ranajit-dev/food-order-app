import React, { useState, useEffect } from 'react'
import PublicLayout from '../components/PublicLayout'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { FaBoxOpen, FaInfoCircle, FaMapMarkedAlt } from 'react-icons/fa';
import { API_URL } from "../config";


const MyOrders = () => {
    const userId = localStorage.getItem("userId");

    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            toast.info("Please login first", {
                onClose: () => navigate("/login")
            });
            return;
        }

        fetch(`${API_URL}/api/orders/${userId}/`)
            .then(res => res.json())
            .then(data => {
                setOrders(data);

            })
    }, [userId, navigate])

    const getStatusBadge = (status)=>{
        const statusLower = status.toLowerCase();
        if(statusLower.includes("delivered")) return 'success';
        if(statusLower.includes("cancelled")) return 'danger';
        if(statusLower.includes("confirmed")) return 'info';
        if(statusLower.includes("prepared")) return 'warning';
        return 'secondary';
    }

    return (
        <PublicLayout>
            <ToastContainer position='top-right' autoClose={1500} />
            <div className='container py-5'>
                <h3 className=' text-muted fw-bold mb-4 d-flex aligin-items-center justify-content-center'><FaBoxOpen className='text-warning me-2 pb-1' size={40} />My Orders</h3>

                {orders.length === 0 ? (
                    <p className='text-center text-muted'>You don’t have any orders yet.</p>
                ) : (
                    orders.map((order, index) => (
                        <div className='card mb-4 shadow-sm' key={index}>
                            <div className='card-body d-flex align-items-center flex-wrap'>
                                <div className='me-2'>
                                    <FaBoxOpen className=' text-warning me-2 ' size={40} />
                                </div>

                                <div className='flex-grow-1'>
                                    <h6 className='mb-1 '>
                                        <Link to="">
                                            Order # {order.order_number}
                                        </Link>
                                    </h6>
                                    <p className='text-muted mb-1'>
                                        <strong>Date: </strong> <span className="fw-medium font-monospace">
                                            {
                                                new Date(order.order_time)
                                                    .toLocaleString('en-IN', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit',
                                                        hour12: true
                                                    })
                                                    .replace(',', '\u00A0\u00A0')
                                                    .replace('pm', 'PM')
                                                    .replace('am', 'AM')
                                            }
                                        </span>
                                    </p>
                                    <span className={`badge bg-${getStatusBadge(order.order_final_status)}`}>{order.order_final_status}</span>
                                </div>

                                <div className='mt-3 mt-md-0 ms-5 ms-md-0 ps-1 ps-md-0'>
                                    <Link className='btn btn-outline-secondary btn-sm  me-2  my-2' to={`/track-order/${order.order_number}`}>
                                            <FaMapMarkedAlt className=''/> Track
                                    </Link>
                                    <Link className='btn btn-outline-primary btn-sm  me-2 ' to={`/order-details/${order.order_number}`}>
                                            <FaInfoCircle className=''/> View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </PublicLayout>
    )
}

export default MyOrders