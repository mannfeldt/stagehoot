import React, { Component, Fragment } from 'react';
import LeftIcon from '@material-ui/icons/ChevronLeft';
import RightIcon from '@material-ui/icons/ChevronRight';
import UpIcon from '@material-ui/icons/ExpandLess';
import DownIcon from '@material-ui/icons/ExpandMore';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { fire } from '../../../base';

class SnakeController extends Component {
  constructor(props) {
    super(props);
    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(name) {
    const { playerKey, game } = this.props;
    const currentPlayer = game.players[playerKey];

    fire.database().ref(`/games/${game.key}/minigame/snakes/${currentPlayer.snakeId}/move`).set(name, (error) => {
      if (error) {
        console.log('error updated snake move');
      }
    });
  }

  render() {
    const { game, playerKey } = this.props;
    const currentPlayer = game.players[playerKey];
    const playerSnake = game.minigame.snakes[currentPlayer.snakeId];

    const allControlActions = playerSnake.actions;
    const displayName = playerSnake.playerKeys.length === 1 ? currentPlayer.name : playerSnake.name;

    return (
      <div className="phase-container">
        <div className="player-controlls-container">
          {allControlActions.map(action => (
            <Fragment key={action}>
              {currentPlayer.controlActions.includes(action)
                ? (
                  <Button key={action} className={`player-controlls-action player-controlls-${action}`} onClick={() => { this.handleAction(action); }} style={{ backgroundColor: playerSnake.color }}>
                    {action === 'up' && <UpIcon className="player-controlls-icon" />}
                    {action === 'down' && <DownIcon className="player-controlls-icon" />}
                    {action === 'right' && <RightIcon className="player-controlls-icon" />}
                    {action === 'left' && <LeftIcon className="player-controlls-icon" />}
                  </Button>
                )
                : (
                  <Button key={action} className={`player-controlls-action player-controlls-${action}`} style={{ backgroundColor: playerSnake.color, opacity: 0.3 }}>
                    {action === 'up' && <UpIcon className="player-controlls-icon" />}
                    {action === 'down' && <DownIcon className="player-controlls-icon" />}
                    {action === 'right' && <RightIcon className="player-controlls-icon" />}
                    {action === 'left' && <LeftIcon className="player-controlls-icon" />}
                  </Button>
                )
                            }
            </Fragment>
          ))}
          <div className="player-controlls-action player-controlls-middle">
            <Typography variant="body1">{displayName}</Typography>
          </div>
        </div>
      </div>
    );
  }
}
SnakeController.propTypes = {
  playerKey: PropTypes.string.isRequired,
  game: PropTypes.object.isRequired,
};
export default SnakeController;
