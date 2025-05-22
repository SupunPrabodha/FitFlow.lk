import React, { useState } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for empty fields
    if (!email || !password) {
      toast.error("Please fill in both fields.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      // Send login data to backend
      const response = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // If login is successful, show success toast and redirect
        toast.success("Login Successful!", {
          position: "top-right",
          autoClose: 3000,
        });

        // Save token and user data to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userData", JSON.stringify(data.user));

        // Redirect to dashboard (or any protected route)
        setTimeout(() => navigate("/home"), 3000);
      } else {
        // Show error message if login fails
        toast.error(data.message || "Invalid email or password.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("An error occurred during login.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("User Profile", 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${userData.name || ""}`, 20, 40);
    doc.text(`Email: ${userData.email || ""}`, 20, 50);
    doc.text(`Contact Number: ${userData.contact || ""}`, 20, 60);
    doc.text(`Age: ${userData.age || ""}`, 20, 70);
    doc.text(`Gender: ${userData.gender || ""}`, 20, 80);
    doc.save("profile.pdf");
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form
          className="bg-gray-800 shadow-xl rounded-xl p-8 border border-gray-700"
          onSubmit={handleSubmit}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Sign in to access your account</p>
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              placeholder="your@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="remember-me" className="ml-2 block text-gray-300">
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-orange-500 hover:text-orange-400 text-sm"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Login
          </button>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-orange-500 hover:text-orange-400 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;