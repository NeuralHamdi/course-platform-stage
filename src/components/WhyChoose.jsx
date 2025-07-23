import React from "react";
import { FaUserTie, FaLightbulb, FaUsers, FaChartLine } from "react-icons/fa";
import { motion } from 'framer-motion';

// Import the dedicated CSS for this component
import '../style/WhyChoose.css';

const features = [
  {
    icon: <FaUserTie />,
    title: "Expert Instructors",
    description: "Learn from industry veterans and thought leaders with real-world experience.",
  },
  {
    icon: <FaLightbulb />,
    title: "Innovative Curriculum",
    description: "Stay ahead with cutting-edge content and practical, skills-focused training.",
  },
  {
    icon: <FaUsers />,
    title: "Strong Community",
    description: "Connect with peers, expand your network, and collaborate on exciting projects.",
  },
  {
    icon: <FaChartLine />,
    title: "Career Advancement",
    description: "Our programs are designed to accelerate your professional growth and open new opportunities.",
  },
];

// Stagger animation for the container of cards
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

// Animation for each individual card
const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};


export default function WhyChoose() {
  return (
    // The main section with a new, full-width design
    <div className="why-choose__section mb-3">
      <div className="container py-5">
        <div className="text-center">
          <h2 className="section__title mb-3">Why Choose ProTrain Hub?</h2>
          <p className="section__subtitle mb-5">
            We provide more than just courses. We offer a path to excellence.
          </p>
        </div>
        
        <motion.div
          className="row justify-content-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="col-lg-3 col-md-6 mb-4 d-flex"
              variants={itemVariants}
            >
              {/* This is our interactive glass card */}
              <motion.div
                className="why-choose__card"
                whileHover="hover" // This string 'hover' will trigger variants with that name
              >
                <div className="why-choose__card-content">
                  <motion.div 
                    className="why-choose__icon-wrapper"
                    // On parent hover, this variant will be triggered
                    variants={{ hover: { scale: 1.1, rotate: 10 } }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h5 className="why-choose__title mt-3">{feature.title}</h5>
                  <p className="why-choose__description">{feature.description}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}