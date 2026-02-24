const mongoose = require("mongoose");
const articlesShema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  thumbnail: String
}, { timestamps: true });

const Article = mongoose.model("Articles", articlesShema, "articles");

module.exports = Article;
