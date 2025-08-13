import { useQuery } from "@tanstack/react-query";
import React from "react";
import Hero from "../assets/hero-image.jpg"; // Default image

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import apiClient from "../Api/apiClient"; // Importing the API client

// Import the enhanced stylesheet
import '../style/ModuleList.css'; 

function ModuleList() {
    // --- CHANGE 1: Switched to useQuery for a single fetch ---
    const fetchAllModules = async () => {
        // The 500ms delay is kept to simulate a network request
        await new Promise(res => setTimeout(res, 500)); 
        const response = await apiClient.get('/modules');
        // Assuming the API returns an object like { data: [...] }
        return response.data; 
    };

    const { data, isError, error, isLoading } = useQuery({
        queryKey: ['modules'], // The key for caching this data
        queryFn: fetchAllModules,
    });

    // --- Animation variants remain the same, they're great! ---
    const cardVariants = {
        hidden: { y: 50, opacity: 1},
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 },
        },
    };

    return (
        <div className="module-list__section">
            <div className="container py-5">
                <h1 className="module-list__title text-center">Our Specialized Training Domains</h1>
                <p className="module-list__subtitle text-muted text-center">
                    Discover a diverse range of programs crafted to meet the demands of today's dynamic professional landscape.
                </p>

                {isLoading ? (
                    <div className="module-list__loader">
                        <FaSpinner className="module-list__spinner" />
                        <p>Loading Modules...</p>
                    </div>
                ) : isError ? (
                    <div className="alert alert-danger" role="alert">
                        <strong>Error:</strong> Failed to fetch modules. {error.message}
                    </div>
                ) : (
                    <div className="row gy-4"> {/* gy-4 adds vertical gutter space */}
                        {/* --- CHANGE 2: Simplified mapping --- */}
                        {/* We now map directly on `data.data` assuming the API structure is { data: [...] } */}
                        {/* Optional chaining `?.` prevents errors if `data` is not yet available */}
                        {data?.data?.map((module, index) => (
                            <motion.div 
                                key={module.id} 
                                className="col-md-6 col-lg-4 d-flex align-items-stretch" // Adjusted columns for better spacing
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                // Stagger the animation for a beautiful effect
                                transition={{ delay: index * 0.08 }} 
                            >
                                <div className="module-list__card">
                                    <div className="module-list__card-image-container">
                                        <img
                                            src={module.url_images || Hero} 
                                            alt={module.titre}
                                            className="module-list__card-img"
                                        />
                                    </div>
                                    <div className="module-list__card-body">
                                        <h5 className="module-list__card-title">
                                            {module.titre || "Module Title"}
                                        </h5>
                                        <p className="module-list__card-text">
                                            {module.description || "No description available for this module."}
                                        </p>
                                        <Link
                                            to='programs'
                                            className="module-list__card-button"
                                        >
                                            View Courses →
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ModuleList;