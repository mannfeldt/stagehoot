import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

class PhaseConnection extends Component {
    constructor(props) {
        super(props);
        this.nextPhase = this.nextPhase.bind(this);
    }

    nextPhase() {
        this.props.gameFunc.update({ phase: "starting" });
    }
    //add function to kick player
    render() {
        let players = this.props.game.players;
        if (!players) {
            players = [];
        } else {
            players = Object.values(players);
        }
        return (
            <div className="phase-container">

                <div className="quiz-top-section">
                    <Typography variant="h3">Join game with Game ID: {this.props.game.gameId}</Typography>
                    <Typography variant="h4">{this.props.game.title}</Typography>
                </div>
                <div className='quiz-middle-section'>
                    <Grid container>
                        {players.map((player, index) =>
                            <Grid key={index} item xs={3}>
                                <Typography className="big-caption" paragraph variant="caption">{player.name}</Typography>
                            </Grid>)}
                    </Grid>
                </div>
                <div className="quiz-bottom-section">
                    <Button onClick={this.nextPhase} variant="contained">Start</Button>

                </div>
            </div>
        );
    }
}
export default PhaseConnection;