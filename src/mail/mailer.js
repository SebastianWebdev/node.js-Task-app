const email = require('nodemailer')
const mailer = async (mailOptions = {
        from: 'youremail@.com',
        to: 'myfriend@yahoo.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    },
    emailSender = {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
        host: process.env.MAIL_HOST,
        port: 587
    }
) => {
    const {
        user,
        pass,
        host,
        port
    } = emailSender
    try {
        const transporter = await email.createTransport({
            host,
            port,
            secure: false,
            auth: {
                user,
                pass,
            },
            tls: {
                rejectUnauthorized: false
            }

        })
        await transporter.verify()

        await transporter.sendMail(mailOptions)
        console.log(`message send to ${mailOptions.to}`);

    } catch (e) {
        //console.log(`Something goes wrong Error: ${e}`);
        throw new Error(`Email Error: ${e}`)
    }




}


module.exports = mailer