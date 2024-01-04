import React, { useState, useEffect} from 'react';
import './css/App.css';
import MapComponent from './MapComponent';
import ChatComponent from './ChatComponent';
import ListComponent from './ListComponent';



const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [location, setLocation] = useState("");
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
    <div className="app-container">
      <MapComponent locations={locations} isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} setLocation={setLocation}></MapComponent>
      {isChatOpen &&
        <>
        <ListComponent locations={locations}></ListComponent>
        <div className='chat-wrapper' location={location}>
          <ChatComponent></ChatComponent>
        </div>
        </>
      }
    </div>
  );
};

export default App;

//<MapComponent isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen}/>