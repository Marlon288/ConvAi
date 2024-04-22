// Tooltip.js
import React from "react";
import "./../css/Tooltip.css";

const Tooltip = ({ text, x, y }) => {
  return (
    <div className="tooltip" style={{ top: y, left: x }}>
      {text}
    </div>
  );
};

export default Tooltip;