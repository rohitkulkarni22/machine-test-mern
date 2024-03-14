const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { validateEmail, validateNumeric } = require('../controllers/ValidationController');
const upload = require('../middlewares/multerConfig');
const requireAuth = require('../middlewares/VerifyAuth');

// Patch
router.patch('/:id', requireAuth, upload.single('f_Image'), async (req, res) => {
  try {
    const { id } = req.params;

    // Retrieve existing employee profile
    const existingEmployee = await Employee.findById(id);
    if (!existingEmployee) {
      return res.status(404).json({ error: 'Employee profile not found' });
    }

    // Extract updated employee data from request body
    const { f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course } = req.body;

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

    // Check for email duplication (excluding the current employee being edited)
    const existingEmployeeWithEmail = await Employee.findOne({ f_Email, _id: { $ne: id } });
    if (existingEmployeeWithEmail) {
      return res.status(400).json({ error: 'Employee profile already exists for this email address' });
    }

    // Update employee profile fields
    existingEmployee.f_Name = f_Name;
    existingEmployee.f_Email = f_Email;
    existingEmployee.f_Mobile = f_Mobile;
    existingEmployee.f_Designation = f_Designation;
    existingEmployee.f_gender = f_gender;
    existingEmployee.f_Course = f_Course;

    // Update the image if provided
    if (req.file) {
      existingEmployee.f_Image = req.file.filename;
    }

    // Save the updated employee profile
    await existingEmployee.save();

    // Respond with success message
    res.status(200).json({ message: 'Employee profile updated successfully', employee: existingEmployee });
  } catch (error) {
    console.error('Error updating employee profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
