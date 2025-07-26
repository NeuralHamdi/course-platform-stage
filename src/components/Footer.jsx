import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { 
    FaTwitter, 
    FaFacebookF, 
    FaLinkedinIn, 
    FaYoutube, 
    FaSpinner, 
    FaCheckCircle 
} from 'react-icons/fa';
import Logo from '../assets/Logo.png';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';


import '../style/Footer.css';


import { useAuth } from '../context/AuthContext'; 

// API call function
const subscribeToNewsletter = async (email) => {
  const { data } = await axios.post('http://mon-projet.test/api/subscribe', { email });
  return data;
};

export default function Footer() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const mutation = useMutation({
    mutationFn: subscribeToNewsletter,
    onSuccess: (data) => {
      setSuccessMessage(data.message || 'Subscription successful!');
    },
    onError: (error) => {
      console.error("Subscription failed:", error.response?.data);
    }
  });

  // This useEffect hook now also resets the form state on login/logout
  useEffect(() => {
   
    mutation.reset();

    setSuccessMessage('');

    if (isAuthenticated && user?.email) {
      setEmail(user.email);
    } else {
      setEmail('');
    }
  }, [isAuthenticated, user]); 

  const renderNewsletterForm = () => {
    if (mutation.isSuccess && successMessage) {
      return (
        <div className="footer-success-message">
          <FaCheckCircle /> {successMessage}
        </div>
      );
    }
    
    return (
      <>
        <form className="footer-newsletter-form" onSubmit={(e) => { e.preventDefault(); mutation.mutate(email); }}>
          <input
            type="email"
            className="footer-newsletter-input"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={mutation.isPending || isAuthenticated}
            required
          />
          <button
            type="submit"
            className="footer-newsletter-btn"
            disabled={mutation.isPending || !email.trim()}
          >
            {mutation.isPending ? <FaSpinner className="spinner" /> : 'Subscribe'}
          </button>
        </form>

        {mutation.isError && (
          <div className="footer-error-message">
            {mutation.error.response?.data?.errors?.email[0] || 'An unexpected error occurred.'}
          </div>
        )}
      </>
    );
  };
  
  // Animation variants...
  const footerVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" }}};
  const iconHover = { y: -5, scale: 1.2, transition: { type: "spring", stiffness: 300 }};

  return (
    <motion.footer
      className="footer-section mt-0"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container">
        <div className="row">
          {/* ProTrain Hub Info */}
          <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
            <div className="footer-about">
              <h5 className="footer-title footer-logo">
                <img src={Logo} alt="ProTrain Hub Logo" className="footer-logo-img" />
                ProTrain Hub
              </h5>
              <p className="footer-description">
                A leading E-learning platform offering interactive courses for companies and individuals.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4 mb-lg-0">
            <h5 className="footer-title">Information</h5>
            <ul className="list-unstyled footer-links">
              <li><Link to="/Apropos">About Us</Link></li>
              <li><Link to="/programs">Programs</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/contact">FAQ</Link></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="col-lg-6 col-md-12">
            <h5 className="footer-title">Stay up to date</h5>
            <p className="footer-description mb-3">
              {isAuthenticated 
                ? "You're just one click away from our latest news and offers."
                : "Get the latest programs and insights directly in your inbox."
              }
            </p>
            {renderNewsletterForm()}
            <div className="footer-social-icons mt-4">
              <motion.a href="#" whileHover={iconHover}><FaTwitter /></motion.a>
              <motion.a href="#" whileHover={iconHover}><FaFacebookF /></motion.a>
              <motion.a href="#" whileHover={iconHover}><FaLinkedinIn /></motion.a>
              <motion.a href="#" whileHover={iconHover}><FaYoutube /></motion.a>
            </div>
          </div>
        </div>
        <hr className="footer-divider" />
        <div className="text-center footer-copyright">
          © {new Date().getFullYear()} ProTrain Hub. All Rights Reserved.
        </div>
      </div>
    </motion.footer>
  );
}