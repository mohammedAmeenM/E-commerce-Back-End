const userSchema = require('../model/userSchema');
const bcrypt=require('bcrypt') 
const ganerateToken=require('../utils/jsonWebTokens')



const createUser = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;
        const newUser = await userSchema.create({
            name,
            email,
            username,
            password
        });
        console.log(newUser);
        res.status(200).json({
            status: 'success',
            data: {
                newUser
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'fail'
        });
    }
};

const userLogin = async (req, res) => {
    const username=req.body.username;
    const password=req.body.password;
    // console.log(username);
// console.log(password);
    try {
        const user = await userSchema.findOne({username}).select('+password');
            // console.log("uxdf",user.password);
        if (!user) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid input'
            });
        }
 
        if (!password || !user.password) {
            return res.status(400).json({
                status: 'fail',   
                message: 'Invalid input '
            });
        } 
        
        const matchPassword = await user.comparePassword(password,user.password)
        // console.log(matchPassword)

        if (!matchPassword) {
            return res.status(401).json({
                status: 'fail',
                message: 'Authentication failed'
               
            });
        }

        const token=ganerateToken(user._id)

        res.status(200).json({
            status: 'success',
            message: 'Authentication successful',
            token,
            data: {
                user
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'fail',
            message: 'Internal server error'
        });
    }
};

module.exports = {
    createUser,userLogin
};
