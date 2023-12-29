const express=require('express');
const adminRouter=express.Router()
const adminController=require('../Controllers/adminController')



adminRouter.post('/login',(adminController.adminLogin))

module.exports=adminRouter;