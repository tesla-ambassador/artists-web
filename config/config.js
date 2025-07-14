const mongoose = require("mongoose");

const connectDB= async()=> {
    try {
        const connect= await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Database connected: ",connect.connection.host, connect.connection.name);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
};
//mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//    .then(() => console.log("Connected to MongoDB"))
//    .catch(err => console.error("MongoDB connection error:", err));

module.exports = connectDB;
