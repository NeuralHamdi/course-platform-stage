import Carousel from 'react-bootstrap/Carousel';
import '../assets/hero-image.jpg';
import { FaArrowRight } from 'react-icons/fa';
import '../style/HeroBanner.css' // Import your CSS file for styling
import HeroImage from '../assets/hero-image.jpg'; // Import the hero image
import { Link } from "react-router-dom"; // Import Link for navigation
import { motion } from 'framer-motion'; // Import Framer Motion for animations
import React from 'react';
export default function Herobanner() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Each child will animate 0.3s after the previous one
      },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };
  return (
     <div className="hero-banner hero-animation d-flex align-items-center">
      <div className="overlay"></div>
      <motion.div className="container text-center text-white position-relative z-2"   variants={containerVariants}
        initial="hidden"
        animate="visible">
        <motion.h1 className="fw-bold" variants={itemVariants}>Unlock Your Potential. Elevate Your Career.</motion.h1>
        <motion.p className="lead mt-3" variants={itemVariants}>
          ProTrain Hub offers industry-leading professional training in digital marketing,
          HR, business management and more. Master new skills, expand your network,
          and achieve your career aspirations.
        </motion.p>
       <motion.div variants={itemVariants}>
          <Link to="/programs" className="btn btn-primary mt-3 btn-hero">
            Explore Programs <FaArrowRight className="ms-2" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
