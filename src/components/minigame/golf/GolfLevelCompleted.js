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
    // vill jag ha en egen komponent som återg¨¨r till efter varje runda. eller ska jag göra som manygolf och lägga det i HUD?
    // så jag aldrig lämnar spelet fören alla banor är klara.
    // mindre att spara till firebase i guess. kan hålla round helt i state. får generera om level. efter varje bana är klar.
    // kan ha manan i bakgrunden precis som i manygolf
    // använd drawHud till att rita leaderboard om level är done.
    return (
      <div className="phase-container">
        <Typography variant="h2">Golf leaderboard</Typography>
      </div>
    );
  }
}

export default GolfLevelCompleted;
