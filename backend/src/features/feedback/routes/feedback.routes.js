import express from 'express';
import FeedbackController from '../controller/feedback.controller.js';
import auth from '../../../middlewares/auth.js';

// creating Routes
const feedbackRouter = express.Router();

//instance of FeedbackController
const feedbackController = new FeedbackController();

feedbackRouter.use(auth);

//Routes

feedbackRouter.get('/assigned', (req, res, next)=>{
    feedbackController.getAssignedFeedbacks(req, res, next);
});
feedbackRouter.post('/:feedbackId/submit', (req, res, next)=>{
    feedbackController.postSubmitFeedback(req, res, next)
});
feedbackRouter.get('/received',(req, res, next)=>{
    feedbackController.getFeedbackReceived(req, res, next)
});
feedbackRouter.get('/employees-feedback', (req, res, next)=>{
    feedbackController.getAllEmployeesFeedback(req, res, next);
});
feedbackRouter.post('/:feedbackId/update', (req, res, next)=>{
    feedbackController.postUpdateFeedback(req, res, next)
})

export default feedbackRouter;
