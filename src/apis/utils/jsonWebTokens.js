const jwt=require('jsonwebtoken');


const ganerateToken=(id)=>{
   return jwt.sign({id:id},process.env.SECRET_STR,{
        expiresIn:process.env.LOGIN_EXPIRES
    })
}
module.exports=ganerateToken;



