const express = require('express');

const path = require('path');
const transactions = require('../routes/transactions');
const dashboardController = require('../controllers/dashboard');

const app = express();

app.use('/transaction', transactions);


app.get('/dashboard', dashboardController.showDashboard);




module.exports = app;