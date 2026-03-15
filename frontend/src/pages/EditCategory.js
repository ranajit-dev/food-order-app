import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useParams, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaPenSquare } from 'react-icons/fa'
import { API_URL } from "../config";

const EditCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const { id } = useParams();

    const adminUser = localStorage.getItem('adminUser')
    const navigate = useNavigate();


    useEffect(() => {
        if (!adminUser) {
            toast.info("Please login first", {
                onClose: () => navigate("/admin-login")
            });
            return;
        }

        fetch(`${API_URL}/api/category/${id}/`)
            .then(res => res.json())
            .then(data => {
                setCategoryName(data.category_name);

            })
            .catch(() => toast.error("Failed to load category"));

    }, [id, adminUser, navigate])


    const handleUpdate = (e) => {

        e.preventDefault();

        if (!categoryName.trim()) {
            toast.error("Category name required")
            return;
        }

        fetch(`${API_URL}/api/category/${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category_name: categoryName })
        })
            .then(res => res.json())
            .then(data => {
                toast.success(data.message, {
                    autoClose: 1500,
                    onClose: () => navigate('/manage-category')
                });
            })
            .catch(() => toast.error("Update failed"));

    } 



    return (
        <AdminLayout>

            <ToastContainer position='top-right' autoClose={1500} />
            <div className='container py-4'>

            <div className='row'>
                <div className='col-md-8'>
                    <div className='shadow-sm rounded d-flex align-items-center mb-3'>
                        <h4 className='mb-4  '>
                            <FaPenSquare className='text-primary me-2' /> Edit Food Category
                        </h4>
                    </div>
                    <form onSubmit={handleUpdate}>
                        <div className='mb-3 '>
                            <label className='form-label '>
                                Category Name
                            </label>
                            <input type='text' className='form-control' onChange={(e) => setCategoryName(e.target.value)} value={categoryName} placeholder='Enter category Name' required />
                        </div>

                        <button type='submit' className='btn btn-primary  mt-3 d-flex justify-content-center align-items-center'>
                            <i className='fas fa-save me-2'></i>Update Category
                        </button>

                    </form>

                </div>
                <div className='col-md-4 d-flex aligin-items-center justify-content-center'>
                    <i className='fas fa-utensils ' style={{ fontSize: '180px', color: '#e5e5e5' }}></i>
                </div>
            </div>
            </div>

        </AdminLayout>
    )
}

export default EditCategory