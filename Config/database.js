const {mongo} =require('./config')
const mongoose = require('mongoose')


exports.connect=async()=>{
    try {
        await mongoose.connect(mongo,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("DB connected")
      } catch (error) {
        console.log(`something went wrong while connecting to the database ${error.message}`);
        process.exit(1);
      }
}
