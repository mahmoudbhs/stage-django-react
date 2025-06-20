import React, { useState } from "react";

function AddRoleForm({ onRoleAdded }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/roles/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout du rôle.");
      setName("");
      setSuccess(true);
      onRoleAdded && onRoleAdded();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4 mt-6 mb-2">
      <label className="font-bold mb-1 block">Ajouter un nouveau rôle :</label>
      <div className="flex gap-2">
        <input
          type="text"
          className="border rounded px-2 py-1 flex-1"
          placeholder="Ex: Technicien, Consultant…"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <button type="submit" disabled={loading || !name.trim()} className="bg-blue-600 text-white rounded px-4 py-1">
          {loading ? "Ajout..." : "Ajouter"}
        </button>
      </div>
      {success && <div className="text-green-600 mt-2">✅ Rôle ajouté !</div>}
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </form>
  );
}

export default AddRoleForm;
