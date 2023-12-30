const jwt=require('jsonwebtoken');
const Users=require('../model/userSchema')
const mongoose = require("mongoose");
const productSchema = require('../model/productSchema');

 
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
        title,description,price,image,  
     })
     res.status(201).json({
        status: 'success',
        message: 'Successfully created a product.',
        data:newProduct
        })
}
  
module.exports={
    adminLogin,allUsers,userById,createProduct
} 