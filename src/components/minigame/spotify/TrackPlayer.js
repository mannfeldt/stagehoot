import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Progress } from 'react-sweet-progress';
import * as util from './SpotifyUtil';
import 'react-sweet-progress/lib/style.css';
import {
  SPOTIFY_GREEN,
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
  hidden: {
    display: 'none',
  },
  nosize: {
    width: 0,
    height: 0,
  },
  header: {
    fontSize: 28,
    padding: 45,
    fontWeight: 400,
  },
});

function TrackPlayer(props) {
  const { track, classes } = props;
  const timeString = util.formatTime(track.currentTime);
  const durationString = util.formatTime(track.duration);
  const progress = (track.currentTime / (track.duration - 0.5)) * 100;
  return (
    <div className={classes.container}>
      <Typography className={classes.header}>Vems låt är detta?</Typography>
      <img src={track.img.url} alt="cover art" className={classes.img} />
      <div className={classes.footer}>
        <Typography className={classes.primaryText}>{track.name}</Typography>
        <Typography className={classes.secondaryText}>{track.artists}</Typography>
        <div className={classes.timeContainer}>
          <Typography className={classes.timeTextLeft}>{timeString}</Typography>
          <LinearProgress
            className={classes.progress}
            variant="determinate"
            value={progress}
            classes={{
              colorPrimary: classes.linearColorPrimary,
              barColorPrimary: classes.linearBarColorPrimary,
            }}
          />
          <Typography className={classes.timeTextRight}>{durationString}</Typography>
        </div>
        <div>
          {/* detta är bara fulhack. componenten behövs för att linearProgress ska köras smooth.. */}
          <Progress
            percent={progress}
            status="success"
            className={classes.nosize}
            symbolClassName={classes.hidden}
          />
        </div>
      </div>
    </div>
  );
}

TrackPlayer.propTypes = {
  classes: PropTypes.object.isRequired,
  track: PropTypes.object.isRequired,
};

export default withStyles(styles)(TrackPlayer);
