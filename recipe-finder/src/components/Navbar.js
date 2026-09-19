import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Discover" },
    { path: "/favorites", label: "Favorites" },
    { path: "/planner", label: "Meal Planner" },
    { path: "/profile", label: "Profile" },
  ];

  return (
    <nav className="bg-[#1A0F0A] text-white sticky top-0 z-40">
      {/* Thin accent line */}
      <div className="h-0.5 bg-gradient-to-r from-[#C45C26] via-[#E8D5C4] to-[#C45C26]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link
            to="/"
            className="text-xl font-bold tracking-tight hover:text-[#E8D5C4] transition"
          >
            FlavorVault
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition duration-200 ${
                  isActive(link.path)
                    ? "text-[#E8D5C4]"
                    : "text-[#D4C4B5] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* User Info + Logout */}
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-[#3D2B22]">
              <span className="text-sm text-[#E8D5C4]">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-[#C45C26] hover:bg-[#A34A1E] text-white text-sm font-medium px-4 py-2 rounded-md transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-[#E8D5C4] hover:text-white transition"
          >
            {menuOpen ? (
              <span className="text-2xl">×</span>
            ) : (
              <span className="text-xl">☰</span>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-[#3D2B22]">
            <div className="flex flex-col gap-3 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm font-medium px-2 py-2 rounded transition ${
                    isActive(link.path)
                      ? "text-[#E8D5C4] bg-[#2C1810]"
                      : "text-[#D4C4B5] hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#3D2B22]">
                <span className="text-sm text-[#E8D5C4]">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-[#C45C26] hover:bg-[#A34A1E] text-white text-sm font-medium px-4 py-2 rounded-md transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;