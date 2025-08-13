import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Import the dedicated CSS for this component
import '../style/CallToAction.css';
import {Link} from 'react-router-dom';
// Animation variants for the text elements to stagger their appearance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
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



export default function CallToAction() {
  const MotionLink = motion(Link);
  return (
    // We add the class that controls our animated background
    <section className="cta__section">
      <motion.div
        className="container text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible" // This triggers the animation when the component scrolls into view
        viewport={{ once: true, amount: 0.5 }} // Animation happens once
      >
        <motion.h2 className="cta__title" variants={itemVariants}>
          Your Next Big Step Starts Here
        </motion.h2>

        <motion.p className="cta__subtitle" variants={itemVariants}>
          Join a community of innovators at Centre AAH. Turn expert-led knowledge into tangible career results, starting today.
        </motion.p>

        <MotionLink
          to="/Programs"
          className="cta__button"
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          Enroll Today <FaArrowRight className="ms-2" />
        </MotionLink>
      </motion.div>
    </section>
  );
}