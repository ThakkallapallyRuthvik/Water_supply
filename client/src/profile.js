// src/components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import user from './img/user.png';
import edit from './img/edit.png';
import inbox from './img/envelope.png';
import settings from './img/settings.png';
import help from './img/question.png';
import logout from './img/log-out.png';
import './Navbar.css';
import bg1 from './bg.jpg';


function App() {

  const [open, setOpen] = useState(false);

  let menuRef = useRef();

  useEffect(() => {
    let handler = (e)=>{
      if(!menuRef.current.contains(e.target)){
        setOpen(false);
        console.log(menuRef.current);
      }      
    };

    document.addEventListener("mousedown", handler);
    

    return() =>{
      document.removeEventListener("mousedown", handler);
    }

  });

  return (
    <div style={{backgroundImage : `url(${bg1})`,  
    backgroundSize: 'cover',
    
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    width:'100vw',
    opacity: '90%'}}>
  <nav className="navbar">
    <div className="App">
      <div className='menu-container' ref={menuRef}>
        <div className='menu-trigger' onClick={()=>{setOpen(!open)}}>
          <img src={user}></img>
        </div>

        <div className={`dropdown-menu ${open? 'active' : 'inactive'}`} >
          <h3>The Kiet<br/><span>Website Designer</span></h3>
          <ul>
            <DropdownItem img = {user} text = {"My Profile"}/>
            <DropdownItem img = {edit} text = {"Edit Profile"}/>
            <DropdownItem img = {inbox} text = {"Inbox"}/>
            <DropdownItem img = {settings} text = {"Settings"}/>
            <DropdownItem img = {help} text = {"Helps"}/>
            <DropdownItem img = {logout} text = {"Logout"}/>
          </ul>
        </div>
      </div>
    </div>
  
  </nav>
 </div>
  );
}

function DropdownItem(props){
  return(
    <li className = 'dropdownItem'>
      <img src={props.img}></img>
      <a> {props.text} </a>
    </li>
  );
}

export default App;

// const Navbar = () => {
//     const [open, setOpen] = useState(false);
//     let menuRef = useRef();
  
//     useEffect(() => {
//       let handler = (e) => {
//         if (!menuRef.current.contains(e.target)) {
//           setOpen(false);
//         }
//       };
  
//       document.addEventListener("mousedown", handler);
  
//       return () => {
//         document.removeEventListener("mousedown", handler);
//       }
//     });
  
//     return (
//       <nav className="navbar">
//         <div className='menu-container' ref={menuRef}>
//           <div className='menu-trigger' onClick={() => { setOpen(!open) }}>
//             <img src={user} alt="User Icon"></img>
//           </div>
  
//           <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`} >
//             <h3>The Kiet<br /><span>Website Designer</span></h3>
//             <ul>
//               <DropdownItem img={user} text={"My Profile"} />
//               <DropdownItem img={edit} text={"Edit Profile"} />
//               <DropdownItem img={inbox} text={"Inbox"} />
//               <DropdownItem img={settings} text={"Settings"} />
//               <DropdownItem img={help} text={"Helps"} />
//               <DropdownItem img={logout} text={"Logout"} />
//             </ul>
//           </div>
//         </div>
//       </nav>
//     );
//   };
  
//   function DropdownItem(props) {
//     return (
//       <li className='dropdownItem'>
//         <img src={props.img} alt={`${props.text} Icon`}></img>
//         <a>{props.text}</a>
//       </li>
//     );
//   }
  
//   export default Navbar;
  