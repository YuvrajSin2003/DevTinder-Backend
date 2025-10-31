const mongoose = require('mongoose');;

const connectDB = async() => {
    await mongoose.connect(
        "mongodb+srv://yuvi991904_db_user:L8wHDDWpB7dWxdny@cluster0.o1cijc4.mongodb.net/devTinder"
    );
};

module.exports = connectDB;