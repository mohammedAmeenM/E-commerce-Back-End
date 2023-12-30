const express=require('express');
const adminRouter=express.Router()
const adminController=require('../Controllers/adminController')
const verifyToken=require('../middlewares/adminAuth')

 

adminRouter.post('/login',(adminController.adminLogin))
.get('/users',verifyToken,(adminController.allUsers))
.get('/users/:id',verifyToken,(adminController.userById))
.post ('/products',verifyToken,(adminController.createProduct))

module.exports=adminRouter;