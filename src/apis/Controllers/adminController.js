const jwt=require('jsonwebtoken');
const Users=require('../model/userSchema')
const mongoose = require("mongoose");
const productSchema = require('../model/productSchema');
const asyncErrorHandler=require('../utils/asyncErrorHandler');

 
const adminLogin=async (req,res)=>{
    const {email,password}=req.body;
    console.log(process.env.ADMIN_PASSWORD);
    if(email===process.env.ADMIN_EMAIL&&password===process.env.ADMIN_PASSWORD){
        const token=jwt.sign({email:email},process.env.ADMIN_SECRET_STR);
        res.status(200).json({
            status:"success",
            data:token
        })
    }else{
        res.status(404).json({
            status:"error",
            message:'this is no an admin'
        })
    }
}
const allUsers=async(req,res)=>{
    const findAllUsers=await Users.find();
    // console.log(findAllUsers);
    if(!findAllUsers){
        return res.status(404).json({
            status:'Error',
            message:'Users not found'
        })
    }
    res.status(200).json({
        status:'Success',
        message:'successfully fetched users datas',
        data:findAllUsers
    })
}

const userById=  async (req,res)=>{
   
    const userId=req.params.id;
    
    if(!mongoose.Types.ObjectId.isValid(userId)){ 
        return res.status(400).json({
            status:'Error', 
            message:'Invalid user ID format'
        })
    } 

    const user= await Users.findById(userId)

    if(!user){
        return res.status(404).json({
            status:'Error',
            message:'user not found'
        })
    }
    // console.log("daaaa", user) 
    return res.status(200).json({
        status:'success',
        message:'successfully fetched user data', 
        data:user
    })  

}

const createProduct= async(req,res)=>{
     const {title,description,price,image,category}=req.body;
     const newProduct= await productSchema.create({
        title,description,price,image,category  
     })
     res.status(201).json({
        status: 'success',
        message: 'Successfully created a product.',
        data:newProduct
        })
}
  
const adminListProducts=asyncErrorHandler(async(req,res)=>{
    const products= await productSchema.find();
    if(!products){
       return res.status(404).json({
            status:'fail',
            message:'products not found'
        })
    }
    res.status(200).json({
        status:'success',
        message:'successfully fetched datas',
        products:products
        })
})

const adminProductById=asyncErrorHandler(async(req,res)=>{
    const productId=req.params.id;
    if(!mongoose.Types.ObjectId.isValid(productId)){
      return res.status(400).json({
            status:'fail',
            message:'invalid ID format'
        })
    }
    const product =await productSchema.findById(productId);
    if(!product){
       return res.status(404).json({
            status:'fail',
            message:'product not found'
        })
    }
    res.status(200).json({
        status:'success',
        message:'successfully fetched data',
        product:product
    })
})

const updateProduct = asyncErrorHandler(async (req, res) => {
    const { id, title, description, price, image, category } = req.body;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid product ID format',
      });
    }
  
    const product = await productSchema.findById(id);
  
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found in the database',
      });
    }
  
    // Update the product
    const update = await productSchema.findByIdAndUpdate(
      { _id: id },
      { title, description, price, image, category },
      { new: true }
    );
  
    res.status(201).json({
      status: 'success',
      message: 'Successfully updated',
      product: update,
    });
  });
  


module.exports={
    adminLogin,allUsers,userById,createProduct,adminListProducts,adminProductById,updateProduct
} 