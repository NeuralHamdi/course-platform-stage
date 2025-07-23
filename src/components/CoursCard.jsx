import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClock, FaChartLine } from 'react-icons/fa';
import Hero from '../assets/hero-image.jpg'; // Image par défaut
import '../style/Programms.css'; // Assurez-vous que le style est bien appliqué

const CourseCard = ({ course }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="col-12 h-100" // Prend toute la largeur de son parent
      variants={cardVariants}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="card h-100 shadow-sm border-0 gradient-border-card">
        <img className="card-img-top" src={Hero} alt={course.titre} />
        <div className="card-body d-flex flex-column">
          <a href={`/courses/${course.id}`} className="text-decoration-none text-dark flex-grow-1 pe-2">
            <h5 className="card-title mb-2 text-start">{course.titre || "Titre du cours"}</h5>
          </a>
          <p className="card-text text-body-secondary flex-grow-1" style={{ textAlign: "justify" }}>
            {course.description || "Description indisponible"}
          </p>
          <div className="d-flex align-items-center mt-2">
            <FaClock className="me-1" /> {course.duree} {course.duree_unite}
          </div>
          <div className="d-flex align-items-center mt-2">
            <FaChartLine className="me-1" /> {course.niveau}
          </div>
          <div className="mt-auto pt-3">
            <Link to={`/courses/${course.id}`} className="btn btn-outline-success btn-close-white w-100 card-footer-btn">
              Details →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
