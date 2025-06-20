import React from "react";
import Sidebar from "../components/Sidebar";
import { useFilters } from "../context/FilterContext";
import { useKpis } from "../context/KpiDataContext";
import jsPDF from "jspdf";
import "jspdf-autotable";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";

const RapportPage = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { filters } = useFilters();
  const { region, technologie, selectedYear, selectedDate } = filters;
  const { kpis, isLoading } = useKpis();

  // Pour l'e-mail modal
  const { user } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  // Filtrage local
  const anomalies = (kpis || []).filter(
    k =>
      (!region || k.zone?.nom === region) &&
      (!technologie || k.technologie === technologie) &&
      (!selectedDate || k.date === selectedDate) &&
      (!selectedYear || k.date.startsWith(String(selectedYear))) &&
      k.anomaly_severity && k.anomaly_severity !== "normale"
  );

  // --------- CSV EXPORT ---------
  const handleExportCSV = () => {
    const header = [
      "Date", "Wilaya", "Technologie", "KPI", "Valeur", "Sévérité", "Explication"
    ];
    const rows = anomalies.map(k => [
      k.date,
      k.zone?.nom,
      k.technologie,
      k.nom,
      k.valeur,
      k.anomaly_severity,
      k.rapport_detaille || k.anomaly_pourquoi || "—"
    ]);
    const csvContent = [
      header,
      ...rows
    ]
      .map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(";"))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "rapport-anomalies.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --------- PDF EXPORT ---------
  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4"
    });
    doc.text("Rapport des anomalies KPI", 40, 40);
    doc.autoTable({
      startY: 60,
      head: [
        ["Date", "Wilaya", "Technologie", "KPI", "Valeur", "Sévérité", "Explication"]
      ],
      body: anomalies.map(k => [
        k.date,
        k.zone?.nom,
        k.technologie,
        k.nom,
        k.valeur,
        k.anomaly_severity,
        k.rapport_detaille || k.anomaly_pourquoi || "—"
      ]),
      styles: { fontSize: 8, cellPadding: 4 },
      headStyles: { fillColor: [226, 0, 16] },
      margin: { left: 40, right: 40 }
    });
    doc.save("rapport-anomalies.pdf");
  };

  // --------- ENVOI MAIL ---------
  const handleSendMail = () => {
    setSent(true);
    setTimeout(() => {
      setModalOpen(false);
      setSent(false);
    }, 1700);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col min-h-screen md:ml-56 transition-all">
        <main className="flex-1 pt-10 pb-10 px-2 md:px-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Rapport des anomalies KPI</h1>
          {/* Boutons d'export */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleExportCSV}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl font-semibold shadow transition"
            >
              Exporter en CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="bg-[#E20010] hover:bg-red-700 text-white px-6 py-2 rounded-xl font-semibold shadow transition"
            >
              Exporter en PDF
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold shadow transition"
            >
              Envoyer par e-mail
            </button>
          </div>
          
          {/* MODAL ENVOI MAIL */}
          {modalOpen && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 shadow-2xl w-[350px] flex flex-col gap-3">
                <h2 className="text-xl font-bold mb-2">Envoi par e-mail</h2>
                <div className="mb-3">
                  <span className="font-semibold text-gray-700">Destinataire :</span>
                  <span className="ml-2">{user?.email || "Non connecté"}</span>
                </div>
                <button
                  onClick={handleSendMail}
                  className="bg-[#E20010] hover:bg-red-700 text-white px-6 py-2 rounded-xl font-semibold shadow transition mb-2"
                >
                  {sent ? "📤 Envoi..." : "Envoyer le rapport"}
                </button>
                {sent && <div className="text-green-600 font-semibold">Mail envoyé !</div>}
                <button onClick={() => setModalOpen(false)} className="text-gray-500 underline">Annuler</button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="text-blue-600 text-lg my-10 text-center animate-pulse">
              Chargement des rapports…
            </div>
          ) : anomalies.length === 0 ? (
            <div className="bg-green-100 text-green-700 p-4 rounded text-center font-semibold">
              Aucune anomalie détectée avec ce filtrage.
            </div>
          ) : (
            <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 bg-white">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border-b">Date</th>
                    <th className="px-4 py-2 border-b">Wilaya</th>
                    <th className="px-4 py-2 border-b">Technologie</th>
                    <th className="px-4 py-2 border-b">KPI</th>
                    <th className="px-4 py-2 border-b">Valeur</th>
                    <th className="px-4 py-2 border-b">Sévérité</th>
                    <th className="px-4 py-2 border-b">Explication</th>
                  </tr>
                </thead>
                <tbody>
                  {anomalies.map((k, idx) => (
                    <tr key={idx} className="text-center hover:bg-gray-50 transition-all">
                      <td className="px-4 py-2 border-b">{k.date}</td>
                      <td className="px-4 py-2 border-b">{k.zone?.nom}</td>
                      <td className="px-4 py-2 border-b">{k.technologie}</td>
                      <td className="px-4 py-2 border-b">{k.nom}</td>
                      <td
                        className={`px-4 py-2 border-b font-bold ${
                          k.anomaly_severity === "élevée"
                            ? "text-red-600"
                            : k.anomaly_severity === "moyenne"
                            ? "text-orange-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {k.valeur}
                      </td>
                      <td className="px-4 py-2 border-b">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-bold uppercase ${
                            k.anomaly_severity === "élevée"
                              ? "bg-red-100 text-red-600"
                              : k.anomaly_severity === "moyenne"
                              ? "bg-orange-100 text-orange-600"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {k.anomaly_severity}
                        </span>
                      </td>
                      <td className="px-4 py-2 border-b text-left text-xs max-w-xs break-words whitespace-pre-line">
                        {k.rapport_detaille || k.anomaly_pourquoi || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RapportPage;
