const userSchema = require('../model/userSchema');
const bcrypt=require('bcrypt') 
const ganerateToken=require('../utils/jsonWebTokens')
const asyncErrorHandler=require('../utils/asyncErrorHandler')
const productSchema=require('../model/productSchema');
const mongoose = require('mongoose');
const Order = require('../model/orderSchema');
const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY)




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
    const user=await userSchema.findById(userId)
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

  const viewWishlist=asyncErrorHandler(async(req,res)=>{
    const userId=req.params.id;
    if(!mongoose.Types.ObjectId.isValid(userId)){
       return res.status(400).json({
            status:'error',
            message:'invalid user ID format'
        })
    }
    const user=await userSchema.findById(userId)
    if(!user){
        return res.status(404).json({
            status:'fail',
            message:'user not found'
        })
    }
    const wishlistIds=user.wishlist;
    if(wishlistIds.length===0){
       return res.status(200).json({
            status:'success',
            message:'user wishlist is empty ',
            data:[]
        })
    }
    const wishlistProducts=await productSchema.find({_id:{$in:wishlistIds}})

        res.status(200).json({
            status:'success',
            message:'successfully feched user wishlist products',
            data:wishlistProducts
        })
  })

  const deleteWishlist=asyncErrorHandler(async(req,res)=>{
    const userId=req.params.id;
    const {productId}=req.body;
    if(!productId){
        return res.status(404).json({status:'fail',message:'product not found'})
    }
    const user=await userSchema.findById(userId);
    if(!user){
        return res.status(404).json({status:'fail',message:'user not found'})
    }
    console.log(productId);
    await userSchema.updateOne({_id:userId},{$pull:{wishlist:productId}})
    res.status(200).json({status:'success',message:'successfully remove product'})
  })


let sValue={};
  const paymentSession=asyncErrorHandler(async(req,res)=>{
    const userId=req.params.id;
    const user = await userSchema.findOne({ _id: userId }).populate("cart").exec();
    if(!user){
        res.status(404).json({status:'fail',message:'user not found'})
    }
    const cartProducts=user.cart;
    if(cartProducts.length === 0){
        res.status(200).json({status:'success',message:'cart is empty',data:[]})
    }
    const lineItems=cartProducts.map((item)=>{
        return{
            price_data: {
                currency: "inr",
                product_data: {
                  name: item.title,
                  description: item.description,
                },
                unit_amount: Math.round(item.price * 100),
              },
              quantity: 1,
        }
    })
    session=await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        line_items:lineItems,
        mode:'payment',
        success_url: `http://localhost:6000/api/users/payment/success`, 
        cancel_url: "http://localhost:3000/api/users/payment/cancel",
    })
    if(!session){
        return res.status(400).json({
            status:'fail',
            message:'error on session side'
        })
    }
    sValue = {
        userId,
        user,
        session,
      };
  
      res.status(200).json({
        status: "Success",
        message: "Strip payment session created",
        url: session.url,
      });
  })
  const successPayment=asyncErrorHandler(async(req,res)=>{
    const {id,user,session}=sValue;
    console.log(id);
    const userId = user._id;
    const cartItems = user.cart;
    const orders = await Order.create({
        userId: id,
        products: cartItems.map(
          (value) => new mongoose.Types.ObjectId(value._id)
        ),
        order_id: session.id,
        payment_id: `demo ${Date.now()}`,
        total_amount: session.amount_total / 100,
      });
  
      if (!orders) {
        return res.json({ message: "error occured while inputing to orderDB" });
      }
  
      const orderId = orders._id;
  
      const userUpdate = await userSchema.updateOne(
        { _id: userId },
        {
          $push: { orders: orderId },
          $set: { cart: [] },
        },
        { new: true }
      );
  
      console.log(userUpdate);
  
  
      if (userUpdate) {
        res.status(200).json({
          status: "Success",
          message: "Payment Successful.",
        });
      } else {
        res.status(500).json({
          status: "Error",
          message: "Failed to update user data.",
        });
      }

  })

  const orderDetails=asyncErrorHandler(async(req,res)=>{
    const userId = req.params.id;

  const user = await userSchema.findById(userId).populate('orders').exec();

  if (!user) {
      return res.status(404).json({
          status: 'Failure',
          message: 'User Not Found',
      });
  }

  const orderProduts = user.orders;
  if (orderProduts.length === 0) {
      return res.status(200).json({
          message: "You don't have any product orders.",
          data: [],
      });
  }
  const ordersWithProducts = await Order.find({ _id: { $in: orderProduts } }).populate("products").exec();

  res.status(200).json({
      message: 'Ordered Products Details Found',
      data: ordersWithProducts,
  });

  })

module.exports = {
    createUser,userLogin,userViewProduct,productById,productListCategory,addToCart,viewCartProducts,addToWishList,
    viewWishlist,deleteWishlist,paymentSession,successPayment,orderDetails
}
