import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      const success = login(email, password);
      if (success) {
        navigate("/");
      } else {
        setError("Wrong email or password");
      }
    } else {
      if (!name.trim()) {
        setError("Please enter your name");
        return;
      }
      const success = register(name, email, password);
      if (success) {
        navigate("/");
      } else {
        setError("Email already exists");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F5] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm border border-[#EDE4DE] p-8 w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2C1810]">
            FlavorVault
          </h1>
          <p className="text-[#6B5E57] mt-2">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-[#FDF0EB] text-[#C45C26] p-3 rounded-lg mb-5 text-center text-sm font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-[#2C1810] mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-[#D9CBC3] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C45C26] focus:border-transparent"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#2C1810] mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#D9CBC3] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C45C26] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C1810] mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#D9CBC3] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C45C26] focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#C45C26] hover:bg-[#A34A1E] text-white py-3 rounded-lg font-medium transition mt-2"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Switch Login / Register */}
        <p className="text-center mt-6 text-[#6B5E57] text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-[#C45C26] hover:text-[#A34A1E] font-medium transition"
          >
            {isLogin ? "Create Account" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;