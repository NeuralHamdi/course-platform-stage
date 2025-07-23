import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
 const {user}=useAuth();
 if(!user){
  return <Navigate to='/login' replace/>;}

  else if(allowedRoles && !allowedRoles.includes(user.role)){
    return <Navigate to='/unauthorized'replace/>
  }
  return <Outlet/>

 }


export default ProtectedRoute;
