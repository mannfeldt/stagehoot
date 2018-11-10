import React, { Component } from 'react';
import { fire } from '../../../base';
import Grid from '@material-ui/core/Grid';
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
        this.saveAnswer = this.saveAnswer.bind(this);
    }

    saveAnswer(answer) {
        let that = this;
        let currentQuestionId = this.props.game.quiz.questions[this.props.game.quiz.currentQuestion].id;
        fire.database().ref('/games/' + that.props.game.key + '/players/' + this.props.playerKey + '/answers/' + currentQuestionId).set(answer, function (error) {
            if (error) {
                let snack = {
                    variant: "error",
                    message: "Unexpected internal error"
                }
                that.props.showSnackbar(snack);
            }
            else {
                let snack = {
                    variant: "success",
                    message: "Successfully updated player!"
                }
                that.props.showSnackbar(snack);
            }
        })
    }

    render() {
        let lastPhase = this.props.game.phase === "final_result" || this.props.game.phase === "end";
        return (
            <div className="play-container">
                {this.props.game.phase === "connection" && <PhaseConnection game={this.props.game} addPlayer={this.props.createPlayer} playerKey={this.props.playerKey} />}
                {this.props.game.phase === "starting" && <PhaseStarting game={this.props.game} updatePlayer={this.props.updatePlayer} />}
                {this.props.game.phase === "awaiting_question" && <PhaseAwaitingQuestion game={this.props.game} updatePlayer={this.props.updatePlayer} />}
                {this.props.game.phase === "show_question" && <PhaseShowQuestion game={this.props.game} updatePlayer={this.props.updatePlayer} />}
                {this.props.game.phase === "answer" && <PhaseAnswer game={this.props.game} saveAnswer={this.saveAnswer} playerKey={this.props.playerKey} />}
                {this.props.game.phase === "result_question" && <PhaseResultQuestion game={this.props.game} updatePlayer={this.props.updatePlayer} playerKey={this.props.playerKey} />}
                {lastPhase  && <PhaseFinalResult game={this.props.game} updatePlayer={this.props.updatePlayer} playerKey={this.props.playerKey} />}
            </div>
        );
    }
}

export default Quiz;