import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// Icons that represent BOTH Training and Consulting
import { FaArrowRight, FaLightbulb, FaUsers, FaGraduationCap, FaCertificate, FaChartLine, FaSitemap } from 'react-icons/fa';

// Import the new, separated CSS file
import '../style/HeroBanner.css'; // Make sure the path is correct

export default function HeroBanner() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, duration: 0.8 } },
  };

  const slideInLeft = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 80, damping: 20 } },
  };
  
  const slideInRight = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 80, damping: 20 } },
  };

  return (
    <div className="modern-hero col-12">
      {/* Background Elements */}
      <div className="hero-bg-grid"></div>
      <div className="hero-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <div className="hero-container">
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Side - Content for a blended "Training & Consulting" message */}
          <div className="hero-left">
            <motion.div className="hero-badge" variants={slideInLeft}>
              <FaGraduationCap className="badge-icon" />
              <span>Formation & Conseil d'Experts</span>
            </motion.div>

            <motion.h1 className="hero-title" variants={slideInLeft}>
              Élevez vos <span className="gradient-text">Compétences</span>
              <br />
              Accélérez votre <span className="gradient-text">Croissance</span>
            </motion.h1>

            <motion.p className="hero-description" variants={slideInLeft}>
              Maîtrisez les compétences de demain avec nos formations de pointe et transformez
              vos défis en opportunités grâce à nos services de conseil stratégique.
            </motion.p>

            <motion.div className="hero-stats" variants={slideInLeft}>
              <div className="stat-item">
                <span className="stat-number">5000+</span>
                <span className="stat-label">APPRENANTS FORMÉS</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">150+</span>
                <span className="stat-label">PROJETS CLIENTS</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">97%</span>
                <span className="stat-label">TAUX DE SUCCÈS</span>
              </div>
            </motion.div>

            <motion.div className="hero-actions" variants={slideInLeft}>
              <Link to="/Programs" className="btn-primary-hero">
                <span>Explorer les Programmes</span>
                <FaArrowRight className="btn-icon" />
              </Link>
              <Link to="/consulting" className="btn-secondary-hero"> {/* Changed to a Link */}
                <FaUsers className="btn-icon" />
                <span>Nos Services Conseil</span>
              </Link>
            </motion.div>
          </div>

          {/* Right Side - New Illustration combining Training & Consulting themes */}
          <div className="hero-right">
            <motion.div className="illustration-container" variants={slideInRight}>
              
              {/* Central element representing ideas/knowledge */}
              <div className="illustration-centerpiece">
                  <FaLightbulb />
              </div>
              
              {/* Floating elements representing outcomes of both services */}
              <motion.div className="floating-element certificate">
                <FaCertificate />
                <span>Certification</span>
              </motion.div>

              <motion.div className="floating-element growth">
                <FaChartLine />
                <span>Croissance</span>
              </motion.div>

              <motion.div className="floating-element course">
                <FaGraduationCap />
                <span>Formation</span>
              </motion.div>

              <motion.div className="floating-element strategy">
                <FaSitemap />
                <span>Stratégie</span>
              </motion.div>

            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}