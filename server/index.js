/* Requires */
const express = require('express');
const path = require('path');
const logger = require('morgan');
const http = require('http');
const bodyParser = require('body-parser');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const expressSession=require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const signalingServer = require('./signaling'); // WebRTC signaling server
const dbModels = require('./db/models');
require('dotenv').config();

/* Init */
const app = express();
const server = http.createServer(app);
signalingServer.listen(server);
require("dotenv").config();

/* DB  */
const { users, instruments, PrivateRooms } = dbModels;

/* Middleware */
app.use(cookieParser());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pathToStaticDir = path.resolve(__dirname, '..', 'client/public');

app.use(express.static(pathToStaticDir));
app.use(express.static(pathToStaticDir, { redirect: false }));

/* Auth */
app.use(expressSession({
  secret: process.env.sessions_secret,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

const fbConfig = {
  clientID: process.env.client_Id,
  clientSecret: process.env.client_Secret,
  callbackURL: process.env.callbackURL
};

passport.use(new FacebookStrategy(fbConfig, (accessToken, refreshToken, profile, done) => {
  console.log('this is the profile', profile);
  users.findAll({ where: { facebookId: profile.id } })
    .then(user => {
      if (user.length > 0) {
        console.log('user already exists', user[0]);
        return done(null, user);
      } else {
        return users.create({
          userName: `${profile.displayName}`,
          password: "N/A",
          facebookId: profile.id,
          token: accessToken,
        }).then(entry => {
          console.log('this is entry for a newly added user', entry.dataValues.id);
          console.log(entry.dataValues, ' got entered', entry);
          return done(null, entry.dataValues.id);
        });
      }
    });
}
));

// serialize and deserialize
passport.serializeUser((user, done) => {
  const final = typeof user==="number"?user:user[0].dataValues.id;
  console.log('this is the user param', user);
  console.log('serializing!!!', final);
  done(null, final);
});

passport.deserializeUser((id, done) => {
  console.log('this is id in deserialize', id);
  users.findAll({ where: { id } })
    .then(found => {
      const values = found[0].dataValues;
      console.log('Trying to "deserialize" this user', values);
      done(null, id);
    });
});

/* Routes */
app.get('/logout', (req, res) => {
  console.log('mysession', req.session);
  if (req.session.userName) {
    delete req.session.userName;
  }
  req.logout();
  console.log('mysession after logout', req.session);
  res.sendStatus(200);
});


app.post('/login', (req, res) => {
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
});

app.post('/signup', (req, res) => {
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
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login'
  })
);

app.get("/getUserInfo", (req, res) => {
  const person=req.session.userName||req.session.passport;
  console.log(person, 'person!!!');

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
});

app.get("/fbLoggedIn", (req, res) => {
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
});

app.post('/makeprivateroom', (req, res) => {
  if (!req.session.userName && !req.session.passport) {
    res.send('you must be logged in');
    console.log('User must be logged in to make private room');
  } else {
    console.log('making private rooms');
    users.findOne({
      where: {
        userName: req.session.userName,
      }
    })
    .then((user) => {
      // if query came back empty handed then user must be logged in via facebook, and their id in schema is stored in passport
      const userId = user ? user.id : req.session.passport.user;
      return PrivateRooms.create({
        url: req.body.roomName,
        userId,
      });
    })
    .then(() => {
      res.sendStatus(200);
    });
  }
});

app.get('/getprivaterooms', (req, res) => {
  // is it not a facebook user?
  users.findOne({
    where: {
      userName: req.session.userName,
    }
  })
  .then(user => {
    // if query came back empty handed then user must be logged in via facebook, and their id in schema is stored in passport
    const userId = user ? user.id : req.session.passport.user;
    return PrivateRooms.findAll({
      where: {
        userId,
      }
    });
  })
  .then(privateRooms => {
    // get url
    res.send(privateRooms.map(room => room.url));
  });
});

app.get('*', (req, res) => {
  console.log('req.session', req.session);
  const pathToIndex = path.join(pathToStaticDir, 'index.html');
  res.status(200).sendFile(pathToIndex);
});

/* Kick off server */
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Listening on port', port);
});
