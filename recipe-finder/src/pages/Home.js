import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function Home() {
  const API_URL = "https://www.themealdb.com/api/json/v1/1";

  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("chicken");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user, toggleFavorite } = useAuth();

  // Search recipes
  const searchRecipes = async (recipeName = search) => {
    if (!recipeName.trim()) {
      setError("Please enter a recipe name");
      return;
    }

    setLoading(true);
    setError("");
    setRecipes([]);

    try {
      const response = await fetch(
        `${API_URL}/search.php?s=${encodeURIComponent(recipeName)}`
      );
      const data = await response.json();

      if (data.meals) {
        setRecipes(data.meals);
      } else {
        setError("No recipes found. Try another name.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load default recipes
  useEffect(() => {
    searchRecipes("chicken");
  }, []);

  // View full recipe
  const viewRecipe = async (id) => {
    try {
      const response = await fetch(`${API_URL}/lookup.php?i=${id}`);
      const data = await response.json();
      if (data.meals) {
        setSelectedRecipe(data.meals[0]);
      }
    } catch (err) {
      setError("Unable to load recipe details");
    }
  };

  const isFavorite = (id) => {
    return user?.favorites?.some((f) => f.idMeal === id);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F5] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2C1810]">
            Discover Recipes
          </h1>
          <p className="text-[#6B5E57] mt-2 text-lg">
            Search and explore delicious recipes from around the world
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-xl shadow-sm border border-[#EDE4DE] p-6 mb-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchRecipes()}
              placeholder="Search chicken, pasta, noodles, pizza..."
              className="flex-1 border border-[#D9CBC3] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C45C26] focus:border-transparent"
            />
            <button
              onClick={() => searchRecipes()}
              className="bg-[#C45C26] hover:bg-[#A34A1E] text-white px-8 py-3 rounded-lg font-medium transition"
            >
              Search
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 bg-[#FDF0EB] text-[#C45C26] p-4 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-[#EDE4DE] border-t-[#C45C26] rounded-full animate-spin"></div>
            <p className="mt-4 text-[#6B5E57]">Finding delicious recipes...</p>
          </div>
        )}

        {/* Recipe Results */}
        {!loading && recipes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-[#2C1810]">
                Recipe Results
              </h2>
              <p className="text-[#6B5E57]">
                {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
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

                    <div className="flex gap-2">
                      <button
                        onClick={() => viewRecipe(recipe.idMeal)}
                        className="flex-1 bg-[#2C1810] hover:bg-[#1A0F0A] text-white py-2.5 rounded-lg text-sm font-medium transition"
                      >
                        View Recipe
                      </button>

                      <button
                        onClick={() => toggleFavorite(recipe)}
                        className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                          isFavorite(recipe.idMeal)
                            ? "bg-[#C45C26] text-white"
                            : "bg-[#F5EAE4] text-[#C45C26] hover:bg-[#EBD9CF]"
                        }`}
                      >
                        {isFavorite(recipe.idMeal) ? "♥" : "♡"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recipe Details Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl">
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

              <div className="flex flex-wrap gap-3 mb-8">
                <span className="bg-[#F5EAE4] text-[#C45C26] px-4 py-1.5 rounded-full text-sm font-medium">
                  {selectedRecipe.strCategory}
                </span>
                <span className="bg-[#F0F4F3] text-[#2C1810] px-4 py-1.5 rounded-full text-sm font-medium">
                  {selectedRecipe.strArea}
                </span>
              </div>

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

              <h3 className="text-xl font-semibold text-[#2C1810] mb-4">
                Instructions
              </h3>
              <p className="text-[#4A3F39] leading-8 whitespace-pre-line mb-8">
                {selectedRecipe.strInstructions}
              </p>

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

export default Home;