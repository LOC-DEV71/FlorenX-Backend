const searchHelper = require("../../../../helper/search");
const Products = require("../../models/products.models");
module.exports.search = async (req, res) => {
    try {
        const find = {
            
        }
        const search = searchHelper(req.query) ;
        if (search.regexList) {
            find.$and = search.regexList.map(r => ({ title: r }));
        }
        if(req.query.search){
            const data = await Products.find(find).limit(5)

            return res.status(200).json({
                message: "ok",
                data
            })
        } else {
            return res.status(200).json({
                message: "ok",
            })
        }
        
    } catch (error) {
        return res.status(400).json({
            message: `Lỗi: ${error}`
        })
    }
}