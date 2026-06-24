import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Dumbbell,
  BookOpen,
  TrendingUp,
  Target,
  BarChart3,
  X,
} from "lucide-react";
import { NAV_LINKS } from "../../constants";

const iconMap = {
  LayoutDashboard,
  Dumbbell,
  BookOpen,
  TrendingUp,
  Target,
  BarChart3,
};

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-dark-800 border-r border-gray-100 dark:border-dark-700 z-50 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-dark-700">
          <NavLink to="/dashboard" className="flex items-center gap-2" onClick={onClose}>
            <Dumbbell className="w-7 h-7 text-primary-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              FitTrack
            </span>
          </NavLink>
          <button onClick={onClose} className="lg:hidden btn-ghost p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {NAV_LINKS.map((link) => {
            const Icon = iconMap[link.icon];
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "sidebar-link-active" : "sidebar-link-inactive"}`
                }
              >
                {Icon && <Icon className="w-5 h-5" />}
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
