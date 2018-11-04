import React, { Component } from 'react';
import { fire } from '../../base';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
class HostConnection extends Component {
    constructor(props) {
        super(props);
        this.nextPhase = this.nextPhase.bind(this);
    }

    nextPhase() {
        this.props.updateGame({phase: "starting"});
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
                <Typography variant="h2">Join game with Game ID: {this.props.game.gameId}</Typography>
                <Typography variant="h3">{this.props.game.title}</Typography>

                {players.map((player, index) =>
                    <div key={player.key}>{player.name}</div>
                )}
                <Button onClick={this.nextPhase} variant="contained">Start</Button>

            </div>
        );
    }
}

export default HostConnection;