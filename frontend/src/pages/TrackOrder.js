import React, { useState, useEffect } from 'react'
import PublicLayout from '../components/PublicLayout'
import '../styles/track.css'
import { useParams } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const TrackOrder = () => {
    const [orderNumber, setOrderNumber] = useState('');
    const [trackingData, setTrackingData] = useState([]);

    const { paramOrderNumber } = useParams();

    useEffect(() => {
        if (paramOrderNumber) {
            setOrderNumber(paramOrderNumber);
            handleTrack(paramOrderNumber);

        }
    }, [paramOrderNumber])

    const handleTrack = async (orderNum) => {

        if (!orderNum) {
            toast.warning("Please enter an order number.");
            return;
        }
        if (orderNum.length !== 12) {
            toast.info("Order number must be exactly 12 characters.");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/track_order/${orderNum}/`)

            
            const data = await response.json();

            if (response.ok) {
                setTrackingData(data);
            } 
            else {
                toast.error("Order not found or not placed yet.");
            }

        } catch (error) {
            console.error("Tracking error:", error);
            toast.error("Something went wrong")
        }
    }
    // Date  Formatting
    const formatDate = (date) => {
        const formatted = new Date(date).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',

        })

        return formatted
    }
    // Time  Formatting
    const formatTime = (date) => {
        const formatted = new Date(date).toLocaleString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })

        return formatted.replace(/am|pm/i, m => m.toUpperCase())
    }

    const getBadge = (status) => {
        switch (status.toLowerCase()) {
            case 'order confirmed': return 'bg-info';
            case 'food being prepared': return 'bg-warning';
            case 'food pickup': return 'bg-primary';
            case 'food delivered': return 'bg-success';
            case 'order cancelled': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    return (
        <PublicLayout>
            <ToastContainer position='top-center' autoClose={1500} />
            <div className='container mt-4'>
                <h3 className='mb-4 text-secondary'>
                    <i className='fas fa-map-marker-alt text-danger'></i>
                    Track Your Order
                </h3>

                <div className='input-group mb-3 shadow-sm'>
                    <span className='input-group-text bg-white'>
                        <i className='fas fa-receipt text-muted'></i>
                    </span>
                    <input
                        type='text'
                        className='form-control'
                        placeholder='Enter Order Number'
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        
                    />
                </div>
                <button
                    onClick={() => handleTrack(orderNumber)}
                    className='btn btn-primary mb-4'
                >
                    <i className='fas fa-truck me-1'></i> Track
                </button>

                {trackingData.length > 0 ? (
                    <div className='card p-4 shadow-sm rounded-4 border-0'>
                        <h5 className='mb-4 text-primary'>
                            <i className='fas fa-stream me-1'></i> Order Status Timeline
                        </h5>

                        <div className='d-flex justify-content-between align-items-center mb-5 px-2 position-relative'>

                            <div className='timeline-line '></div>

                            {trackingData.map((entry, index) => (
                                <div key={index} className='text-center timeline-step flex-fill'>
                                    <div className={`icon ${getBadge(entry.status)} mx-auto mb-2`}>
                                        <i className='fas fa-check text-white'></i>
                                    </div>

                                    <small className='d-block fw-bold'>{entry.status}</small>
                                    <small className='text-muted'>{formatDate(entry.status_date)}</small>
                                </div>
                            ))}
                        </div>

                        <h6 className='mb-2'>Detailed History</h6>
                        <ul className='list-group'>
                            {trackingData.map((entry, index) => (
                                <li key={index} className='list-group-item no-hover-bg'>
                                    <span className={`badge ${getBadge(entry.status)} me-2`}>{entry.status}</span>

                                    <br/>

                                    <small className='text-muted'>{formatDate(entry.status_date)} </small>
                                    <small className='text-muted ms-4'>{formatTime(entry.status_date)}</small>
                                    {entry.order_cancelled_by_user && (
                                        <span className={`badge ${getBadge(entry.status)} ms-2`}>Cancelled by User</span>
                                    )}
                                </li>
                            ))}
                        </ul>

                    </div>
                ) : (
                    <div>
                        <h6 className='text-muted text-secondary text-center mt-5'>Waiting for Restaurant Confirmation!</h6>
                    </div>
                )}


            </div>

        </PublicLayout>
    )
}

export default TrackOrder