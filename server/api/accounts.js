// GET `/api/accounts/logout`
module.exports.logout = (req, res) => {
  console.log('mysession', req.session);
  if (req.session.userName) {
    delete req.session.userName;
  }
  req.logout();
  console.log('mysession after logout', req.session);
  res.sendStatus(200);
};

// POST `/api/accounts/login`
module.exports.login = (req, res) => {
  console.log('req.body.pass', req.body.pass);
  users.findAll({
    where: {
      userName: req.body.user,
    }
  }).then(person => {
    if (person[0]===undefined) {
      console.log('BadLogin');
      res.send("");
    } else {
      console.log(person[0], 'Person[0]!!!');
      const hash = bcrypt.hashSync(req.body.pass, person[0].dataValues.salt);

      users.findAll({
        where: {
          userName: req.body.user,
          password: hash
        }
      }).then(user => {
        if (user.length > 0) {
          instruments.findAll({
            where: {
              userName: req.body.user
            }
          }).then(
            userInstruments => (
               userInstruments.map(a => a.dataValues)
            )).then(userInstrumentsList => {
              console.log("succ logged in", userInstrumentsList);
              req.session.userName = req.body.user;
              res.send(userInstrumentsList);
            });
        } else {
          console.log('BadLogin');
          res.send("");
        }
      });
    }
  });
};

// POST `/api/accounts`
module.exports.signup = (req, res) => {
  users.findAll({
    where: {
      userName: req.body.user
    }
  }).then(user => {
    if (user.length > 0) {
      console.log('this is req.sesion', req.session);
      res.send('UserAlreadyExists');
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.pass, salt);
      users.create({
        userName: req.body.user,
        password: hash,
        salt,
      }).then(entry => {
        console.log(entry.dataValues, ' got entered');
        req.session.userName = req.body.user;
        res.send('SuccessSignup');
      });
    }
  });
};
