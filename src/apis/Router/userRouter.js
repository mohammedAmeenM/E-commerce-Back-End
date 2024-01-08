const express=require('express');
const userController=require('../Controllers/userController');
const userRouter=express.Router()
const verifyToken=require('../middlewares/userAuth')



userRouter.post('/register',(userController.createUser))
.post('/login',(userController.userLogin))
.use(verifyToken)
.get('/products',(userController.userViewProduct))
.get('/products/:id',(userController.productById))
.get('/products/category/:categoryname',(userController.productListCategory))
.post('/:id/cart',(userController.addToCart))
.get ('/:id/cart',(userController.viewCartProducts))
.post('/:id/wishlist',(userController.addToWishList))
.get('/:id/wishlist',(userController.viewWishlist))
.delete('/:id/wishlist',(userController.deleteWishlist))
.post('/:id/payment',(userController.paymentSession))
.get('/payment/success',(userController.successPayment))
module.exports=userRouter; 