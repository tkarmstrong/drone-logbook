let User = require('../../models/user');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../configs/config');

const notAdmin = {
  error: 403,
  message: 'You must be an admin to access this feature.'
}

const notAuthorized = {
  error: 401,
  message: 'You are not authorized to access this feature.'
}

// ********* Create new user ********* //
exports.registerUser = function (req, res, next) {
  let saltRounds = 10;

  User.findOne( {email: req.params.email}, function (err, email) {
    if (err) {
      console.log(err);
      return next(err);
    } else {
      if (!email) {
        // The email address is unique
        console.log('Email address is unique.')

        let hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);

        let newAccount = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          password: hashedPassword,
          email: req.body.email,
          dateCreated: req.body.dateCreated
        };

        User.create(newAccount, function (err, newUser) {
          if (err) {
            console.log(err);
            return next(err);
          } else {
            const token = jwt.sign({
              id: newUser._id,
              role: newUser.role,
              firstName: newUser.firstName,
              lastName: newUser.lastName
            },
              config.web.secret,
            {
              expiresIn: 86400 // 24 hours
            });
            res.status(200).json(token);
          }
        })
      } else {
        // The email address is already in use
        console.log(`This email address already has an account associated.`);
        res.status(500).send({
          text: `This email address already has an account associated.`,
          time_stamp: new Date()
        })
      }
    }
  })
};


// ********* Login User ********* //
exports.loginUser = (req, res) => {
  let thisUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        console.log('No user found? ', !user)
        return res.status(401).json({
          message: "We cannot locate an account with the email provided. Please try again."
        });
      }
      thisUser = user;
      let result = bcrypt.compare(req.body.password, user.password);
      if(!result) {
        return res.status(401).json({
          message: "Authentication failed. Please check your email and password combination and try again."
        })
      }
      const token = jwt.sign({
        id: thisUser._id,
        isAdmin: thisUser.isAdmin,
        firstName: thisUser.firstName,
        lastName: thisUser.lastName,
      },
      config.web.secret, {
        expiresIn: 86400, // 24 hours
      });
      return res.status(200).json(token);
    })
    .catch(err => {
      console.log('err: ', err);
      return res.status(401).json({
        message: "Authentication failed. Unknown server error. Please wait a few minutes and try again. If you continue to see this error, please contact us."
      });
    });
};

/* -----------------------------------------------------
!                   TOKEN REQUIRED                      !
------------------------------------------------------ */
/**
 *  Admin Role Required
 */

// ********* ADMIN: Get All Users ********* //
exports.getUsers = (req, res) => {
  if(req.isAdmin) {
    User.find({}, (err, users) => {
      if (err) {
        console.log(err);
      } else {
        console.log(users);
        res.json(users);
      }
    });
  } else {
    res.status(notAdmin.error).json(notAdmin);
  }
};

// ********* ADMIN: Update User Role ********* //
exports.updateUserRole = (req, res, next) => {
  if(req.isAdmin) {
    User.findById(req.params.id, (err, user) => {
      if(err) {
        console.log('UPDATE USER ROLE ERROR', err);
        next(err);
      } else {
        user.set({
          isAdmin: req.body.isAdmin,
          dateModified: new Date()
        });

        user.save(user, (err) => {
          if (err) {
            console.log('saveErr: ', err);
            return res.status(500).json({message: 'Unfortunately, our server encountered an error. Please try again or contact us for assistance.'});
          } else {
            return res.status(200).json({
              message: 'User role updated',
              userAdmin: user.isAdmin
            });
          }
        });
      }
    });
  } else {
    return res.status(notAdmin.error).json(notAdmin)
  }
}

// ********* ADMIN: Get User By Id ********* //
exports.getUserById = (req, res, next) => {
  if(req.isAdmin) {
    User.findById(req.params.id)
      .exec((err, user) => {
        if (err) {
          return next(err);
        } else {
          res.json(user);
        }
      })
  } else {
    res.status(401).json(notAuthorized)
  }
};

/**
 *
 * Auth or Admin required
 */

// ********* Update User First or Last Name ********* //
exports.updateUserName = (req, res, next) => {
  if(req.auth || req.isAdmin) {
    User.findById(req.params.id, (err, user) => {
      if(err) {
        console.log('error: ', err);
        next(err)
      } else {
        // Update user
        console.log('user: ', user);
        user.set({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          dateModified: new Date()
        });
        // Save to db
        user.save(user, (err) => {
          if (err) {
            console.log('saveErr: ', err);
            return res.status(500).json({message: 'Unfortunately, our server encountered an error. Please try again or contact us for assistance.'});
          } else {
            return res.status(200).json({
              message: 'Our system has successfully processed your name change',
              userFirstName: user.firstName,
              userLastName: user.lastName
            });
          }
        });
      }
    });
  }
};

// ********* Get Users By Email ********* //
exports.getUserByEmail = (req, res, next) => {
  User.findOne({'email': req.params.email} , (err, user) => {
    if (err) {
      return next(err);
    } else {
      res.json(user);
    }
  });
};

// ********* Delete User ********* //
exports.deleteUserById = (req, res, next) => {
  User.findByIdAndDelete({ '_id': req.params.id }, (user, err) => {
    if (err) {
      console.log(err);
      return next(err);
    } else {
      console.log('userDeleted: ', user);
      res.send(200).json(user);
    }
  });
};

// TODO: I don't want to used security questions...
// ********* Forgot Password ********* //
// exports.forgotPassword = (req, res) => {
//   // Get user's selected security questions
//   console.log('email: ', req.params.email);
//   let userFound;
//   User.findOne({email: req.params.email})
//   .then(user => {
//     if (!user) {
//       return res.status(404).json({message: 'We could not locate an account associated with the email provided.'});
//     } else {
//       userFound = user;
//       const answer1 = userFound.selectedSecurityQuestions[0].answerText === req.body.selectedSecurityQuestions[0].answerText;
//       const answer2 = userFound.selectedSecurityQuestions[1].answerText === req.body.selectedSecurityQuestions[1].answerText;
//       const answer3 = userFound.selectedSecurityQuestions[2].answerText === req.body.selectedSecurityQuestions[2].answerText;
//       if (answer1 && answer2 && answer3) {
//         let pw = req.body.password;
//         let hashedPassword = bcrypt.hashSync(pw, 10);
//         user.set({
//           password: hashedPassword
//         });
//         user.save(user, (err) => {
//           if (err) {
//             console.log('saveErr: ', err);
//             return res.status(500).json({message: 'Unfortunately, our server encountered an error. Please try again or contact us for assistance.'});
//           } else {
//             return res.status(200).json({message: 'Your password has been reset successfully. Please login with your new password.'});
//           }
//         });

//       } else {
//         return res.status(401).json({message: 'The answers provided do not match. Please try again or contact us for assistance.'});
//       }
//     }
//   })
//   .catch(err => {
//     console.log('catchErr: ', err);
//     return res.status(500).json({message: 'Unfortunately, our server encountered an error. Please try again or contact us for assistance.'});
//   });
// };
