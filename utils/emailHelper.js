const nodemailer = require("nodemailer");
const {smtpPort,smtpHost,smtpUsername,smtpPassword}=require('../Config/config')


const mailHelper=async({email,subject,link})=>{
  
    
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      auth: {
        user: smtpUsername, // generated ethereal user
        pass: smtpPassword, // generated ethereal password
      },
    });
    console.log(transporter,"create");
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'sender@server.com', 
      to: email, 
      subject: subject, 
      text: "hello world", 
    });

    console.log("Message sent: %s", info.messageId);
}


module.exports=mailHelper