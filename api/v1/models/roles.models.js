const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema({
    title: String,
    description: String,
    permissions: {
        type: Array,
        default: []
    },
    slug: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,

 }, 
 {
    timestamps: true
 });

const Product = mongoose.model("Role", roleSchema, "roles");

module.exports = Product;
