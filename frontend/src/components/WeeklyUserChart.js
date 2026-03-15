import React, {useState, useEffect} from 'react'
import  {LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer} from 'recharts';
import { API_URL } from "../config";


const WeeklyUserChart = () => {
    const [data, setData] = useState([]);
    
      useEffect(() => {
      
          fetch(`${API_URL}/api/weekly_user_registrations/`)
            .then(res => res.json())
            .then(data => {
              setData(data)
      
            })
      
        }, [])
        
  return (
    <div className='card p-3 shadow'>
          <h5 className='text--primary'>Weekly New Users</h5>
          <ResponsiveContainer width="100%" height="300">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week"/>
              <YAxis />
              <Tooltip/>
              <Line type='monotone' dataKey="newUsers" fill="#00BFFF"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
  )
}

export default WeeklyUserChart