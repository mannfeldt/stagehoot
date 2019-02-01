import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import {
  Typography, Card,
} from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CreateTetris from './CreateTetris';
import CreateGolf from './CreateGolf';
import CreateSnake from './CreateSnake';
import CreateSpotify from './CreateSpotify';

class CreateMinigame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gametype: '',
    };
  }

    setGameType = name => (event) => {
      this.setState({ gametype: name });
    };

    render() {
      const { createGame } = this.props;
      const { gametype } = this.state;
      return (
        <div className="app-page create-page">
          {!gametype && (

          <Grid container spacing={24}>
            <Grid item xs={6}>
              <Card className="card-button" onClick={this.setGameType('snake')}>
                <CardHeader title="Snake" />
                <CardContent>
                  <Typography variant="subtitle1" align="center">Create a classic game of snake or change the modes to fit your audience</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card className="card-button" onClick={this.setGameType('tetris')}>
                <CardHeader title="Tetris" />
                <CardContent>
                  <Typography variant="subtitle1" align="center">Game is not available yet</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card className="card-button" onClick={this.setGameType('golf')}>
                <CardHeader title="Golf" />
                <CardContent>
                  <Typography variant="subtitle1" align="center">Create a multiplayer golf simulation game</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card className="card-button" onClick={this.setGameType('spotify')}>
                <CardHeader title="Spotify" />
                <CardContent>
                  <Typography variant="subtitle1" align="center">Get to know your friends Music taste</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          )}
          {gametype === 'snake' && <CreateSnake createGame={createGame} />}
          {gametype === 'tetris' && <CreateTetris createGame={createGame} />}
          {gametype === 'golf' && <CreateGolf createGame={createGame} />}
          {gametype === 'spotify' && <CreateSpotify createGame={createGame} />}
        </div>
      );
    }
}
CreateMinigame.propTypes = {
  createGame: PropTypes.func.isRequired,
};
export default CreateMinigame;
