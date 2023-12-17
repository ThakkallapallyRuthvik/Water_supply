import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';                //always use first letter in uppercase
import Register from './Register';
import Map from './map';  
// import './App.css';


const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/map" element={<Map/>}/>
          {/* Add a default route for the root path */}
          <Route path="/" element={<Navigate to="/register" />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

