const jwt=require('jsonwebtoken');


const adminLogin=async (req,res)=>{
    const {email,password}=req.body;
    console.log(process.env.ADMIN_PASSWORD);
    if(email===process.env.ADMIN_EMAIL&&password===process.env.ADMIN_PASSWORD){
        const token=jwt.sign({email:email},process.env.ADMIN_SECRET_STR);
        res.status(200).json({
            status:"success",
            data:token
        })
    }else{
        res.status(404).json({
            status:"error",
            message:'this is no an admin'
        })
    }
}
module.exports={
    adminLogin
}