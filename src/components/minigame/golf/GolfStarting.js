import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import CountdownAnimation from '../../common/CountdownAnimation';

class GolfStarting extends Component {
  constructor(props) {
    super(props);
    this.startCounter();
    this.nextPhase = this.nextPhase.bind(this);
  }

  startCounter() {
    const that = this;
    let counter = 5;
    const i = setInterval(() => {
      counter -= 1;
      if (counter === 0) {
        that.nextPhase();
        clearInterval(i);
      }
    }, 1000);
    return 5;
  }

  nextPhase() {
    const { game, gameFunc } = this.props;

    game.phase = 'gameplay';
    gameFunc.update(game);
  }

  // skapa bara en klassic mode med en "boll" per spelare

  // i golf.js så sno kod för att kunna skapa en golfbana med fysik osv.
  // skapa firebase lyssnare till varje boll? likt snake kanske. men granska den lösningen dåden inte var så jättebra
  // skapa en enkel golfcontroller som kan göra en swing, få ett powervärde och skicka värdet till firebaase och in i snake.js som slår till bollen utifrån värdet
  // börja med en standard klubba/vinkel, i golfController ska man sen kunna ändra klubba innan varje slag.
  // putter, wedge, iron 8, iron 6, driver är standard?
  // övriga klubbtyper kan man köpa för ingame currency som man vinner efter varje hål?
  // eller som kan kan köpa till sin "profil" kräver att jag börjar med inloggning till stagehoot. krävs också för att få till handikapp.
  // kanske bara för golf man behöver logga in? eller har valet att kunna logga in med fördelen att spara progress etc?
  render() {
    return (
      <div className="phase-container">
        <Typography variant="h2">Starting game</Typography>
        <CountdownAnimation speed="slow" />
      </div>
    );
  }
}
GolfStarting.propTypes = {
  gameFunc: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired,
};
export default GolfStarting;
