import React, { Component } from 'react';
import { fire } from '../../base';
import HostSetup from './PhaseSetup';
import HostConnection from './PhaseConnection';
import HostStarting from './PhaseStarting';
import HostAwaitingQuestion from './PhaseAwaitingQuestion';
import HostShowQuestion from './PhaseShowQuestion';
import HostAnswer from './PhaseAnswer';
import HostFinalResult from './PhaseFinalResult';
import HostResultQuestion from './PhaseResultQuestion';
import HostEnd from './PhaseEnd';

class HostQuiz extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <div className="host-container">
                {this.props.game.phase === "setup" && <HostSetup game={this.props.game} updateGame={this.props.updateGame} />}
                {this.props.game.phase === "connection" && <HostConnection game={this.props.game} updateGame={this.props.updateGame} />}
                {this.props.game.phase === "starting" && <HostStarting game={this.props.game} updateGame={this.props.updateGame} />}
                {this.props.game.phase === "awaiting_question" && <HostAwaitingQuestion game={this.props.game} updateGame={this.props.updateGame} />}
                {this.props.game.phase === "show_question" && <HostShowQuestion game={this.props.game} updateGame={this.props.updateGame} />}
                {this.props.game.phase === "answer" && <HostAnswer game={this.props.game} updateGame={this.props.updateGame} />}
                {this.props.game.phase === "result_question" && <HostResultQuestion game={this.props.game} updateGame={this.props.updateGame} />}
                {this.props.game.phase === "final_result" && <HostFinalResult game={this.props.game} updateGame={this.props.updateGame} />}
                {this.props.game.phase === "end" && <HostEnd game={this.props.game} updateGame={this.props.updateGame} />}
            </div>
        );
    }
}

export default HostQuiz;