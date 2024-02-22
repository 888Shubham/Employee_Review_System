import FeedbackRepository from "../model/feedback.repository.js";

export default class FeedbackController{
    constructor(){
        this.feedbackRepository = new FeedbackRepository();
    }

    // Function to get assigned tasks to the employee.
    async getAssignedFeedbacks(req, res, next){
        try {
            const employeeId = req.session.employee._id;
        const assignedFeedbacks = await this.feedbackRepository.employeeAssignedFeedbacks(employeeId);
        res.render('assigned-feedbacks', {employee: req.session.employee, assignedFeedbacks: assignedFeedbacks, notification: null});
        } catch (error) {
            return next(error);
        }      
    }

    // submit a new Feedback.
    async postSubmitFeedback(req, res, next){
        try {
            const employeeId = req.session.employee._id;
        const feedbackId = req.params.feedbackId;
        const feedbackData = req.body.feedback;
        const submittedFeedback = await this.feedbackRepository.submitFeedback(feedbackId, feedbackData);
        const assignedFeedbacks = await this.feedbackRepository.employeeAssignedFeedbacks(employeeId);
        let notification = "Feedback submitted successfuly."
        if(submittedFeedback)
        {
            res.render('assigned-feedbacks', {employee: req.session.employee, assignedFeedbacks: assignedFeedbacks, notification: notification});
        }
        } catch (error) {
            next (error);
        }
    }

    //Function to get feedbacks received page for a specific employee.
    async getFeedbackReceived(req, res, next){
        try {
            const employeeId = req.session.employee._id;
            const receivedFeedbacks = await this.feedbackRepository.feedbacksReceived(employeeId);
            const givenFeedbacks = await this.feedbackRepository.submittedFeedbacks(employeeId);
            res.render('received-feedbacks', {employee: req.session.employee, receivedFeedbacks: receivedFeedbacks, givenFeedbacks: givenFeedbacks, notification: null});
        } catch (error) {
            next(error);
        }
    }

    // Function to get all feedbacks of employess pending and successful to show to the admin page.
    async getAllEmployeesFeedback(req, res, next){
        try {
            const pendingFeedbacks = await this.feedbackRepository.getpendingFeedbacks();
        const successfulFeedbacks = await this.feedbackRepository.getsuccessfulFeedbacks();
        res.render('all-feedbacks', {employee: req.session.employee, pendingFeedbacks: pendingFeedbacks, successfulFeedbacks: successfulFeedbacks});
        } catch (error) {
            next (error);
        }
    }

    //Function to updtae feedback only admin allowed
    async postUpdateFeedback(req, res, next){
        try {
            const employeeId = req.session.employee._id;
            const feedbackId = req.params.feedbackId;
            const data = req.body;
            const updatedFeedback = await this.feedbackRepository.updateFeedback(feedbackId, data);
            const receivedFeedbacks = await this.feedbackRepository.feedbacksReceived(employeeId);
            const givenFeedbacks = await this.feedbackRepository.submittedFeedbacks(employeeId);
            let notification;
            if(updatedFeedback)
            {
                notification = "Feedback updated successfuly.";
            }
            res.render('received-feedbacks', {
                employee: req.session.employee,
                receivedFeedbacks: receivedFeedbacks,
                givenFeedbacks: givenFeedbacks,
                notification: notification
                });
        } catch (error) {
            next(error);
        }
    }
}