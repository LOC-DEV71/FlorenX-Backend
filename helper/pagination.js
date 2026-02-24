module.exports = (objectPagination, query, countProducts) => {
    if(query.page < 1){
        query.page = 1
    }
    const limit = Number(query.limit) || 6;
    const currentPage = Number(query.page) || 1;

    objectPagination.limit = limit;
    objectPagination.currentPage = currentPage;
    objectPagination.skip = (currentPage - 1) * limit;

    if (countProducts) {
        objectPagination.totalPage = Math.ceil(countProducts / limit);
    }

    return objectPagination;
};
