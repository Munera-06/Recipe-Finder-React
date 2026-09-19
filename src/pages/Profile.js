import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  // Show only first 4 favorites as preview
  const recentFavorites = user.favorites.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FDF8F5] pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2C1810]">
            My Profile
          </h1>
          <p className="text-[#6B5E57] mt-2">
            Manage your account and saved recipes
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-[#EDE4DE] p-8 mb-8">
          <h2 className="text-xl font-semibold text-[#2C1810] mb-6">
            Account Information
          </h2>

          <div className="space-y-5">
            <div className="bg-[#FDF8F5] border border-[#EDE4DE] p-4 rounded-lg">
              <p className="text-sm text-[#6B5E57] mb-1">Name</p>
              <p className="text-lg font-medium text-[#2C1810]">{user.name}</p>
            </div>

            <div className="bg-[#FDF8F5] border border-[#EDE4DE] p-4 rounded-lg">
              <p className="text-sm text-[#6B5E57] mb-1">Email</p>
              <p className="text-lg font-medium text-[#2C1810]">{user.email}</p>
            </div>

            <div className="bg-[#FDF8F5] border border-[#EDE4DE] p-4 rounded-lg">
              <p className="text-sm text-[#6B5E57] mb-1">Saved Favorites</p>
              <p className="text-lg font-medium text-[#2C1810]">
                {user.favorites.length} recipe{user.favorites.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Saved Favorites Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-[#EDE4DE] p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#2C1810]">
              Saved Favorites
            </h2>

            {user.favorites.length > 0 && (
              <Link
                to="/favorites"
                className="text-[#C45C26] hover:text-[#A34A1E] font-medium text-sm transition"
              >
                View All →
              </Link>
            )}
          </div>

          {user.favorites.length === 0 ? (
            <p className="text-[#6B5E57]">
              You haven’t saved any recipes yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentFavorites.map((recipe) => (
                <div
                  key={recipe.idMeal}
                  className="flex items-center gap-4 bg-[#FDF8F5] border border-[#EDE4DE] rounded-lg p-3"
                >
                  <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#2C1810] text-sm line-clamp-2">
                      {recipe.strMeal}
                    </p>
                    <p className="text-xs text-[#6B5E57] mt-1">
                      {recipe.strCategory}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-[#C45C26] hover:bg-[#A34A1E] text-white py-3.5 rounded-lg font-medium transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;