const nodemailer = require('nodemailer')

//Step 1
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'Pelumiogundipe905@gmail.com',
        pass: 'Goodnews'
    }
})

// Step 2

const mailOptions = {
    from: 'Pelumiogundipe905@gmail.com',
    to: 'morufatsoremekun@gmail.com',
    subjects: 'testing and Testing',
    text: 'Sending email with nodemailer',
    attachments: [
        {filename: 'dylan-sauerwein-SgyK8OfgzNg-unsplash.jpg', path: './dylan-sauerwein-SgyK8OfgzNg-unsplash.jpg'}
    ]
}



module.exports = {
    transporter,
    mailOptions
}


