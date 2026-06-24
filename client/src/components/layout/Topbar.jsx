import { Menu, Moon, Sun, LogOut, User } from "lucide-react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar({ onMenuClick }) {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm border-b border-gray-100 dark:border-dark-700">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        <button onClick={onMenuClick} className="lg:hidden btn-ghost p-2">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <button onClick={toggleDarkMode} className="btn-ghost p-2">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link to="/profile" className="btn-ghost p-2">
            <User className="w-5 h-5" />
          </Link>
          <button onClick={handleLogout} className="btn-ghost p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
