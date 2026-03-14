import React, { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaPlusCircle } from 'react-icons/fa'

const AddCategory = () => {

    const [categoryName, setcategoryName] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:8000/api/add-category/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category_name: categoryName })
            })

            const data = await response.json()
            if (response.status === 201) {
                toast.success(data.message)

            } else {
                toast.error("Something went wrong")
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
                <div className='row'>
                    <div className='col-md-8'>
                        <div className='shadow-sm rounded d-flex align-items-center mb-3'>
                            <h4 className='mb-4  '>
                                <FaPlusCircle className='text-primary me-2' />Add category
                            </h4>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className='mb-3 '>
                                <label className='form-label '>
                                    Category Name
                                </label>
                                <input type='text' className='form-control' onChange={(e) => setcategoryName(e.target.value)} value={categoryName} placeholder='Enter category Name' required />
                            </div>

                            <button type='submit' className='btn btn-primary  mt-3 d-flex justify-content-center align-items-center'>
                                <i className='fas fa-plus me-2'></i>Add Category
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

export default AddCategory