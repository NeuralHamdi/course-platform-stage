import React, { useState } from "react";
import "../style/Login.css";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";


const Signup = () => {
  const navigate = useNavigate();

  const [nom, setLastName] = useState("");
  const [prenom, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profession, setProfession] = useState("");
  const [niveau_Etudes, setEducationLevel] = useState("");
  
  const [errors, setErrors] = useState([]); 
  const [success, setSuccessMessage] = useState('');

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post("http://mon-projet.test/api/register", {
        nom, prenom, email, password, profession, niveau_Etudes,
      });
      return response.data;
    },
    onSuccess: () => {
      setErrors([]);
      setSuccessMessage("Inscription réussie ! Vous serez redirigé...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    },
    onError: (error) => {
      setSuccessMessage('');
      if (error.response && error.response.data && error.response.data.errors) {
        const backendErrors = Object.values(error.response.data.errors).flat();
        setErrors(backendErrors);
      } else {
        const message = error.response?.data?.message || "Une erreur réseau est survenue.";
        setErrors([message]);
      }
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrors([]);
    mutation.mutate();
  };
  
  return (
    // CORRECTION : On remplace mt-5 par py-5 (padding) pour éviter les problèmes de débordement.
    // Votre CSS doit utiliser `min-height: 100vh` sur `.login-page`.
    <div className="login-page d-flex align-items-center justify-content-center py-5">
      <div className="login-box shadow rounded bg-white p-4 p-md-5">

        {/* AFFICHAGE DU SUCCÈS */}
        {success && (
          <div className="alert alert-success d-flex align-items-center gap-2">
            <FaCheckCircle />
            <span>{success}</span>
          </div>
        )}

        {/* AFFICHAGE DES ERREURS */}
        {errors.length > 0 && (
          <div className="alert alert-danger">
            <ul className="mb-0 ps-3">
              {errors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <h2 className="text-center fw-bold mb-3">Créer un compte</h2>
        <p className="text-center text-muted mb-4">Remplissez vos informations pour vous inscrire.</p>

        <form autoComplete="off" onSubmit={handleSubmit}>
          
          {/* NOUVEAU: Conteneur Flex pour Nom et Prénom */}
          <div className="d-flex flex-column flex-md-row gap-3 mb-3">
            <div className="flex-grow-1">
              <label htmlFor="nom" className="form-label">Nom</label>
              <input
                type="text" id="nom" className="form-control" placeholder="Ex: Dupont" required
                value={nom} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className="flex-grow-1">
              <label htmlFor="prenom" className="form-label">Prénom</label>
              <input
                type="text" id="prenom" className="form-control" placeholder="Ex: Jean" required
                value={prenom} onChange={(e) => setFirstName(e.target.value)} />
            </div>
          </div>

          {/* Le reste des champs reste inchangé */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email" id="email" className="form-control" placeholder="nom@exemple.com" required
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <input
              type="password" id="password" className="form-control" placeholder="••••••••" required minLength="8"
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="mb-3">
            <label htmlFor="profession" className="form-label">Profession</label>
            <select
              id="profession" className="form-select" required
              value={profession} onChange={(e) => setProfession(e.target.value)}>
              <option value="" disabled>-- Choisissez une profession --</option>
              <option value="etudiant">Étudiant</option>
              <option value="developpeur">Développeur</option>
              <option value="designer">Designer</option>
              <option value="chef_de_projet">Chef de projet</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="niveau_Etudes" className="form-label">Niveau d'étude</label>
            <select
              id="niveau_Etudes" className="form-select" required
              value={niveau_Etudes} onChange={(e) => setEducationLevel(e.target.value)}>
              <option value="" disabled>-- Choisissez un niveau d'étude --</option>
              <option value="bac">Baccalauréat</option>
              <option value="bac+3">Licence (Bac+3)</option>
              <option value="bac+5">Master (Bac+5)</option>
              <option value="bac+8">Doctorat (Bac+8)</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-4 mb-2" disabled={mutation.isLoading}>
            {mutation.isLoading ? "Inscription en cours..." : "S'inscrire"}
          </button>
          
          <Link to="/login" className="btn btn-outline-primary w-100">
            Vous avez déjà un compte ? Se connecter
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Signup;