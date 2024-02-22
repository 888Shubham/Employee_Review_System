import AdminRepository from "../model/admin.repository.js";
import EmployeeRepository from "../../employee/model/employee.respository.js";
import EmployeeModel from "../../employee/model/employee.schema.js";
import FeedbackRepository from "../../feedback/model/feedback.repository.js";
import FeedbackModel from "../../feedback/model/feedback.schema.js";

export default class AdminController{
    constructor(){
        this.employeeRepository =  new EmployeeRepository();
        this.feedbackRepository = new FeedbackRepository();
        this.adminRepository = new AdminRepository();
    }

    // function to get admin home Page
    async getAdminHomePage(req, res, next){
        try {
            const pendingFeedbacks = await this.feedbackRepository.getpendingFeedbacks();
            const successfulFeedbacks = await this.feedbackRepository.getsuccessfulFeedbacks();
            const feedbacksSubmitted = await this.feedbackRepository.submittedFeedbacks(req.session.employee._id);
            const receivedFeedbacks = await this.feedbackRepository.feedbacksReceived(req.session.employee._id);
            const employees = await EmployeeModel.find({});
            res.render('admin-home-page', {totalEmployees: employees.length, 
                employee: req.session.employee, 
                pendingFeedbacks: pendingFeedbacks.length, 
                successfulFeedbacks: successfulFeedbacks.length, 
                feedbacksGiven: feedbacksSubmitted.length,
                feedbacksReceived: receivedFeedbacks.length
            });
        } catch (error) {
            next(error);
        }
    }

    //Function to get assign Feedback page.
    async getAssignPage(req, res, next){
        try {
            const employees = await EmployeeModel.find({});
            res.render('assign-task', {employees: employees, employee: req.session.employee, notification: null});
        } catch (error) {
            next(error);
        }
    }

    //Function to post assigned feedback by the admin,
    async postAssignFeedback(req, res, next){
        try {
            const {sender, receiver} = req.body;
        let notification;
        const employees = await EmployeeModel.find({});
        if(!sender || !receiver)
        {
            notification = "Please select both sender and reciever field cannot be empty."
            return res.render('assign-task', {employees: employees, employee: req.session.employee, notification: notification});
        }
        if(sender === receiver)
        {
            notification = "Sender and receiver both cannot be same."
            return res.render('assign-task', {employees: employees, employee: req.session.employee, notification: notification});
        }
        // Check if already assigned.
        const isAlreadyAssigned = await FeedbackModel.findOne({sender: sender, receiver: receiver, status: 'pending'});
        if(isAlreadyAssigned)
        {
            notification = "Already assigned";
            return res.render('assign-task', {employees: employees, employee: req.session.employee, notification: notification});
        }
        const assignedFeedback = await this.adminRepository.assignFeedback(sender, receiver);
        if(assignedFeedback)
        {
            notification = "Feedback assigned successfully."
        }
        
        res.render('assign-task', {employees: employees, employee: req.session.employee, notification: notification});
        } catch (error) {
           next(error); 
        }
    }

    //Function to get all employees page to admin.
    async getAllEmployee(req, res, next){
        try {
            const employees = await EmployeeModel.find({}).populate('reviews');
            res.render('all-employees', {employees: employees, employee: req.session.employee, notification: null});
        } catch (error) {
            next(error);
        }
    }

    //Function to add new employee.
    async postAddNewEmployee(req, res, next){
        try {
            const {name, email, password, role} = req.body;
        const newEmployee = await this.employeeRepository.register({name, email, password, role});
        const employees = await EmployeeModel.find({});
        let notification;
        if(newEmployee)
        {
            notification = "New employee added successfully.";
        }
        res.render('all-employees', {employees: employees, employee: req.session.employee, notification: notification});
        } catch (error) {
            next(error);
        }
    }
}