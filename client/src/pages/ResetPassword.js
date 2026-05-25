import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const res = await API.post(`/auth/reset-password/${token}`, { password });
      setMessage(res.data.message || "Password reset");
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">New Password</label>
        <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 border rounded mb-4" />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Reset Password</button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
