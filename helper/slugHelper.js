const slugify = require("slugify");

function generateSlug(text) {
  if (!text) return "";
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true
  });
}

module.exports = generateSlug;
