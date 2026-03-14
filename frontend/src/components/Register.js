import React, {useState} from 'react'
import PublicLayout from './PublicLayout'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'

const Register = () => {

    const [formData, setFormData] = useState({
            first_name : '',
            last_name : '',
            email : '',
            mobile : '',
            password : '',
            repeat_password: ''      
        })

    const navigate = useNavigate()

    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev)=> ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()

        const {first_name, last_name, email, mobile, password, repeat_password} = formData

        if(password!==repeat_password){
            return toast.error("password didn't match")
        }
        try {
            const response = await fetch('http://127.0.0.1:8000/api/register/', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({first_name, last_name, email, mobile, password})
        })

        const result = await response.json()

        if(response.status === 201){
            toast.success(result.message || "Successfully Registered")

            setFormData({
                first_name : '',
                last_name : '',
                email : '',
                mobile : '',
                password : '',
                repeat_password: ''
            })
            setTimeout(()=>{
                navigate("/login")
            }, 1000)
            
        }else {
            toast.error(result.message || "Something went wrong")
        }
        } catch (error) {
            console.error(error)
            toast.error("Error connecting to server")
        }
    }

  return (

        <PublicLayout>
            <ToastContainer position='top-right' autoClose={1000}/>


           <div className='container py-5'>
                <div className='row shadow rounded-4'>

                {/* {FORM} */}
                    <div className='col-md-6 p-4'>
                    <h3 className='text-center text-primary mb-4'>
                        <i className='fas fa-user-plus me-2'></i>User Registration
                    </h3>

                    <form onSubmit={handleSubmit}>
                        <div className='mb-3 '>

                            <input  name='first_name' type='text' className='form-control mb-2'  placeholder='First Name' onChange={handleChange} value={formData.first_name} required/>   
                        </div>                       

                        <div className='mb-3 '>

                            <input  name='last_name' type='text' className='form-control'  placeholder='Last Name ' onChange={handleChange} value={formData.last_name} required/> 
                        </div>  

                        <div className='mb-3 '>

                            <input  name='email' type='email' className='form-control'  placeholder='Email' onChange={handleChange} value={formData.email} required/>     
                        </div>

                        <div className='mb-3 '>

                            <input  name='mobile' type='tel' className='form-control'  placeholder='Mobile Number'  onChange={handleChange} value={formData.mobile}required/>     
                        </div>

                        <div className='mb-3 '>

                            <input  name='password' type='password' className='form-control'  placeholder='Password'  onChange={handleChange} value={formData.password}required/>
                        </div>            

                        <div className='mb-3 '>

                            <input  name='repeat_password' type='password' className='form-control'  placeholder='Repeat Password' onChange={handleChange} value={formData.repeat_password} required/>
                        </div>

                        <button className='btn btn-primary mb-3 w-100'>
                            <i className='fas fa-user-check me-2'></i>Register
                        </button>                  
                        
                    </form>
                    </div>

                    {/* IMAGE */}
                    <div className='col-md-6 d-flex align-items-center justify-content-center position-relative'>

                            <i
                                className="fas fa-user-plus mb-4 "
                                style={{
                                fontSize: "250px",
                                opacity: "0.30",
                                color: "#fd650d",
                                WebkitTextStroke: "3px #3217fe",
                                // color: "#0d6efd"
                                }}
                            ></i>

                    </div>
                </div>
            </div> 
        </PublicLayout>

  )
}

export default Register