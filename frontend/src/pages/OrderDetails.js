import React, { useState, useEffect } from 'react'
import PublicLayout from '../components/PublicLayout'
import { useParams, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import CancelOrderModal from '../components/CancelOrderModal'
import { API_URL } from "../config";

const OrderDetails = () => {
    const userId = localStorage.getItem("userId");

    const [orderItems, setOrderItems] = useState([]);
    const [orderAddress, setOrderAddress] = useState(null);
    const [total, setTotal] = useState(0);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const handleCloseModal = () => setShowCancelModal(false);

    const navigate = useNavigate();

    const { order_number } = useParams();

    useEffect(() => {
        if (!userId) {
            toast.info("Please login first", {
                onClose: () => navigate("/login")
            });
            return;
        }

        fetch(`${API_URL}/api/orders/by_order_number/${order_number}/`)
            .then(res => res.json())
            .then(data => {
                setOrderItems(data);
                const totalAmount = data.reduce((sum, item) => sum + Number(item.food.item_price) * item.quantity, 0);
                setTotal(totalAmount);

            })

        fetch(`${API_URL}/api/order_address/${order_number}/`)
            .then(res => res.json())
            .then(data => {
                setOrderAddress(data);


            })
    }, [order_number, userId, navigate])
    // }, [order_number])

    const handleCancelSuccess = () => {
        fetch(`${API_URL}/api/order_address/${order_number}/`)
            .then(res => res.json())
            .then(data => {
                setOrderAddress(data); 
            })
    };


    return (
        <PublicLayout>
            <ToastContainer position='top-right' autoClose={1500} />
            <div className='container py-5'>
                <h4 className='mb-4 text-primary'>
                    <i className='fas fa-receipt me-2'></i> Order #{order_number} Details
                </h4>
                <div className='row'>
                    <div className='col-md-7'>
                        {orderItems.map((item, index) => (
                            <div key={index} className='card mb-4 shadow-sm border-0'>
                                <div className='row'>
                                    <div className='col-md-4'>
                                        <img src={`${API_URL}${item.food.image}`} className='img-fluid rounded' style={{ height: "200px", width: '100%' }} alt="food-img" />
                                    </div>
                                    <div className='col-md-8 ms-1'>
                                        <h5>{item.food.item_name} ({item.food.item_quantity})</h5>
                                        <p>{item.food.item_description}</p>
                                        <p><strong>Price: </strong>&#8377; {item.food.item_price}</p>
                                        <p><strong>Quantity: </strong> {item.quantity}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='col-md-5 '>
                        {orderAddress && (
                            <div className='card shadow-sm border-0 bg-light p-4'>
                                <h5 className='fw-semibold mb-3'>
                                    <i className='fas fa-map-marker-alt me-2 text-danger'></i>Delivery Details
                                </h5>
                                <p>
                                    <strong>Date: </strong>{
                                        new Date(orderAddress.order_time)
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
                                </p>

                                <p><strong>Address: </strong>{orderAddress.address}</p>
                                <p><strong>Status: </strong>{orderAddress.order_final_status || "Waiting for Restaurant Confirmation"}</p>

                                <p><strong>Payment Mode: </strong><span className='badge bg-info text-dark mx-2'>{orderAddress.payment_mode}</span></p>

                                <p><strong>Total Price: </strong> &#8377; {total}</p>

                                <a href={`${API_URL}/api/invoice/${order_number}/`} target='_blank' className='btn btn-primary my-2 w-100' rel='noreferrer'>
                                    <i className='fas fa-file-invoice me-2'></i> Invoice
                                </a>

                                {orderAddress && (
                                    <>
                                        <CancelOrderModal
                                            show={showCancelModal}
                                            handleClose={handleCloseModal}
                                            orderNumber={order_number}
                                            paymentMode={orderAddress.payment_mode}
                                            onSuccess={handleCancelSuccess}
                                        />
                                        {(orderAddress.order_final_status === null ||
                                            orderAddress.order_final_status === 'Order Confirmed' ||
                                            orderAddress.order_final_status === 'Food being Prepared'
                                        ) ? (
                                            <button
                                                className='btn btn-danger my-2 w-100'
                                                onClick={() => setShowCancelModal(true)}
                                            >
                                                <i className='fas fa-times-circle me-2'></i> Cancel Order
                                            </button>
                                        ) : (
                                            <p className='text-danger  text-center mt-2'>
                                                Order can't be cancelled (Current Status: {orderAddress.order_final_status})
                                            </p>
                                        )}
                                    </>
                                )}

                            </div>
                        )}
                    </div>
                </div>
            </div>

        </PublicLayout>
    )
}

export default OrderDetails