import React from 'react';
import './App.css';

function App() {
  return (
    <Navbar>
      <NavItem icon="a" />
      <NavItem icon="b" />
      <NavItem icon="c" />
      <NavItem icon="d" />
    </Navbar>
  );
}

function Navbar(props) {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">{props.children}</ul>
    </nav>
  );
}

function NavItem(props) {
    const handleClick = () => {
        if (props.onClick) {
          props.onClick();
        }
      };
  return (
    <li className="nav-item">
      <a href="#" className="icon-button" onClick={handleClick}>
        {props.icon}
      </a>
    </li>
  );
}

export default App;
