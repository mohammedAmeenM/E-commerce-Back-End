const express=require('express');
const userController=require('../Controllers/userController')
const userRouter=express.Router()



userRouter.post('/register',(userController.createUser))
.post('/login',(userController.userLogin))
module.exports=userRouter;