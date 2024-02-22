import EmployeeRepository from "../model/employee.respository.js";
import FeedbackRepository from "../../feedback/model/feedback.repository.js";
import EmployeeModel from "../model/employee.schema.js";
import bcrypt from 'bcrypt';

export default class EmployeeController{
    constructor(){
        this.employeeRepository = new EmployeeRepository()
        this.feedbackRepository = new FeedbackRepository();
    }
    //function to get employee home page
    
    async getEmpoyeeHomepage(req, res, next){
        try {
            const feedbacksSubmitted = await this.feedbackRepository.submittedFeedbacks(req.session.employee._id);
            const receivedFeedbacks = await this.feedbackRepository.feedbacksReceived(req.session.employee._id);
            const feedbacksAssigned = await this.feedbackRepository.employeeAssignedFeedbacks(req.session.employee._id);
            res.render('employee-home-page', {employee: req.session.employee,
                feedbacksReceived: receivedFeedbacks.length,
                assignedFeedbacks: feedbacksAssigned.length,
                feedbacksGiven: feedbacksSubmitted.length
                });
        } catch (error) {
            next(error);
        }
    }

    //Function to get home page or t0 signIn or signUp
    async getSigInForm(req, res, next){
        try {
            res.render('home', {employee: null, notification: null});
        } catch (error) {
            next( error);
        }
    }

    //Registering a new employee

    async registerUser(req, res, next){
        try {
            const {name, email, password} = req.body;
        const newUser = await this.employeeRepository.register({name, email, password});
        let notification;
        if(newUser)
        {
            notification = "User signup successful you can now login";
        }
        return res.render('home', {employee: null, notification});
        } catch (error) {
            return next(error)
        }
    }

    //Sign in a employee or Login

    async signIn(req, res, next){
        try {
            const{email, password} = req.body;
        const employee =  await this.employeeRepository.findEmployeeByEmailId(email);
        let notification;
        if(!employee)
        {
            notification = "This email not exist enter correct email.";
            return res.render('home', {employee: null, notification});
        }
        const isValidPassword =  await bcrypt.compare(password, employee.password);
        if(!isValidPassword)
        {
            notification = "Password not match enter correct password.";
            return res.render('home', {employee: null, notification});
        }
        // Adding employee in cookies for verfication of login process.
        req.session.employee = employee;
        if(employee.role == 'Admin')
        {
            return res.redirect('/api/admin/');
        }
        res.redirect('/api/employee/');

        } catch (error) {
            return next(error);
        }
    }

    // Function to delete an employee by id
    async deleEmployee(req, res, next){
        try {
            const employeeId = req.params.employeeId;
        const isDeleted = await this.employeeRepository.deleteEmployeeById(employeeId);
        let notification;
        if(isDeleted)
        {
            notification = "Employee deleted successfuly."
        }
        const employees = await EmployeeModel.find({}).populate('reviews');
        res.render('all-employees', {employees: employees, employee: req.session.employee, notification: notification});

        } catch (error) {
            next(error);
        }
    }

    //Function to update and empoyee by Id
    async updateEmployee(req, res, next){
        try {
            const employeeId = req.params.employeeId;
        const data = req.body;
        const isUpdated = await this.employeeRepository.updateEmployeeById(employeeId, data);
        let notification;
        if(isUpdated)
        {
            notification = "Employee updated successfuly."
        }
        const employees = await EmployeeModel.find({}).populate('reviews');
        res.render('all-employees', {employees: employees, employee: req.session.employee, notification: notification});
        } catch (error) {
           next( error); 
        }
    }

    //Logout
    async logout(req, res, next){
        try {
            req.session.destroy((err)=>{
                if(err){
                    console.log(err);
                }
                else
                {
                    return res.redirect('/');
                }
            });
        } catch (error) {
            return next(error);
        }
    }
}