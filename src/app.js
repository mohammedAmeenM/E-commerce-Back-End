const express=require('express');
const userRouter = require('./apis/Router/userRouter');
const app=express();
const mogan=require('morgan')
const customError=require('./apis/utils/customError');
const adminRouter=require('../src/apis/Router/adminRouter')


app.use(express.json());
app.use(mogan('dev'))
app.use('/api/users/',userRouter)
app.use('/api/admin/',adminRouter)
app.all('*',(req,res,next)=>{
    const err=new customError (`can't find ${req.originalUrl} on the server ! `,404)
    next(err)
})

module.exports=app;