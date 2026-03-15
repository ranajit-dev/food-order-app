import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useParams, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaPenSquare } from 'react-icons/fa'
import { API_URL } from "../config";

const EditFood = () => {
    const { id } = useParams();
    const adminUser = localStorage.getItem('adminUser')
    const navigate = useNavigate();

    const [categories, setCategories] = useState([])
    const [formData, setFormData] = useState({
        category: '',
        item_name: '',
        item_price: '',
        item_description: '',
        image: '',
        item_quantity: '',
        is_available: ''
    })
    useEffect(() => {
        if (!adminUser) {
            toast.info("Please login first", {
                onClose: () => navigate("/admin-login")
            });
            return;
        }

        fetch(`${API_URL}/api/edit-food/${id}/`)
            .then(res => res.json())
            .then(data => {
                setFormData(data);

            })
            .catch(() => toast.error("Failed to edit food"));

        fetch(`${API_URL}/api/categories/`)
            .then(res => res.json())
            .then(data => {
                setCategories(data);

            })
            .catch(() => toast.error("Failed to load category"));

    }, [id, adminUser, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFileChange = (e) => {

        setFormData((prev) => ({
            ...prev,
            image: e.target.files[0]
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const data = new FormData() //bundle textual and image data

        data.append("category", formData.category);
        data.append("item_name", formData.item_name);
        data.append("item_description", formData.item_description);
        data.append("item_quantity", formData.item_quantity);
        data.append("item_price", formData.item_price);
        data.append("image", formData.image);
        data.append("is_available", formData.is_available ? "true" : "false");

        try {
            const response = await fetch(`${API_URL}/api/edit-food/${id}/`, {
                method: 'PUT',
                body: data
            })

            const result = await response.json()

            if (response.status === 200) {
                toast.success(result.message, {
                    onClose: () => navigate('/manage-food'),
                    autoClose: 1500
                })

            } else {
                toast.error(result.message)
            }
        } catch (error) {
            console.error(error)
            toast.error("Error connecting to server")
        }
    }


    return (
        <AdminLayout>

            <ToastContainer position='top-right' autoClose={1000} />
            <div className='container'>
                <div className='row'>
                    <div className='col-md-8'>
                        <div className='shadow-sm rounded d-flex align-items-center mb-3'>
                            <h4 className='mb-4  '>
                                <FaPenSquare className='text-primary me-2 ms-1 ' />Edit Food Item
                            </h4>
                        </div>
                        <form onSubmit={handleSubmit} encType='multipart/form-data'>
                            <div className='mb-3 '>
                                <label className='form-label '>
                                    Food Category
                                </label>
                                <select name='category' className='form-select' required onChange={handleChange} value={formData.category}>
                                    <option value=''>Select category</option>

                                    {categories.map((cat, index) => (
                                        <option key={cat.id} value={cat.id}>{cat.category_name}</option>

                                    ))}
                                </select>
                            </div>

                            <div className='mb-3 '>
                                <label className='form-label '>
                                    Food Item Name
                                </label>
                                <input name='item_name' type='text' className='form-control' onChange={handleChange} placeholder='Enter Food Name' value={formData.item_name} required />
                            </div>

                            <div className='mb-3 '>
                                <label className='form-label '>
                                    Description
                                </label>
                                <textarea name='item_description' type='text' className='form-control' onChange={handleChange} placeholder='Enter description' value={formData.item_description} required>

                                </textarea>
                            </div>

                            <div className='mb-3 '>
                                <label className='form-label '>
                                    Quantity
                                </label>
                                <input name='item_quantity' type='text' className='form-control' onChange={handleChange} placeholder='e.g- 2 pcs / large' value={formData.item_quantity} required />
                            </div>

                            <div className='mb-3 '>
                                <label className='form-label '>
                                    &#8377; Price
                                </label>
                                <input name='item_price' type='number' step='.01' className='form-control' onChange={handleChange} value={formData.item_price} placeholder='' required />
                            </div>


                            <div className='mb-3 form-check form-switch'>
                                <input name='is_available' type='checkbox' className='form-check-input' onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })} placeholder='' checked={formData.is_available} />

                                <label className='form-check-label'>
                                    {formData.is_available ? 'Available' : 'Not Available'}
                                </label>
                            </div>



                            <div className='mb-3 '>
                                <label className='form-label '>
                                    Image
                                </label>
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <input name='image' type='file' accept='image/*' className='form-control' onChange={handleFileChange} placeholder='' />

                                    </div>
                                    <div className='col-md-6'>
                                        {formData.image && (
                                            <img src={`${API_URL}${formData.image}`} alt='food-img' className='img-fluid' style={{ maxHeight: '100px', border: '1px solid red', borderRadius: '8px', padding: '4px', maxWidth: '153px' }} />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button type='submit' className='btn btn-primary  mt-3 d-flex justify-content-center align-items-center'>
                                <i className='fas fa-plus me-2'></i>Update Food Item
                            </button>

                        </form>

                    </div>
                    <div className='col-md-4 d-flex align-items-center justify-content-center mt-4 mt-md-0'>
                        <i className='fas fa-utensils ' style={{ fontSize: '180px', color: '#e5e5e5' }}></i>
                    </div>
                </div>
            </div>

        </AdminLayout>
    )
}

export default EditFood