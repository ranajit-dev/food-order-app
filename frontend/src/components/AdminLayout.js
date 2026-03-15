import React, { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import "../styles/admin.css"
import { API_URL } from "../config";


const AdminLayout = ({ children }) => {

    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [newOrders, setNewOrders] = useState(0)

    useEffect(() => {

        fetch(`${API_URL}/api/dashboard_metrics/`)
            .then(res => res.json())
            .then(data => {
                setNewOrders(data.new_orders)

            })

    }, [])

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarOpen(false) //mobile view
            } else {
                setSidebarOpen(true) //desktop view
            }
        }
        handleResize() //initial check

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, []);

    const toggleSidebar = () => setSidebarOpen(prev => !prev) //prev = previous

    return (
        <div className='d-flex '>
            {sidebarOpen && <AdminSidebar />}

            <div id='page-content-wraper' className={`flex-grow-1 ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}>
                <AdminHeader toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} newOrders ={newOrders} />
                <div className='container-fluid mt-4'>
                    {children}

                </div>
            </div>
        </div>
    )
}

export default AdminLayout