const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const path = require('path');
const User = require('./models/user');
const removeDiacritics = require('diacritics').remove;

const app = express();


// mongodb connection
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/atestat', {useMongoClient: true});
const db = mongoose.connection;
// mongo error
db.on('error', console.error.bind(console, 'connection error:'));


// use sessions for tracking logins
app.use(session({
  secret: 'Atestat2018',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// add capitalize
String.prototype.capitalize = function(){
  return this.toLowerCase().replace(/(^|\s)\S/g, function (m) {
      return m.toUpperCase();
  });
};

// convert to uri
String.prototype.toURI = function() {
  return this.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s+/g, '-');
}

// convert from uri to string
String.prototype.fromURItoString = function() {
  return this.toLowerCase().trim().replace(/-/g, ' ');
}

// remove punctuation, diacritics, extra space and lower case the string
String.prototype.toSearch = function() {
  return removeDiacritics(this.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s+/g, ' '));
}

// make user id available in templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId;
  next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname + '/public')));

app.set('view engine', 'pug');

const mainRoutes = require('./routes/index.js');
const cards = require('./routes/card.js');
const cpanel = require('./routes/cpanel.js');

app.use(mainRoutes);
app.use(cards);
app.use('/cpanel', cpanel);

app.use((req, res, next) => {
  const err = new Error('Ne pare rău, dar pagina pe care o căutaţi nu există..');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status);

  res.render('error', {title: err.status, session: req.session.userId || null});

});

app.listen(80, () => {
  console.log('The application is running on http://127.0.0.1:80/!');
});
