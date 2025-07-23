import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Hero from '../assets/hero-image.jpg'; 
import { FaClock, FaChartLine } from 'react-icons/fa';
import { Link } from "react-router-dom"; 
import { motion } from "framer-motion";
import '../style/Programms.css'
export default function FilterCourses() {
  const [search, setSearch] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");

  
  const fetchCourses = async () => {
    const response = await axios.get("http://mon-projet.test/api/courses", {
      params: {
        search: search,
        module_id: moduleId,
        level: level,
        duration: duration, 
      },
    });
    return response.data;
  };

  // --- React Query : récupérer les cours filtrés ---
  const { data: courses, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['courses', search, moduleId, level,duration], 
    queryFn: fetchCourses,
 
  });
const fetchModules = async () => {
  const response = await axios.get("http://mon-projet.test/api/modules/all");
  return response.data;
};

const { data: modules=[], isLoading: modulesLoading, isError: modulesError } = useQuery({
  queryKey: ['modules'],
  queryFn: fetchModules,
});

  // --- Clear Filters ---
  const clearFilters = () => {
    setSearch("");
    setModuleId("");
    setLevel("");
    refetch(); // recharge sans filtre
  };

  return (
    <div className="container mt-5 animated-background">
      <h2>Filter Courses</h2>

      {/* --- Filtres --- */}
   <motion.div
  className="m-4 rounded-4 p-4 shadow-sm filter-container"
  initial={{ opacity: 0, y: -50 }} // Start invisible and 50px above
  animate={{ opacity: 1, y: 0 }}   // Animate to full visibility and original position
  transition={{ duration: 0.5, ease: "easeOut" }}
>
  
  {/* LIGNE 1: Les champs de recherche */}
  <div className="row g-3 mb-4">
    {/* Filtre 1: Recherche par mot-clé */}
    <div className="col-12 col-md-6 col-lg-3">
      <input
        type="text"
        className="form-control"
        placeholder="Recherche..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    {/* Filtre 2: Domaine */}
    <div className="col-12 col-md-6 col-lg-3">
      <select
        className="form-select"
        value={moduleId}
        onChange={(e) => setModuleId(e.target.value)}
      >
        <option value="">Sélectionner Domaine</option>
        
      {Array.isArray(modules)&&modules.map((module) => (
    <option key={module.id} value={module.id}>
      {module.titre} {/* ou module.name, selon le nom dans ta BDD */}
    </option>
  ))}
      </select>
    </div>

    {/* Filtre 3: Durée */}
    <div className="col-12 col-md-6 col-lg-3">
      <select className="form-select" value={duration} onChange={(e) => setDuration(e.target.value) }>
        <option value="">Sélectionner Durée</option>
        <option value="hours">Hours</option>
        <option value="days">days</option>
        <option value="weeks">weeks</option>
      </select>
    </div>

    {/* Filtre 4: Niveau */}
    <div className="col-12 col-md-6 col-lg-3">
      <select
        className="form-select"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
      >
        <option value="">Sélectionner Niveau</option>
        <option value="Beginner">Débutant</option>
        <option value="Intermediate">Intermédiaire</option>
        <option value="Advanced">Avancé</option>
      </select>
    </div>
  </div>

  {/* LIGNE 2: Les boutons d'action */}
  <div className="row">
    <div className="col-12 d-flex justify-content-end">
      <button onClick={clearFilters} className="btn btn-outline-secondary me-2 btn-action">
        ✖ Effacer
      </button>
      <button onClick={() => refetch()} className="btn btn-primary btn-action">
        Appliquer les Filtres
      </button>
    </div>
  </div>
</motion.div>


    
        {isLoading && <p>Loading courses...</p>}
        {isError && <p className="text-danger">Error: {error.message}</p>}

        {/* --- Affichage des cours --- */}
     <motion.div
  className="row"
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // This will make each child animate one after the other
      },
    },
  }}
  initial="hidden"
  animate="show"
>
          {courses?.map((course) => (
               <motion.div
      key={course.id}
      className="col-md-4 col-lg-3 mb-4"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      whileHover={{ scale: 1.05, y: -5 }} // Animate on hover: scale up and move up
      transition={{ duration: 0.3 }}
    >
          <div className="card h-100 shadow-sm border-0 gradient-border-card">
            <img className="card-img-top " src={Hero} alt="Card image"></img>
           {/* --- Code à remplacer dans la section d'affichage des cours --- */}

      <div className="card-body d-flex flex-column">

        {/* Ligne pour le Titre et le Prix */}
        <div className="d-flex align-items-center mb-2">
          {/* Titre cliquable aligné à gauche */}
          <a href={`/courses/${course.id}`} className="text-decoration-none text-dark flex-grow-1 pe-2">
        <h5 className="card-title mb-0 text-start" style={{ marginBottom: 0 }}>{course.titr || "data cours"}</h5>
          </a>
        </div>

        {/* La description avec une classe standard pour un rendu plus fiable */}
        <p className="card-text text-body-secondary flex-grow-1" style={{ textAlign: "justify" }}>{course.description}</p>
        
        {/* Informations sur la durée */}
        <div className="d-flex align-items-center mt-2">
          <FaClock className="me-1" /> {course.duree} {course.duree_unite}
        </div>
        {/* Informations sur le niveau */}
        <div className="d-flex align-items-center mt-2">
          <FaChartLine className="me-1" /> {course.niveau}
        </div>
  <div className="mt-auto pt-3 ">
    <Link to={`/courses/${course.id}`} className="btn btn-outline-success btn-close-white w-100 card-footer-btn">
      Details →
    </Link>
  </div>

</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {courses?.length === 0 && !isLoading && <p>No courses found.</p>}
    </div>
  );
}
