import React from 'react';
import { FaArrowRight, FaGraduationCap, FaUsers, FaCertificate, FaChartLine, FaLaptop, FaBookOpen } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import apiClient from '../Api/apiClient';
export default function HeroBanner() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8
      },
    },
  };

  const slideInLeft = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 80, damping: 20 },
    },
  };

  const slideInRight = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 80, damping: 20 },
    },
  };

  const floatingAnimation = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseAnimation = {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="modern-hero col-12">
      {/* Background Elements */}
      <div className="hero-bg-grid"></div>
      <div className="hero-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="hero-container">
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Side - Content */}
          <div className="hero-left">
            <motion.div className="hero-badge" variants={slideInLeft}>
              <FaGraduationCap className="badge-icon" />
              <span>Centre de Formation Professionnel</span>
            </motion.div>

            <motion.h1 className="hero-title" variants={slideInLeft}>
              Développez vos 
              <span className="gradient-text"> Compétences</span>
              <br />
              Boostez votre 
              <span className="gradient-text"> Carrière</span>
            </motion.h1>

            <motion.p className="hero-description" variants={slideInLeft}>
              ProTrain Hub propose des formations professionnelles de pointe en marketing digital, 
              ressources humaines, gestion d'entreprise et bien plus encore. Maîtrisez de nouvelles 
              compétences et atteignez vos objectifs de carrière.
            </motion.p>

            <motion.div className="hero-stats" variants={slideInLeft}>
              <div className="stat-item">
                <span className="stat-number">5000+</span>
                <span className="stat-label">Étudiants</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Formations</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">95%</span>
                <span className="stat-label">Satisfaction</span>
              </div>
            </motion.div>

            <motion.div className="hero-actions" variants={slideInLeft}>
              <Link to="Programs" className="btn-primary-hero">
                <span>
                  
                  Explorer les Programmes
                  </span>
                <FaArrowRight className="btn-icon" />
              </Link>
              <button className="btn-secondary-hero">
                <FaUsers className="btn-icon" />
                <span>Rejoindre une Démo</span>
              </button>
            </motion.div>
          </div>

          {/* Right Side - Illustration */}
          <div className="hero-right">
            <motion.div className="illustration-container" variants={slideInRight}>
              {/* Main Learning Scene */}
              <div className="learning-scene">
                <div className="laptop-mockup">
                  <div className="laptop-screen">
                    <div className="screen-content">
                      <div className="course-header"></div>
                      <div className="course-progress"></div>
                      <div className="course-modules">
                        <div className="module"></div>
                        <div className="module"></div>
                        <div className="module active"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Student Avatar */}
                <div className="student-avatar">
                  <div className="avatar-circle">
                    <FaUsers />
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div 
                className="floating-element certificate" 
                {...floatingAnimation}
                style={{ animationDelay: '0s' }}
              >
                <FaCertificate />
                <span>Certificat</span>
              </motion.div>

              <motion.div 
                className="floating-element chart" 
                {...floatingAnimation}
                style={{ animationDelay: '1s' }}
              >
                <FaChartLine />
                <span>Progrès</span>
              </motion.div>

              <motion.div 
                className="floating-element book" 
                {...floatingAnimation}
                style={{ animationDelay: '2s' }}
              >
                <FaBookOpen />
                <span>Cours</span>
              </motion.div>

              <motion.div 
                className="floating-element laptop" 
                {...pulseAnimation}
              >
                <FaLaptop />
                <span>E-Learning</span>
              </motion.div>

              {/* Achievement Rings */}
              <div className="achievement-rings">
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .modern-hero {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #0369a1 50%, #0284c7 75%, #0ea5e9 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          padding: 120px 0 80px 0;
          margin-top: 0;
        }

        /* Fix for navbar visibility */
        .modern-hero::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(59, 130, 246, 0.1);
          z-index: 1000;
          pointer-events: none;
        }

        .hero-bg-grid {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 20s linear infinite;
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        .hero-bg-shapes {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.1);
          backdrop-filter: blur(10px);
        }

        .shape-1 {
          width: 300px;
          height: 300px;
          top: 10%;
          left: -5%;
          animation: float 15s ease-in-out infinite;
        }

        .shape-2 {
          width: 200px;
          height: 200px;
          top: 60%;
          right: -5%;
          animation: float 12s ease-in-out infinite reverse;
        }

        .shape-3 {
          width: 150px;
          height: 150px;
          top: 30%;
          right: 20%;
          animation: float 18s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(10deg); }
        }

        .hero-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          width: 100%;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          min-height: 70vh;
        }

        .hero-left {
          z-index: 2;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          padding: 8px 16px;
          border-radius: 25px;
          color: #60a5fa;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
        }

        .badge-icon {
          font-size: 1rem;
        }

        .hero-title {
          font-size: 4rem;
          line-height: 1.1;
          font-weight: 900;
          color: white;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }

        .gradient-text {
          background: linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 1.2rem;
          line-height: 1.7;
          color: #cbd5e1;
          margin-bottom: 32px;
          max-width: 500px;
        }

        .hero-stats {
          display: flex;
          gap: 40px;
          margin-bottom: 40px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2.5rem;
          font-weight: 900;
          color: white;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn-primary-hero {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none;
          color: white;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
        }

        .btn-primary-hero:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
        }

        .btn-secondary-hero {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .btn-secondary-hero:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .btn-icon {
          transition: transform 0.3s ease;
        }

        .btn-primary-hero:hover .btn-icon {
          transform: translateX(4px);
        }

        .hero-right {
          position: relative;
          z-index: 2;
        }

        .illustration-container {
          position: relative;
          height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .learning-scene {
          position: relative;
          z-index: 2;
        }

        .laptop-mockup {
          width: 300px;
          height: 200px;
          background: linear-gradient(145deg, #1e293b, #334155);
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .laptop-screen {
          width: 100%;
          height: 100%;
          background: #0f172a;
          border-radius: 8px;
          padding: 16px;
          overflow: hidden;
        }

        .screen-content {
          height: 100%;
        }

        .course-header {
          height: 20px;
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          border-radius: 4px;
          margin-bottom: 12px;
        }

        .course-progress {
          height: 8px;
          background: #1e293b;
          border-radius: 4px;
          margin-bottom: 16px;
          position: relative;
          overflow: hidden;
        }

        .course-progress::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 60%;
          background: linear-gradient(90deg, #10b981, #34d399);
          border-radius: 4px;
          animation: progressFill 3s ease-in-out infinite;
        }

        @keyframes progressFill {
          0% { width: 30%; }
          50% { width: 80%; }
          100% { width: 60%; }
        }

        .course-modules {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .module {
          height: 16px;
          background: #334155;
          border-radius: 4px;
          opacity: 0.6;
          transition: all 0.3s ease;
        }

        .module.active {
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          opacity: 1;
          animation: pulse 2s ease-in-out infinite;
        }

        .student-avatar {
          position: absolute;
          bottom: -30px;
          right: -40px;
        }

        .avatar-circle {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #10b981, #34d399);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
          animation: bounce 3s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .floating-element {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .certificate {
          top: 50px;
          right: 20px;
          color: #fbbf24;
        }

        .chart {
          top: 200px;
          left: -20px;
          color: #10b981;
        }

        .book {
          bottom: 100px;
          right: 50px;
          color: #8b5cf6;
        }

        .laptop {
          bottom: 50px;
          left: 20px;
          color: #3b82f6;
        }

        .achievement-rings {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
        }

        .ring {
          position: absolute;
          border: 2px solid rgba(59, 130, 246, 0.2);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .ring-1 {
          width: 400px;
          height: 400px;
          animation: rotate 20s linear infinite;
        }

        .ring-2 {
          width: 500px;
          height: 500px;
          animation: rotate 30s linear infinite reverse;
          border-color: rgba(16, 185, 129, 0.1);
        }

        .ring-3 {
          width: 600px;
          height: 600px;
          animation: rotate 40s linear infinite;
          border-color: rgba(139, 92, 246, 0.1);
        }

        @keyframes rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .modern-hero {
            padding: 140px 0 60px 0;
          }
          
          .hero-content {
            grid-template-columns: 1fr;
            gap: 60px;
            text-align: center;
          }
          
          .hero-title {
            font-size: 3rem;
          }
          
          .illustration-container {
            height: 400px;
          }
        }

        @media (max-width: 768px) {
          .modern-hero {
            padding: 120px 0 40px 0;
          }
          
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-description {
            font-size: 1.1rem;
          }
          
          .hero-stats {
            justify-content: center;
            gap: 30px;
          }
          
          .hero-actions {
            justify-content: center;
          }
          
          .btn-primary-hero,
          .btn-secondary-hero {
            padding: 14px 24px;
            font-size: 1rem;
          }
          
          .laptop-mockup {
            width: 250px;
            height: 160px;
          }
        }

        @media (max-width: 480px) {
          .modern-hero {
            padding: 100px 0 40px 0;
          }
          
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-stats {
            flex-direction: column;
            gap: 20px;
          }
          
          .hero-actions {
            flex-direction: column;
            align-items: center;
          }
          
          .btn-primary-hero,
          .btn-secondary-hero {
            width: 100%;
            max-width: 280px;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}