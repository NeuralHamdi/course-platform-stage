import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import heroImage from '../assets/hero-image.jpg'; // image par défaut si besoin
import { Link } from "react-router-dom";
export default function Cours() {
  const { id } = useParams();

  // Fonction fetch des cours du module
  const fetchCourses = async () => {
    const response = await axios.get(`http://mon-projet.test/api/modules/${id}/courses`);
    return response.data;
  };

  // useQuery pour récupérer les cours
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['courses', id], // depend de l'id du module
    queryFn: fetchCourses,
  });

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Liste des cours</h1>

      {/* Gestion des états */}
      {isLoading && <p>Chargement des cours...</p>}

      {isError && (
        <div className="alert alert-danger">
          Erreur lors du chargement des cours : {error.message}
        </div>
      )}

      {/* Affichage des cours */}
      {data && data.length > 0 ? (
        <div className="row">
          {data.map((course) => (
            <div key={course.id} className="col-md-4 col-lg-3 mb-4">
              <div className="card h-100 shadow-sm border-0 rounded-4">
                <img
                  src={heroImage}
                  alt={course.title}
                  className="card-img-top rounded-top-4"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">{course.title}</h5>
                  <p className="card-text text-muted">
                    {course.description || "Description indisponible"}
                  </p>
                 <Link to={`/modules/${module.id}`} className="btn btn-outline-primary mt-auto">
  Details
</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && <p>Aucun cours trouvé pour ce module.</p>
      )}
    </div>
  );
}
