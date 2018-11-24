import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  text: {
    marginBottom: '-200px',
    fontSize: '86px',
    paddingTop: '160px',
  },
  circle: {
    color: '#6JpDK4',

  },
});
class Timer extends PureComponent {
  render() {
    const {
      classes, text, value, startValue,
    } = this.props;
    let currentCount = value === null ? startValue : value;
    const start = startValue < 1 ? 0 : startValue;

    if (currentCount < 0) {
      currentCount = 0;
    }
    const completed = currentCount / start;

    return (
      <div className={classes.container}>
        <Typography variant="caption" className={classes.text}>{text}</Typography>
        <CircularProgress
          className={classes.circle}
          classes={{
            colorSecondary: classes.circle,
          }}
          variant="static"
          value={completed * 100}
          thickness={4}
          size={300}
        />
      </div>
    );
  }
}

Timer.propTypes = {
  text: PropTypes.string,
  value: PropTypes.number,
  startValue: PropTypes.number,
  classes: PropTypes.any,
};
export default withStyles(styles)(Timer);
