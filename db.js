require('dotenv').config();
const mongoose = require('mongoose');

async function connectDB(){
   return await mongoose.connect(`mongodb://localhost:27017/${process.env.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }, () => {console.log(`connected to db ${process.env.DB}`);
    });
}

module.exports = {
    connectDB
}
