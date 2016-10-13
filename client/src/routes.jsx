// Modules
import React from 'react';
import { Route, IndexRoute } from 'react-router';

// Local Imports
import App from './components/App';
import LandingPage from './components/LandingPage';
import Login from './components/Forms/Login';
import Signup from './components/Forms/Signup';
import Room from './components/Room';
import GreenRoom from './components/GreenRoom';
import Invalid from './components/Invalid';
import Metronome from './components/Metronome';
import BeatSequencer from './components/BeatSequencer';

const appName = 'reprise';

export default (
  <Route path="/" component={App} title={appName} >
    <IndexRoute component={LandingPage} title={appName} />
    <Route path="login" component={Login} />
    <Route path="signup" component={Signup} />
    <Route path="room/:roomId" component={Room} />
    <Route path="green-room" component={GreenRoom} />
    <Route path="metronome" component={Metronome} />
    <Route path="beats" component={BeatSequencer} />
    <Route path="*" component={Invalid} />
  </Route>
);
