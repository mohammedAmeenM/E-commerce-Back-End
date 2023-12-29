const jwt=require('jsonwebtoken');

module.exports=function verifyToken(req,res,next){
    const token=req.headers["authorization"];
    if(!token){
        return res.status(403).json({
            message:"no token provided"
        })
    }
    jwt.verify(token,process.env.SECRET_STR,(err,decode)=>{
        if(err) {
            return res.status(401).json({message: "Unathorazed"})
        }
        req.username=decode.username
        next()
    })
}