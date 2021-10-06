import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import QRCode from "qrcode.react";

class PhaseConnection extends Component {
  constructor(props) {
    super(props);
    this.nextPhase = this.nextPhase.bind(this);
  }

  nextPhase() {
    const { gameFunc } = this.props;
    gameFunc.update({ phase: "starting" });
  }

  render() {
    const { game } = this.props;
    let { players } = game;
    if (!players) {
      players = [];
    } else {
      players = Object.values(players);
    }
    let playUrl =
      game.gametype === "golf" || game.gametype === "golfrace"
        ? "https://mannfeldt.github.io/golf/?pin=" + game.gameId
        : "https://mannfeldt.github.io/stagehoot/#/play?pin=" + game.gameId;
    // här ska jag skapa qr kod också över länken. med ?pin=xxxx
    return (
      <div className="phase-container">
        <div className="quiz-top-section">
          <Typography variant="h2">
            <span>Join game with Game PIN: </span>
            <span className="dynamic-text">{game.gameId}</span>
          </Typography>
          {game.gametype === "golf" || game.gametype === "golfrace" ? (
            <div style={{ marginTop: 30 }}>
              <QRCode value={playUrl} size={200} />
              <Typography variant="h4" style={{ marginTop: 30 }}>
                mannfeldt.github.io/golf
              </Typography>
            </div>
          ) : (
            <div style={{ marginTop: 40 }}>
              <QRCode value={playUrl} size={200} />
              <Typography variant="h4" style={{ marginTop: 40 }}>
                mannfeldt.github.io/stagehoot
              </Typography>
            </div>
          )}
          <Typography variant="subtitle1" style={{ marginTop: 20 }}>
            {game.title}
          </Typography>
        </div>
        <div className="quiz-middle-section">
          <Button onClick={this.nextPhase} variant="contained">
            Start
          </Button>
        </div>
        <div className="quiz-bottom-section">
          <Grid container>
            <Grid container>
              {players.map((player) => (
                <Grid key={player.key} item xs={3}>
                  <Typography
                    paragraph
                    variant="body1"
                    className="dynamic-text"
                  >
                    {player.name}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}
PhaseConnection.propTypes = {
  game: PropTypes.object.isRequired,
  gameFunc: PropTypes.object.isRequired,
};
export default PhaseConnection;
