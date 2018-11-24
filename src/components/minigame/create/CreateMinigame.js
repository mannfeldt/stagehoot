import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import CreateSnake from './CreateSnake';
import CreateTetris from './CreateTetris';

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
            <Button onClick={this.setGameType('snake')} variant="contained">Snake</Button>
            <Button onClick={this.setGameType('tetris')} variant="contained">Tetris</Button>
          </Grid>
          )}
          {gametype === 'snake' && <CreateSnake createGame={createGame} />}
          {gametype === 'tetris' && <CreateTetris createGame={createGame} />}
        </div>
      );
    }
}
CreateMinigame.propTypes = {
  createGame: PropTypes.func.isRequired,
};
export default CreateMinigame;
