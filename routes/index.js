const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Card = require('../models/card');
const mid = require('../middleware');

// GET /
router.get('/', mid.requireLogin, mid.logoutNoSession, (req, res, next) => {
  Card.find().sort({year: 1}).exec(function(error, card) {
    if(error) {
      return next(error);
    } else {
      return res.render('collection', {
        title: 'Colectie',
        admin: false,
        card: card,
        session: req.session || req.session.userId
      });
    }

  });


});

// GET /logout
router.get('/logout', (req, res, next) => {
  if(req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/login');
      }

    });

  }
});

// GET /login
router.get('/login', mid.loggedOut, (req, res, next) => {
  return res.render('login', {title: 'Login'});
});

// POST /login
router.post('/login', (req, res, next) => {
  if(req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function(error, user) {
      if(!user) {
        const err = new Error('Datele introduse nu sunt corecte..');
        err.status = 401;
        return next(err);
      } else if(error) {
        const err = new Error('Ne pare rău, dar ceva nu a mers bine..');
        err.status = 500;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/');
      }
    });
  }
});

// GET /register
router.get('/register', mid.loggedOut, (req, res, next) => {
  return res.render('register', {title: 'Register'});
});

// POST /register
router.post('/register', (req, res, next) => {
  if(req.body.lastName &&
    req.body.firstName &&
    req.body.email &&
    req.body.password &&
    req.body.confirmPassword) {
      if(req.body.password === req.body.confirmPassword) {
        // create object with form input
        const userData = {
          fullName: {
            firstName: req.body.firstName,
            lastName: req.body.lastName
          },
          email: req.body.email,
          password: req.body.password,
          role: [
            'user'
          ]
        };

        User.create(userData, function(error, user) {
          if(error) {
            return next(error);
          } else {
            req.session.userId = user._id;
            res.redirect('/');
          }
        });
      }
    }
});

module.exports = router;
