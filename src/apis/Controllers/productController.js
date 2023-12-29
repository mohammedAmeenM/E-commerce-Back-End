const productSchema=require('../model/productSchema');
const asyncErrorHandler=require('../utils/asyncErrorHandler');


const createProduct=asyncErrorHandler (async (req,res)=>{
    const {title,description,price,image,category}=req.body;
    const newProduct= await productSchema.create({
        title,description,price,image,category
    })
    res.status(200).json({
        status:'success',
        data:{
            newProduct
        }
    })
})
module.exports={createProduct}