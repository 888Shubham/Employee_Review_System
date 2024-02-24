import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
         await mongoose.connect("mongodb+srv://shubhamkb888:Shubham%40123@cluster0.a4x67w4.mongodb.net/EmployeeReviewSystem");
         console.log("MongoDB connected using mongoose");
    } catch (error) {
        console.log(error);
    }
}
