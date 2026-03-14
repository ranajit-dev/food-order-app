import React, {useState} from 'react'
import PublicLayout from './PublicLayout'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa'

const Login = () => {

const [formData, setFormData] = useState({
            emailcontact : '',
            password : '',
      
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

        const { emailcontact,  password} = formData

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({ emailcontact, password})
        })

        const result = await response.json()

        if(response.status === 200){
            toast.success(result.message || "Login Successful")

            localStorage.setItem("userId", result.user.id)
            localStorage.setItem("userName", result.user.name)

            setFormData({
                emailcontact : '',
                password : '',
            })
            setTimeout(()=>{
                navigate("/")
            }, 1500)

            
        }else {
            toast.error(result.message || "Invalid Credential")
        }
        } catch (error) {
            console.error(error)
            toast.error("Error connecting to server")
        }
    }


  return (
    <PublicLayout>
            <ToastContainer position='top-right' autoClose={1500}/>


           <div className='container py-5'>
                <div className='row align-items-center'>

                {/* {FORM} */}
                    <div className='col-md-6 p-4'>
                    <h3 className='text-center text-primary mb-4 d-flex align-items-center justify-content-center'>
                        <FaSignInAlt className='me-2 '/>User Login
                    </h3>

                    <form className='card p-4 shadow' onSubmit={handleSubmit}>

                        <div className='mb-3 '>
                            <input  name='emailcontact' type='text' className='form-control'  placeholder='Email or Mobile Number' onChange={handleChange} value={formData.emailcontact} required/>     
                        </div>

                        <div className='mb-3 '>
                            <input  name='password' type='password' className='form-control'  placeholder='Password'  onChange={handleChange} value={formData.password}required/>
                        </div>  

                        <div className='d-flex justify-content-between'>
                        <button className='btn btn-primary mb-3 '>
                            <FaSignInAlt className='me-2'/>Login
                        </button>   

                        <button className='btn btn-outline-secondary mb-3' onClick={()=>navigate("/register")}>
                            <FaUserPlus className='me-2'/>Register
                        </button> 
                        </div>                 
                        
                    </form>
                    </div>

                    {/* IMAGE */}
                    <div className='col-md-6 d-flex align-items-center justify-content-center position-relative'>

                            <i
                                className="fas fa-user-check mb-3 pt-5"
                                style={{
                                fontSize: "225px",
                                opacity: "0.30",
                                color: "#4654e7",
                                WebkitTextStroke: "3px #f6771d",
                                // color: "#0d6efd"
                                }}
                            ></i>

                    </div>
                </div>
            </div> 
        </PublicLayout>
  )
}

export default Login