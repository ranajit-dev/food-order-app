import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import {  useNavigate } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { API_URL } from "../config";

const ManageUser = () => {
    const [users, setUsers] = useState([])
    const [allUsers, setAllUsers] = useState([])

    const adminUser = localStorage.getItem('adminUser')
    const navigate = useNavigate();

    useEffect(() => {
        if (!adminUser) {
            toast.info("Please login first", {
                onClose: () => navigate("/admin-login")
            });
            return;
        }

        fetch(`${API_URL}/api/users/`)
            .then(res => res.json())
            .then(data => {
                setUsers(data)
                setAllUsers(data)
            })
    }, [])



    const handleSearch = (s) => {
        const keyword = s.trim().toLowerCase()

        if (!keyword) {
            setUsers(allUsers)
        } else {
            const filtered = allUsers.filter((u) =>
                u.first_name.toLowerCase().includes(keyword) ||
                u.last_name.toLowerCase().includes(keyword) ||
                u.email.toLowerCase().includes(keyword)

            ); //u -> User 

            setUsers(filtered);

        }
    }

    const handleDelete = (id) => {

        if (window.confirm("Are you sure, you want to delete this user?")) {
            fetch(`${API_URL}/api/delete-user/${id}/`, {
                method: 'DELETE',

            })
                .then(res => res.json())
                .then(data => {
                    toast.success(data.message || "Deleted successfully");

                    // setCategories(categories.filter(cat => cat.id !== id));
                    // setAllCategories(categories.filter(cat => cat.id !== id));

                    setUsers(prev => prev.filter(user => user.id !== id));
                    setAllUsers(prev => prev.filter(user => user.id !== id));
                })
                .catch(() => toast.error("Delete failed"));
        }
    }

    return (
        <AdminLayout>
            <ToastContainer position='top-right' autoClose={1500} />
            <div className='container'>
                <h3 className='text-center text-primary mb-4'>
                    <i className='fas fa-list-alt me-1'></i>User List
                </h3>
                <h5 className='text-end text-muted'>
                    <i className='fas fa-database me-1'></i>Total Users
                    <span className='ms-2 badge bg-success '>{users.length}</span>
                </h5>

                {/* Search BAR */}
                <div className='mb-3 d-flex justify-content-between'>
                    <input type='text' className='form-control w-50' placeholder='Search by name or email ' onChange={(e) => handleSearch(e.target.value)}></input>

                    {/* CSV FILE */}
                    <CSVLink filename={'user_list.csv'} data={users} className='btn btn-outline-success '>
                        <i className='fas fa-file-csv me-1'></i><b>Export to CSV</b>
                    </CSVLink>
                </div>
                <div className="table-responsive">
                    <table className='table table-bordered table-hover table-striped'>
                        <thead className='table-dark'>
                            <tr>
                                <th>S.No</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Mobile</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user, index) => ( 
                                    <tr key={user.id}>
                                        <td>{index + 1}</td>
                                        <td>{user.first_name}</td>
                                        <td>{user.last_name}</td>
                                        <td>{user.mobile}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <button onClick={() => handleDelete(user.id)} className='btn btn-sm btn-danger ms-2'> <i className='fas fa-trash-alt me-1 '></i>Delete </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <td colSpan='6' className='text-center text-muted'>No user found</td>
                            )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    )
}

export default ManageUser