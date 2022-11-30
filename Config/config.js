module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongo:process.env.MONGODB_CONNECTION,
  secretkey:process.env.SECRET_KEY,
  cloudinaryname: process.env.CLOUDINARY_NAME,
  cloudinaryApikey:process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecretkey: process.env.CLOUDINARY_API_SECRET_KEY,
  smtpHost: process.env.SMTP_HOST, 
  smtpPort: process.env.SMTP_PORT,
  smtpUsername:process.env.SMTP_USERNAME,
  smtpPassword:process.env.SMTP_PASSWORD
};


