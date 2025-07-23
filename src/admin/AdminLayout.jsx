import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

function AdminLoyout() {
  return (

      <div className='d-flex'>
          <Sidebar /> {/* Manquant dans ton dernier code */}

     
      
        <main className='flex-grow-1'>
          <Outlet/>
        </main>
    </div>
  )
}

export default AdminLoyout
