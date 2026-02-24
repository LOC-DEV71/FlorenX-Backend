const Category = require("../api/v1/models/product.category.models");
async function getAllCategoryId(rootId) {
  const children = await Category.find({
    parent_id: rootId,
    deleted: false
  }).select("_id");

  let ids = children.map(c => c._id.toString());

  for (const child of children) {
    const subIds = await getAllCategoryId(child._id.toString());
    ids = ids.concat(subIds);
  }

  return ids;
}

module.exports = getAllCategoryId;