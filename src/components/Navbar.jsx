// src/components/Navbar.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../style/style.css';
import Logo from '../assets/Logo.png';
// --- CHANGE 1: Import NavLink instead of Link ---
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the AuthContext
import { useNavigate } from 'react-router-dom';
import { Link} from 'react-router-dom'; // Import Link for navigation

const Navbar = () => {

 const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <nav className="navbar navbar-expand-lg fixed-top mb-5 ">
      <div className="container-fluid">
        <Link className="navbar-brand me-auto d-flex align-items-center" to="/">
          <img
            src={Logo}
            alt="Logo"
            width="66"
            height="70"
            className="d-inline-block align-top me-2"
          />
          <span>Centre AAH</span>
        </Link>
     
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="offcanvas offcanvas-end custom-offcanvas"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title bg-gray" id="offcanvasNavbarLabel">Menu</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>

          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-center flex-grow-1 pe-3">
        
              <li className="nav-item">
                <NavLink className="nav-link mx-lg-2" end to="/">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link mx-lg-2" to="/Programs">Programs</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link mx-lg-2" to="/Apropos">About</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link mx-lg-2" to="/contact">Contact</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link mx-lg-2" to="/consulting">Consulting</NavLink>
              </li>
            </ul>
          </div>
        </div>
        
        {/* I am changing this back to a <Link> because it is an action, not a navigation state. */}
       
        {user ? (
          <div className="d-flex align-items-center">
<Link to="/dashboard" className="me-3 text-decoration-none text-dark">
        👤 {user.nom}
    </Link>
            <button onClick={handleLogout} className="Logout-button">Logout</button>
          </div>
        ) : (
          <NavLink to="/Login" className='login-button'>Login</NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;