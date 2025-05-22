import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    bestseller: false,
    image: "",
    //date: "", // Added date field
  });

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.post(`${backendUrl}/api/product/single`, { productId: id });
        if (response.data.success) {
          setProductData(response.data.product);
        } else {
          toast.error("Failed to fetch product details.");
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'quantity') {
      const numValue = Number(value);
      if (numValue > 0 || value === "") {
        setProductData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setProductData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (productData.quantity < 1) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    try {
      const updatedData = {
        ...productData,
        date: new Date().toISOString().split('T')[0], 
      };

      const response = await axios.put(`${backendUrl}/api/product/update/${id}`, updatedData);
      if (response.data.success) {
        toast.success("Product updated successfully!");
        navigate("/list");
      } else {
        toast.error("Failed to update product.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 border rounded-lg shadow-2xl bg-white">
      <h2 className="text-3xl font-semibold mb-6 text-center text-blue-900">Update Product</h2>

      {/* Display Product Image */}
      {productData.image && (
        <div className="flex justify-center mb-4">
          <img src={productData.image} alt={productData.name} className="w-32 h-32 object-cover rounded-md" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Product Description</label>
          <textarea
            rows={4}
            name="description"
            value={productData.description}
            onChange={handleChange}
            placeholder="Enter description"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Product Category</label>
          <select
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          >
            <option value="Supplements">Supplements</option>
            <option value="Fitness Equipments">Fitness Equipments</option>
            <option value="Accessories">Accessories</option>
            <option value="Essentials">Essentials</option>
            <option value="Gym Hygiene & Safety">Gym Hygiene & Safety</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Product Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            placeholder="Enter price"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Product Quantity</label>
          <input
            type="number"
            name="quantity"
            value={productData.quantity}
            onChange={handleChange}
            placeholder="Enter quantity (must be greater than 0)"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="bestseller"
            checked={productData.bestseller}
            onChange={handleChange}
            className="w-5 h-5 focus:ring-2 focus:ring-blue-500"
          />
          <label className="text-sm font-semibold text-gray-700">Add to Bestseller</label>
        </div>

        {/* Display or allow editing of date */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Product Date</label>
          <input
            type="date"
            name="date"
            value={productData.date ? productData.date : new Date().toISOString().split('T')[0]} // Default to current date if not set
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-3 px-6 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 transition flex items-center justify-center space-x-2"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
