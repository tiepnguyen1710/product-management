module.exports = (query, totalProduct) => {
    const objectPagination = {
        currentPage : 1,
        limitItems : 4
    }

    if(query.page){
        objectPagination.currentPage = parseInt(query.page);
    }

    //console.log(query.page);

    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

    objectPagination.totalPage = Math.ceil(totalProduct / objectPagination.limitItems);

    return objectPagination
}