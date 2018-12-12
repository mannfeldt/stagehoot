import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { fire } from '../../base';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let titleText = 'Stagehoot';
    if (fire.options.projectId === 'ettkilomjol-dev') {
      titleText = 'Ett Kilo Mjöl DEV';
    }

    return (
      <div id="header">
        <AppBar position="static">
          <Toolbar className="toolbar">
            <div className="appbar-container--left">
              <Link className="appbar-title text-big" to="/">
                {titleText}
              </Link>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
export default Header;
