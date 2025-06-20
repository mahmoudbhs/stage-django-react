import React, { useEffect, useState } from "react";

function RolesList({ refresh }) {
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/roles/")
      .then(res => res.json())
      .then(data => setRoles(data));
  }, [refresh]);
  return (
    <div className="bg-gray-50 p-3 rounded shadow mb-4">
      <h2 className="font-semibold mb-2">Rôles existants :</h2>
      <ul>
        {roles.map(r => <li key={r.id}>- {r.name}</li>)}
      </ul>
    </div>
  );
}

export default RolesList;
