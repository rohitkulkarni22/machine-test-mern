const express = require('express');
const bodyParser = require('body-parser');
const loginRoutes = require('./routes/Login');
const signupRoutes = require('./routes/Signup');
const createEmployeeAccount = require('./routes/Employee');
const editEmployeeAccount = require('./routes/EmployeeEdit');
const getEmployeeData = require('./routes/getEmployee');

const app = express();

app.use(bodyParser.json());

// Use login routes
app.use('/api/login', loginRoutes);
app.use('/api/signup', signupRoutes);
app.use('/api/create', createEmployeeAccount);
app.use('/api/edit', editEmployeeAccount);
app.use('/api/employees', getEmployeeData);


module.exports = { app };
