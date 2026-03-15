import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useNavigate, useParams } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import '../styles/vieworder.css'
import { API_URL } from "../config";


const ViewFoodOrder = () => {
    const { orderNumber } = useParams();

    const adminUser = localStorage.getItem('adminUser')
    const navigate = useNavigate();
    const [data, setData] = useState(null)

    const [previewImg, setPreviewImg] = useState(null)



    useEffect(() => {
        if (!adminUser) {
            toast.info("Please login first", {
                onClose: () => navigate("/admin-login")
            });
            return;
        }

        if (!orderNumber) return;

        fetch(`${API_URL}/api/view-order-detail/${orderNumber}/`)
            .then(res => res.json())
            .then(data => {
                setData(data)
            })

    }, [adminUser, orderNumber, navigate])


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

    if (!data) return <AdminLayout>
        <p className='text-center pt-5'>Loading..</p>
    </AdminLayout>

    const { order, foods, tracking } = data;

    const statusOptions = [
        "Order Confirmed",
        "Food being Prepared",
        "Food Pickup",
        "Food Delivered",
        "Order Cancelled"
    ];

    const currentStatus = order.order_final_status || "";

    const visibleOptions = statusOptions.slice(statusOptions.indexOf(currentStatus) + 1)

    return (
        <AdminLayout>
            <ToastContainer position='top-right' autoClose={1500} />
            <div className='container mt-4'>
                <h3 className='text-center text-primary mb-4'>
                    {/* Order Details #{order.order_number} */}
                    Order Details #{orderNumber}
                </h3>
                <div className='row'>
                    <div className='col-md-6'>
                        <h5 className='text-secondary'>User Info</h5>
                        <table className='table table-bordered'>
                            <tbody>
                                <tr><th>First Name</th><td>{order.user_first_name}</td></tr>

                                <tr><th>Last Name</th><td>{order.user_last_name}</td></tr>

                                <tr><th>Email</th><td>{order.user_email}</td></tr>

                                <tr><th>Mobile</th><td>{order.user_mobile}</td></tr>

                                <tr><th>Address</th><td>{order.address}</td></tr>

                                <tr><th>Order Time</th><td>{formatDateTime(order.order_time)}</td></tr>

                                <tr><th>Final Status</th><td>{order.order_final_status || 'Pending'}</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className='col-md-6 mb-3'>
                        <h5 className='text-secondary'>Ordered Foods</h5>
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {foods.map((food, index) => (
                                    <tr key={index}>
                                        {/* <td className='img-cell'><img src={`http://127.0.0.1:8000${food.image}`} alt="food-img" className='food-img'/></td> */}

                                        <td>
                                            <img
                                                src={`${API_URL}${food.image}`}
                                                alt=""
                                                className="thumb"
                                                onClick={() =>
                                                    setPreviewImg(`${API_URL}${food.image}`)
                                                }
                                            />
                                        </td>

                                        <td>{food.item_name}</td>
                                        <td>{food.item_price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>


                <h5 className='mt-3 text-secondary'>Tracking History</h5>
                <table className='table table-bordered'>
                    <thead>
                        <tr>
                            <th>Sl. No</th>
                            <th>Status</th>
                            <th>Remark</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tracking.length === 0 ? (
                            <tr>
                                <td colSpan='4' className='text-center'>No tracking history yet</td>
                            </tr>
                        ) : (
                            tracking.map((track, index) => (
                                <tr key={index}>

                                    <td>{index + 1}</td>
                                    <td>{track.status}</td>
                                    <td>{track.remark}</td>
                                    <td>{formatDateTime(track.status_date)}</td>
                                </tr>
                            ))
                        )

                        }
                    </tbody>
                </table>

                {/* Update Food Status */}
                
                {order.order_final_status !== "Food Delivered" && (
                    <div className='my-4'>
                        <h5 className='text-secondary'>Update Order Status</h5>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const status = e.target.status.value;
                            const remark = e.target.remark.value;

                            fetch(`${API_URL}/api/update-order-status/`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    order_number: order.order_number,
                                    status,
                                    remark,
                                }),
                            })
                                .then((res) => res.json())
                                .then((res) => {
                                    if (res.message) {
                                        toast.success(res.message);
                                        setTimeout(() => window.location.reload(), 1000);
                                    } else {
                                        toast.error(res.error || "Failed to update status");
                                    }
                                })
                                .catch(() => toast.error("Server Error"))
                        }}>
                            <div className='mb-3'>
                                <label className='form-label'>Status</label>
                                <select name='status' className='form-control' required>
                                    {visibleOptions.map((status, index) => (
                                        <option key={index} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='mb-3'>
                                <label className='form-label'>Remark</label>
                                <textarea name='remark' className='form-control' required rows='3'></textarea>
                            </div>

                            <div className='text-center'>
                                <button type='submit' className='btn btn-success'>Update Status</button>
                            </div>
                        </form>
                    </div>
                )}

                {previewImg && (
                    <div
                        className="img-modal"
                        onClick={() => setPreviewImg(null)}
                    >
                        <img
                            src={previewImg}
                            alt=""
                            className="img-modal-content"
                        />
                    </div>
                )}

            </div>

        </AdminLayout>
    )
}

export default ViewFoodOrder