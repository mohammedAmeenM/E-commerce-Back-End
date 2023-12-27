const dotenv=require('dotenv');
dotenv.config({path:'./config.env'})
const mongoose=require('mongoose');

 const ConnectDB=async ()=>{
    try {
        await mongoose.connect(process.env.LOCAL_CONN_DB)
        console.log(`DB connecting sucessfull `)
    } catch (err) {
        console.error(err);
    }
}
module.exports=ConnectDB