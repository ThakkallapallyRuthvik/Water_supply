import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';                //always use first letter in uppercase
import Register from './Register';
import Map from './map';  
import Navbar from './navbar';
import MapDept from './mapDept';
import MapCust from './mapCust';
import RequestPasswordReset from './requestPasswordReset';
import ResetPassword from './resetPassword';
import Test from './test2';


const App = () => {
  return (
    <div>
      <Router>
        <Routes>

          <Route path="/test" element={<Test />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/map" element={<Map/>}/>
          <Route path="/mapDepartment" element={<MapDept/>} />
          <Route path="/mapCustomer" element={<MapCust/>} />
          <Route path='/requestPasswordReset' element={<RequestPasswordReset/>} />
          <Route path='/resetPassword' element={<ResetPassword/>} />
          {/* Add a default route for the root path */}
          <Route path="/" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

