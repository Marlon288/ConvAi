import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "../css/AdminPage.css";
import "../css/TrainingData.css";
import "../css/Analytics.css";
import Sidebar from "../components/SideBar";
import TrainingData from "../components/TrainingData";
import Analytics from "../components/Analytics";

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
          <Route path="training-data" element={
              <div className="admin-content">
                <TrainingData />
              </div>
          } />
    
          <Route path="analytics" element={
            <div className="analytics-content">
             <Analytics />
            </div>
          } />
        </Routes>
    </div>
  );
}

export default AdminPage;