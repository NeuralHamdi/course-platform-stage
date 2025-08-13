import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaPaperPlane, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

// Import your page styles and authentication context
import '../style/ContactPage.css';
import { useAuth } from '../context/AuthContext';
import apiClient from '../Api/apiClient';

// --- Page Data (No Changes) ---
const contactInfoCards = [
  { icon: <FaMapMarkerAlt />, text: "Localisation du centre : Bureaux N° 16 & 17 3 eme Etage Immob Guedira lot Elmassira N° P1883 , Agadir, Morocco, 810000" },
  { icon: <FaEnvelope />, text: "info@centre-aah.com" },
  { icon: <FaPhoneAlt />, text: "+1 (800) 555-0199" }
];

const faqData = [
    { id: 'faq1', question: "What types of training programs do you offer?", answer: "We offer a wide range of training programs including digital marketing, web development, data science, project management, and soft skills workshops, tailored for various skill levels from beginner to advanced." },
    { id: 'faq2', question: "How can I enroll in a training program?", answer: "You can enroll directly through our website by selecting your desired course and following the registration steps. Alternatively, you can contact our admissions team for personalized assistance." },
    { id: 'faq3', question: "Do you offer corporate training solutions?", answer: "Yes, we provide customized corporate training solutions designed to meet the specific needs of businesses. Please contact us to discuss your organization's requirements and receive a tailored proposal." },
    { id: 'faq4', question: "What are your payment options?", answer: "We accept various payment methods including credit/debit cards, bank transfers, and installment plans for eligible programs. Specific options can be found on each course's detail page or by contacting our support team." }
];

// API call function (No Changes)
const sendContactMessage = (newMessage) => {
   return apiClient.post('/contact', newMessage);
};

/**
 * Form validation utility functions
 */
const validateField = (name, value) => {
    switch (name) {
        case 'name':
            if (!value.trim()) return 'Name is required';
            if (value.trim().length < 2) return 'Name must be at least 2 characters';
            if (value.trim().length > 50) return 'Name must be less than 50 characters';
            if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'Name can only contain letters and spaces';
            return '';
            
        case 'email':
            if (!value.trim()) return 'Email is required';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value.trim())) return 'Please enter a valid email address';
            if (value.trim().length > 100) return 'Email must be less than 100 characters';
            return '';
            
        case 'message':
            if (!value.trim()) return 'Message is required';
            if (value.trim().length < 10) return 'Message must be at least 10 characters';
            if (value.trim().length > 1000) return 'Message must be less than 1000 characters';
            return '';
            
        default:
            return '';
    }
};

/**
 * Validates the entire form and returns an object with field errors
 * @param {Object} formData - The form data to validate
 * @returns {Object} - Object containing field errors
 */
const validateForm = (formData) => {
    const errors = {};
    
    Object.keys(formData).forEach(field => {
        const error = validateField(field, formData[field]);
        if (error) {
            errors[field] = error;
        }
    });
    
    return errors;
};

