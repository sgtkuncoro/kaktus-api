import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import uniqueValidator from 'mongoose-unique-validator';

// TODO: add uniqueness and email validations to email field
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

userSchema.methods.setPassword = function setPassword(password) {
    this.passwordHash = bcrypt.hashSync(password, 10)
}

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
        confirmed: this.confirmed,
        token: this.generateJWT()
    }
}

userSchema.plugin(uniqueValidator, {
    message: "This email already taken"
})

export default mongoose.model('User', userSchema);