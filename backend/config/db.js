import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
         await mongoose.connect("mongodb+srv://shubhamkb888:Shubham@123@cluster0.a4x67w4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
         console.log("MongoDB connected using mongoose");
    } catch (error) {
        console.log(error);
    }
}
