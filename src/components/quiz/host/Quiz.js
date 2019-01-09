import React, { Component } from 'react';
import PhaseSetup from './PhaseSetup';
import PhaseConnection from './PhaseConnection';
import PhaseStarting from './PhaseStarting';
import PhaseAwaitingQuestion from './PhaseAwaitingQuestion';
import PhaseShowQuestion from './PhaseShowQuestion';
import PhaseAnswer from './PhaseAnswer';
import PhaseFinalResult from './PhaseFinalResult';
import PhaseResultQuestion from './PhaseResultQuestion';
import PhaseEnd from './PhaseEnd';

class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className="host-container">
        {this.props.game.phase === 'setup' && <PhaseSetup game={this.props.game} gameFunc={this.props.gameFunc} />}
        {this.props.game.phase === 'connection' && <PhaseConnection game={this.props.game} gameFunc={this.props.gameFunc} />}
        {this.props.game.phase === 'starting' && <PhaseStarting game={this.props.game} gameFunc={this.props.gameFunc} />}
        {this.props.game.phase === 'awaiting_question' && <PhaseAwaitingQuestion game={this.props.game} gameFunc={this.props.gameFunc} />}
        {this.props.game.phase === 'show_question' && <PhaseShowQuestion game={this.props.game} gameFunc={this.props.gameFunc} />}
        {this.props.game.phase === 'answer' && <PhaseAnswer game={this.props.game} gameFunc={this.props.gameFunc} />}
        {this.props.game.phase === 'result_question' && <PhaseResultQuestion game={this.props.game} gameFunc={this.props.gameFunc} />}
        {this.props.game.phase === 'final_result' && <PhaseFinalResult game={this.props.game} gameFunc={this.props.gameFunc} />}
        {this.props.game.phase === 'end' && <PhaseEnd game={this.props.game} gameFunc={this.props.gameFunc} />}
      </div>
    );
  }
}

export default Quiz;
