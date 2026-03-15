import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useNavigate } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { API_URL } from "../config";

const OrderReport = () => {

    const [formData, setFormData] = useState({
        from_date: '',
        to_date: '',
        status: 'all'
    })
    const [orders, setOrders] = useState([])
    const [allOrders, setAllOrders] = useState([])

    const adminUser = localStorage.getItem('adminUser')
    const navigate = useNavigate();


    useEffect(() => {
        if (!adminUser) {
            toast.info("Please login first", {
                onClose: () => navigate("/admin-login")
            });
            return;
        }

    }, [adminUser, navigate])

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/api/order-between-dates/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await response.json()
            if (response.status === 200) {
                setOrders(data)
                setAllOrders(data)

            } else {
                toast.error("Something went wrong")
            }
        } catch (error) {
            console.error(error)
            toast.error("Error connecting to server")
        }
    }

    // Date Time Formatting
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

    const handleSearch = (s) => {
        const keyword = s.toLowerCase()
        if (!keyword) {
            setOrders(allOrders)
        } else {
            const filtered = allOrders.filter((order) => order.order_number.toLowerCase().includes(keyword)) //c -> category 
            setOrders(filtered)

        }
    }

    return (
        <AdminLayout>
            <ToastContainer position='top-right' autoClose={1500}/>
            <div className='container'>
                <h3 className='text-center text-primary mb-4'>
                    <i className='fas fa-calendar-alt me-1'></i>Between Dates Reports
                </h3>

                <form onSubmit={handleSubmit} className='mb-4'>
                    <div className='row mb-3'>
                        <div className='col-md-4'>
                            <label className='form-label'>From Date</label>
                            <input type='date' name='from_date' onChange={handleChange} className='form-control' required />
                        </div>

                        <div className='col-md-4'>
                            <label className='form-label'>To Date</label>
                            <input type='date' name='to_date' onChange={handleChange} className='form-control' required />
                        </div>

                        <div className='col-md-4'>
                            <label value={formData.status} className='form-label'>Status</label>
                            <select name='status' onChange={handleChange} className='form-control' required>
                                <option value='all'>All</option>
                                <option value='not_confirmed'>Not Confirmed</option>
                                <option value='Order Confirmed'>Order Confirmed</option>
                                <option value='Food being Prepared'>Food being Prepared</option>
                                <option value='Food Pickup'>Food Pickup</option>
                                <option value='Food Delivered'>Food Delivered</option>
                                <option value='Order Cancelled'>Order Cancelled</option>

                            </select>
                        </div>
                    </div>

                    <div className='text-center my-4'>
                        <button className='btn btn-primary w-50' type='submit'>
                            Submit
                        </button>
                    </div>
                </form>


                <>
                    <h5 className='text-end text-muted'>
                        <i className='fas fa-database me-1'></i>Total
                        <span className='ms-2 badge bg-success'>{orders.length}</span>
                    </h5>

                    {/* Search always visible */}
                    <div className='mb-3 d-flex justify-content-between'>
                        <input
                            type='text'
                            className='form-control w-50'
                            placeholder='Search by order number'
                            onChange={(e) => handleSearch(e.target.value)}
                        />

                        <CSVLink filename={'betn-dates-report.csv'} data={orders} className='btn btn-outline-success'>
                            Export to CSV
                        </CSVLink>
                    </div>

                    <table className='table table-bordered table-hover table-stripped'>
                        <thead className='table-dark'>
                            <tr>
                                <th>S.No</th>
                                <th>Order Number</th>
                                <th>Order Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className='text-center text-muted'>
                                        No matching orders found
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order, index) => (
                                    <tr key={order.id}>
                                        <td>{index + 1}</td>
                                        <td>{order.order_number}</td>
                                        <td>{formatDateTime(order.order_time)}</td>
                                        <td>
                                            <a href={`/admin-view-order-detail/${order.order_number}`} className='btn btn-sm btn-info'>
                                                <i className='fas fa-eye me-1 '></i> View Details
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </>

            </div>
        </AdminLayout>
    )
}

export default OrderReport