import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaPaperPlane, FaSpinner, FaCheckCircle } from 'react-icons/fa';

// Import your page styles and authentication context
import '../style/ContactPage.css';
import { useAuth } from '../context/AuthContext'; // Import your auth hook
import apiClient from '../Api/apiClient'; // Import your API client

// --- Page Data ---
const contactInfoCards = [
  { icon: <FaMapMarkerAlt />, text: "123 Professional Way, Knowledge City" },
  { icon: <FaEnvelope />, text: "info@protrainhub.com" },
  { icon: <FaPhoneAlt />, text: "+1 (800) 555-0199" }
];

const faqData = [
    { id: 'faq1', question: "What types of training programs do you offer?", answer: "We offer a wide range of training programs including digital marketing, web development, data science, project management, and soft skills workshops, tailored for various skill levels from beginner to advanced." },
    { id: 'faq2', question: "How can I enroll in a training program?", answer: "You can enroll directly through our website by selecting your desired course and following the registration steps. Alternatively, you can contact our admissions team for personalized assistance." },
    { id: 'faq3', question: "Do you offer corporate training solutions?", answer: "Yes, we provide customized corporate training solutions designed to meet the specific needs of businesses. Please contact us to discuss your organization's requirements and receive a tailored proposal." },
    { id: 'faq4', question: "What are your payment options?", answer: "We accept various payment methods including credit/debit cards, bank transfers, and installment plans for eligible programs. Specific options can be found on each course's detail page or by contacting our support team." }
];

// API call function
const sendContactMessage = (newMessage) => {
   return apiClient.post('/contact', newMessage);
};


// --- The Main Page Component ---
export default function ContactPage() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  // State for the accordion
  const [openFaqId, setOpenFaqId] = useState(faqData[0].id);

  // --- NEW: State and Logic for the Contact Form ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Pre-fill form if the user is logged in
  useEffect(() => {
    if (isAuthenticated) {
      setFormData(prev => ({ ...prev, name: user.nom || '', email: user.email || '' }));
    }
  }, [isAuthenticated, user]);
  
  const mutation = useMutation({
    mutationFn: sendContactMessage,
    onSuccess: () => {
        // Clear the form on success, but keep name/email if user is logged in
        if (isAuthenticated) {
            setFormData(prev => ({...prev, message: ''}));
        } else {
            setFormData({ name: '', email: '', message: '' });
        }
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };
  
  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  // --- Helper function to render the form with feedback ---
  const renderContactForm = () => {
    if (mutation.isSuccess) {
        return (
            <div className="form-success-message">
                <FaCheckCircle size={48} className="mb-3" />
                <h4>Message Sent!</h4>
                <p>Thank you for reaching out. We will get back to you shortly.</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <input 
                    type="text" 
                    name="name"
                    className="form-control" 
                    placeholder="Your Name" 
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isAuthenticated} // Disable if user is logged in
                    required 
                />
            </div>
            <div className="mb-3">
                <input 
                    type="email" 
                    name="email"
                    className="form-control" 
                    placeholder="Your Email" 
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isAuthenticated} // Disable if user is logged in
                    required  
                />
            </div>
            <div className="mb-4">
                <textarea 
                    name="message"
                    className="form-control" 
                    rows="5" 
                    placeholder="Type your message here..." 
                    value={formData.message}
                    onChange={handleChange}
                    required
                ></textarea>
            </div>
            {/* Display validation errors from Laravel */}
            {mutation.isError && (
                <div className="form-error-message">
                    {mutation.error.response?.data?.errors?.message?.[0] || 'An unexpected error occurred.'}
                </div>
            )}
            <motion.button
                type="submit"
                className="submit-btn"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                disabled={mutation.isPending} // Disable button while loading
            >
                {mutation.isPending ? <FaSpinner className="spinner" /> : (
                    <>Send Message <FaPaperPlane className="ms-2" /></>
                )}
            </motion.button>
        </form>
    );
  };

  return (
    <div className="contact-page-wrapper">
      {/* SECTION 1: HERO */}
      <motion.section 
        className="contact-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container position-relative z-2">
            <motion.h1 className="hero-title" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
                Get In Touch
            </motion.h1>
            <motion.p className="hero-subtitle" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
                We are here to answer your questions and help you find the perfect training solution.
            </motion.p>
            <motion.div className="row justify-content-center" initial="hidden" animate="visible" transition={{ staggerChildren: 0.2, delayChildren: 0.6 }}>
                {contactInfoCards.map((info, index) => (
                    <motion.div key={index} className="col-md-4 mb-3" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                        <div className="info-card">
                            <span className="info-icon">{info.icon}</span>
                            <span className="info-text">{info.text}</span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
      </motion.section>

      {/* SECTION 2: FORM & MAP */}
      <section className="contact-main-section">
        <div className="container">
          <div className="row justify-content-center g-4">
            <motion.div className="col-lg-6" initial={{ opacity: 0, x: -100 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <div className="form-card">
                <h2 className="form-title">Send Us a Message</h2>
                {/* --- RENDER THE SMART FORM HERE --- */}
                {renderContactForm()}
              </div>
            </motion.div>
            <motion.div className="col-lg-6" initial={{ opacity: 0, x: 100 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <div className="map-card">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3441.59560384814!2d-9.565980625345799!3d30.411833574744047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3b6f0e3e230ef%3A0x6b4f7a26f3c15f5!2sFacult%C3%A9%20des%20sciences%20juridiques%20%C3%A9conomiques%20et%20sociales!5e0!3m2!1sfr!2sma!4v1717351608665!5m2!1sfr!2sma" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Our Location"></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* SECTION 3: FAQ */}
      <section className="contact-faq-section">
        <div className="container">
            <motion.h2 className="section-title" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }}>
                Frequently Asked Questions
            </motion.h2>
            <div className="accordion" id="faqAccordion">
                {faqData.map((faq) => (
                    <motion.div key={faq.id} className="accordion-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <h2 className="accordion-header">
                            <button className={`accordion-button ${openFaqId !== faq.id ? 'collapsed' : ''}`} type="button" onClick={() => toggleFaq(faq.id)}>
                                {faq.question}
                            </button>
                        </h2>
                        <AnimatePresence>
                            {openFaqId === faq.id && (
                                <motion.div className="accordion-collapse" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
                                    <div className="accordion-body">{faq.answer}</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
}