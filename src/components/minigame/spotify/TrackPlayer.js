import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import SpotifyTimer from './SpotifyTimer';
import {
  SPOTIFY_GREEN,
  MISSING_ALBUM_COVER,
} from './SpotifyConstants';

// kan användas för lite coolare shadows. tillsammans med en radio på 200px
// const shadowColors = ['rgba(255,0,0,.4)', 'rgba(0,255,0,.4)', 'rgba(0,0,255,.4)'];

const styles = theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexFlow: 'column',
  },
  img: {
    marginBottom: 45,
    maxHeight: 540,
    webkitBboxShadow: '0 0 10px rgba(0,0,0,.3)',
    boxShadow: '0 0 10px rgba(0,0,0,.3)',
  },
  timeContainer: {
    display: 'flex',
    marginTop: 60,
    width: 680,
  },
  progress: {
    width: '100%',
    height: 3,
    marginTop: 10,
  },
  linearColorPrimary: {
    backgroundColor: '#404040',
  },
  linearBarColorPrimary: {
    backgroundColor: SPOTIFY_GREEN,
  },
  timeTextLeft: {
    marginRight: 20,
    marginLeft: 40,
    fontSize: 16,
    color: '#fff',
    opacity: 0.6,
    fontWeight: 400,
  },
  timeTextRight: {
    marginRight: 40,
    marginLeft: 20,
    fontSize: 16,
    color: '#fff',
    opacity: 0.6,
    fontWeight: 400,
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
  header: {
    fontSize: 28,
    padding: 45,
    fontWeight: 400,
  },
});

function TrackPlayer(props) {
  const { track, classes, text } = props;
  return (
    <div className={classes.container}>
      <Typography className={classes.header}>{text}</Typography>
      <img src={track.img} alt="cover art" className={classes.img} onError={(e) => { e.target.onerror = null; e.target.src = MISSING_ALBUM_COVER; }} />
      <div className={classes.footer}>
        <Typography className={classes.primaryText}>{track.name}</Typography>
        <Typography className={classes.secondaryText}>{track.artists}</Typography>
        <SpotifyTimer time={track.currentTime} duration={track.duration} />
      </div>
    </div>
  );
}

TrackPlayer.propTypes = {
  classes: PropTypes.object.isRequired,
  track: PropTypes.object.isRequired,
  text: PropTypes.string,
};

export default withStyles(styles)(TrackPlayer);
