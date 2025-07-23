// src/components/Sidebar.js

import React from 'react';
import { NavLink } from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
// Nous créerons ce fichier juste après

// Importez les icônes depuis React Icons (Bootstrap Icons est un bon choix)
import { 
    BsGrid1X2Fill, 
    BsPeopleFill, 
    BsBookFill, 
    BsStack, 
    BsClockFill, 
    BsCreditCardFill,
    BsFileTextFill,
    BsPersonVcardFill,
    BsBoxArrowRight,
    BsThreeDots,
    BsMortarboardFill // Une icône pour le logo
} from 'react-icons/bs';

const Sidebar = () => {
    const {user,logout}=useAuth();
    // Pour éviter la répétition, nous pouvons mapper sur une liste de liens
    const navLinks = [
        { to: ".", icon: <BsGrid1X2Fill />, text: "Dashboard" },
        { to: "students", icon: <BsPeopleFill />, text: "Students" },
        { to: "/courses", icon: <BsBookFill />, text: "Courses" },
        { to: "/modules", icon: <BsStack />, text: "Modules" },
        { to: "/sessions", icon: <BsClockFill />, text: "Sessions" },
        { to: "/payments", icon: <BsCreditCardFill />, text: "Payments" },
        { to: "/inscriptions", icon: <BsFileTextFill />, text: "Inscriptions" },
        { to: "/admins", icon: <BsPersonVcardFill />, text: "Admins" },
    ];
const logoutfun=()=>{
    logout();
    

}
    return (
        <aside className="sidebar vh-100 shadow">
            <div className="d-flex flex-column h-100 p-3">

                {/* Sidebar Header */}
                <div className="sidebar-header d-flex align-items-center justify-content-between mb-4">
                    <div className='d-flex align-items-center gap-2'>
                        <BsMortarboardFill size={30} className="text-primary" />
                        <span className="fs-5 fw-bold">ProTrain Hub</span>
                    </div>
                    <BsThreeDots size={20} className="text-muted"/>
                </div>

                {/* Navigation Links */}
                <ul className="nav nav-pills flex-column mb-auto">
                    {navLinks.map((link) => (
                        <li className="nav-item" key={link.to}>
                            {/* NavLink est comme un <Link> mais il sait s'il est actif */}
                            <NavLink 
                                to={link.to} 
                                className="nav-link d-flex align-items-center gap-3"
                                end
                            >
                                {link.icon}
                                <span>{link.text}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Logout Link (pushed to the bottom) */}
                <div className="sidebar-footer mt-auto">
                    <hr className="text-muted" />
                    <button onClick={logoutfun}  className="nav-link d-flex align-items-center gap-3">
                        <BsBoxArrowRight />
                        <span>Logout</span>
                    </button>
                </div>

            </div>
        </aside>
    );
};

export default Sidebar;
