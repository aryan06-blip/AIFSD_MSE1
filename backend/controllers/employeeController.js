const Employee = require('../models/Employee');

// @desc    Add Employee
// @route   POST /api/employees
// @access  Private
const addEmployee = async (req, res, next) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;

    const employeeExists = await Employee.findOne({ email });

    if (employeeExists) {
      res.status(400);
      throw new Error('Employee with this email already exists');
    }

    const employee = await Employee.create({
      name,
      email,
      department,
      skills,
      performanceScore,
      experience
    });

    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Employees
// @route   GET /api/employees
// @access  Private
const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find({});
    res.json(employees);
  } catch (error) {
    next(error);
  }
};

// @desc    Search Employee by department
// @route   GET /api/employees/search
// @access  Private
const searchEmployees = async (req, res, next) => {
  try {
    const { department } = req.query;
    
    if (!department) {
      res.status(400);
      throw new Error('Department query parameter is required');
    }

    const employees = await Employee.find({ 
      department: { $regex: new RegExp(department, 'i') } 
    });
    
    res.json(employees);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Employee
// @route   DELETE /api/employees/:id
// @access  Private
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
      await Employee.deleteOne({ _id: req.params.id });
      res.json({ message: 'Employee removed successfully' });
    } else {
      res.status(404);
      throw new Error('Employee not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update Employee Performance
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployee = async (req, res, next) => {
  try {
    const { performanceScore } = req.body;
    const employee = await Employee.findById(req.params.id);

    if (employee) {
      employee.performanceScore = performanceScore !== undefined ? performanceScore : employee.performanceScore;
      const updatedEmployee = await employee.save();
      res.json(updatedEmployee);
    } else {
      res.status(404);
      throw new Error('Employee not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addEmployee,
  getEmployees,
  searchEmployees,
  deleteEmployee,
  updateEmployee
};
