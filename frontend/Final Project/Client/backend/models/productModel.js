//productModel.js
import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: {type:String, required:true},
    description: {type:String, required:true},
    price: {type:Number, required:true},
    image: {type:String, required:true},
    category: {type:String, required:true},
    quantity: { type:Number, required:true},
    bestseller: { type: Boolean},
    date: {type:Number, required:true},

})

const productModel = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel