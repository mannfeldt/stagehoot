import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

class GolfLevelCompleted extends Component {
  constructor(props) {
    super(props);
    this.nextPhase = this.nextPhase.bind(this);
  }


  nextPhase() {
    this.props.gameFunc.update({ phase: 'gameplay' });
  }
  // på componentDidMount så starta en timer eller liknande. koppla timern till något visuellt. typ en materialUI progressbar. 0-100 som visas.
  // när timern är klar så updateras phase till nästa

  render() {
    return (
      <div className="phase-container">
        <Typography variant="h2">Golf leaderboard</Typography>
      </div>
    );
  }
}

export default GolfLevelCompleted;
