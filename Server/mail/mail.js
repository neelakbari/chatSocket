const nodemailer = require('nodemailer')

// const sendEmail = async (option) => {
//     var transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: 'ronakgondaliya386@gmail.com',
//             pass: 'Ro#524#@'
//         }
//     });

//     var mailOptions = {
//         from: 'ronakgondaliya386@gmail.com',
//         to: option.email,
//         subject: 'Reset Password',
//         text: option.token
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }
//     });
// }

// module.exports.sendEmail = sendEmail


exports.sendEmail = async (email, token) => {
    try {
        console.log(email);
        const transporter = nodemailer.createTransport({
            host: 'ronakgondaliya386@yopmail.com',
            service: 'gmail',
            port: 587,
            secure: true,
            auth: {
                user: 'ronakgondaliya386@yopmail.com',
                pass: 'Ro#524#@',
            },
        });

        await transporter.sendMail({
            from: 'ronakgondaliya386@yopmail.com',
            to: email,
            subject: "Reset Password",
            text: token,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

// module.exports = sendEmail;