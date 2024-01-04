const userSchema = require('../model/userSchema');
const bcrypt=require('bcrypt') 
const ganerateToken=require('../utils/jsonWebTokens')
const asyncErrorHandler=require('../utils/asyncErrorHandler')
const productSchema=require('../model/productSchema');
const mongoose = require('mongoose');




const createUser =asyncErrorHandler( async (req, res) => {
    const { name, email, username, password } = req.body;

    const user=await userSchema.findOne({username:username})
    console.log(user);
    // console.log(user.username)   
    if(user)return res.status(400).json({
        message:"user allreday exist"
    })
        const newUser = await userSchema.create({
            name:name,
            email:email,
            username:username,
            password:password
        });
       
        res.status(201).json({
            status: 'success',
            data: {
                newUser
            }
        });
     
})

const userLogin = asyncErrorHandler( async (req, res) => {
    const username=req.body.username;
    const password=req.body.password;
    // console.log(username);
// console.log(password);
 
        const user = await userSchema.findOne({username}).select('+password');
            // console.log("uxdf",user.password);
        if (!user) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid input'
            });
        }
 
        if (!password || !user.password) {
            return res.status(400).json({
                status: 'fail',   
                message: 'Invalid input '
            });
        } 
        
        const matchPassword = await user.comparePassword(password,user.password)
        // console.log(matchPassword)

        if (!matchPassword) {
            return res.status(401).json({
                status: 'fail',
                message: 'Authentication failed'
               
            });
        }

        const token=ganerateToken(user._id)

        res.status(200).json({
            status: 'success',
            message: 'Authentication successful',
            token,
            data: {
                user
            }
        });

 
});

const userViewProduct=asyncErrorHandler (async (req,res)=>{
    const product=await productSchema.find();
    if(!product){
       return res.status(404).json({
            status:'fail',
            message:'Product Not Found'
        })
    }
    res.status(200).json({
        status:'success',
        message:'successfully fetched datas',
        products:product
    })

})

const productById=asyncErrorHandler(async(req,res)=>{
    const productId=req.params.id ;
    if(!mongoose.Types.ObjectId.isValid(productId)){
        return res.status(400).json({
            status:'fail',
            message:'invalid product ID format'
        })
    }
    const product=await productSchema.findById(productId)
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

const productListCategory=asyncErrorHandler(async(req,res)=>{
    const Paramscategory=req.params.categoryname;
    console.log(Paramscategory);
    const category=await productSchema.find({category:Paramscategory})
    console.log(category);
    if(!category){
        return res.status(404).json({
            status:'fail',
            message:'products not found'
        })
    }
    res.status(200).json({
        status:'success',
        message:'successfully fetched datas',
        products:category
    })
})
const addToCart=asyncErrorHandler(async(req,res)=>{
    const userId=req.params.id
    if(!mongoose.Types.ObjectId.isValid(userId)){
       return res.status(400).json({
            status:'fail',
            message:'invalid user ID format'
        })
    }
    const {productId}=req.body;
    if(!productId){
       return res.status(404).json({
            status:'fail',
            message:'product not found'
        })
    }
    const user = await userSchema.findById(userId);

    if (!user) {
        return res.status(404).json({
            status: 'fail',
            message: 'User not found'
        });
    }

    if (user.cart.includes(productId)) {
        return res.status(409).json({
            status: 'fail',
            message: 'Product already exists in the cart'
        });
    }

   await userSchema.updateOne({_id:userId},{$addToSet:{cart:productId}})
    res.status(200).json({
        status:'success',
        message:'successfully product added to cart'
    })
  })

  const viewCartProducts=asyncErrorHandler(async(req,res)=>{
    const userId=req.params.id;
    if(!mongoose.Types.ObjectId.isValid(userId)){
        return res.status(400).json({
             status:'fail',
             message:'invalid user ID format'
         })
     }
    const user=await User.findById(userId)
    if(!user){
        return res.status(404).json({
            status:'fail',
            message:'user not found'
        })
    }
    const cartUserIds=user.cart;
    if(cartUserIds.length===0){
        return res.status(200).json({
            status:'success',
            message:'user cart is empty',data:[]
        })
    }
    const cartProducts= await productSchema.find({_id:{$in :cartUserIds}});
        res.status(200).json({
            status:'success',
            message:'successfull fetched cart products',
            data:cartProducts
        })
  })

  const addToWishList=asyncErrorHandler(async(req,res)=>{
    const userId=req.params.id;
    if(!userId){
        return res.status(404).json({
            status:'fail',
            message:'user id not found'
        })
    }
    const {productId}=req.body;
    const products = await productSchema.findById(productId)
    if(!products){
        return res.status(404).json({
            status:'fail',
            message:'product not found'
        })
    }
    const findProduct=await userSchema.findOne({_id:userId,wishlist:productId})
    if(findProduct){
        return res.status(409).json({
            status:'fail',
            message:'product allready exist'
        })
    }
    await userSchema.updateOne({_id:userId},{$push : {wishlist:productId}})
        res.status(200).json({
            status:'success',
            message:'product successfully add to wishlist'
        })

  })


module.exports = {
    createUser,userLogin,userViewProduct,productById,productListCategory,addToCart,viewCartProducts,addToWishList
}
