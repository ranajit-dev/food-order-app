import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const SearchOrder = () => {

    const [searchTerm, setSearchTerm] = useState("");
    const [orders, setOrders] = useState([]);

    const [submitted, setSubmitted] = useState(false);

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



    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchTerm.trim()) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/search-orders/?q=${searchTerm}`);
            const data = await response.json()

            setOrders(data);
            setSubmitted(true);

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

    return (
        <AdminLayout>
            <ToastContainer position='top-right' autoClose={1500} />
            <div className='container mt-4'>
                <h3 className='text-center text-primary mb-4'>
                    <i className='fas fa-search me-1'></i>Search Orders
                </h3>

                <form onSubmit={handleSearch} className='d-flex  mt-3 ' style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <input type='text' onChange={(e) => setSearchTerm(e.target.value)} name='q' placeholder='Enter Order Number' className='form-control' style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} />
                    <button type='submit' className=' btn btn-warning px-4' style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>Search</button>
                </form>



                {submitted && (
                    <table className='table table-bordered table-hover table-stripped mt-5'>
                        <thead className='table-dark'>
                            <tr>
                                <th>S.No</th>
                                <th>Order Number</th>
                                <th>Order Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {orders.length > 0 ? (orders.map((order, index) => (
                                <tr key={order.id}>
                                    <td>{index + 1}</td>
                                    <td>{order.order_number}</td>
                                    <td>{formatDateTime(order.order_time)}</td>
                                    <td>
                                        <a href={`/admin-view-order-detail/${order.order_number}`} className='btn btn-sm btn-info'>
                                            View Details
                                        </a>
                                    </td>
                                </tr>
                            ))) : (
                                <tr>
                                    <td colSpan="4" className='text-center text-muted'>
                                        No Record found
                                    </td>
                                </tr>
                            )

                            }
                        </tbody>
                    </table>
                )}


            </div>
        </AdminLayout>
    )
}

export default SearchOrder