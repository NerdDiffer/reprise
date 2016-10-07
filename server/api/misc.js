// TODO: figure out what these handlers do & put them somewhere else

// GET `/api/misc/getUserInfo`
module.exports.getUserInfo = (req, res) => {
  // TODO: figure out how passport sets session
  const person = req.session.userName || req.session.passport;

  if (req.session.passport) {
    users.findOne({ where: { id: person.user } }).then(fbUser => {
      console.log('uh oh ', fbUser);
      const fbUserName= fbUser.dataValues.userName;
      instruments.findAll({ where: { userName: fbUserName } }).then(
        userInstruments => (
           userInstruments.map(a => a.dataValues)
        )).then(userInstrumentsList => {
          console.log(person, userInstrumentsList, 'userInsts');
          res.send([person, userInstrumentsList]);
        });
    });
  } else {
    instruments.findAll({ where: { userName: person } }).then(
        userInstruments => (
           userInstruments.map(a => a.dataValues)
        )).then(userInstrumentsList => {
          console.log(person, userInstrumentsList, 'userInsts');
          res.send([person, userInstrumentsList]);
        });
  }
};

// GET `/api/misc/fbLoggedIn`
module.exports.fbLoggedIn = (req, res) => {
  if (req.session.passport) {
    console.log('rsp', req.session.passport);
    users.findOne({
      where: {
        id: req.session.passport.user
      }
    }).then(
      people => {
        console.log('people on 406', people);
        const person = people.dataValues.userName;
        console.log('person!!!', person);
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
