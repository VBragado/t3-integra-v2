const express = require('express');
const app = express();
const routes = require('./routes/index');
const db = require('./config/database');

//const { AuthorizationToken } = require('./utils/auth');
//const { getStores } = require('./utils/stores');
//const { callTest } = require('./utils/test1');

app.set('view engine', 'ejs'); // set the view engine to EJS

// Set up middleware, such as body-parser and cors
app.use(express.json());

// Set up routes
app.use(routes);

//app.get('/dashboard', dashboardController.showDashboard);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});