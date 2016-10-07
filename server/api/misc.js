// TODO: figure out what these handlers do & put them somewhere else
const { users, instruments } = require('../db/models');

// GET `/api/misc/getUserInfo`
module.exports.getUserInfo = (req, res) => {
  // TODO: figure out how passport sets session
  const person = req.session.userName || req.session.passport;

  if (req.session.passport) {
    users.findOne({ where: { id: person.user } }).then(fbUser => {
      const fbUserName= fbUser.dataValues.userName;
      instruments.findAll({ where: { userName: fbUserName } }).then(
        userInstruments => (
           userInstruments.map(a => a.dataValues)
        )).then(userInstrumentsList => {
          res.send([person, userInstrumentsList]);
        });
    });
  } else {
    instruments.findAll({ where: { userName: person } }).then(
        userInstruments => (
           userInstruments.map(a => a.dataValues)
        )).then(userInstrumentsList => {
          res.send([person, userInstrumentsList]);
        });
  }
};

// GET `/api/misc/fbLoggedIn`
module.exports.fbLoggedIn = (req, res) => {
  if (req.session.passport) {
    users.findOne({
      where: {
        id: req.session.passport.user
      }
    }).then(
      people => {
        const person = people.dataValues.userName;
        instruments.findAll({
          where: {
            userName: person
          }
        }).then(
          userInstruments => (
            userInstruments.map(a => a.dataValues)
          )).then(userInstrumentsList => {
            res.send([person, userInstrumentsList]);
          });
      });
  } else {
    res.send("false");
  }
};
