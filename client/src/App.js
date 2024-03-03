import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';                //always use first letter in uppercase
import Register from './Register';
import Map from './map';  
import MapDept from './mapDept';
import MapCust from './mapCust';
import MapGuest from './mapGuest';
import RequestPasswordReset from './requestReset';
import ResetPassword from './resetPassword';
import Home from './newHome'
import Reports from './reports'

const App = () => {
  return (
    <div>
      <Router>
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/map" element={<Map/>}/>
          <Route path="/mapDepartment" element={<MapDept/>} />
          <Route path="/mapCustomer" element={<MapCust/>} />
          <Route path="/mapGuest" element={<MapGuest/>} />
          <Route path="/requestPasswordReset" element={<RequestPasswordReset/>} />
          <Route path="/resetPassword" element={<ResetPassword/>} />
          {/* <Route path="newreg" element={<NewReg />} /> */}
          <Route path="/home" element={<Home />} />
          <Route path="/reports" element={<Reports />} />
          {/* Add a default route for the root path */}
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

