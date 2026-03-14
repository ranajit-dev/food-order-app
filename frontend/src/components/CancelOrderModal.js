import React, { useState } from 'react'

const CancelOrderModal = ({ show, handleClose, orderNumber, paymentMode, onSuccess }) => {
    const [remark, setRemark] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async () => {
        if (!remark.trim()) {
            setError("Please provide a reason for cancellation");
            return;

        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/cancel_order/${orderNumber}/`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    remark
                })
            })
            const result = await response.json();

            if (response.ok) {
                let msg = result.message
                if (paymentMode === 'online') {
                    msg += '\nSince you paid online, your amount will be refunded to your account within 2 working days.';
                }
                setMessage(msg);
                setRemark("");
                setError("");

                if (onSuccess) {
                    onSuccess();
                }
                setTimeout(() => {
                    handleClose();
                    setMessage("");
                }, 1500);
            }
            else {
                setError(result.message || "failed to cancel order")
            }

        } catch (err) {
            setError("Something went wrong")
        }
    }

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Cancel Order: #{orderNumber}</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        {message ? (
                            <p className='alert alert-success'>{message}</p>
                        ) : (
                            <>
                                <label className='form-label'>Reason for cancellation</label>
                                <textarea
                                    className='form-control'
                                    rows='4'
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                    placeholder='Enter reason here...'
                                >
                                </textarea>

                                {error &&
                                    <p className='text-danger mt-2'>
                                        {error}
                                    </p>
                                }
                            </>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                        <button type="button" className="btn btn-danger" onClick={handleSubmit} disabled={!!message}>Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CancelOrderModal