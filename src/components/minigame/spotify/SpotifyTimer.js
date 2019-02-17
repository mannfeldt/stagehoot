import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import SpotifyProgressbar from './SpotifyProgressbar';
import * as util from './SpotifyUtil';

const styles = theme => ({
  timeContainer: {
    display: 'flex',
    marginTop: 60,
    width: 680,
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
});

function SpotifyTimer(props) {
  const { time, duration, classes } = props;
  const timeString = util.formatTime(time);
  const durationString = util.formatTime(duration);
  const progress = (time / (duration - 0.5)) * 100;
  return (
    <div className={classes.timeContainer}>
      <Typography className={classes.timeTextLeft}>{timeString}</Typography>
      <SpotifyProgressbar progress={progress} />
      <Typography className={classes.timeTextRight}>{durationString}</Typography>
    </div>
  );
}

SpotifyTimer.propTypes = {
  classes: PropTypes.object.isRequired,
  time: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
};

export default withStyles(styles)(SpotifyTimer);
