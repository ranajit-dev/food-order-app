import React, { useState, useEffect, useRef } from 'react'
import AdminLayout from '../components/AdminLayout'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaPlusCircle } from 'react-icons/fa'


const AddFood = () => {

    const [categories, setCategories] = useState([])

    // file input reference to manually clear it
    const fileInputRef = useRef(null)

    const [formData, setFormData] = useState({
        category: '',
        item_name: '',
        item_price: '',
        item_description: '',
        image: null,
        item_quantity: ''
    })

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/categories/')
            .then(res => res.json())
            .then(data => {
                setCategories(data)
            })
    }, [])

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

        data.append("category", formData.category)
        data.append("item_name", formData.item_name)
        data.append("item_description", formData.item_description)
        data.append("item_quantity", formData.item_quantity)
        data.append("item_price", formData.item_price)
        data.append("image", formData.image)

        try {
            const response = await fetch('http://127.0.0.1:8000/api/add-food-item/', {
                method: 'POST',
                body: data
            })

            const result = await response.json()

            if (response.status === 201) {
                toast.success(result.message)

                setFormData({
                    category: '',
                    item_name: '',
                    item_price: '',
                    item_description: '',
                    image: null,
                    item_quantity: ''
                })
                // clears actual file input from DOM
                fileInputRef.current.value = ""

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

            <ToastContainer position='top-right' autoClose={2000} />
            <div className='container'>
                <div className='row '>
                    <div className='col-md-8'>
                        <div className='shadow-sm rounded d-flex align-items-center mb-3'>
                            <h4 className='mb-4  '>
                                <FaPlusCircle className='text-primary me-2 ms-1 ' />Add Food Item
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
                                <input name='item_price' type='number' className='form-control' onChange={handleChange} value={formData.item_price} placeholder='' required />
                            </div>

                            <div className='mb-3 '>
                                <label className='form-label '>
                                    Image
                                </label>
                                <input name='image' ref={fileInputRef} type='file' accept='image/*' className='form-control' onChange={handleFileChange} placeholder='' />
                            </div>

                            <button type='submit' className='btn btn-primary  mt-3 d-flex justify-content-center align-items-center'>
                                <i className='fas fa-plus me-2'></i>Add Food Item
                            </button>

                        </form>

                    </div>
                    <div className='col-md-4 d-flex align-items-center justify-content-center'>
                        <i className='fas fa-utensils ' style={{ fontSize: '180px', color: '#e5e5e5' }}></i>
                    </div>
                </div>
            </div>

        </AdminLayout>
    )
}

export default AddFood