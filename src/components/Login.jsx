import React from "react";
import "../style/Login.css";
import axios from "axios";
import { useMutation,QueryClient,QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import the AuthContext
import { Link } from "react-router-dom"; // Import Link for navigation
import apiClient from "../Api/apiClient";

const Login = () => {
  const { login } = useAuth(); // from context
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post("/login", {
        email,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      login(data.user, data.token); // save to context
      if(data.user.role==="administrateur"){
        navigate('/admin')
      }
      else{
        navigate("/"); 
      }
     // redirect to homepage after login
    },
    onError: (error) => {
      alert("Login failed: " + error.response.data.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };
  return (
    <div className="login-page d-flex align-items-center justify-content-center vh-100">
      <div className="login-box shadow rounded bg-white p-5">
        <h2 className="text-center fw-bold mb-3">Login</h2>
        <p className="text-center text-muted mb-4">Enter your details to access your account.</p>

        <form autoComplete="off" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="name@example.com"
              required
              autoComplete="off"
              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="••••••••"
              required
              autoComplete="off"
                
              
              value={password}
              onChange={(e)=>setPassword(e.target.value)}         
            />
          </div>

          

          <button type="submit" className="btn btn-primary w-100 mb-2" disabled={mutation.isLoading}>{mutation.isLoading ? "Signing  in..":'sign in'}</button>
          <Link type="button" className="btn btn-outline-primary w-100" to='/Signup'>Sign Up</Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
