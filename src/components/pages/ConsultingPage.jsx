import React, { useState, useEffect, useRef } from 'react';
import { Route, Search, Construction, TrendingUp, Check, Cpu, Shield, Cloud, Settings, MessageCircle, ArrowRight } from 'lucide-react';
import '../../style/consulting-services.css'; // Your path to the new CSS file

const consultingProcess = [
    { icon: Search, title: "Discovery & Analysis", description: "We start by deeply understanding your goals, challenges, and current technological landscape." },
    { icon: Route, title: "Strategic Roadmap", description: "Our experts craft a bespoke, data-driven strategy and a clear roadmap for implementation." },
    { icon: Construction, title: "Agile Implementation", description: "We deploy the solution with precision, integrating it seamlessly into your existing workflow." },
    { icon: TrendingUp, title: "Growth & Optimization", description: "We provide ongoing support and analysis to ensure continuous growth and optimization." }
];

const services = [
    { id: 'cloud', icon: Cloud, title: "Cloud & AI Transformation", features: ["Multi-Cloud & Hybrid Strategy", "Serverless Architecture Solutions", "Custom AI & Machine Learning Model Development", "Data Migration and Modernization"] },
    { id: 'cyber', icon: Shield, title: "Cybersecurity & Compliance", features: ["Vulnerability Assessments & Penetration Testing", "Security Policy & Architecture Design", "GDPR, ISO 27001 Compliance Consulting", "Employee Security Awareness Training"] },
    { id: 'iot', icon: Cpu, title: "IoT & Automation", features: ["Full-Stack IoT Integration", "Real-time Data Processing & Analytics", "Industrial Automation (IIoT)", "Smart Device Network Architecture"] },
    { id: 'strategy', icon: Settings, title: "Strategic Digital Advisory", features: ["Digital Transformation Roadmap", "Technology Stack Auditing & Optimization", "IT Process & Workflow Improvement", "CIO-as-a-Service"] }
];

const ConsultingServices = () => {
    const [activeService, setActiveService] = useState(services[0].id);
    const currentService = services.find(s => s.id === activeService);
    const canvasRef = useRef(null);

    // useEffect for the interactive canvas background animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            if (!canvas.parentElement) return;
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        };
        
        let particles = [];
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * 0.4 - 0.2;
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
                if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
                this.x += this.speedX;
                this.y += this.speedY;
            }
            draw() {
                ctx.fillStyle = 'rgba(165, 180, 252, 0.7)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function init() {
            particles = [];
            const numberOfParticles = (canvas.width * canvas.height) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        }

        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 110) {
                        opacityValue = 1 - (distance / 110);
                        ctx.strokeStyle = `rgba(165, 180, 252, ${opacityValue})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            connect();
            animationFrameId = requestAnimationFrame(animate);
        };
        
        const handleResize = () => {
            resizeCanvas();
            init();
        }

        handleResize(); // Initial call
        animate();

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);
    
    return (
        <div className="consulting-blueprint-wrapper">
      
            <section className="hero-immersive-section">
                <canvas ref={canvasRef} id="interactive-network-canvas"></canvas>
                <div className="hero-content-container">
                    <h1 className="hero-title">
                        <span className="fade-in-word">Your</span>
                        <span className="fade-in-word">Vision,</span>
                        <br />
                        <span className="fade-in-word highlight">Engineered.</span>
                    </h1>
                    <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="600">
                        We architect and implement robust technology solutions that turn ambitious ideas into market-leading realities.
                    </p>
                    <a href="#services" className="hero-cta-btn" data-aos="fade-up" data-aos-delay="800">
                        Explore Our Expertise <ArrowRight size={20} />
                    </a>
                </div>
            </section>

            <section id="process" className="process-journey-section">
                <div className="container">
                    <div className="section-title" data-aos="fade-up">
                        <h2>Our Strategic Framework</h2>
                        <p>A proven, transparent 4-step process that ensures clarity, precision, and outstanding results for your project.</p>
                    </div>
                    <div className="process-timeline" data-aos="fade-up" data-aos-delay="200">
                        {consultingProcess.map((step, index) => (
                            <div key={step.title} className="process-step" data-aos="fade-up" data-aos-delay={index * 100}>
                                <div className="step-icon-wrapper"><step.icon size={28}/></div>
                                <div className="step-content">
                                    <h3 className="step-title">{step.title}</h3>
                                    <p className="step-description">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="services" className="services-interactive-section">
                <div className="container">
                    <div className="section-title" data-aos="fade-up">
                        <h2>Core Consulting Domains</h2>
                        <p>Dive into our specializations. We offer deep expertise across the most critical areas of modern technology.</p>
                    </div>
                    <div className="services-grid" data-aos="fade-up" data-aos-delay="200">
                        <nav className="service-nav">
                            {services.map((service) => (
                                <button key={service.id} className={`service-nav-item ${activeService === service.id ? 'active' : ''}`} onClick={() => setActiveService(service.id)}>
                                    <service.icon className="nav-icon" size={20} />
                                    <span>{service.title}</span>
                                </button>
                            ))}
                        </nav>
                        <div className="service-details-container">
                          <div className="service-details" key={currentService.id}>
                              <h3 className="detail-title"><currentService.icon size={32} className="title-icon"/> {currentService.title}</h3>
                              <ul className="feature-list">
                                  {currentService.features.map(feature => (
                                      <li key={feature} className="feature-list-item">
                                          <Check size={18} className="check-icon"/><span>{feature}</span>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                        </div>
                    </div>
                </div>
            </section>

       <section className="final-cta-fullwidth-section py-5">
  <div className="container text-center">
    <h2 data-aos="fade-up">Ready to Build Something Exceptional?</h2>

    <p 
      className="lead mx-auto mb-4 w-100" 
      style={{ maxWidth: '600px' }} 
      data-aos="fade-up" 
      data-aos-delay="100"
    >
      Your transformation starts with a conversation. Let's discuss your vision.
    </p>

    <div data-aos="fade-up" data-aos-delay="200">
      <a 
        href="https://wa.me/+212625426096?text=Hello!%20I'm%20interested%20in%20consultation." 
        target="_blank" 
        rel="noopener noreferrer" 
        className="btn btn-primary d-inline-flex align-items-center gap-2 rounded-pill px-4 py-2"
      >
        <MessageCircle size={24}/> Book a Free Consultation
      </a>
    </div>
  </div>
</section>

        </div>
    );
};

export default ConsultingServices;