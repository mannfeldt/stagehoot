import React, { Component } from 'react';
import PhaseSetup from './PhaseSetup';
import PhaseConnection from './PhaseConnection';
import PhaseStarting from './PhaseStarting';
import Snake from '../snake/Snake';
import Tetris from '../tetris/Tetris';
import PhaseFinalResult from './PhaseFinalResult';
import PhaseEnd from './PhaseEnd';
import SnakeStarting from '../snake/SnakeStarting';

class Minigame extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        switch (this.props.game.gametype) {
            case 'snake':
                return (
                    <div className="host-container">
                        {this.props.game.phase === "setup" && <PhaseSetup game={this.props.game} gameFunc={this.props.gameFunc} />}
                        {this.props.game.phase === "connection" && <PhaseConnection game={this.props.game} gameFunc={this.props.gameFunc} />}
                        {this.props.game.phase === "starting" && <SnakeStarting game={this.props.game} gameFunc={this.props.gameFunc} />}
                        {this.props.game.phase === "gameplay" && <Snake game={this.props.game} gameFunc={this.props.gameFunc} />}
                        {this.props.game.phase === "final_result" && <PhaseFinalResult game={this.props.game} gameFunc={this.props.gameFunc} />}
                        {this.props.game.phase === "end" && <PhaseEnd game={this.props.game} gameFunc={this.props.gameFunc} />}
                    </div>
                );
            case 'tetris':
                return (
                    <div className="host-container">
                        {this.props.game.phase === "setup" && <PhaseSetup game={this.props.game} gameFunc={this.props.gameFunc} />}
                        {this.props.game.phase === "connection" && <PhaseConnection game={this.props.game} gameFunc={this.props.gameFunc} />}
                        {this.props.game.phase === "starting" && <PhaseStarting game={this.props.game} gameFunc={this.props.gameFunc} />}
                        {this.props.game.phase === "gameplay" && <Tetris game={this.props.game} gameFunc={this.props.gameFunc} />}
                        {this.props.game.phase === "final_result" && <PhaseFinalResult game={this.props.game} gameFunc={this.props.gameFunc} />}
                        {this.props.game.phase === "end" && <PhaseEnd game={this.props.game} gameFunc={this.props.gameFunc} />}
                    </div>
                );
            default:
                return (null);
        }
    }
}

export default Minigame;