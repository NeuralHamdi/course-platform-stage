// src/pages/Unauthorized.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
return (
    <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <h1 className="display-4 text-danger mt-3">403 - Accès refusé</h1>
        <p className="lead">Vous n'avez pas l'autorisation d'accéder à cette page.</p>
        <Link to="/" className="btn btn-primary mt-3">
            Retour à l'accueil
        </Link>
    </div>
);
};

export default Unauthorized;
