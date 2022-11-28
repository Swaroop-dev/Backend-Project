//new dev branch for development purpose
const { port,cloudinaryname,cloudinaryApikey,cloudinaryApiSecretkey} = require("./Config/config");
const { connect } = require("./Config/database");
const cloudinary =require('cloudinary')

const app = require("./app")

//Database connection
connect();

//Cloudinary connection with configurations
cloudinary.config({
  cloud_name:cloudinaryname,
  api_secret:cloudinaryApiSecretkey,
  api_key:cloudinaryApikey
})


app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
