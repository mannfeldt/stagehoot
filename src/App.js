import React, { Component } from 'react';
import './App.css';
import { fire } from './base';
import Header from './components/Header';
import Create from './components/pages/Create';
import Host from './components/pages/Host';
import Play from './components/pages/Play';
import Home from './components/pages/Home';

import {
  HashRouter as Router,
  Route,
} from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <div id="content">
            <Route exact path="/play" render={() => <Play />} />
            <Route exact path="/host" render={() => <Host />} />
            <Route exact path="/create" render={() => <Create />} />
            <Route exact path="/" render={() => <Home />} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
