const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    username: String,
    password: String ,
    cart:[{type:mongoose.Schema.ObjectId,ref:"product"}],
    wishlist:[{type:mongoose.Schema.ObjectId,ref:"product"}]
});

userSchema.pre('save', async function(next) {
    const user = this;

    if (!user.isModified('password')) return next();

    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        next();
    } catch (error) {
        console.error('Error hashing password:', error);
        next(error);
    }
});

userSchema.methods.comparePassword = async function(password, passwordDB) {
    return await bcrypt.compare(password, passwordDB);
}

const User = mongoose.model('User', userSchema);
module.exports = User;
