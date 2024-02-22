import express from 'express';
import EmployeeController from '../controller/employee.controller.js';
import { escapeXML } from 'ejs';
import auth from '../../../middlewares/auth.js';

//instance for EmployeeController
const employeeController = new EmployeeController();

//creating Router
const employeeRouter = express.Router();


//Routes
employeeRouter.get('/',(req, res, next)=>{ auth,
    employeeController.getEmpoyeeHomepage(req, res, next)
});
employeeRouter.get('/register',(req, res ,next)=>{
    employeeController.getSigInForm(req, res, next)
});
employeeRouter.post('/signup',(req, res ,next)=>{
    employeeController.registerUser(req, res ,next);
});
employeeRouter.post('/signin',(req, res, next)=>{
    employeeController.signIn(req,res, next)
});
employeeRouter.get('/logout',(req, res, next)=>{ 
    employeeController.logout(req, res, next)
});

//Admin features
employeeRouter.get('/:employeeId/delete',(req, res ,next)=>{ auth,
    employeeController.deleEmployee(req, res, next)
});
employeeRouter.post('/:employeeId/update',(req, res ,next)=>{ auth,
    employeeController.updateEmployee(req, res, next)
});

export default employeeRouter;
