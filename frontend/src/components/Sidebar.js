import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, BarChart2, AlertCircle, FileText, Settings, Menu, Users, LogOut } from "lucide-react";
import { useContext } from "react";
import AuthContext from "../context/AuthContext"; // <-- chemin adapté à ton projet

const nav = [
  { name: "Dashboard", to: "/dashboard", icon: <LayoutDashboard /> },
  { name: "KPI", to: "/kpi", icon: <BarChart2 /> },
  { name: "Alertes", to: "/alertes", icon: <AlertCircle /> },
  { name: "Rapports", to: "/rapports", icon: <FileText /> },
  { name: "Rôles", to: "/roles", icon: <Users /> },
  { name: "Paramètres", to: "/parametres", icon: <Settings /> }
];

const Sidebar = ({ open, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutUser } = useContext(AuthContext); // <- attention au nom ici !

  const handleLogout = () => {
    logoutUser(); // <-- ici aussi
    navigate("/login");
  };

  return (
    <div>
      {/* ... NAVIGATION ... */}
      <aside className="fixed z-50 inset-y-0 left-0 bg-[#E20010] text-white flex flex-col transition-all duration-300 shadow-lg
        ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-56 md:w-56">
        {/* ... entête et menu ... */}
        <nav className="flex-1 py-6 flex flex-col gap-2">
          {nav.map(item => (
            <Link
              key={item.name}
              to={item.to}
              className={`flex items-center gap-3 px-6 py-2 rounded-l-lg transition-all hover:bg-white/10 font-semibold ${
                location.pathname === item.to ? "bg-white/20" : ""
              }`}
              onClick={onToggle}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        {/* BOUTON DECONNEXION */}
        <div className="mt-auto pb-6 px-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 font-semibold text-red-200 hover:text-white transition"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
