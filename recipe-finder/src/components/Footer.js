import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#1A0F0A] text-white">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-[#C45C26] via-[#E8D5C4] to-[#C45C26]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand Section */}
          <div className="md:col-span-5">
            <h2 className="text-2xl font-bold tracking-tight mb-3">
              FlavorVault
            </h2>
            <p className="text-[#D4C4B5] text-sm leading-relaxed max-w-sm">
              Your personal kitchen companion. Discover recipes from around the world, 
              save your favorites, and plan your weekly meals with ease.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#E8D5C4] mb-4">
              Navigate
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/"
                  className="text-[#D4C4B5] hover:text-white text-sm transition duration-200"
                >
                  Discover Recipes
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className="text-[#D4C4B5] hover:text-white text-sm transition duration-200"
                >
                  My Favorites
                </Link>
              </li>
              <li>
                <Link
                  to="/planner"
                  className="text-[#D4C4B5] hover:text-white text-sm transition duration-200"
                >
                  Meal Planner
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-[#D4C4B5] hover:text-white text-sm transition duration-200"
                >
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#E8D5C4] mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5 text-sm text-[#D4C4B5]">
              <li>
                <a
                  href="https://www.themealdb.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition duration-200"
                >
                  TheMealDB API
                </a>
              </li>
              <li className="pt-1">
                <span className="text-[#A89B94]">
                  Recipes powered by TheMealDB
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#3D2B22] mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[#A89B94] text-sm">
            © {new Date().getFullYear()} FlavorVault. All rights reserved.
          </p>
          <p className="text-[#A89B94] text-sm">
            Crafted for home cooks
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;