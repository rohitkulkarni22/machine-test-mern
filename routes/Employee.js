
const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { validateEmail, validateNumeric } = require('../controllers/ValidationController');
const upload = require('../middlewares/multerConfig');
const requireAuth = require('../middlewares/VerifyAuth');

// POST /api/create
router.post('/', requireAuth, upload.single('f_Image'), async (req, res) => {
  try {
    // Extract employee data from request body
    const { f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course } = req.body;

    // Generate a unique serial number for the employee
    const employeeCount = await Employee.countDocuments();
    const f_sno = employeeCount + 1;

    // Check if an employee profile already exists for the provided email
    const existingEmployee = await Employee.findOne({ f_Email });
    if (existingEmployee) {
      return res.status(400).json({ error: 'Employee profile already exists for this email address' });
    }

    // Get the filename of the uploaded image
    const f_Image = req.file.filename;


    // Validate email
    const isEmailValid = await validateEmail(f_Email);
    if (!isEmailValid) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate mobile (assuming it should be numeric)
    const isMobileNumeric = validateNumeric(f_Mobile);
    if (!isMobileNumeric) {
      return res.status(400).json({ error: 'Mobile number should be numeric' });
    }

    // Create a new employee
    const newEmployee = new Employee({
      f_sno,
      f_Image,
      f_Name,
      f_Email,
      f_Mobile,
      f_Designation,
      f_gender,
      f_Course,
    });

    // Save the new employee to the database
    await newEmployee.save();

    // Respond with success message
    res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
