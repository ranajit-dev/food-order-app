import React, { useState, useEffect } from 'react'
import PublicLayout from '../components/PublicLayout'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const PaymentPage = () => {

    const userId = localStorage.getItem("userId");

    const [paymentMode, setPaymentMode] = useState("cod");
    const [address, setAddress] = useState("");
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
    });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handlePlaceOrder = async () => {

        if (!address.trim()) {
            toast.error("Please enter delivery address");
            return;
        }

        if (paymentMode === 'online') {
            const { cardNumber, expiry, cvv } = cardDetails;

            if (!cardNumber || !expiry || !cvv) {
                toast.error("Please fill in all card details");
                return;
            }
        }
        try {
            setLoading(true);

            const response = await fetch('http://127.0.0.1:8000/api/place_order/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    address: address,
                    paymentMode: paymentMode,
                    cardNumber: paymentMode === 'online' ? cardDetails.cardNumber : '',
                    expiry: paymentMode === 'online' ? cardDetails.expiry : '',
                    cvv: paymentMode === 'online' ? cardDetails.cvv : '',
                })
            })

            const result = await response.json()

            if (response.status === 201) {

                toast.success(result.message, {
                    onClose: () => navigate("/my-orders")
                })


            } else {
                toast.error(result.message || "Something went wrong")
            }
        } catch (error) {
            console.error(error)
            toast.error("Error connecting to server")
        } finally {
            setLoading(false);
        }

    };



    return (
        <PublicLayout>
            <ToastContainer position='top-right' autoClose={1500} />
            <div className='container py-5'>
                <h3 className='text-center text-primary mb-5'>
                    <i className='fas fa-credit-card me-2'></i> Checkout & Payment
                </h3>

                <div className='row offset-md-3 '>
                    <div className='col-md-8'>

                        <div className='card p-4 shadow-lg border-0'>
                            <div className='mb-3'>
                                <label className='form-label fw-semibold'>Delivery Address</label>
                                <textarea className='form-control border-primary-subtle' rows='5' placeholder='Enter your full delivery address' value={address} onChange={(e) => setAddress(e.target.value)} required></textarea>
                            </div>

                            <div className="mb-3 d-flex flex-column flex-md-row gap-3">
                                <div className='form-check form-check-inline '>
                                    <input className='form-check-input '
                                        id='cod'
                                        type='radio'
                                        name='paymentMode'
                                        value='cod'
                                        checked={paymentMode === 'cod'}
                                        //  onChange={() =>setPaymentMode('cod')}
                                        onChange={(e) => setPaymentMode(e.target.value)}
                                    />

                                    <label htmlFor='cod' className='form-check-label '>Cash on Delivery</label>
                                </div>

                                <div className="form-check form-check-inline mb-3">
                                    <input
                                        id='online'
                                        className="form-check-input"
                                        type="radio"
                                        name="paymentMode"
                                        value="online"
                                        checked={paymentMode === "online"}
                                        onChange={(e) => setPaymentMode(e.target.value)}
                                    />
                                    <label htmlFor='online' className="form-check-label">Online Payment</label>
                                </div>
                            </div>

                            {paymentMode === 'online' && (
                                <div className='row'>
                                    <div className='col-12 col-md-6 mb-3'>
                                        <label className='form-label'>Card Number</label>
                                        <input
                                            type='tel'
                                            className='form-control'
                                            value={cardDetails.cardNumber}
                                            onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                                            placeholder='1234 **** **** ****'
                                        />
                                    </div>
                                    <div className='col-6 col-md-3 mb-3'>
                                        <label className='form-label'>Expiry</label>
                                        <input
                                            type='text'
                                            className='form-control'
                                            value={cardDetails.expiry}
                                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                            placeholder='MM/YY'
                                        />
                                    </div>
                                    <div className='col-6 col-md-3'>
                                        <label className='form-label'>CVV</label>
                                        <input
                                            type='password'
                                            className='form-control'
                                            value={cardDetails.cvv}
                                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                            placeholder='***'
                                        />
                                    </div>
                                </div>
                            )}

                            <button className='btn btn-success mt-4 w-100 ' onClick={handlePlaceOrder} disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Placing Order...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-check-circle me-2"></i>
                                        Confirm & Place Order
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>


        </PublicLayout>
    )
}

export default PaymentPage