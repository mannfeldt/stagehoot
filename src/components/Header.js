import React, { Component } from 'react';
//import './header.css';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
//import headerImg from './header.jpg';
import { fire } from '../base';
import firebase from 'firebase/app';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    };
    this.openMenu = this.openMenu.bind(this);
    this.handleClose = this.handleClose.bind(this);

  }

  openMenu = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose() {
    this.setState({
      anchorEl: null
    });
  }

  render() {
    function MenuItemList(props) {
      let items = [];
      items.push(<Link key={items.length} to={'/'}><MenuItem onClick={props.onClose}>Home</MenuItem></Link>);
      items.push(<Link key={items.length} to={'/play'}><MenuItem onClick={props.onClose}>Play</MenuItem></Link>);
      items.push(<Link key={items.length} to={'/host'}><MenuItem onClick={props.onClose} >Host</MenuItem></Link>);
      items.push(<Link key={items.length} to={'/create'}><MenuItem onClick={props.onClose} >Create</MenuItem></Link>);
      return (<div className="header-menulist">
        {items}
      </div>);
    }

    let titleText = "Stagehoot";
    if (fire.options.projectId === "ettkilomjol-dev") {
      titleText = "Ett Kilo Mjöl DEV";
    }
    let route = window.location.href.substr(window.location.href.indexOf("/#/") + 2);

    return (
      <div id="header">
        <AppBar position="static">
          <Toolbar className="toolbar">
            <div className="appbar-container--left">
              <Link className="appbar-title text-big" to={'/'}>
                {titleText}
              </Link>
              <span className="hide-mobile">
                <Link to={'/'}>
                  <Button className={route === "/" ? 'appbar-nav-button selected-route':'appbar-nav-button'}>
                    Home
                  </Button>
                </Link>
                <Link to={'/play'}>
                  <Button className={route === "/play" ? 'appbar-nav-button selected-route':'appbar-nav-button'}>
                    Play
                  </Button>
                </Link>
                <Link to={'/host'}>
                  <Button className={route === "/host" ? 'appbar-nav-button selected-route':'appbar-nav-button'}>
                    Host
                  </Button>
                </Link>
                <Link to={'/create'}>
                  <Button className={route === "/create" ? 'appbar-nav-button selected-route':'appbar-nav-button'}>
                    Create
                  </Button>
                </Link>
              </span>
            </div>
            <div className="appbar-container--right hide-desktop">
              <IconButton onClick={this.openMenu}>
                <MoreVertIcon />
              </IconButton>
              <Menu open={!!this.state.anchorEl} onClose={this.handleClose} anchorEl={this.state.anchorEl}>
                <MenuItemList onClose={this.handleClose} />
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </div >
    );
  }
}
export default Header;