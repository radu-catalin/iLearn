const User = require('../models/user');

function loggedOut(req, res, next) {
  if(req.session && req.session.userId) {
    return res.redirect('/');
  }
  return next();
}

function requireLogin(req, res, next) {
  if(!req.session || !req.session.userId) {
    return res.redirect('/login');
  }
  return next();
}


// force logout if the user is no longer in database
function logoutNoSession(req, res, next) {
  User.findById(req.session.userId).exec(function(error, user) {
    if(error) {
      return next(error);
    } else {
      if(req.session.userId && !user) {
        return res.redirect('/logout');
      }
      next();
    }
  });

}

function requireRole(req, res, next) {
  User.findById(req.session.userId).exec(function(error, user) {
    if(error || !user) {
      return next(error);
    } else {
      if(user.role.length > 1) {
        return next();
      } else {
        const err = new Error('Nu ai permisiunea să accesezi această zonă!');
        err.status = 403;
        return next(err);
      }
    }
  });
}



module.exports.loggedOut = loggedOut;
module.exports.requireLogin = requireLogin;
module.exports.logoutNoSession = logoutNoSession;
module.exports.requireRole = requireRole;
