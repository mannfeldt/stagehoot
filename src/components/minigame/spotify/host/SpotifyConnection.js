import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/Person';

const styles = theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexFlow: 'column',
  },
  avatar: {
    marginBottom: 5,
    height: 120,
    borderRadius: '50%',
    webkitBboxShadow: '0 0 10px rgba(0,0,0,.3)',
    boxShadow: '0 0 10px rgba(0,0,0,.3)',
  },
  icon: {
    height: 120,
    width: 120,
    marginTop: 5,
  },
  primaryText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 500,
  },
  secondaryText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 400,
    opacity: 0.6,
  },
  pin: {
    fontSize: 32,
  },
  header: {
    fontSize: 28,
    padding: 45,
    fontWeight: 400,
    color: '#fff',
  },
  subheader: {
    fontSize: 24,
    padding: 45,
    fontWeight: 400,
    color: '#fff',
    opacity: 0.7,
  },
});
class SpotifyConnection extends Component {
  constructor(props) {
    super(props);
    this.nextPhase = this.nextPhase.bind(this);
  }

  nextPhase() {
    const { gameFunc } = this.props;
    gameFunc.update({ phase: 'gameplay' });
  }

  render() {
    const { game, classes } = this.props;
    let { players } = game;
    if (!players) {
      players = [];
    } else {
      players = Object.values(players);
    }
    return (
      <div className="phase-container">
        <div className="quiz-top-section">
          <Typography className={classes.header}>
            <span>Join game with Game PIN: </span>
            <span className={classes.pin}>{game.gameId}</span>
          </Typography>
          <Typography className={classes.subheader}>mannfeldt.github.io/stagehoot</Typography>
          <Typography className={classes.title}>{game.title}</Typography>
        </div>
        <div className="quiz-middle-section">
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
          >
            {players.map(player => (
              <Grid
                key={player.key}
                item
                style={{ padding: '15px 30px 30px 30px' }}
              >
                {player.avatar ? (<img className={classes.avatar} src={player.avatar} alt={player.name} />) : (<PersonIcon classes={{ root: classes.icon }} />) }
                <Typography className={classes.secondaryText}>{player.name}</Typography>
              </Grid>
            ))}
          </Grid>
        </div>
        <div className="quiz-bottom-section">
          <Button onClick={this.nextPhase} color="primary">Start</Button>
        </div>
      </div>
    );
  }
}
SpotifyConnection.propTypes = {
  game: PropTypes.object.isRequired,
  gameFunc: PropTypes.object.isRequired,
  classes: PropTypes.any,
};
export default withStyles(styles)(SpotifyConnection);
