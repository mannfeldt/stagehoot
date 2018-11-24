import React, { PureComponent } from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

class PhaseEnd extends PureComponent {
  render() {
    const { game } = this.props;
    return (
      <div className="phase-container">
        <Typography>{`hur seer detta ut konstigt med dollarsign?HostEnd toggleheader()${game.title}`}</Typography>
      </div>
    );
  }
}
PhaseEnd.propTypes = {
  game: PropTypes.object.isRequired,
};
export default PhaseEnd;
