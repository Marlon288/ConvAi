// UsageGraph.js
import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import "./../css/UsageGraph.css";

const UsageGraph = ({ selectedLocation }) => {
  const [usageData, setUsageData] = useState([]);

  useEffect(() => {
    fetchUsageData();
  }, [selectedLocation]);

  const fetchUsageData = async () => {
    console.log(selectedLocation);
    try {
      const response = await fetch('http://localhost:9000/api/protected/analytics/usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ location: selectedLocation }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      setUsageData(Object.entries(data).map(([date, count]) => ({ date, count })));
    } catch (error) {
      console.error("Error fetching usage data:", error);
    }
  };

 
  return (
    <div className="usage-graph-card">
      <h3>Usage Over Time</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={usageData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
          <YAxis tickFormatter={(count) => `${count} users`} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} dot={{ r: 6, fill: '#ffffff', stroke: '#8884d8', strokeWidth: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageGraph;