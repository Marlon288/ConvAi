import React, { useState, useEffect} from 'react';
import './css/App.css';
import MapComponent from './MapComponent';
import ChatComponent from './ChatComponent';
import ListComponent from './ListComponent';
import LoginPage from './LoginPage';
import ProtectedRoute from './ProtectedRoute';
import AdminPage from './AdminPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';





const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [location, setLocation] = useState([]);
  const [locations, setLocations] = useState([]);

  const fetchLocations = () => {
    fetch("http://localhost:9000/api/getLocations")
    .then(response => response.json())
    .then(data => setLocations(data))
    .catch(error => console.error('Error fetching locations:', error));
  };

  useEffect(() => {
    fetchLocations();
  }, []);



return (
  <Router>
    <div className="app-container">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={
          <>
            <MapComponent locations={locations} isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} setLocation={setLocation} />
            {isChatOpen &&
              <>
                <ListComponent locations={locations} setLocation={setLocation} />
                <div className='chat-wrapper'>
                  <ChatComponent location={location} />
                </div>
              </>
            }
          </>
        } />
      </Routes>
    </div>
  </Router>
);
};


export default App;

//<MapComponent isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen}/>