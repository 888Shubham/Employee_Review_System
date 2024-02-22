import { ObjectId } from "mongoose";
import mongoose from "mongoose";
import FeedbackModel from "./feedback.schema.js";
import EmployeeModel from "../../employee/model/employee.schema.js";

export default class FeedbackRepository{
    //Function to submit a feedback by a employee
    async submitFeedback(feedbackId, feedbackData ){
        const feedback = await FeedbackModel.findById(feedbackId);
        feedback.feedback = feedbackData;
        feedback.status = 'success';
        const savedFeedback = await feedback.save();
        // UPdating emploee sender and receiver.
        const sender = await EmployeeModel.findByIdAndUpdate(savedFeedback.sender, {$push: {'reviews.given': savedFeedback._id}},{new:true});
        return savedFeedback;
    }

    //function to get assigned feedback to a specific employee
    async employeeAssignedFeedbacks(employeeId){
        return await FeedbackModel.find({sender: employeeId, status: 'pending'}).populate('receiver');
    }
    
    //Function to get feedbacks that submitted by specfic employee.
    async submittedFeedbacks(employeeId){
        
         return await FeedbackModel.find({sender: employeeId, status: 'success'}).populate('receiver');
    }

    // Function to get feedbacks that a specific employee received by other employees.
    async feedbacksReceived(employeeId){
        return await FeedbackModel.find({receiver: employeeId, status: 'success'}).populate('sender');
    }

    // Function to get pending feedbacks to show to the admin page.
    async getpendingFeedbacks(){
        return await FeedbackModel.find({status: 'pending'}).populate('sender').populate('receiver');
    }

    // Function to get successfull feedbacks to show to the admin page.
    async getsuccessfulFeedbacks(){
        return await FeedbackModel.find({status: 'success'}).populate('sender').populate('receiver');
    }

    // Function to update feedback only admin allowed.
    async updateFeedback(feedbackId, data){
        return await FeedbackModel.findByIdAndUpdate(feedbackId, data,{new:true});
    }
}