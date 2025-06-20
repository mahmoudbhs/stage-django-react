import React from "react";
import Sidebar from "../components/Sidebar";
import { useFilters } from "../context/FilterContext";
import { useKpis } from "../context/KpiDataContext";

const AlertesPage = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { filters } = useFilters();
  const { region, technologie, selectedYear, selectedDate } = filters;
  const { kpis, isLoading } = useKpis();

  console.log("KPIs dans AlertesPage :", kpis?.slice(0, 3));

  // Filtrage local
  const alertes = (kpis || []).filter(
    k =>
      (!region || k.zone?.nom === region) &&
      (!technologie || k.technologie === technologie) &&
      (!selectedDate || k.date === selectedDate) &&
      (!selectedYear || k.date.startsWith(String(selectedYear))) &&
      k.anomaly_severity && k.anomaly_severity !== "normale"
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col min-h-screen md:ml-56 transition-all">
        <main className="flex-1 pt-10 pb-10 px-2 md:px-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Alertes détectées</h1>
          {isLoading ? (
            <div className="text-blue-600 text-lg my-10 text-center animate-pulse">
              Chargement des alertes…
            </div>
          ) : alertes.length > 0 ? (
            <div className="space-y-4">
              {alertes.map((a, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded shadow-md border-l-4 bg-white
                    ${
                      a.anomaly_severity === "élevée"
                        ? "border-red-600"
                        : a.anomaly_severity === "moyenne"
                        ? "border-orange-400"
                        : "border-yellow-300"
                    }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold">
                      {a.nom} [{a.technologie}]
                    </span>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold
                        ${
                          a.anomaly_severity === "élevée"
                            ? "bg-red-600 text-white"
                            : a.anomaly_severity === "moyenne"
                            ? "bg-orange-400 text-white"
                            : "bg-yellow-300 text-black"
                        }`}
                    >
                      {a.anomaly_severity}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <b>Wilaya:</b> {a.zone?.nom} &nbsp; | &nbsp;
                    <b>Date:</b> {a.date}
                  </div>
                  <div className="text-sm">
                    <b>Valeur:</b> {a.valeur}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-600 text-lg my-10 text-center">
              Aucune alerte détectée.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AlertesPage;
