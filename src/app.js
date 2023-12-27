const express=require('express');
const userRouter = require('./apis/Router/userRouter');
const app=express();
const mogan=require('morgan')


app.use(express.json());
app.use(mogan('dev'))
app.use('/api/users/',userRouter)

module.exports=app;