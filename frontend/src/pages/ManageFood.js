import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { Link } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ManageFood = () => {

    const [foods, setFoods] = useState([])
    const [allfoods, setAllFoods] = useState([])

    const [currentPage, setCurrentPage] = useState(1);
        const foodsPerPage = 5;

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/foods/')
            .then(res => res.json())
            .then(data => {
                setFoods(data)
                setAllFoods(data)
            })
    }, [])



    const handleSearch = (s) => {
        const keyword = s.toLowerCase()
        if (!keyword) {
            setFoods(allfoods)
        } else {
            const filtered = allfoods.filter((c) => c.item_name.toLowerCase().includes(keyword)) //c -> category 
            setFoods(filtered)

            setCurrentPage(1)
        }
    }
    const handleDelete = (id) => {

        if (window.confirm("Are you sure, you want to delete this food item?")) {
            fetch(`http://127.0.0.1:8000/api/delete-food/${id}/`, {
                method: 'DELETE',

            })
                .then(res => res.json())
                .then(data => {
                    toast.success(data.message || "Deleted successfully");

                    setFoods(foods.filter(food => food.id !== id));
                    setAllFoods(foods.filter(food => food.id !== id));

                    // setCategories(prev => prev.filter(food => food.id !== id));
                    // setAllCategories(prev => prev.filter(food => food.id !== id));
                })
                .catch(() => toast.error("Delete failed"));
        }
    }

    //Pagination Logic      //     1    *    9 
    const indexOfLastFood = currentPage * foodsPerPage;
    const indexOfFirstFood = indexOfLastFood - foodsPerPage; // 9 - 9 =0

    const currentFoods = foods.slice(indexOfFirstFood, indexOfLastFood)

    const totalPages = Math.ceil(foods.length / foodsPerPage);

    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <AdminLayout>
            <ToastContainer position='top-right' autoClose={1500} />
            <div className='container'>
                <h3 className='text-center text-primary b=mb-4'>
                    <i className='fas fa-list-alt me-1'></i>Manage Food Item
                </h3>
                <h5 className='text-end text-muted'>
                    <i className='fas fa-database me-1'></i>Total Food Items
                    <span className='ms-2 badge bg-success '>{foods.length}</span>
                </h5>

                {/* Search BAR */}
                <div className='mb-3 d-flex justify-content-between'>
                    <input type='text' className='form-control w-50' placeholder='Search food item' onChange={(e) => handleSearch(e.target.value)}></input>

                    {/* CSV FILE */}
                    <CSVLink filename={'food_list.csv'} data={foods} className='btn btn-outline-success '>
                        <i className='fas fa-file-csv me-1'></i><b>Export to CSV</b>
                    </CSVLink>
                </div>

                <table className='table table-bordered table-hover table-stripped'>
                    <thead className='table-dark'>
                        <tr>
                            <th>S.No</th>
                            <th>Category Name</th>
                            <th>Food Item Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentFoods.map((food, index) => ( //cat = category
                            <tr key={food.id}>
                                <td>{indexOfFirstFood + index + 1}</td>
                                <td>{food.category_name}</td>
                                <td>{food.item_name}</td>
                                <td>
                                    {/* <Link to={`/edit-food/${food.id}`} className='btn btn-sm btn-primary'>
                                        <i className='fas fa-edit me-1 '></i>Edit
                                    </Link>

                                    <button onClick={() => handleDelete(food.id)} className='btn btn-sm btn-danger ms-2'>
                                        <i className='fas fa-trash-alt me-1 '></i>Delete
                                    </button> */}

                                    <div className="d-flex flex-column flex-md-row gap-2">
                                        <Link
                                            to={`/edit-food/${food.id}`}
                                            className="btn btn-sm btn-primary w-100 w-md-auto"
                                        >
                                            <i className="fas fa-edit me-1"></i>
                                            Edit
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(food.id)}
                                            className="btn btn-sm btn-danger w-100  w-md-auto"
                                        >
                                            <i className="fas fa-trash-alt me-1"></i>
                                            Delete
                                        </button>
                                    </div>

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
        </AdminLayout>
    )
}

export default ManageFood