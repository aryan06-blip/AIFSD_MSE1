const express = require('express');
const router = express.Router();
const {
  addEmployee,
  getEmployees,
  searchEmployees,
  deleteEmployee,
  updateEmployee
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addEmployee)
  .get(protect, getEmployees);

router.get('/search', protect, searchEmployees);

router.route('/:id')
  .delete(protect, deleteEmployee)
  .put(protect, updateEmployee);

module.exports = router;
