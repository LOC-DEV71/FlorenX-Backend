module.exports = (objectPagination, query, countProducts) =>{
    if(objectPagination.currentPage < 1){
        objectPagination.currentPage = 1;
    }

    const totalProducts = Math.ceil(countProducts/objectPagination.limitItem);
    objectPagination.totalPage = totalProducts;
    
    if(query.page){
        objectPagination.currentPage = Number(query.page);
    }
    if(query.limit){
        objectPagination.limitItem = Number(query.limit);
    }

    objectPagination.skip = (objectPagination.currentPage - 1)*objectPagination.limitItem;

    return objectPagination;
}