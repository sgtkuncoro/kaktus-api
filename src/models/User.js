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
    },
    confirmationToken: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

userSchema.methods.setPassword = function setPassword(password) {
    this.passwordHash = bcrypt.hashSync(password, 10)
}

userSchema.methods.setConfimationToken = function setConfimationToken() {
    this.confirmationToken = this.generateJWT();
}

userSchema.methods.isValidPassword = function isValidPassword(password) {
    return bcrypt.compareSync(password, this.passwordHash)
}

userSchema.methods.generateJWT = function generateJWT() {
    return jwt.sign({
        email: this.email,
        confirmed: this.confirmed
    }, process.env.JWT_SECRET);
}

userSchema.methods.generateResetPasswordToken = function generateResetPasswordToken() {
    return jwt.sign({
        _id: this._id
    }, process.env.JWT_SECRET, {
        expiresIn: "1h"
    });
}

userSchema.methods.toAuthJSON = function toAuthJSON() {
    return {
        email: this.email,
        confirmed: this.confirmed,
        token: this.generateJWT()
    }
}

userSchema.methods.generateConfirmationUrl = function generateConfirmationUrl() {
    return `${process.env.HOST}/confirmation/${this.confirmationToken}`
}

userSchema.methods.generateResetPasswordLink = function generateResetPasswordLink(){
    return `${process.env.HOST}/reset_password/${this.generateResetPasswordToken()}`
}

userSchema.plugin(uniqueValidator, {
    message: "This email already taken"
})

export default mongoose.model('User', userSchema);