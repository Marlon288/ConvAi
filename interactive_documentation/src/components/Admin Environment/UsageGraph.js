// UsageGraph.js
import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Label, ReferenceLine} from "recharts";

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

 
  const formatDate = (date) => {
    const [year, month] = date.split("-");
    return `${month}/${year}`;
  };

  const sortedUsageData = usageData.sort((a, b) => new Date(a.date) - new Date(b.date));

  const calculateAveragePromptsPerDay = () => {
    const totalPrompts = usageData.reduce((sum, entry) => sum + entry.count, 0);
    const totalDays = usageData.length;
    return totalDays > 0 ? totalPrompts / totalDays : 0;
  };

  const averagePromptsPerDay = calculateAveragePromptsPerDay();

  return (
    <div>
      <h3>Usage Rate</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={sortedUsageData} margin={{ top: 10, right: 10, bottom: 10, left: 15 }}>
          <XAxis dataKey="date" tickFormatter={formatDate} />
          <YAxis label={{ value: "Prompts", position: "left", angle: -90, offset: 0 }} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          {averagePromptsPerDay && !isNaN(averagePromptsPerDay) && (
          <ReferenceLine y={averagePromptsPerDay} stroke="red" strokeDasharray="3 3">
            <Label position="top" fill="red" fontSize={12}>
              {`Average: ${averagePromptsPerDay.toFixed(2)}`}
            </Label>
          </ReferenceLine>
        )}
          <Line type="monotone" dataKey="count" name="Prompts per Day" stroke="#8884d8" strokeWidth={2} dot={{ r: 6, fill: '#ffffff', stroke: '#8884d8', strokeWidth: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageGraph;