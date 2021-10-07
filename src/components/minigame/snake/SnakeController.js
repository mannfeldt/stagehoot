import React, { Component, Fragment } from "react";
import LeftIcon from "@material-ui/icons/ChevronLeft";
import RightIcon from "@material-ui/icons/ChevronRight";
import UpIcon from "@material-ui/icons/ExpandLess";
import DownIcon from "@material-ui/icons/ExpandMore";
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { fire } from "../../../base";

class SnakeController extends Component {
  constructor(props) {
    super(props);
    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(name) {
    const { playerKey, game } = this.props;
    const currentPlayer = game.players[playerKey];

    fire
      .database()
      .ref(`/games/${game.key}/minigame/snakes/${currentPlayer.snakeId}/move`)
      .set(name, (error) => {
        if (error) {
          console.log("error updated snake move");
        }
      });
  }

  render() {
    const { game, playerKey } = this.props;
    const currentPlayer = game.players[playerKey];
    const playerSnake = game.minigame.snakes[currentPlayer.snakeId];

    const allControlActions = playerSnake.actions;
    const displayName =
      playerSnake.playerKeys.length === 1
        ? currentPlayer.name
        : playerSnake.name;

    return (
      <div className="snake-controller-container">
        <div style={{ position: "absolute", zIndex: 100 }}>{displayName}</div>
        <Button
          key={"up"}
          className="snake-controller-button-fullwidth"
          onClick={() => {
            this.handleAction("up");
          }}
          disabled={!currentPlayer.controlActions.includes("up")}
          style={{
            backgroundColor: playerSnake.color,
            opacity: currentPlayer.controlActions.includes("up") ? 1.0 : 0.3,
          }}
        >
          <UpIcon className="player-controlls-icon" />
        </Button>
        <Button
          key={"left"}
          className="snake-controller-button"
          onClick={() => {
            this.handleAction("left");
          }}
          disabled={!currentPlayer.controlActions.includes("left")}
          style={{
            backgroundColor: playerSnake.color,
            opacity: currentPlayer.controlActions.includes("left") ? 1.0 : 0.3,
          }}
        >
          <LeftIcon className="player-controlls-icon" />
        </Button>
        <Button
          key={"right"}
          className="snake-controller-button"
          disabled={!currentPlayer.controlActions.includes("right")}
          onClick={() => {
            this.handleAction("right");
          }}
          style={{
            backgroundColor: playerSnake.color,
            opacity: currentPlayer.controlActions.includes("right") ? 1.0 : 0.3,
          }}
        >
          <RightIcon className="player-controlls-icon" />
        </Button>
        <Button
          key={"down"}
          className="snake-controller-button-fullwidth"
          disabled={!currentPlayer.controlActions.includes("down")}
          onClick={() => {
            this.handleAction("down");
          }}
          style={{
            backgroundColor: playerSnake.color,
            opacity: currentPlayer.controlActions.includes("down") ? 1.0 : 0.3,
          }}
        >
          <DownIcon className="player-controlls-icon" />
        </Button>
      </div>
    );
  }
}
SnakeController.propTypes = {
  playerKey: PropTypes.string.isRequired,
  game: PropTypes.object.isRequired,
};
export default SnakeController;
