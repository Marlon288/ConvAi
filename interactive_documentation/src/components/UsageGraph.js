// UsageGraph.js
import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./../css/UsageGraph.css";

const UsageGraph = ({ selectedLocation }) => {
  const [usageData, setUsageData] = useState([]);

  useEffect(() => {
    fetchUsageData();
  }, [selectedLocation]);

  const fetchUsageData = async () => {
    try {
      const response = await fetch('/api/protected/analytics/usage', {
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
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={usageData}>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageGraph;