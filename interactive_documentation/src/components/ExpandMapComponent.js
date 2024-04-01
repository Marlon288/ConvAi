import React from 'react';
import './../css/ExpandMap.css';

const ExpandMap= ({ isChatOpen, setIsChatOpen }) => {

  return (
    <div className={`btn-container ${isChatOpen ? 'visible' : 'hidden'}`}>
        <svg onClick={() => setIsChatOpen(false)} viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg"><g strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14 10L21 3M21 3H16.5M21 3V7.5M10 14L3 21M3 21H7.5M3 21L3 16.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
    </div>
  );
};

export default ExpandMap;
