import React, { Component } from 'react';
import './App.scss';
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';
import { fire } from './base';
import Header from './components/common/Header';
import Create from './components/pages/Create';
import Host from './components/pages/Host';
import Play from './components/pages/Play';
import Home from './components/pages/Home';
import CustomizedSnackbars from './components/common/CustomizedSnackbars';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snack: '',
      showHeader: true,
    };
    const hash = window.location.hash
      .substring(1)
      .split('&')
      .reduce((initial, item) => {
        if (item) {
          const parts = item.split('=');
          initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
      }, {});
    window.location.hash = '';
    if (hash.access_token) {
      localStorage.setItem('spotifytoken', hash.access_token);
      localStorage.setItem('spotifytoken_timestamp', Date.now());
    }
    this.showSnackbar = this.showSnackbar.bind(this);
    this.hideSnackbar = this.hideSnackbar.bind(this);
    this.toggleHeader = this.toggleHeader.bind(this);

  }

  hideSnackbar() {
    const snack = this.state.snack;
    snack.open = false;
    this.setState({
      snack,
    });
  }

  showSnackbar(snack) {
    snack.open = true;
    this.setState({
      snack,
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
