import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Favorites() {
  const API_URL = "https://www.themealdb.com/api/json/v1/1";
  const { user, toggleFavorite } = useAuth();
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  if (!user) return null;

  // Load full recipe details
  const viewRecipe = async (id) => {
    setLoadingDetails(true);
    try {
      const res = await fetch(`${API_URL}/lookup.php?i=${id}`);
      const data = await res.json();
      if (data.meals) {
        setSelectedRecipe(data.meals[0]);
      }
    } catch (err) {
      console.error("Failed to load recipe details");
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F5] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2C1810]">
            My Favorites
          </h1>
          <p className="text-[#6B5E57] mt-2 text-lg">
            You have {user.favorites.length} saved recipe
            {user.favorites.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Empty State */}
        {user.favorites.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#EDE4DE] p-12 text-center shadow-sm">
            <p className="text-[#6B5E57] text-lg">
              No favorites yet. Go to Home and save some recipes!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {user.favorites.map((recipe) => (
              <div
                key={recipe.idMeal}
                className="bg-white rounded-xl shadow-sm border border-[#EDE4DE] overflow-hidden hover:shadow-md transition"
              >
                <img
                  src={recipe.strMealThumb}
                  alt={recipe.strMeal}
                  className="w-full h-48 object-cover"
                />

                <div className="p-5">
                  <h3 className="font-semibold text-[#2C1810] text-lg mb-2 line-clamp-2">
                    {recipe.strMeal}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="bg-[#F5EAE4] text-[#C45C26] px-3 py-1 rounded-full text-sm font-medium">
                      {recipe.strCategory}
                    </span>
                    <span className="bg-[#F0F4F3] text-[#2C1810] px-3 py-1 rounded-full text-sm font-medium">
                      {recipe.strArea}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => viewRecipe(recipe.idMeal)}
                      className="w-full bg-[#2C1810] hover:bg-[#1A0F0A] text-white py-2.5 rounded-lg text-sm font-medium transition"
                    >
                      View Recipe
                    </button>

                    <button
                      onClick={() => toggleFavorite(recipe)}
                      className="w-full bg-[#F5EAE4] hover:bg-[#EBD9CF] text-[#C45C26] py-2.5 rounded-lg text-sm font-medium transition"
                    >
                      Remove from Favorites
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Loading Details */}
      {loadingDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="inline-block w-10 h-10 border-4 border-[#EDE4DE] border-t-[#C45C26] rounded-full animate-spin"></div>
            <p className="mt-4 text-[#6B5E57] font-medium">Loading recipe...</p>
          </div>
        </div>
      )}

      {/* Recipe Details Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl">
            {/* Image + Close */}
            <div className="relative">
              <img
                src={selectedRecipe.strMealThumb}
                alt={selectedRecipe.strMeal}
                className="w-full h-64 md:h-80 object-cover rounded-t-2xl"
              />
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 bg-white w-11 h-11 rounded-full text-2xl font-bold shadow-md hover:bg-gray-100 transition"
              >
                ×
              </button>
            </div>

            <div className="p-6 md:p-8">
              <h2 className="text-3xl font-bold text-[#2C1810] mb-5">
                {selectedRecipe.strMeal}
              </h2>

              {/* Tags */}
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="bg-[#F5EAE4] text-[#C45C26] px-4 py-1.5 rounded-full text-sm font-medium">
                  {selectedRecipe.strCategory}
                </span>
                <span className="bg-[#F0F4F3] text-[#2C1810] px-4 py-1.5 rounded-full text-sm font-medium">
                  {selectedRecipe.strArea}
                </span>
              </div>

              {/* Ingredients */}
              <h3 className="text-xl font-semibold text-[#2C1810] mb-4">
                Ingredients
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                {Array.from({ length: 20 }, (_, i) => {
                  const ingredient = selectedRecipe[`strIngredient${i + 1}`];
                  const measure = selectedRecipe[`strMeasure${i + 1}`];
                  if (!ingredient || ingredient.trim() === "") return null;

                  return (
                    <div
                      key={i}
                      className="bg-[#FDF8F5] border border-[#EDE4DE] p-3 rounded-lg"
                    >
                      <span className="font-medium text-[#2C1810]">
                        {ingredient}
                      </span>
                      {measure && (
                        <span className="text-[#6B5E57]"> — {measure}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Instructions */}
              <h3 className="text-xl font-semibold text-[#2C1810] mb-4">
                Instructions
              </h3>
              <p className="text-[#4A3F39] leading-8 whitespace-pre-line mb-8">
                {selectedRecipe.strInstructions}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {selectedRecipe.strYoutube && (
                  <a
                    href={selectedRecipe.strYoutube}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#C45C26] hover:bg-[#A34A1E] text-white px-6 py-3 rounded-lg font-medium transition"
                  >
                    Watch Video
                  </a>
                )}

                {selectedRecipe.strSource && (
                  <a
                    href={selectedRecipe.strSource}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#2C1810] hover:bg-[#1A0F0A] text-white px-6 py-3 rounded-lg font-medium transition"
                  >
                    Visit Recipe Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Favorites;