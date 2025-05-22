import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [membershipType, setMembershipType] = useState("");
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract form data
    const name = e.target.name.value;
    const email = e.target.email.value;
    let contactNumber = e.target.contactNumber.value;
    const gender = e.target.gender.value;
    const age = e.target.age.value;

    // Validate contact number
    if (!/^0\d{9}$/.test(contactNumber)) {
      toast.error("Contact number must start with 0 and contain exactly 10 digits.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Validate age
    if (age < 1 || age > 100) {
      toast.error("Age must be between 1 and 100.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!membershipType) {
      toast.error("Please select a membership type.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!paymentReceipt) {
      toast.error("Please upload a payment receipt.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("contactNumber", contactNumber);
      formData.append("gender", gender);
      formData.append("age", age);
      formData.append("membershipType", membershipType);
      formData.append("paymentReceipt", paymentReceipt);
      const response = await fetch("http://localhost:4000/api/user/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Registration Successful!", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => navigate("/login"), 3000);
      } else {
        toast.error(data.message || "Registration Failed", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("An error occurred during registration.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleContactNumberChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, "");
    if (value && !value.startsWith("0")) {
      value = "0" + value.slice(1);
    }
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    e.target.value = value;
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form
          className="bg-gray-800 shadow-xl rounded-xl p-8 border border-gray-700"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Join FitFlow Gym </p>
          </div>

          {/* Name Field */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              placeholder="Enter name"
              required
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              placeholder="Enter email"
              required
            />
          </div>

          {/* Contact Number Field */}
          <div className="mb-4">
            <label htmlFor="contactNumber" className="block text-gray-300 mb-2">
              Contact Number
            </label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              placeholder="07XXXXXXXX"
              maxLength={10}
              onChange={handleContactNumberChange}
              required
            />
          </div>

          {/* Gender and Age Fields */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="gender" className="block text-gray-300 mb-2">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                required
                defaultValue=""
              >
                <option value="" disabled>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label htmlFor="age" className="block text-gray-300 mb-2">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                placeholder="YY"
                min="1"
                max="100"
                required
              />
            </div>
          </div>

          {/* Membership Management Dropdown */}
          <div className="mb-4">
            <label htmlFor="membershipType" className="block text-gray-300 mb-2">
              Membership Management
            </label>
            <select
              id="membershipType"
              name="membershipType"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={membershipType}
              onChange={e => setMembershipType(e.target.value)}
              required
            >
              <option value="" disabled>Select Membership Type</option>
              <option value="monthly">Monthly</option>
              <option value="3months">3 Months</option>
              <option value="6months">6 Months</option>
              <option value="annual">Annual</option>
            </select>
          </div>

          {/* Payment Receipt Upload */}
          <div className="mb-6">
            <label htmlFor="paymentReceipt" className="block text-gray-300 mb-2">
              Payment Receipt
            </label>
            <input
              type="file"
              id="paymentReceipt"
              name="paymentReceipt"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              onChange={(e) => setPaymentReceipt(e.target.files[0])}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Sign Up
          </button>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-orange-500 hover:text-orange-400 font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;