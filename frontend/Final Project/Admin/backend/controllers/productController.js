import { v2 as cloudinary } from "cloudinary";  // Ensure Cloudinary is imported
import productModel from "../models/productModel.js";

// Function to add a product
const addProduct = async (req, res) => {
    try {
        console.log("REQ.FILES: ", req.files);  // Log uploaded files
        console.log("REQ.BODY: ", req.body);  // Log body of request

        const { name, description, price, category, quantity, bestseller } = req.body;

        const images = req.files ? Object.values(req.files).flat().map(file => file.path) : [];
        console.log("Extracted Images: ", images);  // Log the extracted image paths

        const imagePath = req.file.path;
        const result = await cloudinary.uploader.upload(imagePath, {resource_type: 'image'})

        // Create product data
        const productData = {
            name,
            description,
            price: Number(price),
            category,
            quantity: Number(quantity),
            bestseller: bestseller === "true", // Convert to boolean
            image: result.secure_url,  // Fix: Use `imageUrls` instead of undefined `imagesUrl`
            date: Date.now(),
            
        };

       // console.log(productData);

        // Save the product to the database
        const product = new productModel(productData);
        await product.save();

        // Send response after saving (Only **ONE** response)
        return res.json({ success: true, message: "Product added successfully", product });

    } catch (error) {
        console.error("Error in addProduct:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Other functions (listProducts, removeProduct, etc.)
const listProducts = async (req, res) => {
    // Implement this function
    try{
        const products = await productModel.find({});
        res.json({success:true,products})
    }catch(error)
    {
        console.log(error)
        res.json({ success: false, message: error.message})
    }

};

const removeProduct = async (req, res) => {
    // Implement this function
    try{
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true, message:"product removed"})
    }catch(error){
res.json({ success: false, message: error.message })
    }
};

const singleProduct = async (req, res) => {
    // Implement this function
    try{

        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success:true, product})

    }catch (error){
        console.log(error)
        res.json({ success: false, message: error.message})
    }
};
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params; // Extract id from URL params
        const { name, description, price, category, quantity, bestseller } = req.body;

        //console.log(id)

        // Validate if the ID is provided
        if (id==null) {
            return res.status(400).json({ success: false, message: "Product ID is required." });
        }

        // Validate and safely convert price
        let numericPrice = undefined;
         if (price !== undefined) {
            if (isNaN(price)) {
                return res.status(400).json({ success: false, message: "Invalid price format." });
            } else {
                numericPrice = Number(price);
            }
        }

        // Prepare the updated product data
        const updatedProductData = { name, description, price: numericPrice, category, quantity, bestseller };

        // Find and update the product
        const updatedProduct = await productModel.findByIdAndUpdate(id, updatedProductData, { new: true });

        console.log(updatedProductData)

        // Check if the product was found and updated
        /*/if (updatedProduct==null) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }*/

        // Successfully updated product
        res.json({ success: true, message: "Product updated successfully!", updatedProduct });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get low stock products (quantity < 10)
const getLowStockProducts = async (req, res) => {
    try {
        const lowStockProducts = await productModel.find({ quantity: { $lt: 10 } });
        res.json({
            success: true,
            products: lowStockProducts
        });
    } catch (error) {
        console.error('Error fetching low stock products:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching low stock products",
            error: error.message
        });
    }
};

// **Ensure all functions are exported**
export { listProducts, addProduct, removeProduct, singleProduct, updateProduct, getLowStockProducts };
