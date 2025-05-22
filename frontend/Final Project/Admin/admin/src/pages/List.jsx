import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { assets } from "../assets/assets"; // Assuming the path to assets is correct

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const currency = "Rs. ";

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
        setFilteredList(response.data.products);
        const uniqueCategories = [
          ...new Set(response.data.products.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCategories((prevSelected) =>
      checked
        ? [...prevSelected, value]
        : prevSelected.filter((category) => category !== value)
    );
  };

  const filterProducts = () => {
    let filtered = list;
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.category)
      );
    }
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredList(filtered);
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategories, searchTerm]);

  return (
    <div
      /*className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${assets.front_image})`, 
      }}*/
    >
      <p className="mb-2 text-2xl font-bold text-center text-white">ALL PRODUCTS LIST</p>

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder=" Search by name "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className=" px-4 py-2 border rounded w-3/4 text-black"
        />
      </div>

      <div className="mb-4">
        <p className="font-semibold text-black">Filter by Category</p>
        <div className="flex gap-4">
          {categories.map((category, index) => (
            <label key={index} className="flex items-center text-black">
              <input
                type="checkbox"
                value={category}
                onChange={handleCategoryChange}
                className="mr-2"
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center py-2 px-4 border-b bg-gray-700 text-sm font-semibold text-white">
          <p className="text-center">Name</p>
          <p className="text-center">Bestseller</p>
          <p className="text-center">Category</p>
          <p className="text-center">Quantity</p>
          <p className="text-center">Stock Status</p>
          <p className="text-center">Price</p>
          <p className="text-center">Date</p>
          <p className="text-center">Actions</p>
        </div>

        {filteredList.length > 0 ? (
          filteredList.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center py-2 px-4 border-b bg-white bg-opacity-50 text-black"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <p className="font-bold">{item.name}</p>
              </div>
              <p className="font-bold text-center">{item.bestseller ? "Yes" : "No"}</p>
              <p className="font-bold text-center">{item.category}</p>
              <p className="font-bold text-center">{item.quantity || 0}</p>
              <p className={`font-bold text-center ${item.quantity >= 20 ? 'text-green-600' : 'text-red-600'}`}>
                {item.quantity >= 20 ? 'Optimum' : 'Restock'}
              </p>
              <p className="font-bold text-center">{currency}{item.price}</p>
              <p className="font-bold text-center">{new Date(item.date).toLocaleDateString()}</p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => navigate(`/product/update/${item._id}`)}
                  className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
                >
                  Update
                </button>
                <button
                  onClick={() => removeProduct(item._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">No products available</p>
        )}
      </div>
    </div>
  );
};

export default List;
