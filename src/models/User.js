import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

// TODO: add uniqueness and email validations to email field
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        index: true
    },
    passwordHash: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

userSchema.methods.isValidPassword = function isValidPassword(password) {
    return bcrypt.compareSync(password, this.passwordHash)
}

userSchema.methods.generateJWT = function generateJWT() {
    return jwt.sign({
        email: this.email
    }, process.env.JWT_SECRET);
}

userSchema.methods.toAuthJSON = function toAuthJSON() {
    return {
        email: this.email,
        token: this.generateJWT()
    }
}

export default mongoose.model('User', userSchema);