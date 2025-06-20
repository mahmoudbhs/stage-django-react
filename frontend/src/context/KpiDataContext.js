// src/context/KpiDataContext.js

import React, { createContext, useContext, useEffect, useState } from "react";

const KpiDataContext = createContext();

export const KpiDataProvider = ({ children }) => {
  const [kpis, setKpis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // On charge tous les KPI pour Alger, Chlef, Blida (pour toutes les technos)
    // On fait 3 fetch en parallèle et on fusionne
    const wilayas = ["Alger", "Chlef", "Blida"];
    const fetches = wilayas.map(w =>
      fetch(
        `http://127.0.0.1:8000/api/kpis/?page_size=10000&zone__nom=${encodeURIComponent(w)}`
      ).then(res => res.json())
    );
    Promise.all(fetches)
      .then(results => {
        // Fusionne tous les résultats de .results (car paginé)
        const allKpis = results.flatMap(r =>
          Array.isArray(r.results) ? r.results : []
        );
        setKpis(allKpis);
        setIsLoading(false);
        console.log(`✅ [KPIContext] ${allKpis.length} KPI chargés pour Alger, Chlef et Blida`);
      })
      .catch(err => {
        setIsLoading(false);
        setKpis([]);
        console.error("[KPIContext] Erreur chargement KPI :", err);
      });
  }, []);

  return (
    <KpiDataContext.Provider value={{ kpis, isLoading }}>
      {children}
    </KpiDataContext.Provider>
  );
};

export const useKpis = () => useContext(KpiDataContext);
