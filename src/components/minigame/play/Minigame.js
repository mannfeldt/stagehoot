import React, { Component } from 'react';
import { fire } from '../../../base';
import Grid from '@material-ui/core/Grid';
import PhaseConnection from './PhaseConnection';
import PhaseStarting from './PhaseStarting';
import PhaseFinalResult from './PhaseFinalResult';
import PhaseEnd from './PhaseEnd';
import SnakeController from '../snake/SnakeController';
import TetrisController from '../tetris/TetrisController';

class Minigame extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    //Får ha en phase som är "gameplay" där den specifika komponenten för varje minigame rendreras. eller där en phaseGamePlay rednfreras som i sin tur kollar på gametype

    render() {
        let lastPhase = this.props.game.phase === "final_result" || this.props.game.phase === "end";
        switch (this.props.game.gametype) {
            case 'snake':
                return (
                    <div className="play-container">
                        {this.props.game.phase === "connection" && <PhaseConnection game={this.props.game} addPlayer={this.props.createPlayer} playerKey={this.props.playerKey} />}
                        {this.props.game.phase === "starting" && <PhaseStarting game={this.props.game} updatePlayer={this.props.updatePlayer} />}
                        {this.props.game.phase === "gameplay" && <SnakeController game={this.props.game} updatePlayer={this.props.updatePlayer} playerKey={this.props.playerKey} />}
                        {lastPhase && <PhaseFinalResult game={this.props.game} updatePlayer={this.props.updatePlayer} playerKey={this.props.playerKey} />}
                    </div>
                );
            case 'tetris':
                return (
                    <div className="play-container">
                        {this.props.game.phase === "connection" && <PhaseConnection game={this.props.game} addPlayer={this.props.createPlayer} playerKey={this.props.playerKey} />}
                        {this.props.game.phase === "starting" && <PhaseStarting game={this.props.game} updatePlayer={this.props.updatePlayer} />}
                        {this.props.game.phase === "gameplay" && <TetrisController game={this.props.game} updatePlayer={this.props.updatePlayer} />}
                        {lastPhase && <PhaseFinalResult game={this.props.game} updatePlayer={this.props.updatePlayer} playerKey={this.props.playerKey} />}
                    </div>
                );
            default:
                return (null);
        }
    }
}

export default Minigame;