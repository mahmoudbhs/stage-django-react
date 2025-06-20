// src/components/RoleForm.js
import { useState } from "react";
import axios from "axios";

const RoleForm = () => {
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/roles/", { name: role });
      setMessage("Rôle ajouté !");
      setRole("");
    } catch {
      setMessage("Erreur lors de l'ajout.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 rounded shadow">
      <label className="font-semibold">Nom du rôle</label>
      <input
        type="text"
        value={role}
        onChange={e => setRole(e.target.value)}
        className="border rounded px-3 py-2"
        placeholder="Ex : admin, consultant…"
        required
      />
      <button className="bg-[#E20010] text-white px-6 py-2 rounded font-bold hover:bg-[#b8000a]">
        Ajouter
      </button>
      {message && <div className="mt-2 text-sm">{message}</div>}
    </form>
  );
};

export default RoleForm;
