module.exports = (query) => {
  const objSearch = {};

  if (!query.search) return objSearch;

  let keyword = query.search
    .normalize("NFC")               
    .toLowerCase()
    .replace(/[^a-z0-9\u00C0-\u1EF9\s]/gi, "") 
    .replace(/\s+/g, " ")           
    .trim();

  if (!keyword) return objSearch;

  const words = keyword.split(" ");

  objSearch.regexList = words.map(w =>
    new RegExp(
      w.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
      "i"
    )
  );

  return objSearch;
};
