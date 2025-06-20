import React from "react";
import KpiChart from "../components/KpiChart";
import AlgerieMap from "../components/AlgerieMap"; 
import KpiBarChart from "../components/KpiBarChart";
import { wilayaCoordinates } from "../components/wilayaCoordinates";
import Sidebar from "../components/Sidebar";
import { useFilters } from "../context/FilterContext";
import { useKpis } from "../context/KpiDataContext"; // NEW

function getAllDatesOfYear(year = 2023) {
  const dates = [];
  const start = new Date(`${year}-01-01`);
  const end = new Date(`${year}-12-31`);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

const Dashboard = () => {
  const { filters, setFilter } = useFilters();
  const { region, technologie, selectedYear, selectedDate } = filters;
  const { kpis, isLoading } = useKpis(); // Get KPI data from context

  const allDates = getAllDatesOfYear(selectedYear);
console.log("KPIs reçus :", kpis?.slice(0, 1)); // Regarde la 1ère ligne pour le format


  // Filtrage local !
  const filteredKpis = (kpis || []).filter(
    k =>
      (!region || k.zone?.nom === region) &&
      (!technologie || k.technologie === technologie) &&
      (!selectedDate || k.date === selectedDate) &&
      (!selectedYear || k.date.startsWith(String(selectedYear)))
  );

  const chartData = filteredKpis
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((k) => ({
      date: k.date,
      valeur: parseFloat(k.valeur),
    }));

  const kpiNames = [...new Set(filteredKpis.map((k) => k.nom))];
  const barChartData = kpiNames.map((name) => {
    const items = filteredKpis.filter((k) => k.nom === name);
    return {
      nom_kpi: name,
      valeur: items.reduce((a, b) => a + b.valeur, 0) / items.length,
    };
  });

  return (
    <div className="flex bg-gradient-to-tr from-gray-100 via-white to-gray-200 min-h-screen">
      <Sidebar open={false} onToggle={() => {}} />
      <div className="flex-1 flex flex-col min-h-screen md:ml-56 transition-all">
        <main className="flex-1 pt-10 pb-10 px-2 md:px-8">
          <h1 className="text-4xl font-extrabold mb-4 text-gray-800 tracking-tight flex items-center gap-3">
            <span role="img" aria-label="dashboard">📈</span>
            Dashboard KPI <span className="text-[#E20010]">Algérie</span>
          </h1>
          <p className="text-gray-600 mb-6 text-lg">Suivi, analyse et visualisation en temps réel des KPIs du réseau.</p>

          {/* Filtres */}
          <div className="flex flex-wrap gap-4 mb-10 bg-white rounded-xl shadow-md px-6 py-4">
            <select
              value={selectedYear}
              onChange={e => setFilter("selectedYear", Number(e.target.value))}
              className="border rounded-lg px-4 py-2 shadow-sm focus:ring focus:border-[#E20010] transition"
            >
              <option value={2022}>2022</option>
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
            </select>
            <select
              value={region}
              onChange={e => setFilter("region", e.target.value)}
              className="border rounded-lg px-4 py-2 shadow-sm focus:ring focus:border-[#E20010] transition"
            >
              <option value="">Toutes les wilayas</option>
              {Object.keys(wilayaCoordinates).map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
            <select
              value={technologie}
              onChange={e => setFilter("technologie", e.target.value)}
              className="border rounded-lg px-4 py-2 shadow-sm focus:ring focus:border-[#E20010] transition"
            >
              <option value="">Toutes technologies</option>
              <option value="2G">2G</option>
              <option value="3G">3G</option>
              <option value="4G">4G</option>
            </select>
            <select
              value={selectedDate}
              onChange={e => setFilter("selectedDate", e.target.value)}
              className="border rounded-lg px-4 py-2 shadow-sm focus:ring focus:border-[#E20010] transition"
            >
              <option value="">Toutes dates</option>
              {allDates.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* GRAPHIQUES */}
          {isLoading ? (
            <div className="text-[#E20010] text-xl my-10 text-center animate-pulse">
              Chargement des KPI…
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between">
                <h2 className="font-bold text-lg mb-4 text-[#E20010]">Évolution sur la période</h2>
                <KpiChart data={chartData} />
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between">
                <h2 className="font-bold text-lg mb-4 text-[#E20010]">Répartition par KPI</h2>
                <KpiBarChart data={barChartData} />
              </div>
<div className="col-span-2 bg-white rounded-2xl shadow-lg p-6 mt-6">
  <h2 className="font-bold text-lg mb-4 text-[#E20010]">Carte interactive Algérie</h2>
  <AlgerieMap
    onWilayaClick={(wilaya) => {
      // Ajoute ici ton filtrage ou autre action
      alert(`Wilaya sélectionnée : ${wilaya}`);
    }}
    // wilayaColors={{"Alger": "#f59e42"}} // pour colorier dynamiquement
  />
</div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Dashboard;
