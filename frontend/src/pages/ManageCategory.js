import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { Link, useNavigate } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ManageCategory = () => {

    const [categories, setCategories] = useState([])
    const [allcategories, setAllCategories] = useState([])

    const adminUser = localStorage.getItem('adminUser')
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 5;

    useEffect(() => {
        if (!adminUser) {
            toast.info("Please login first", {
                onClose: () => navigate("/admin-login")
            });
            return;
        }


        fetch('http://127.0.0.1:8000/api/categories/')
            .then(res => res.json())
            .then(data => {
                setCategories(data)
                setAllCategories(data)
            })
    }, [adminUser, navigate])

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

    const handleSearch = (s) => {
        const keyword = s.trim().toLowerCase()
        if (!keyword) {
            setCategories(allcategories)
        } else {
            const filtered = allcategories.filter((c) => c.category_name.toLowerCase().includes(keyword)) //c -> category 
            setCategories(filtered)

        }
        setCurrentPage(1);
    }

    const handleDelete = (id) => {

        if (window.confirm("Are you sure, you want to delete this category?")) {
            fetch(`http://127.0.0.1:8000/api/category/${id}/`, {
                method: 'DELETE',

            })
                .then(res => res.json())
                .then(data => {
                    toast.success(data.message || "Deleted successfully");

                    // setCategories(categories.filter(cat => cat.id !== id));
                    // setAllCategories(categories.filter(cat => cat.id !== id));

                    setCategories(prev => prev.filter(cat => cat.id !== id));
                    setAllCategories(prev => prev.filter(cat => cat.id !== id));
                })
                .catch(() => toast.error("Delete failed"));
        }
    }

    //Pagination Logic      //     1 * 5 , 2 * 5
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage; // 5 - 5 =0 , 10-5 =5

    const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory)

    const totalPages = Math.ceil(categories.length / categoriesPerPage);

    const handlePageChange = (page) => setCurrentPage(page);


    return (
        <AdminLayout>
            <ToastContainer position='top-right' autoClose={1500} />
            <div className='container'>
                <h3 className='text-center text-primary mb-4'>
                    <i className='fas fa-list-alt me-1'></i>Manage Food Category
                </h3>
                <h5 className='text-end text-muted'>
                    <i className='fas fa-database me-1'></i>Total Categories
                    <span className='ms-2 badge bg-success '>{categories.length}</span>
                </h5>

                {/* Search BAR */}
                <div className='mb-3 d-flex justify-content-between'>
                    <input type='text' className='form-control w-50' placeholder='Search category name ' onChange={(e) => handleSearch(e.target.value)}></input>

                    {/* CSV FILE */}
                    <CSVLink filename={'category_list.csv'} data={categories} className='btn btn-outline-success '>
                        <i className='fas fa-file-csv me-1'></i><b>Export to CSV</b>
                    </CSVLink>
                </div>
                <div className="table-responsive">
                    <table className='table table-bordered table-hover table-striped'>
                        <thead className='table-dark'>
                            <tr>
                                <th>S.No</th>
                                <th>Category Name</th>
                                <th>Creation Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCategories.map((cat, index) => ( //cat = category
                                <tr key={cat.id}>
                                    <td>{indexOfFirstCategory  + index + 1}</td>
                                    <td>{cat.category_name}</td>
                                    <td>{formatDateTime(cat.creation_date)}
                                    </td>
                                    <td>
                                        <div className="d-flex flex-column flex-md-row gap-2">
                                            <Link
                                                to={`/edit-category/${cat.id}`}
                                                className="btn btn-sm btn-primary w-100 w-md-auto"
                                            >
                                                <i className="fas fa-edit me-1"></i>
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="btn btn-sm btn-danger w-100  w-md-auto"
                                            >
                                                <i className="fas fa-trash-alt me-1"></i>
                                                Delete
                                            </button>
                                        </div>


                                        {/* <Link to={`/edit-category/${cat.id}`} className='btn btn-sm btn-primary'> <i className='fas fa-edit me-1 '></i>Edit </Link>

                                        <button onClick={() => handleDelete(cat.id)} className='btn btn-sm btn-danger ms-2'> <i className='fas fa-trash-alt me-1 '></i>Delete </button> */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className='mt-3 d-flex justify-content-center'>
                            <nav>
                                <ul className='pagination'>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    )}

                </div>
            </div>
        </AdminLayout>
    )
}

export default ManageCategory