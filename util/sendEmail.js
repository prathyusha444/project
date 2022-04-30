const nodemailer = require("nodemailer");

const transporter = async () => {
       await nodemailer.createTransport({
        service: "gmail",
        port: 587,
        auth: {
            user: "prathyushatummala80@gmail.com",
            pass: "your passwd",
        },
    });
    return Promise.resolve()
}