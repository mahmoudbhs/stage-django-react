import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { UserPlus, Mail, Calendar, BadgeCheck, UserCog } from "lucide-react";

const API_URL = "http://localhost:8000/api/users/";

const RolePage = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    date_naissance: "",
    role: "technicien"
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          username: form.email, // Username = email (simple)
          password: "P@ssword" + Math.floor(Math.random() * 100000) // Genère un mdp random
        })
      });
      if (response.ok) {
        setStatus("success");
        setForm({
          first_name: "",
          last_name: "",
          email: "",
          date_naissance: "",
          role: "technicien"
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
    setLoading(false);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar open={false} onToggle={() => {}} />
      <div className="flex-1 flex flex-col md:ml-56 items-center justify-center">
        <main className="flex-1 w-full flex flex-col justify-center items-center">
          <div className="max-w-lg w-full mt-10">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="text-[#E20010]" size={32} />
              <h2 className="text-2xl font-extrabold text-gray-800">Ajouter un utilisateur</h2>
            </div>
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-5 animate-fade-in"
            >
              <div className="relative">
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                  className="peer border-b-2 border-gray-300 focus:border-[#E20010] outline-none py-2 px-4 w-full transition"
                  placeholder=" "
                />
                <label className="absolute left-4 top-0 text-gray-500 peer-focus:text-[#E20010] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-sm bg-white px-1 pointer-events-none">
                  Prénom
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                  className="peer border-b-2 border-gray-300 focus:border-[#E20010] outline-none py-2 px-4 w-full transition"
                  placeholder=" "
                />
                <label className="absolute left-4 top-0 text-gray-500 peer-focus:text-[#E20010] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-sm bg-white px-1 pointer-events-none">
                  Nom
                </label>
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="pl-10 peer border-b-2 border-gray-300 focus:border-[#E20010] outline-none py-2 px-4 w-full transition"
                  placeholder="Email"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="date"
                  name="date_naissance"
                  value={form.date_naissance}
                  onChange={handleChange}
                  required
                  className="pl-10 peer border-b-2 border-gray-300 focus:border-[#E20010] outline-none py-2 px-4 w-full transition"
                />
              </div>
              <div className="relative">
                <UserCog className="absolute left-3 top-3 text-gray-400" size={18} />
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                  className="pl-10 border-b-2 border-gray-300 focus:border-[#E20010] outline-none py-2 px-4 w-full transition"
                >
                  <option value="technicien">Technicien</option>
                  <option value="consultant">Consultant</option>
                </select>
              </div>
              <button
                type="submit"
                className={`mt-2 bg-[#E20010] hover:bg-red-700 text-white font-bold py-2 px-6 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 ${
                  loading ? "opacity-50 cursor-not-allowed animate-pulse" : ""
                }`}
                disabled={loading}
              >
                <BadgeCheck size={20} />
                {loading ? "Ajout en cours..." : "Ajouter"}
              </button>
              {status === "success" && (
                <div className="bg-green-100 text-green-800 text-center rounded p-2 font-semibold mt-2 animate-bounce">
                  ✅ Utilisateur ajouté avec succès !
                </div>
              )}
              {status === "error" && (
                <div className="bg-red-100 text-red-800 text-center rounded p-2 font-semibold mt-2">
                  ❌ Une erreur est survenue, vérifie les champs.
                </div>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RolePage;
