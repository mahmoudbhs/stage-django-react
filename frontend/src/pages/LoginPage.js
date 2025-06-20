import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DjezzyLogo from "../pages/assets/logodjez.png";
import AuthContext from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { loginUser } = useContext(AuthContext); // utiliser le loginUser du Context

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  console.log("Tentative de connexion..."); // 🔍 LOG 1

  const success = await loginUser(email, password);
  console.log("Résultat loginUser:", success); // 🔍 LOG 2

  if (success) {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("Utilisateur connecté :", user); // 🔍 LOG 3

    if (user?.role === "admin" || user?.role === "technicien" || user?.role === "consultant") {
      console.log("Redirection vers /kpi");
      navigate("/dashboard");
    } else {
      console.log("Redirection vers /");
      navigate("/");
    }
  } else {
    console.log("Erreur : login échoué");
    setError("Identifiants invalides ou erreur serveur.");
  }
};


  return (
    <div className="min-h-screen bg-[#f4f4f4] flex flex-col items-center justify-center px-4">
      <img src={DjezzyLogo} alt="Djezzy Logo" className="w-40 mb-8" />

      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center text-red-600 mb-4">
          Connexion
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700">Adresse e-mail</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-lg mt-1"
            placeholder="exemple@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Mot de passe</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-lg mt-1"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
