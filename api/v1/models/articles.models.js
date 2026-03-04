const mongoose = require("mongoose");
const articlesShema = new mongoose.Schema({
  title: String,
  description: String,
  slug: String,
  content: String,
  featured: String,
  thumbnail: String,
  articleCategory: String,
  status: String,
  position: Number
}, { timestamps: true });

const Article = mongoose.model("Articles", articlesShema, "articles");

module.exports = Article;
