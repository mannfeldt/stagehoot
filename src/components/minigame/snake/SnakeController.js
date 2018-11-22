import React, { Component, Fragment } from 'react';
import LeftIcon from '@material-ui/icons/ChevronLeft';
import RightIcon from '@material-ui/icons/ChevronRight';
import UpIcon from '@material-ui/icons/ExpandLess';
import DownIcon from '@material-ui/icons/ExpandMore';
import { Typography } from '@material-ui/core';
import { fire } from '../../../base';
import Button from '@material-ui/core/Button';

class SnakeController extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.handleAction = this.handleAction.bind(this);
    }

    validateDirectionChange(keyPress, currentDirection) {
        return (keyPress === 'left' && currentDirection !== 'right') ||
            (keyPress === 'right' && currentDirection !== 'left') ||
            (keyPress === 'up' && currentDirection !== 'down') ||
            (keyPress === 'down' && currentDirection !== 'up');
    }

    handleAction(name) {
        let currentPlayer = this.props.game.players[this.props.playerKey];
        let snakeId = currentPlayer.snakeId;
        let currentSnake = this.props.game.minigame.snakes[snakeId];
        //om det inte är ett giltigt move så spara det inte till firebase? alt kan jag göra denna sanering vid read i snake.js
        if (currentSnake.move === name) {
            console.log("move is same as current direction");
            return;
        }
        if (!this.validateDirectionChange(name, currentSnake.move)) {
            console.log("move is unvalid");
            return;
        }
        fire.database().ref('/games/' + this.props.game.key + '/minigame/snakes/' + snakeId + '/move').set(name, function (error) {
            if (error) {
                console.log("error updated snake move");
            }
            else {
                console.log("successfully updated snake move");
            }
        })
    }

    render() {
        let currentPlayer = this.props.game.players[this.props.playerKey];
        let playerSnake = this.props.game.minigame.snakes[currentPlayer.snakeId];

        let controlActions = currentPlayer.controlActions;
        let allControlActions = playerSnake.actions;
        return (
            <div className="phase-container">
                <div className='player-controlls-container'>
                    {allControlActions.map((action, index) =>
                        <Fragment key={action}>
                            {controlActions.indexOf(action) > -1 &&
                                <Button key={action} className={'player-controlls-action player-controlls-' + action} onClick={() => { this.handleAction(action) }} style={{ backgroundColor: playerSnake.color }}>
                                    {action === 'up' && <UpIcon className='player-controlls-icon' />}
                                    {action === 'down' && <DownIcon className='player-controlls-icon' />}
                                    {action === 'right' && <RightIcon className='player-controlls-icon' />}
                                    {action === 'left' && <LeftIcon className='player-controlls-icon' />}
                                </Button>
                            }
                            {controlActions.indexOf(action) === -1 &&
                                <Button key={action} className={'player-controlls-action player-controlls-' + action} style={{ backgroundColor: playerSnake.color, opacity: 0.3 }}>
                                    {action === 'up' && <UpIcon className='player-controlls-icon' />}
                                    {action === 'down' && <DownIcon className='player-controlls-icon' />}
                                    {action === 'right' && <RightIcon className='player-controlls-icon' />}
                                    {action === 'left' && <LeftIcon className='player-controlls-icon' />}
                                </Button>
                            }
                        </Fragment>
                    )}
                    <div className='player-controlls-action player-controlls-middle'>
                        <Typography variant="body1">{playerSnake.name}</Typography>
                    </div>
                </div>
            </div>
        );
    }
}

export default SnakeController;