import express from 'express';
import AdminController from '../controller/admin.controller.js';
import auth from '../../../middlewares/auth.js';

// instance of AdminController
const adminController = new AdminController();

//creating Router
const adminRouter = express.Router();

adminRouter.use(auth);

adminRouter.get('/',(req, res, next)=>{
    adminController.getAdminHomePage(req, res,next)
});
adminRouter.get('/assign',(req, res, next)=>{
    adminController.getAssignPage(req, res, next)
});
adminRouter.post('/assign',(req, res, next)=>{
    adminController.postAssignFeedback(req, res, next)
});
adminRouter.post('/add-employee',(req, res ,next)=>{
    adminController.postAddNewEmployee(req, res, next)
});
adminRouter.get('/employees',(req, res, next)=>{
    adminController.getAllEmployee(req, res, next)
});

export default adminRouter;