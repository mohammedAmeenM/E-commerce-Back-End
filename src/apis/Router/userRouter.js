const express=require('express');
const userController=require('../Controllers/userController');
const productController=require('../Controllers/productController')
const userRouter=express.Router()



userRouter.post('/register',(userController.createUser))
.post('/login',(userController.userLogin))
.post('/products',(productController.createProduct))
module.exports=userRouter;