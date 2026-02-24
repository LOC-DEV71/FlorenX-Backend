const buildTree = (categories) => {
  const map = {}
  const roots = []

  categories.forEach(cat => {
    map[cat._id] = { ...cat._doc, children: [] }
  })

  categories.forEach(cat => {
    if (cat.parent_id) {
      map[cat.parent_id]?.children.push(map[cat._id])
    } else {
      roots.push(map[cat._id])
    }
  })

  return roots
}

module.exports = { buildTree }  
