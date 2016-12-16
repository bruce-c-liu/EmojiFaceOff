
require('dotenv').config();

// const models = require('./config/db.connect.js');

// models.sequelize.sync().then(() => {
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

require('./config/middleware.js')(app, express);
require('./routes/routes.js')(app, express);
app.listen(port, () => {
  console.log('Listening on port ' + port);
});
// });
