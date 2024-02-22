import EmployeeModel from "./employee.schema.js";


export default class EmployeeRepository{
    
    // Function to register a new employee
    async register(data){
        const employee = new EmployeeModel(data);
            const newUser = await employee.save();
            return newUser;
    }

    // Function to check if employee exist by email id
    async findEmployeeByEmailId(email) {
        return await EmployeeModel.findOne({ email: email });
    }
    
    // Function to delete an employee by id
    async deleteEmployeeById(employeeId) {
        return await EmployeeModel.findByIdAndDelete(employeeId);
    }
    
    // Function to update an employee's details by id.
    async  updateEmployeeById(employeeId, data) {
        return await EmployeeModel.findByIdAndUpdate(employeeId, data, {
            new: true,
            runValidators: true
        });
    }
}