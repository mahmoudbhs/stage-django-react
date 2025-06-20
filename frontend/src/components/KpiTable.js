import React from "react";

const KpiTable = ({ kpis, page, setPage, totalPages }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Zone</th>
            <th className="px-4 py-2 border">Technologie</th>
            <th className="px-4 py-2 border">KPI</th>
            <th className="px-4 py-2 border">Valeur</th>
          </tr>
        </thead>
        <tbody>
          {kpis.map((kpi, index) => (
            <tr key={index} className="text-center">
              <td className="px-4 py-2 border">{kpi.date || "—"}</td>
              <td className="px-4 py-2 border">{kpi.zone?.nom || "—"}</td>
              <td className="px-4 py-2 border">{kpi.technologie || "—"}</td>
              <td className="px-4 py-2 border">{kpi.nom_kpi?.nom || "—"}</td>
              <td className="px-4 py-2 border">{kpi.valeur || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Précédent
        </button>
        <span className="px-4 py-2">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default KpiTable;