export default function ContactPage() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  // Enhanced State Management
  const [openFaqId, setOpenFaqId] = useState(faqData[0].id);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    message: '' 
  });
  
  // New state for form validation
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Auto-populate form if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({ 
        ...prev, 
        name: user.nom || '', 
        email: user.email || '' 
      }));
    }
  }, [isAuthenticated, user]);

  // Validate form whenever formData changes
  useEffect(() => {
    const errors = validateForm(formData);
    setFieldErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  }, [formData]);
  
  // Enhanced mutation with better error handling
  const mutation = useMutation({
    mutationFn: sendContactMessage,
    onSuccess: () => {
        // Clear form appropriately based on authentication status
        if (isAuthenticated) {
            setFormData(prev => ({...prev, message: ''}));
            setTouched(prev => ({...prev, message: false}));
        } else {
            setFormData({ name: '', email: '', message: '' });
            setTouched({});
        }
        setFieldErrors({});
    },
    onError: (error) => {
        // Handle server-side validation errors
        if (error.response?.data?.fieldErrors) {
            setFieldErrors(error.response.data.fieldErrors);
        }
    }
  });

  /**
   * Handles input changes with real-time validation
   * @param {Event} e - The input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing (if field was touched)
    if (touched[name] && fieldErrors[name]) {
      const newError = validateField(name, value);
      setFieldErrors(prev => ({
        ...prev,
        [name]: newError
      }));
    }
  };

  /**
   * Handles input blur events to mark fields as touched
   * @param {Event} e - The blur event
   */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate the field
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };
  
  /**
   * Handles form submission with comprehensive validation
   * @param {Event} e - The form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = { name: true, email: true, message: true };
    setTouched(allTouched);
    
    // Validate entire form
    const errors = validateForm(formData);
    setFieldErrors(errors);
    
    // Only submit if form is valid
    if (Object.keys(errors).length === 0) {
      mutation.mutate(formData);
    }
  };
  
  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  /**
   * Renders individual form input with error handling
   * @param {string} type - Input type
   * @param {string} name - Input name
   * @param {string} placeholder - Input placeholder
   * @param {boolean} readOnly - Whether input is read-only
   * @param {number} rows - Number of rows for textarea
   * @returns {JSX.Element} - Form input with error display
   */
  const renderFormInput = (type, name, placeholder, readOnly = false, rows = null) => {
    const hasError = touched[name] && fieldErrors[name];
    const inputClasses = `form-control ${hasError ? 'is-invalid' : ''}`;
    
    const inputProps = {
      name,
      className: inputClasses,
      placeholder,
      value: formData[name],
      onChange: handleChange,
      onBlur: handleBlur,
      readOnly,
      required: true
    };

    return (
      <div className="mb-3">
        {rows ? (
          <textarea {...inputProps} rows={rows}></textarea>
        ) : (
          <input type={type} {...inputProps} />
        )}
        
        <AnimatePresence>
          {hasError && (
            <motion.div 
              className="invalid-feedback d-block"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <FaExclamationCircle className="me-1" />
              {fieldErrors[name]}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  /**
   * Renders the complete contact form with validation
   * @returns {JSX.Element} - Complete form component
   */
  const renderContactForm = () => {
    // Show success message after successful submission
    if (mutation.isSuccess) {
        return (
            <motion.div 
              className="form-success-message" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
            >
                <FaCheckCircle size={48} className="mb-3 text-success" />
                <h4 className="fw-bold">Message Sent!</h4>
                <p>Thank you for reaching out. We'll be in touch shortly.</p>
                <button 
                  type="button" 
                  className="btn btn-outline-primary mt-3"
                  onClick={() => {
                    mutation.reset();
                    setFieldErrors({});
                    setTouched({});
                  }}
                >
                  Send Another Message
                </button>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            {/* Name Input */}
            {renderFormInput('text', 'name', 'Your Name *', isAuthenticated)}
            
            {/* Email Input */}
            {renderFormInput('email', 'email', 'Your Email *', isAuthenticated)}
            
            {/* Message Input */}
            {renderFormInput('text', 'message', 'Type your message here... *', false, 5)}

            {/* Server Error Display */}
            <AnimatePresence>
              {mutation.isError && !mutation.error.response?.data?.fieldErrors && (
                  <motion.div 
                    className="form-error-message mb-3" 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                  >
                      <FaExclamationCircle className="me-2" /> 
                      {mutation.error.response?.data?.message || 'An unexpected error occurred. Please try again.'}
                  </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button 
              type="submit" 
              className={`submit-btn mt-4 ${!isFormValid && Object.keys(touched).length > 0 ? 'btn-disabled' : ''}`}
              whileHover={isFormValid ? { scale: 1.02 } : {}} 
              whileTap={isFormValid ? { scale: 0.98 } : {}}
              disabled={mutation.isPending}
            >
                {mutation.isPending ? (
                  <><FaSpinner className="spinner me-2" /> Sending...</>
                ) : (
                  <>Send Message <FaPaperPlane className="ms-2" /></>
                )}
            </motion.button>
            
            {/* Form Validation Summary */}
            {Object.keys(touched).length > 0 && !isFormValid && (
              <motion.div 
                className="form-validation-summary mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <small className="text-muted">
                  <FaExclamationCircle className="me-1" />
                  Please fix the errors above before submitting.
                </small>
              </motion.div>
            )}
        </form>
    );
  };

  return (
    <div className="contact-page-wrapper">
      {/* SECTION 1: HERO */}
      <section className="contact-hero">
        <motion.div className="container" initial="hidden" animate="visible" transition={{ staggerChildren: 0.2 }}>
            <motion.h1 className="hero-title" variants={{ hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1, transition:{duration:0.6} } }}>
                Get In Touch
            </motion.h1>
            <motion.p className="hero-subtitle" variants={{ hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1, transition:{duration:0.6, delay:0.2} } }}>
                We're here to answer your questions about our courses, consulting, or anything else you need.
            </motion.p>
            <div className="row justify-content-center gy-4 mt-4">
                {contactInfoCards.map((info, index) => (
                    <motion.div key={index} className="col-lg-4 col-md-6" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition:{delay: 0.4 + index*0.1} } }}>
                        <div className="info-card">
                            <span className="info-icon">{info.icon}</span>
                            <span className="info-text">{info.text}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
      </section>

      {/* SECTION 2: FORM & MAP */}
      <section className="contact-main-section">
        <div className="container">
          <div className="row g-5 align-items-center">
            <motion.div className="col-lg-6" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <div className="form-card">
                <h2 className="form-title">Send a Direct Message</h2>
                <p className="form-subtitle text-muted mb-4">
                  Fields marked with * are required
                </p>
                {renderContactForm()}
              </div>
            </motion.div>
            <motion.div className="col-lg-6" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <div className="map-card">
                <iframe src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d215.0538881662523!2d-9.563877379496224!3d30.411651011459192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1s%20Immob%20Guedira!5e0!3m2!1sfr!2sma!4v1755081080678!5m2!1sfr!2sma" width="100%" height="550" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Our Location"></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* SECTION 3: FAQ */}
      <section className="contact-faq-section">
        <div className="container">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="accordion" id="faqAccordion">
                {faqData.map((faq, index) => (
                    <motion.div key={faq.id} className="accordion-item" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                        <h2 className="accordion-header" id={`heading-${faq.id}`}>
                            <button className={`accordion-button ${openFaqId !== faq.id ? 'collapsed' : ''}`} type="button" onClick={() => toggleFaq(faq.id)}>
                                {faq.question}
                            </button>
                        </h2>
                        <AnimatePresence initial={false}>
                            {openFaqId === faq.id && (
                                <motion.div className="accordion-collapse" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: 'easeInOut' }}>
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