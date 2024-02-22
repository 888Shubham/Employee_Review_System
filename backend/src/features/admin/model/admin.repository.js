import FeedbackModel from "../../feedback/model/feedback.schema.js";


export default class AdminRepository{
    //Function to assign a feedback to user.
    async assignFeedback(sender, receiver){
        const assignedFeedback = await FeedbackModel({sender,receiver, status: 'pending'});
        const savedFeedback = await assignedFeedback.save();
        return savedFeedback;
    }
}