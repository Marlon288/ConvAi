import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "../css/AdminPage.css";
import "../css/TrainingData.css";
import "../css/Analytics.css";
import Sidebar from "../components/Admin Environment/SideBar";
import TrainingData from "../components/Admin Environment/TrainingData";
import Analytics from "../components/Admin Environment/Analytics";

function AdminPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="admin-container">
      <Sidebar onLogout={handleLogout} />
      
        <Routes>
        <Route path="analytics" element={
            <div className="analytics-content">
             <Analytics />
            </div>
          } />
          <Route path="training-data" element={
              <div className="admin-content">
                <TrainingData />
              </div>
          } />
    
          
        </Routes>
    </div>
  );
}

export default AdminPage;