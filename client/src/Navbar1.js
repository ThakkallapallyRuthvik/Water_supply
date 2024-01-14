// src/components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    }
  });

  return (
    <nav className="navbar">
      <div className='menu-container' ref={menuRef}>
        <div className='menu-trigger' onClick={() => { setOpen(!open) }}>
          <img src={user} alt="User Icon"></img>
        </div>

        <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`} >
          <h3>The Kiet<br /><span>Website Designer</span></h3>
          <ul>
            <DropdownItem img={user} text={"My Profile"} />
            <DropdownItem img={edit} text={"Edit Profile"} />
            <DropdownItem img={inbox} text={"Inbox"} />
            <DropdownItem img={settings} text={"Settings"} />
            <DropdownItem img={help} text={"Helps"} />
            <DropdownItem img={logout} text={"Logout"} />
          </ul>
        </div>
      </div>
    </nav>
  );
};

function DropdownItem(props) {
  return (
    <li className='dropdownItem'>
      <img src={props.img} alt={`${props.text} Icon`}></img>
      <a>{props.text}</a>
    </li>
  );
}

export default Navbar;
