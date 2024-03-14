const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const requireAuth = require('../middlewares/VerifyAuth');
const isAdmin = require('../middlewares/RoleAuth');


// GET /api/employees
router.get('/', requireAuth, isAdmin, async (req, res) => {
  try {
    let { page, limit, sortBy, sortOrder, search } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    sortBy = sortBy || 'f_Name';
    sortOrder = sortOrder === 'desc' ? -1 : 1;

    // Construct query for search filter if search query is provided
    let searchFilter = {};
    if (search) {
      searchFilter = {
        $or: [
          { f_Name: { $regex: search, $options: 'i' } },
          { f_Email: { $regex: search, $options: 'i' } },
          { f_sno: parseInt(search) || -1 },
          { f_Designation: { $regex: search, $options: 'i' } },
          { f_gender: { $regex: search, $options: 'i' } },
          { f_Course: { $regex: search, $options: 'i' } },
          // Add more fields for searching if needed
        ]
      };
    }

    // Fetch employees based on search filter, pagination, and sorting
    const employees = await Employee.find(searchFilter)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    // Count total number of employees (for pagination)
    const totalCount = await Employee.countDocuments(searchFilter);

    // Respond with employee list and pagination metadata
    res.status(200).json({
        employees: employees.map(employee => ({
            f_sno: employee.f_sno,
            f_Name: employee.f_Name,
            f_Email: employee.f_Email,
            f_Mobile: employee.f_Mobile,
            f_Designation: employee.f_Designation,
            f_gender: employee.f_gender,
            f_Course: employee.f_Course,
            f_Createdate: employee.f_Createdate
          })),
        page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount
    });
  } catch (error) {
    console.error('Error fetching employee list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
