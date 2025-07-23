// src/components/CourseDetails.jsx

import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Spinner, Accordion, Card, Container, Row, Col, Badge, Button } from "react-bootstrap";
import { FaClock, FaDollarSign, FaEnvelope, FaMapMarkerAlt, FaPhone, FaRegCheckCircle, FaChartBar, FaHistory } from 'react-icons/fa';
import hero from '../assets/hero-image.jpg'; // Image de secours
import RelatedCourses from "./RelatedCourses.jsx";

export default function CourseDetails() {
  const { id } = useParams();
  
  const { data: course, isLoading, isError } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      // Remplacez l'URL par votre endpoint d'API réel
      const response = await axios.get(`http://mon-projet.test/api/courses/${id}`);
      return response.data;
    }
  });

  // --- Fonctions d'aide pour la logique d'affichage ---

  // Détermine le badge de statut pour une session
  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'active':
        return <Badge bg="success" className="rounded-pill">Active</Badge>;
      case 'a_venir':
        return <Badge bg="warning" className="text-dark rounded-pill">Upcoming</Badge>;
      case 'terminee':
        return <Badge bg="secondary" className="rounded-pill">Completed</Badge>;
      default:
        return null;
    }
  };

  // Génère le bouton CTA pour une session
  const getCTAButton = (session) => {
    if (session.statut === 'terminee') {
      return <Button variant="secondary" disabled>Completed</Button>;
    }
    if (session.places_disponibles === 0) {
      return <Button variant="secondary" disabled>Full</Button>;
    }
    // Le lien pointe vers la page d'inscription, comme dans votre code original
    return <Button as={Link} to={`/inscription/${session.id}`} variant="primary" className="enroll-button">Enroll Now</Button>;
  };


  if (isLoading) {
    return <div className="d-flex justify-content-center align-items-center vh-100"><Spinner animation="border" variant="primary" /></div>;
  }

  if (isError) {
    return <div className="container py-5"><div className="alert alert-danger">An error occurred while loading the course data.</div></div>;
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>
        {/* --- Hero Section --- */}
        <header
            className="hero-section text-white text-center d-flex align-items-center justify-content-center"
            style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${course.url_imagee || hero})` }}
        >
            <Container>
                <h1 className="display-4 fw-bold">{course.titre}</h1>
                <p className="lead">{course.description}</p>
            </Container>
        </header>

        <Container className="py-5">
            <Row className="g-5">
                {/* --- Colonne Principale (Gauche) --- */}
                <Col lg={8}>
                    {/* --- About This Program --- */}
                    <Card className="mb-4 shadow-sm card-with-border">
                        <Card.Body>
                            <h2 className="h5 fw-bold mb-3">About This Program</h2>
                            <p className="card-text text-muted">{course.about}</p>
                        </Card.Body>
                    </Card>

                    {/* --- What You’ll Learn --- */}
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <h2 className="h5 fw-bold mb-3">What You’ll Learn</h2>
                            <ul className="list-unstyled mb-0">
                                {course.objectifs && course.objectifs.map((objective, index) => (
                                    <li key={index} className="d-flex align-items-center mb-2">
                                        <FaRegCheckCircle className="text-warning me-3 flex-shrink-0" />
                                        <span>{objective}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>

                    {/* --- Course Information --- */}
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Row className="text-center">
                                <Col md={4} className="mb-3 mb-md-0">
                                    <FaClock size="2em" className="text-primary mb-2" />
                                    <h5 className="h6 text-muted">Duration</h5>
                                    <p className="mb-0 fw-bold">{`${course.duree} ${course.duree_unite}`}</p>
                                </Col>
                                <Col md={4} className="mb-3 mb-md-0 border-start border-end">
                                    <FaChartBar size="2em" className="text-primary mb-2" />
                                    <h5 className="h6 text-muted">Level</h5>
                                    <p className="mb-0 fw-bold">{course.niveau}</p>
                                </Col>
                                <Col md={4}>
                                    <FaDollarSign size="2em" className="text-primary mb-2" />
                                    <h5 className="h6 text-muted">Reference Price</h5>
                                    <p className="mb-0 fw-bold">${course.prix_reference}</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* --- Upcoming Sessions --- */}
                    <section className="mb-4">
                        <h2 className="h4 mb-4 fw-bold">Upcoming Sessions</h2>
                        <Row>
                            {course.sessions && course.sessions.map((session) => (
                                <Col md={6} key={session.id} className="mb-4">
                                    <Card className="h-100 shadow-sm session-card">
                                        <Card.Body className="d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h5 className="h6 card-title fw-bold">{session.titre}</h5>
                                                {getStatusBadge(session.statut)}
                                            </div>
                                            <p className="text-muted small">
                                                {new Date(session.date_debut).toLocaleDateString()} - {new Date(session.date_fin).toLocaleDateString()}
                                            </p>
                                            <p className="fw-bold fs-5 my-2">${session.prix}</p>
                                            <p className="text-muted mt-auto mb-3">{`${session.places_disponibles} spots available`}</p>
                                            {getCTAButton(session)}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </section>

                    {/* --- Course Content --- */}
                    <section>
                        <h2 className="h4 mb-4 fw-bold">Course Content</h2>
                        <Accordion defaultActiveKey="0" flush>
                            {course.lecons && course.lecons.map((lecon, index) => (
                                <Accordion.Item eventKey={String(index)} key={lecon.id} className="mb-2 shadow-sm accordion-item-custom">
                                    <Accordion.Header>{lecon.titre}</Accordion.Header>
                                    <Accordion.Body>
                                        <p>{lecon.description}</p>
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </section>
                </Col>

                {/* --- Barre Latérale (Droite) --- */}
                <Col lg={4}>
                    <div className="sticky-top" style={{ top: '6rem' }}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <h5 className="card-title fw-bold">Need Help?</h5>
                                <p className="text-muted small">Contact us for more information.</p>
                                <ul className="list-unstyled mt-3">
                                    <li className="mb-3 d-flex align-items-center"><FaEnvelope className="me-3 text-primary" /> contact@education.com</li>
                                    <li className="mb-3 d-flex align-items-center"><FaPhone className="me-3 text-primary" /> +1 234 567 890</li>
                                    <li className="mb-3 d-flex align-items-center"><FaMapMarkerAlt className="me-3 text-primary" /> 123 Education Lane, Online</li>
                                    <li className="d-flex align-items-center"><FaHistory className="me-3 text-primary" /> Mon-Fri, 9am - 5pm</li>
                                </ul>
                                <Button variant="outline-primary" className="w-100 mt-4">Contact Us</Button>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>

            {/* --- Section des Cours Similaires (conservée de votre code) --- */}
            {id && (
                <div className="mt-5 pt-5 border-top">
                    <h2 className="h4 fw-bold text-center mb-4">Related Programs</h2>
                    <RelatedCourses courseId={id} />
                </div>
            )}
        </Container>

        {/* --- Styles CSS personnalisés --- */}
        <style type="text/css">{`
            .hero-section {
                min-height: 40vh;
                background-size: cover;
                background-position: center;
                padding: 4rem 1rem;
            }
            .card-with-border {
                border-left: 5px solid #0d6efd;
            }
            .session-card {
                transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
            }
            .session-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
            }
            .enroll-button {
                transition: all 0.2s ease;
            }
            .accordion-item-custom {
                border-radius: .375rem;
                border: 1px solid rgba(0,0,0,.125);
            }
            .accordion-button:not(.collapsed) {
                color: #0d6efd;
                background-color: #e7f1ff;
                font-weight: bold;
            }
            .text-warning {
               color: #ffc107 !important;
            }
        `}</style>
    </div>
  );
}