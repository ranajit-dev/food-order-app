import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useNavigate } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import { toast } from 'react-toastify'
import { API_URL } from "../config";

const OrdersConfirmed = () => {
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
        fetch(`${API_URL}/api/orders-confirmed/`)
            .then(res => res.json())
            .then(data => {
                setOrders(data)
                setAllOrders(data)
            })
    }, [adminUser, navigate])

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
            <div className='container'>
                <h3 className='text-center text-primary mb-4'>
                    <i className='fas fa-list-alt me-1'></i>Detail of Order Confirmed
                </h3>
                <h5 className='text-end text-muted'>
                    <i className='fas fa-database me-1'></i>Total Order Confirmed
                    <span className='ms-2 badge bg-success '>{orders.length}</span>
                </h5>

                {/* Search BAR */}
                <div className='mb-3 d-flex justify-content-between'>
                    <input type='text' className='form-control w-50' placeholder='Search by order number ' onChange={(e) => handleSearch(e.target.value)}></input>

                    {/* CSV FILE */}
                    <CSVLink filename={'order-confirmed-list.csv'} data={orders} className='btn btn-outline-success '>
                        <i className='fas fa-file-csv me-1'></i><b>Export to CSV</b>
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
                        {orders.map((order, index) => (
                            <tr key={order.id}>
                                <td>{index + 1}</td>
                                <td>{order.order_number}</td>
                                <td>{formatDateTime(order.order_time)}
                                </td>
                                <td>
                                    <a href={`/admin-view-order-detail/${order.order_number}`} className='btn btn-sm btn-info me-4'>
                                        <i className='fas fa-eye me-1 '></i>View Details
                                    </a>
                                    <a href={`${API_URL}/api/admin/invoice/${order.order_number}/`} target='_blank' className='btn btn-primary  btn-sm' rel='noreferrer'>
                                        <i className='fas fa-file-invoice me-2 p-1'></i> <span className='me-2'>Invoice </span>
                                    </a>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    )
}

export default OrdersConfirmed