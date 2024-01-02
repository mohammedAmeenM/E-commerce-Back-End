const express=require('express');
const adminRouter=express.Router()
const adminController=require('../Controllers/adminController')
const verifyToken=require('../middlewares/adminAuth');
const uploadImage = require('../middlewares/uploads/multerImageUpload');

 

adminRouter.post('/login',(adminController.adminLogin))
.use(verifyToken)
.get('/users',(adminController.allUsers))
.get('/users/:id',(adminController.userById))
.post ('/products',uploadImage,(adminController.createProduct))
.get('/products',(adminController.adminListProducts))
.get('/products/:id',(adminController.adminProductById))
.put('/products',(adminController.updateProduct))

module.exports=adminRouter;