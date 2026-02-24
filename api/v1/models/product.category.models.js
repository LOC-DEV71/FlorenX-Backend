const mongoose = require("mongoose");
const productCategorySchema = new mongoose.Schema({
    title: String,
    parent_id: {
        type: String,
        default: "",
    },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: {
    type: Boolean,
    default: false
    },
    deletedAt: Date,
    slug: String,
}, { timestamps: true });

const Product = mongoose.model("ProductCategory", productCategorySchema, "products-category");

module.exports = Product;
