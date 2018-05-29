import nodemailer from 'nodemailer';

const from = '"kaktus.Store" <sigit.kunc@gmail.com>';

function setup() {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        service: process.env.SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
}

export function sendConfirmationEmail(user) {
    const transport = setup();
    const email = {
        from,
        to: user.email,
        subject: "welcome to kaktus store",
        text: `

        Welcome to kaktus store. Please confirm your email.

        ${user.generateConfirmationUrl()}
        
        `
    }

    transport.sendMail(email, function(err, res){
        if(err){
            console.log(err)
        } else {
            console.log(res)
        }
    })
}

export function sendResetPasswordEmail(user) {
    const transport = setup();
    const email = {
        from,
        to: user.email,
        subject: "Reset Password",
        text: `

        For reset your password please followe this link:

        ${user.generateResetPasswordLink()}
        
        `
    }

    transport.sendMail(email, function(err, res){
        if(err){
            console.log(err)
        } else {
            console.log(res)
        }
    })
}