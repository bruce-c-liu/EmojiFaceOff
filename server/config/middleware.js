const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

module.exports = (app, express) => {
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(morgan('dev'));
  if (process.env.NODE_ENV === 'production') {
   app.use('/', express.static(path.join(__dirname, '../../client/build')));
  } else {
    app.use('/', express.static(path.join(__dirname, 'public')));
  }
  // app.use(express.static(__dirname + '/../../client'));

  	
};
