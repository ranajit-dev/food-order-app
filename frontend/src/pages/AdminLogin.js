import React, {useState} from 'react'
import {FaUser, FaLock, FaSignInAlt} from "react-icons/fa"
import "../styles/admin.css"
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PublicLayout from '../components/PublicLayout'

const AdminLogin = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (e)=>{
        e.preventDefault();

        const response = await fetch('http://127.0.0.1:8000/api/admin-login/', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({username, password})
        })

        const data = await response.json()
        if(response.status ===200){
            toast.success(data.message)
            localStorage.setItem("adminUser", username)
            setTimeout(()=>{
                window.location.href = '/admin-dashboard'
            }, 2000)
        }else {
            toast.error(data.message)
        }
    }

  return (
    <PublicLayout>

    <div className='d-flex justify-content-center align-items-center vh-100 ' style={{backgroundImage:"url('/images/adminbg.jpg')", backgroundSize:"cover"}}>
        <div className="card p-4 shadow-lg w-100 " style={{maxWidth: "400px"}}>
            <h4 className='text-center mb-4 d-flex align-items-center justify-content-center'>
                <FaUser className='me-2 icon-fix'/>Admin Login
            </h4>
            <form onSubmit={handleLogin}>
                <div className='mb-3 '>
                    <label className='form-label d-flex align-items-center'>
                        <FaUser className='me-2 icon-fix'/>UserName
                    </label>
                    <input type='text' className='form-control' onChange={(e)=>setUsername(e.target.value)} value={username} placeholder='Admin Username' required/>                  
                </div>
                <div className='mb-3'>
                    <label className='form-label d-flex align-items-center'>
                        <FaLock className='me-2 icon-fix'/>Password
                    </label>
                    <input type='password' className='form-control' onChange={(e)=>setPassword(e.target.value)} value={password} placeholder='Enter Password' required/>                  
                </div>
                <button type='submit' className='btn btn-primary w-100 mt-3 d-flex justify-content-center align-items-center'>
                    <FaSignInAlt className='me-2 icon-fix'/>Admin Login
                </button>
            </form>
        </div>
        <ToastContainer position='top-right'  autoClose={2000}/>
    </div>
    </PublicLayout>
  )
}

export default AdminLogin