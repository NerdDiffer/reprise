// Modules
import React from 'react';
import { Route, IndexRoute } from 'react-router';

// Local Imports
import App from './components/App';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Room from './components/Room';
import CreateOrJoin from './components/CreateOrJoin';
import Invalid from './components/Invalid';
import Metronome from './components/Metronome';
import BeatSequencer from './components/BeatSequencer';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={LandingPage} />
    <Route path="login" component={Login} />
    <Route path="signup" component={Signup} />
    <Route path="room/:roomId" component={Room} />
    <Route path="createorjoin" component={CreateOrJoin} />
    <Route path="metronome" component={Metronome} />
    <Route path="beats" component={BeatSequencer} />
    <Route path="*" component={Invalid} />
  </Route>
);
