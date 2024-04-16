// SideBar.js
import React from "react";
import { Link } from "react-router-dom";
import "../css/SideBar.css";

const Sidebar = ({ onLogout }) => {

    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    return (
      <div className="sidebar">
        <div className="sidebar-title">Dashboard</div>
        <nav className="nav-element">
          <ul className="list">
          <Link to="/admin/training-data" className="list-element"><li>Training Data</li></Link>
          <Link to="/admin/analytics" className="list-element"><li>Analytics</li></Link>
          </ul>
        </nav>
        <div className="user-info">
         <svg onClick={onLogout} className="logout-icon" height="200px" width="200px"  viewBox="0 0 384.971 384.971"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g id="Sign_Out"> <path d="M180.455,360.91H24.061V24.061h156.394c6.641,0,12.03-5.39,12.03-12.03s-5.39-12.03-12.03-12.03H12.03 C5.39,0.001,0,5.39,0,12.031V372.94c0,6.641,5.39,12.03,12.03,12.03h168.424c6.641,0,12.03-5.39,12.03-12.03 C192.485,366.299,187.095,360.91,180.455,360.91z"></path> <path d="M381.481,184.088l-83.009-84.2c-4.704-4.752-12.319-4.74-17.011,0c-4.704,4.74-4.704,12.439,0,17.179l62.558,63.46H96.279 c-6.641,0-12.03,5.438-12.03,12.151c0,6.713,5.39,12.151,12.03,12.151h247.74l-62.558,63.46c-4.704,4.752-4.704,12.439,0,17.179 c4.704,4.752,12.319,4.752,17.011,0l82.997-84.2C386.113,196.588,386.161,188.756,381.481,184.088z"></path> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </g></svg>        
          <span className="role">Role: {role}</span>
        </div>
      </div>
    );
  };

export default Sidebar;