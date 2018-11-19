import React, { Component, Fragment } from 'react';
import Paper from '@material-ui/core/Paper';
import LeftIcon from '@material-ui/icons/ChevronLeft';
import RightIcon from '@material-ui/icons/ChevronRight';
import UpIcon from '@material-ui/icons/ExpandLess';
import DownIcon from '@material-ui/icons/ExpandMore';
import { Typography } from '@material-ui/core';
import { fire } from '../../../base';

class SnakeController extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.handleAction = this.handleAction.bind(this);
    }
    handleAction(name) {
        let currentPlayer = this.props.game.players[this.props.playerKey];
        let snakeId = currentPlayer.snakeId;

        fire.database().ref('/games/' + this.props.game.key + '/minigame/snakes/' + snakeId + '/move').set(name, function (error) {
            if (error) {
                console.log("error updated snake move")

            }
            else {
                console.log("successfully updated snake move")
            }
        })
    }

    render() {
        let currentPlayer = this.props.game.players[this.props.playerKey];
        let playerSnake = this.props.game.minigame.snakes[currentPlayer.snakeId];

        let controlActions = currentPlayer.controlActions;
        let allControlActions = ['up', 'right', 'down', 'left'];
        return (
            <div className="phase-container">
                <div className='player-controlls-container'>
                    {allControlActions.map((action, index) =>
                        <Fragment key={action}>
                            {controlActions.indexOf(action) > -1 &&
                                <Paper key={action} className={'player-controlls-action player-controlls-' + action} onClick={() => { this.handleAction(action) }} style={{ backgroundColor: playerSnake.color }}>
                                    {action === 'up' && <UpIcon className='player-controlls-icon' />}
                                    {action === 'down' && <DownIcon className='player-controlls-icon' />}
                                    {action === 'right' && <RightIcon className='player-controlls-icon' />}
                                    {action === 'left' && <LeftIcon className='player-controlls-icon' />}
                                </Paper>
                            }
                            {controlActions.indexOf(action) === -1 &&
                                <Paper key={action} className={'player-controlls-action player-controlls-' + action} style={{ backgroundColor: playerSnake.color, opacity: 0.3 }}>
                                    {action === 'up' && <UpIcon className='player-controlls-icon' />}
                                    {action === 'down' && <DownIcon className='player-controlls-icon' />}
                                    {action === 'right' && <RightIcon className='player-controlls-icon' />}
                                    {action === 'left' && <LeftIcon className='player-controlls-icon' />}
                                </Paper>
                            }
                        </Fragment>
                    )}
                    <Paper className='player-controlls-action player-controlls-middle'>
                        <Typography variant="body1">{playerSnake.name}</Typography>
                    </Paper>
                </div>
            </div>
        );
    }
}

export default SnakeController;