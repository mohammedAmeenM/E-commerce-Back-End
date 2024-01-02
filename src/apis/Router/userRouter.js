const express=require('express');
const userController=require('../Controllers/userController');
const userRouter=express.Router()



userRouter.post('/register',(userController.createUser))
.post('/login',(userController.userLogin))
.get('/products',(userController.userViewProduct))
.get('/products/:id',(userController.productById))
.get('/products/category/:categoryname',(userController.productListCategory))
module.exports=userRouter; 