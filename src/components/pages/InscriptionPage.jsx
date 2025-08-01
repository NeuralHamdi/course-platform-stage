// src/pages/InscriptionPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../Api/apiClient";
import PaymentCheckout from "../PaymentCheckout";
import { Spinner, Alert } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
// Mocked current user — replace this with your real auth/user context


export default function InscriptionPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const {user} = useAuth();

  const { data: session, isLoading, isError } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      const res = await apiClient.get(`/sessions/${sessionId}`);
      return res.data;
    }
  });

  if (isLoading) {
    return <div className="text-center py-5"><Spinner animation="border" /></div>;
  }

  if (isError) {
    return <Alert variant="danger" className="m-4">Impossible de charger la session.</Alert>;
  }

  return (
    <PaymentCheckout
      selectedSession={session}
      currentUser={user} // Replace with your actual auth context
      onBack={() => navigate(-1)}
      onPaymentStart={() => console.log("Paiement en cours...")}
    />
  );
}
