const product = require("../models/product");

const getProducts= async(req, res)=>{
    try{
        const products= await product.find({});
        console.log(products);
         res.status(200).json(products);
    }
    catch(err){
        res.status(401).json(err);
    }
};

module.exports= getProducts;

const getProductById= async(req, res)=>{
    try{
        const id=req.params.id;
        const item= await product.findOne({id:id});
        return res.status(200).json(item);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
}

module.exports= getProductById;