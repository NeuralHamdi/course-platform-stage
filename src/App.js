import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';


// Import Global Styles
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css'; 

// Import Layout Components
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import AdminLoyout from './admin/AdminLayout.jsx';
import DashboardStats from './admin/StatCard.jsx';

// Import Page/Route Components
import Home from './components/pages/Home.jsx';
import FilterCourses from './components/Programs.jsx';

import AboutSection from './components/Apropos.jsx';
import ContactPage from './components/Contact.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import CourseDetails from './components/lecons_Details.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Unauthorized from './components/pages/Unauthorized.jsx';
import NotFound from './components/pages/NotFound.jsx';
import { useAuth } from './context/AuthContext.jsx';
import StudentTable from './admin/StudentTable.jsx';
import CoursePage from './admin/GestionCourse.jsx';
import ModulesPage from './admin/ModulesPage.jsx';
import GestionSession from './admin/GestionSession.jsx';
import SubscriptionsPage from './admin/SubscriptionsPage.jsx';
import ConsultingServices from './components/pages/ConsultingPage.jsx';

import PaymentsPage from './admin/PayementPages.jsx';
import PaymentSuccessPage from './components/pages/PaymentSuccessPage.jsx';
import PaymentCancelPage from './components/pages/PaymentCancelPage.jsx';
import InscriptionPage from './components/pages/InscriptionPage.jsx';
import DashboardPage from './components/pages/DashboardPage.jsx';


//animation
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init({ duration: 800, once: true, offset: 100 });
/**
 * PublicLayout: Wraps all public pages to provide the Navbar and Footer.
 */
const PublicLayout = () => {
  const { user } = useAuth();  


    if(user&&user.role==='administrateur'){
      return <Navigate to='/admin' replace/>
    }



  return(
     <div className="App">
    <header className="mb-5">
      <Navbar />
    </header>
    <main>
      
      <Outlet />
    </main>
    <Footer />
  </div>

  )

 
};

/**
 * stripe listen --forward-to http://mon-projet.test/api/stripe/webhook
 */


function App() {
  return (
  
    <Router>
      <Routes>
  
        {/* --- PUBLIC ROUTES --- */}
        {/* All routes nested here will have the public Navbar and Footer */}
        <Route path='/' element={<PublicLayout />}>
          <Route index element={<Home/>}/>
          <Route path="Programs" element={<FilterCourses />} />
       
          <Route path="Apropos" element={<AboutSection />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path='consulting'  element={<ConsultingServices/>} />
          <Route path="courses/:id" element={<CourseDetails />} />
          <Route path="/unauthorized" element={<Unauthorized/>}/>
          

          <Route element={<ProtectedRoute />}>
            <Route path="/inscription/:sessionId" element={<InscriptionPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/payment/cancel" element={<PaymentCancelPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
        </Route>
        {/* <Route element={<ProtectedRoute allowedRoles={['etudiants']} />}>
        <Route path='/payement' */}

        {/* --- ADMIN PROTECTED ROUTES --- */}
        {/* Routes nested here are only for admins and will have the Sidebar layout */}
  <Route element={<ProtectedRoute allowedRoles={['administrateur']} />}>
  <Route path="/admin" element={<AdminLoyout />}>
    <Route index element={<DashboardStats />} />
     <Route path="students" element={<StudentTable />} /> 
     <Route path='courses' element={<CoursePage/>}/>
     <Route path='modules' element={<ModulesPage/>}/>
      <Route path='sessions' element={<GestionSession/>}/>
      <Route path='payments' element={<PaymentsPage/>}/>
      <Route path='subscriptions' element={<SubscriptionsPage/>}/>
  </Route>
</Route>

        <Route path='*' element={<NotFound/>}/>

      </Routes>
    </Router>

  );
}

export default App;