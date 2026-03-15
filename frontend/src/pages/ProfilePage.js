import React, { useState, useEffect } from 'react'
import PublicLayout from '../components/PublicLayout'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { API_URL } from "../config";

const ProfilePage = () => {

    const userId = localStorage.getItem("userId");
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        mobile: '',
        reg_date: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            toast.info("Please login first", {
                onClose: () => navigate("/login")
            });
            return;
        }

        fetch(`${API_URL}/api/user/${userId}/`)
            .then(res => res.json())
            .then(data => {
                setFormData(data)

            })
    }, [userId, navigate])

    const handleChange = (e) => {

        setFormData({ ...formData, [e.target.name]: e.target.value })
    }


    const handleSubmit = async (e) => {
        e.preventDefault()


        try {
            const response = await fetch(`${API_URL}/api/user_update/${userId}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ first_name: formData.first_name, last_name: formData.last_name })
            })

            const result = await response.json()

            if (response.status === 200) {
                toast.success(result.message || "Profile Updated")

            } else {
                toast.error(result.message || "Something went wrong")
            }
        } catch (error) {
            console.error(error)
            toast.error("Error connecting to server")
        }
    };

    return (
        <PublicLayout>
            <ToastContainer position='top-right' autoClose={1500} />
            <div className='container py-5'>
                <h3 className='text-center text-primary mb-4'>
                    <i className='fas fa-user-circle me-1'></i>My Profile
                </h3>

                <form onSubmit={handleSubmit} className='card p-4 shadow-sm border-0'>
                    <div className='row'>
                        <div className='col-md-6 mb-3'>
                            <label className='form-lable mb-1'>First Name</label>
                            <input type='text' className='form-control' name='first_name' value={formData.first_name} onChange={handleChange} required/>
                        </div>

                        <div className='col-md-6 mb-3'>
                            <label className='form-lable mb-1'>Last Name</label>
                            <input type='text' className='form-control' name='last_name' value={formData.last_name} onChange={handleChange} required/>
                        </div>

                        <div className='col-md-6 mb-3'>
                            <label className='form-lable mb-1'>Email</label>
                            <input type='email' className='form-control' value={formData.email} disabled />
                        </div>

                        <div className='col-md-6 mb-3'>
                            <label className='form-lable mb-1'>Mobile Number</label>
                            <input type='tel' className='form-control' value={formData.mobile} disabled />
                        </div>

                        <div className='col-md-6 mb-3'>
                            <label className='form-lable mb-1'>Registration Date</label>
                            <input type='text' className='form-control' value={new Date(formData.reg_date).toLocaleString('en-IN', {
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
                                .replace('am', 'AM')} disabled />
                        </div>

                    </div>

                    <button type='submit' className='btn btn-primary mt-3'>
                        <i className='fas fa-save me-2'></i>Update Profile
                    </button>
                </form>
            </div>

        </PublicLayout>
    )
}

export default ProfilePage