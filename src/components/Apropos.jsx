import React from 'react';
import { FaAward, FaLightbulb, FaHandsHelping, FaUserFriends, FaBriefcase, FaFlask, FaChalkboardTeacher, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AboutImg from '../assets/about.jpg';

// Import the dedicated CSS for this page
import '../style/AboutPage.css';

// Re-usable animation variants for items that fade in from the bottom
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

// Data (kept as is)
const aboutContent = {
  heading: "Empowering Futures Through Expert Training",
  mission: "Our mission is to provide high-quality, accessible professional training that equips individuals and organizations with the skills needed to thrive in a rapidly evolving global landscape.",
  vision: "We envision a world where continuous learning is a cornerstone of professional growth, fostering innovation and leadership across all industries."
};

const coreValues = [
  { icon: <FaAward />, title: "Excellence", description: "Committed to delivering top-tier training programs crafted by industry experts." },
  { icon: <FaLightbulb />, title: "Innovation", description: "Continuously evolving our curriculum to match the latest industry trends." },
  { icon: <FaHandsHelping />, title: "Collaboration", description: "Fostering an interactive environment where students and instructors grow together." },
  { icon: <FaUserFriends />, title: "Student-Centric", description: "Dedicated to providing personalized support and resources for every learner." }
];

const uniqueApproachItems = [
  { icon: <FaBriefcase />, title: "Career Advancement", description: "Our programs are designed to equip you with in-demand skills for new career opportunities." },
  { icon: <FaChartLine />, title: "Practical Application", description: "We emphasize hands-on learning and real-world case studies for immediate application." },
  { icon: <FaChalkboardTeacher />, title: "Expert-Led Instruction", description: "Learn directly from industry veterans who bring invaluable experience and insights." },
  { icon: <FaFlask />, title: "Continuous Innovation", description: "Our curriculum is constantly updated to reflect the latest industry trends and best practices." }
];

const ctaButtons = [
  { label: "Explore Programs", link: "/programs", variant: "primary" },
  { label: "Contact Us", link: "/contact", variant: "secondary" },
];


export default function AboutSection() {
  return (
    <div className="about-page">
      {/* INTRO SECTION */}
      <div className="container about-intro-section">
        <div className="row align-items-center">
          <motion.div
            className="col-12 col-lg-6 text-md-start"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="about-heading mb-4">{aboutContent.heading}</h1>
            <p className="about-text"><strong>Mission:</strong> {aboutContent.mission}</p>
            <p className="about-text"><strong>Vision:</strong> {aboutContent.vision}</p>
          </motion.div>
          <motion.div
            className="col-12 col-lg-6 mt-4 mt-lg-0 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="about-image-wrapper">
              <img src={AboutImg} alt="Team collaboration" className="img-fluid" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* CORE VALUES SECTION */}
      <div className="about-values-section">
        <div className="container">
          <motion.h2 className="section-title text-center" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>Our Core Values</motion.h2>
          <motion.div
            className="row justify-content-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.2 }}
          >
            {coreValues.map((value, index) => (
              <motion.div key={index} className="col-md-6 col-lg-3 d-flex" variants={fadeInUp}>
                <motion.div className="value-card" whileHover={{ y: -10, boxShadow: '0px 20px 40px rgba(0,0,0,0.1)' }}>
                  <div className="value-icon">{value.icon}</div>
                  <h5 className="value-title">{value.title}</h5>
                  <p className="value-description">{value.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* UNIQUE APPROACH SECTION */}
      <div className="container about-approach-section">
        <motion.h2 className="section-title text-center" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>Our Unique Approach & Impact</motion.h2>
        <div className="row justify-content-center">
          {uniqueApproachItems.map((item, index) => (
            <motion.div
              key={index}
              className="col-lg-6 mb-4"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="approach-card">
                <div className="approach-icon">{item.icon}</div>
                <div className="approach-text">
                  <h6 className="approach-title">{item.title}</h6>
                  <p className="approach-description mb-0">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CALL TO ACTION SECTION */}
      <motion.div className="about-cta-section text-center" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <h2 className="cta-title">Ready to Begin Your Journey?</h2>
        <p className="cta-subtitle">Explore our programs and discover how we can help you achieve your career goals.</p>
        <div className="cta-buttons">
          {ctaButtons.map((btn, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to={btn.link} className={`btn btn-lg btn-${btn.variant} mx-2 cta-btn`}>
                {btn.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}