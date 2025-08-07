import React from 'react';
// Updated icons to add more dynamism for new sections
import { FaAward, FaLightbulb, FaHandsHelping, FaUserFriends, FaBriefcase, FaFlask, FaChalkboardTeacher, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AboutImg from '../assets/about.jpg'; // Assuming you have an image here

// Import the dedicated CSS for this page
import '../style/AboutPage.css';

// Re-usable animation variants for items that fade in from the bottom
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

// --- DATA (CORE VALUES DESCRIPTIONS UPDATED FOR IMPACT) ---
const aboutContent = {
  heading: "Empowering Futures Through Expert Training",
  mission: "Our mission is to provide high-quality, accessible professional training that equips individuals and organizations with the skills needed to thrive in a rapidly evolving global landscape.",
  vision: "We envision a world where continuous learning is a cornerstone of professional growth, fostering innovation and leadership across all industries."
};

// ** UPDATED FOR CONTEXT **
const coreValues = [
  { icon: <FaAward />, title: "Uncompromising Quality", description: "Delivering elite training and curriculum that sets the industry standard for excellence." },
  { icon: <FaLightbulb />, title: "Relentless Innovation", description: "Our courses evolve in real-time with technology, ensuring you learn what's relevant now and next." },
  { icon: <FaHandsHelping />, title: "Supportive Community", description: "Fostering a network where learners and mentors collaborate, challenge, and grow together." },
  { icon: <FaUserFriends />, title: "Your Success, Our Mission", description: "We are deeply invested in your outcome, providing personalized guidance to achieve your career goals." }
];

const uniqueApproachItems = [
  { icon: <FaBriefcase />, title: "Career Advancement", description: "Our programs are designed to equip you with in-demand skills for new career opportunities." },
  { icon: <FaChartLine />, title: "Practical Application", description: "We emphasize hands-on learning and real-world case studies for immediate application." },
  { icon: <FaChalkboardTeacher />, title: "Expert-Led Instruction", description: "Learn directly from industry veterans who bring invaluable experience and insights." },
  { icon: <FaFlask />, title: "Continuous Innovation", description: "Our curriculum is constantly updated to reflect the latest industry trends and best practices." }
];

// ** UPDATED CTA BUTTONS AND TEXT **
const ctaContent = {
    title: "Ready to Build Your Future?",
    subtitle: "Take the next step. Explore our programs or speak directly with an advisor to chart your path to success.",
    buttons: [
      { label: "Explore Programs", link: "/programs", variant: "primary" },
      { label: "Contact An Advisor", link: "/contact", variant: "secondary" },
    ]
}

export default function AboutSection() {
  return (
    <div className="about-page">
      {/* INTRO SECTION (No changes here) */}
      <section className="about-intro-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <motion.div
              className="col-lg-6"
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
              className="col-lg-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <div className="about-image-wrapper">
                <img src={AboutImg} alt="Team collaboration" className="img-fluid" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== CORE VALUES SECTION (REVAMPED) ========== */}
      <section className="about-values-section">
        <div className="container">
          <motion.h2 className="section-title text-center" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>Our Core Values</motion.h2>
          <motion.div
            className="row gy-4 justify-content-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.2 }}
          >
            {coreValues.map((value, index) => (
              <motion.div key={index} className="col-md-6 col-lg-3 d-flex" variants={fadeInUp}>
                <div className="value-card">
                  <div className="value-icon">{value.icon}</div>
                  <h5 className="value-title">{value.title}</h5>
                  <p className="value-description">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* UNIQUE APPROACH SECTION (No changes here) */}
      <section className="about-approach-section">
          <div className="container">
            <motion.h2 className="section-title text-center" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>Our Unique Approach & Impact</motion.h2>
            <div className="row gy-4 justify-content-center">
                {uniqueApproachItems.map((item, index) => (
                <motion.div
                    key={index}
                    className="col-lg-6"
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
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
      </section>


      {/* ========== CALL TO ACTION SECTION (REVAMPED) ========== */}
      <motion.section className="about-cta-section" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <h2 className="cta-title">{ctaContent.title}</h2>
        <p className="cta-subtitle">{ctaContent.subtitle}</p>
        <div className="cta-buttons">
          {ctaContent.buttons.map((btn, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to={btn.link} className={`btn btn-lg cta-btn btn-${btn.variant}`}>
                {btn.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}