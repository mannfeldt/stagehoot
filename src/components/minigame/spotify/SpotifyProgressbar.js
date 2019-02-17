import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Progress } from 'react-sweet-progress';
import 'react-sweet-progress/lib/style.css';
import {
  SPOTIFY_GREEN,
} from './SpotifyConstants';

const styles = theme => ({
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
  hidden: {
    display: 'none',
  },
  nosize: {
    width: 0,
    height: 0,
  },
});

function SpotifyProgressbar(props) {
  const { progress, classes } = props;
  return (
    <React.Fragment>
      <LinearProgress
        className={classes.progress}
        variant="determinate"
        value={progress}
        classes={{
          colorPrimary: classes.linearColorPrimary,
          barColorPrimary: classes.linearBarColorPrimary,
        }}
      />
      {/* detta är bara fulhack. componenten behövs för att linearProgress ska köras smooth.. */}
      <Progress
        percent={progress}
        status="success"
        className={classes.nosize}
        symbolClassName={classes.hidden}
      />
    </React.Fragment>
  );
}

SpotifyProgressbar.propTypes = {
  classes: PropTypes.object.isRequired,
  progress: PropTypes.number.isRequired,
};

export default withStyles(styles)(SpotifyProgressbar);
