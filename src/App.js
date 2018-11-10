import React, { Component } from 'react';
import './App.scss';
import { fire } from './base';
import Header from './components/common/Header';
import Create from './components/pages/Create';
import Host from './components/pages/Host';
import Play from './components/pages/Play';
import Home from './components/pages/Home';
import CustomizedSnackbars from './components/common/CustomizedSnackbars';

import {
  HashRouter as Router,
  Route,
} from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snack: '',
      showHeader: true,
    };
    this.showSnackbar = this.showSnackbar.bind(this);
    this.hideSnackbar = this.hideSnackbar.bind(this);
    this.toggleHeader = this.toggleHeader.bind(this);

  }
  hideSnackbar() {
    let snack = this.state.snack;
    snack.open = false;
    this.setState({
      snack: snack,
    });
  }
  showSnackbar(snack) {
    snack.open = true;
    this.setState({
      snack: snack,
    });
  }
  toggleHeader(value) {
    this.setState({ showHeader: value });
  }
  render() {
    return (
      <Router>
        <div className="App">
          {this.state.showHeader && <Header />}
          <div id="content">
            <Route exact path="/play" render={() => <Play showSnackbar={this.showSnackbar} toggleHeader={this.toggleHeader} />} />
            <Route exact path="/host" render={() => <Host showSnackbar={this.showSnackbar} toggleHeader={this.toggleHeader} />} />
            <Route exact path="/create" render={() => <Create showSnackbar={this.showSnackbar} />} />
            <Route exact path="/" render={() => <Home />} />
          </div>
          {this.state.snack && <CustomizedSnackbars snack={this.state.snack} hideSnackbar={this.hideSnackbar} />}
        </div>
      </Router>
    );
  }
}

export default App;
