const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    }
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: false
  },
  role: []
});

// authenticate input against database documents
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({email: email}).exec(function(error, user) {
    if(error || !user) {
      return callback(error);
    } /*else if(!user) {
      const err = new Error('Utilizatorul nu există..');
      err.status = 401;
      return callback(err);
    }*/
    bcrypt.compare(password, user.password, function(error, result) {
      if(result === true) {
        return callback(null, user);
      } else {
        return callback();
      }
    });
  });
};

// hash password before it's saved to database
UserSchema.pre('save', function(next) {
  const user = this;

  bcrypt.hash(user.password, 10, function(err, hash) {
    if(err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
})


const User = mongoose.model('User', UserSchema);
module.exports = User;