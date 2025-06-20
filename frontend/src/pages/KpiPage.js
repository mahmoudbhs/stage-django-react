import React, { useState } from "react";
import KpiTable from "../components/KpiTable";
import KpiChart from "../components/KpiChart";
import { wilayaCoordinates } from "../components/wilayaCoordinates";
import Sidebar from "../components/Sidebar";
import { useKpis } from "../context/KpiDataContext";

const periodOptions = [
  { label: "Toutes", value: "all" },
  { label: "7 derniers jours", value: "7" },
  { label: "30 derniers jours", value: "30" },
  { label: "90 derniers jours", value: "90" },
];

const PAGE_SIZE = 50;

const KpiPage = () => {
  const { kpis, isLoading } = useKpis();
  const [page, setPage] = useState(1);
  const [technologie, setTechnologie] = useState("");
  const [region, setRegion] = useState("");
  const [period, setPeriod] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filtrage local sur les données contextuelles !
  let filteredKpis = (kpis || []).filter(
    k =>
      (!technologie || k.technologie === technologie) &&
      (!region || k.zone?.nom === region)
  );

  // Filtrage par période
  if (period !== "all") {
    const today = new Date();
    const periodDays = Number(period);
    filteredKpis = filteredKpis.filter((k) => {
      const dateKpi = new Date(k.date);
      return (
        dateKpi >= new Date(today.getFullYear(), today.getMonth(), today.getDate() - periodDays)
      );
    });
  }

  // Pagination locale (pas serveur !)
  const totalPages = Math.ceil(filteredKpis.length / PAGE_SIZE);
  const pagedKpis = filteredKpis.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Les données pour le graphe (page courante)
  const chartData = pagedKpis.map((k) => ({
    date: k.date,
    valeur: parseFloat(k.valeur),
  }));

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className="flex-1 p-4 sm:p-8 md:p-20 max-w-full w-full overflow-x-auto md:ml-56 transition-all">
        {/* Filtres alignés */}
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Filtre technologie */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Technologie :
            </label>
            <select
              value={technologie}
              onChange={(e) => {
                setPage(1);
                setTechnologie(e.target.value);
              }}
              className="px-4 py-2 border border-gray-300 rounded"
            >
              <option value="">Toutes</option>
              <option value="2G">2G</option>
              <option value="3G">3G</option>
              <option value="4G">4G</option>
            </select>
          </div>
          {/* Filtre wilaya */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Wilaya :
            </label>
            <select
              value={region}
              onChange={(e) => {
                setPage(1);
                setRegion(e.target.value);
              }}
              className="px-4 py-2 border border-gray-300 rounded"
            >
              <option value="">Toutes</option>
              {Object.keys(wilayaCoordinates).map((wilaya) => (
                <option key={wilaya} value={wilaya}>
                  {wilaya}
                </option>
              ))}
            </select>
          </div>
          {/* Filtre période */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Période :
            </label>
            <select
              value={period}
              onChange={(e) => {
                setPage(1);
                setPeriod(e.target.value);
              }}
              className="px-4 py-2 border border-gray-300 rounded"
            >
              {periodOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tableau KPI avec loader ou message “no data” */}
        <div className="mb-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-32 text-lg text-blue-500 font-semibold animate-pulse">
              Chargement des KPI...
            </div>
          ) : pagedKpis.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400 font-semibold">
              <span>😕 Aucune donnée trouvée.</span>
              <span className="text-sm mt-2">Change les filtres pour voir d’autres résultats !</span>
            </div>
          ) : (
            <KpiTable
              kpis={pagedKpis}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
            />
          )}
        </div>
        {/* Graphique KPI = toujours la page courante */}
        <KpiChart data={chartData} />
      </main>
    </div>
  );
};

export default KpiPage;
