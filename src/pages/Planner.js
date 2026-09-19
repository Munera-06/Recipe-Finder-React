import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function Planner() {
  const API_URL = "https://www.themealdb.com/api/json/v1/1";
  const { user } = useAuth();

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [plan, setPlan] = useState(() => {
    const saved = localStorage.getItem("mealPlan");
    return saved
      ? JSON.parse(saved)
      : {
          Monday: null,
          Tuesday: null,
          Wednesday: null,
          Thursday: null,
          Friday: null,
          Saturday: null,
          Sunday: null,
        };
  });

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    localStorage.setItem("mealPlan", JSON.stringify(plan));
  }, [plan]);

  const searchRecipes = async () => {
    if (!search.trim()) {
      setError("Please enter a recipe name");
      return;
    }

    setLoading(true);
    setError("");
    setSearchResults([]);

    try {
      const res = await fetch(
        `${API_URL}/search.php?s=${encodeURIComponent(search)}`
      );
      const data = await res.json();

      if (data.meals) {
        setSearchResults(data.meals);
      } else {
        setError("No recipes found. Try another name.");
      }
    } catch (err) {
      setError("Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  const getRandomRecipe = async () => {
    setLoading(true);
    setError("");
    setSearchResults([]);

    try {
      const res = await fetch(`${API_URL}/random.php`);
      const data = await res.json();
      if (data.meals) setSearchResults(data.meals);
    } catch (err) {
      setError("Unable to get random recipe");
    } finally {
      setLoading(false);
    }
  };

  const addToDay = (day, recipe) => {
    setPlan({ ...plan, [day]: recipe });
  };

  const removeFromDay = (day) => {
    setPlan({ ...plan, [day]: null });
  };

  const clearWholeWeek = () => {
    setPlan({
      Monday: null,
      Tuesday: null,
      Wednesday: null,
      Thursday: null,
      Friday: null,
      Saturday: null,
      Sunday: null,
    });
  };

  const viewRecipe = async (id) => {
    try {
      const res = await fetch(`${API_URL}/lookup.php?i=${id}`);
      const data = await res.json();
      if (data.meals) {
        setSelectedRecipe(data.meals[0]);
      }
    } catch (err) {
      setError("Could not load recipe details");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F5] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* ========== HEADER ========== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#2C1810]">
              Weekly Meal Planner
            </h1>
            <p className="text-[#6B5E57] mt-2 text-lg">
              Plan your meals, view full recipes, and watch cooking videos
            </p>
          </div>

          <button
            onClick={clearWholeWeek}
            className="bg-[#C45C26] hover:bg-[#A34A1E] text-white px-6 py-3 rounded-lg font-medium transition duration-200"
          >
            Clear Entire Week
          </button>
        </div>

        {/* ========== WEEKLY PLAN ========== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {days.map((day) => (
            <div
              key={day}
              className="bg-white rounded-xl shadow-sm border border-[#EDE4DE] overflow-hidden hover:shadow-md transition"
            >
              <div className="bg-[#2C1810] text-white text-center py-3 font-semibold tracking-wide">
                {day}
              </div>

              <div className="p-5">
                {plan[day] ? (
                  <div>
                    <img
                      src={plan[day].strMealThumb}
                      alt={plan[day].strMeal}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-semibold text-[#2C1810] text-lg mb-1 line-clamp-2">
                      {plan[day].strMeal}
                    </h3>
                    <p className="text-sm text-[#6B5E57] mb-5">
                      {plan[day].strCategory} • {plan[day].strArea}
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => viewRecipe(plan[day].idMeal)}
                        className="flex-1 bg-[#2C1810] hover:bg-[#1A0F0A] text-white py-2.5 rounded-lg text-sm font-medium transition"
                      >
                        View Recipe
                      </button>
                      <button
                        onClick={() => removeFromDay(day)}
                        className="px-4 bg-[#F5EAE4] hover:bg-[#EBD9CF] text-[#C45C26] rounded-lg text-sm font-medium transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-52 flex flex-col items-center justify-center text-[#A89B94]">
                    <span className="text-3xl mb-2">🍽️</span>
                    <p className="text-sm">No meal planned</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ========== SEARCH SECTION ========== */}
        <div className="bg-white rounded-xl shadow-sm border border-[#EDE4DE] p-6 mb-12">
          <h2 className="text-2xl font-semibold text-[#2C1810] mb-6">
            Find Recipes
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchRecipes()}
              placeholder="Search for chicken, pasta, salad..."
              className="flex-1 border border-[#D9CBC3] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C45C26] focus:border-transparent"
            />

            <button
              onClick={searchRecipes}
              className="bg-[#C45C26] hover:bg-[#A34A1E] text-white px-8 py-3 rounded-lg font-medium transition"
            >
              Search
            </button>

            <button
              onClick={getRandomRecipe}
              className="bg-[#2C1810] hover:bg-[#1A0F0A] text-white px-8 py-3 rounded-lg font-medium transition"
            >
              Random Recipe
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-[#FDF0EB] text-[#C45C26] p-3 rounded-lg text-center text-sm font-medium">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block w-10 h-10 border-4 border-[#EDE4DE] border-t-[#C45C26] rounded-full animate-spin"></div>
              <p className="mt-4 text-[#6B5E57]">Loading recipes...</p>
            </div>
          )}
        </div>

        {/* ========== SEARCH RESULTS ========== */}
        {!loading && searchResults.length > 0 && (
          <div className="mb-14">
            <h3 className="text-xl font-semibold text-[#2C1810] mb-6">
              Search Results ({searchResults.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((recipe) => (
                <div
                  key={recipe.idMeal}
                  className="bg-white rounded-xl shadow-sm border border-[#EDE4DE] overflow-hidden hover:shadow-md transition"
                >
                  <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="w-full h-44 object-cover"
                  />

                  <div className="p-5">
                    <h3 className="font-semibold text-[#2C1810] mb-1 line-clamp-2">
                      {recipe.strMeal}
                    </h3>
                    <p className="text-sm text-[#6B5E57] mb-4">
                      {recipe.strCategory} • {recipe.strArea}
                    </p>

                    <button
                      onClick={() => viewRecipe(recipe.idMeal)}
                      className="w-full bg-[#2C1810] hover:bg-[#1A0F0A] text-white py-2.5 rounded-lg text-sm font-medium mb-3 transition"
                    >
                      View Recipe
                    </button>

                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          addToDay(e.target.value, recipe);
                          e.target.value = "";
                        }
                      }}
                      className="w-full border border-[#D9CBC3] rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C45C26]"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Add to day...
                      </option>
                      {days.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========== FAVORITES ========== */}
        {user?.favorites?.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-[#2C1810] mb-6">
              From Your Favorites
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {user.favorites.map((recipe) => (
                <div
                  key={recipe.idMeal}
                  className="bg-white rounded-xl shadow-sm border border-[#EDE4DE] p-4"
                >
                  <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="w-full h-28 object-cover rounded-lg mb-3"
                  />
                  <p className="font-medium text-[#2C1810] text-sm mb-3 line-clamp-2">
                    {recipe.strMeal}
                  </p>

                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addToDay(e.target.value, recipe);
                        e.target.value = "";
                      }
                    }}
                    className="w-full border border-[#D9CBC3] rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C45C26]"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Add to day...
                    </option>
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========== RECIPE DETAILS MODAL ========== */}
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

export default Planner;