import React, {useState, useEffect} from 'react'
import  {BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer} from 'recharts';
import { API_URL } from "../config";

const WeeklySalesChart = () => {
    const [data, setData] = useState([]);
    
      useEffect(() => {
      
          fetch(`${API_URL}/api/weekly_sales_summary/`)
            .then(res => res.json())
            .then(data => {
              setData(data)
      
            })
      
        }, [])
  return (
    <div className='card p-3 shadow'>
          <h5 className='text--primary'>Weekly Sales</h5>
          <ResponsiveContainer width="100%" height="300">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week"/>
              <YAxis />
              <Tooltip/>
              <Bar dataKey="sales" fill="#198754"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
  )
}

export default WeeklySalesChart