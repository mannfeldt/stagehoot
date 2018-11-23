import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';

class PhaseFinalResult extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.replayGame = this.replayGame.bind(this);
    }
    replayGame() {
        this.props.gameFunc.update({ phase: 'starting' });
    }
    render() {
        return (
            <div className="phase-container">
                <div className='quiz-middle-section'>
                    <Typography variant="h2">Final score</Typography>
                    skriv ut vinnaren och hur lång tid gamet tog (använd minigame.ticks och minigame.difficulty för att räkna ut sekunder)
                    minigame.winners inner håller vinnare/vinnarna.
                    kan vara så att winners inte finns om det snakes.length === 1 men då är ju den "vinnaren". typ i coop singelplayer
                    podium
                </div>
                <div className="align-bottom ">
                    <div>
                        <Button onClick={this.replayGame}>Replay game</Button>
                        <Button onClick={this.props.gameFunc.restart}>Re-host game</Button>
                        <Button onClick={this.props.gameFunc.quit}>Quit game</Button>
                        <Button onClick={() => alert('show results')}>Show results</Button>
                        <Button onClick={() => alert('start survey')}>Start survey</Button>
                        <Button>
                            <Link to={'/create'}>Create new game</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default PhaseFinalResult;