import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { API_URL } from "../config";

const ManageReviews = () => {
    const [reviews, setReviews] = useState([])
    const adminUser = localStorage.getItem('adminUser')
    const navigate = useNavigate();


    useEffect(() => {
        if (!adminUser) {
            toast.info("Please login first", {
                onClose: () => navigate("/admin-login")
            });
            return;
        }
        fetch(`${API_URL}/api/all-reviews/`)
            .then(res => res.json())
            .then(data => {
                setReviews(data)
            })
    }, [navigate, adminUser])

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

    const handleDelete = (id) => {

        if (window.confirm("Are you sure, you want to delete this review?")) {
            fetch(`${API_URL}/api/delete_review/${id}/`, {
                method: 'DELETE',

            })
                .then(res => res.json())
                .then(data => {
                    toast.success(data.message);

                    setReviews(prev => prev.filter(rev => rev.id !== id));
                })
                .catch(() => toast.error("Delete failed"));
        }
    }
    return (
        <AdminLayout>
            <ToastContainer position='top-right' autoClose={1500} />
            <div className='container'>
                <h3 className='text-center text-primary mb-4'>
                    <i className='fas fa-star me-1'></i>Manage Reviews
                </h3>
            <h5 className='text-end text-muted'>
                    <i className='fas fa-database me-1'></i>Total Reviews
                    <span className='ms-2 badge bg-success '>{reviews.length}</span>
                </h5>

                <table className='table table-bordered table-hover table-stripped'>
                    <thead className='table-dark'>
                        <tr>
                            <th>S.No</th>
                            <th>Food Item</th>
                            <th>User</th>
                            <th>Rating</th>
                            <th>Comment</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((r, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{r.food_name}</td>
                                <td>{r.user_name}</td>
                                <td>{[...Array(5)].map((_, i) =>(
                                    <i key={i} className={`fa-star text-warning ${i<r.rating ? 'fas' : 'far'} me-1`}></i>
                                ))} {r.rating} star</td>
                                <td>{r.comment}</td>
                                <td>{formatDateTime(r.created_at)}
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(r.id)} className='btn btn-sm btn-danger ms-2'> <i className='fas fa-trash-alt me-1 '></i>Delete </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    )
}

export default ManageReviews