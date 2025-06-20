import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const KpiBarChart = ({ data }) => {
  if (!data || data.length === 0)
    return (
      <div className="bg-white rounded shadow p-6 flex items-center justify-center min-h-[280px] text-gray-400">
        Aucune donnée pour l’histogramme.
      </div>
    );

  return (
    <div className="bg-white rounded shadow p-2">
      <h3 className="font-bold mb-2 text-lg text-gray-700">Histogramme des KPI (moyenne par nom)</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data.slice(0, 20)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nom_kpi" tick={{ fontSize: 10 }} interval={0} angle={-35} textAnchor="end" height={55} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="valeur" fill="#f59e42" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default KpiBarChart;
