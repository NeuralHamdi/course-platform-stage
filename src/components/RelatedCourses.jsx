import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Needed for course links
import { motion } from 'framer-motion'; // Needed for animations
import { FaClock, FaChartLine } from 'react-icons/fa'; // Needed for icons
import Hero from '../assets/hero-image.jpg'; // Default image

// Make sure this path is correct for your CSS file
import '../style/Programms.css'; // This CSS file contains the .card, .gradient-border-card, etc. styles

const RelatedCourses = ({ courseId }) => {
  // Function to fetch related courses
  console.log("Fetching related courses for courseId:", courseId);
  const fetchRelatedCourses = async () => {
    const response = await axios.get(`http://mon-projet.test/api/courses/${courseId}/related`);
    console.log("Related courses fetched:", response.data);
    return response.data;
  };

  const {
    data: relatedCourses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['relatedCourses', courseId],
    queryFn: fetchRelatedCourses,
    enabled: !!courseId, // Only enable query if courseId is present
  });

  // Define cardVariants directly here, as they are used within this component now
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (isError) {
    return <div className="alert alert-warning">Could not load related programs.</div>;
  }

  // If the list is empty, return null to render nothing
  if (!relatedCourses || relatedCourses.length === 0) {
    // You can choose to return an empty div or a message instead of null if preferred
    return <div>
        lkngfdngfd
    </div>;
  }

  return (
    <div className="related-courses-section my-5">
      <h3 className="fw-bold mb-4"> </h3>
      <div className="row g-4">
        {relatedCourses.map(course => (
          // The structure of CourseCard is moved directly here
          <motion.div
            key={course.id} // Don't forget the key when mapping!
            className="col-md-6 col-lg-3" // Apply responsive column classes here
            variants={cardVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
            initial="hidden"
            animate="show"
          >
            <div className="card h-100 shadow-sm border-0 gradient-border-card">
              <img className="card-img-top" src={Hero} alt={course.titre} />
              <div className="card-body d-flex flex-column">
                {/* Use Link for internal navigation */}
                <Link to={`/courses/${course.id}`} className="text-decoration-none text-dark flex-grow-1 pe-2">
                  <h5 className="card-title mb-2 text-start">{course.titre || "Titre du cours"}</h5>
                </Link>
                <p className="card-text text-body-secondary flex-grow-1" style={{ textAlign: "justify" }}>
                  {course.description}
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
        ))}
      </div>
    </div>
  );
};

export default RelatedCourses;