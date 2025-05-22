import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Supplements");
  const [quantity, setQuantity] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (price < 1) {
      toast.error("Price must be at least 1");
      return;
    }

    if (quantity < 1) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("quantity", quantity);
    formData.append("bestseller", bestseller);
    formData.append("date", date);

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(backendUrl + "/api/product/add", formData, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setImage(null);
        setName("");
        setDescription("");
        setPrice("");
        setCategory("Supplements");
        setQuantity("");
        setBestseller(false);
        setDate("");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${assets.front_image})` }}
    >
      <form
        className="flex flex-col w-full items-start gap-6 p-6 rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        {/* Image Upload Section */}
        <div>
          <p className="mb-3 text-lg font-semibold text-white">Upload Image</p>
          <div className="flex gap-4 items-center">
            <label htmlFor="image1" className="cursor-pointer">
              <img
                className="w-32 h-32 object-cover rounded-md border-2 border-gray-300"
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt="Uploaded Preview"
              />
              <input
                type="file"
                id="image1"
                hidden
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    setImage(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* Product Name Section */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 items-center">
            <label className="text-sm font-medium text-black bg-white p-2 rounded-md shadow-lg">Product Name</label>
            <input
              className="w-full max-w-[500px] px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-opacity-80 bg-white text-black"
              type="text"
              placeholder="Type here"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Product Description Section */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 items-center">
            <label className="text-sm font-medium text-black bg-white p-2 rounded-md shadow-lg">Product Description</label>
            <textarea
              className="w-full max-w-[500px] px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-opacity-80 bg-white text-black"
              placeholder="Write content here"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Product Category Section */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 items-center">
            <label className="text-sm font-medium text-black bg-white p-2 rounded-md shadow-lg">Product Category</label>
            <select
              className="w-full max-w-[500px] px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-opacity-80 bg-white text-black"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Supplements">Supplements</option>
              <option value="Fitness Equipments">Fitness Equipments</option>
              <option value="Accessories">Accessories</option>
              <option value="Essentials">Essentials</option>
              <option value="Gym Hygiene & Safety">Gym Hygiene & Safety</option>
            </select>
          </div>
        </div>

        {/* Product Price Section */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 items-center">
            <label className="text-sm font-medium text-black bg-white p-2 rounded-md shadow-lg">Product Price</label>
            <input
              className="w-full sm:w-[120px] px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-opacity-80 bg-white text-black"
              type="number"
              placeholder="25"
              value={price}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 0 || e.target.value === "") {
                  setPrice(e.target.value);
                }
              }}
              required
            />
          </div>
        </div>

        {/* Product Quantity Section */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 items-center">
            <label className="text-sm font-medium text-black bg-white p-2 rounded-md shadow-lg">Product Quantity</label>
            <input
              className="w-full sm:w-[120px] px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-opacity-80 bg-white text-black"
              type="number"
              placeholder="5"
              value={quantity}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value > 0 || e.target.value === "") {
                  setQuantity(e.target.value);
                }
              }}
              required
            />
          </div>
        </div>

        {/* Product Date Section */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 items-center">
            <label className="text-sm font-medium text-black bg-white p-2 rounded-md shadow-lg">Product Date</label>
            <input
              className="w-full sm:w-[200px] px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-opacity-80 bg-white text-black"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Bestseller Section */}
        <div className="flex gap-2 mt-4">
          <input
            type="checkbox"
            id="bestseller"
            checked={bestseller}
            onChange={(e) => setBestseller(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="bestseller" className="text-sm font-medium text-black bg-white p-2 rounded-md shadow-lg">
            Mark as Bestseller
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Add;
