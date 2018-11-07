import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import AnswerOption from '../AnswerOption';
import Grid from '@material-ui/core/Grid';

class HostSetup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: 0,
            started: false,
            isTimelimited: true,
            question: {
                question: '',
                answers: [],
            },
        }
        this.nextPhase = this.nextPhase.bind(this);
    }

    componentDidMount() {
        let that = this;
        let question = this.props.game.quiz.questions[this.props.game.quiz.currentQuestion];
        this.setState({ question: question, isTimelimited: this.props.game.quiz.timelimit });
        if (this.props.game.quiz.timelimit) {
            let counter = question.timelimit;
            let i = setInterval(function () {
                counter--;
                that.setState({ counter: counter, started: true });
                if (counter <= 0) {
                    that.nextPhase();
                    clearInterval(i);
                }
            }, 1000);
        }
    }
    componentDidUpdate(prevProps) {
        let playerKeys = this.props.game.players ? Object.keys(this.props.game.players) : [];
        let answersCollected = 0;

        for (let i = 0; i < playerKeys.length; i++) {
            if (this.props.game.players[playerKeys[i]].answers && this.props.game.players[playerKeys[i]].answers[this.props.game.quiz.questions[this.props.game.quiz.currentQuestion].id]) {
                answersCollected++;
            }
        }
        if(answersCollected === playerKeys.length){
            this.nextPhase();
        }
      }
    nextPhase() {
        this.props.updateGame({ phase: "result_question" });
    }
    render() {
        let answers = [];
        if (this.props.game) {
            answers = this.props.game.quiz.questions[this.props.game.quiz.currentQuestion].answers;
        }
        let answersCollected = 0;
        let playerKeys = this.props.game.players ? Object.keys(this.props.game.players) : [];
        for (let i = 0; i < playerKeys.length; i++) {
            if (this.props.game.players[playerKeys[i]].answers && this.props.game.players[playerKeys[i]].answers[this.props.game.quiz.questions[this.props.game.quiz.currentQuestion].id]) {
                answersCollected++;
            }
        }
        return (
            <div className="phase-container">
                {!this.state.isTimelimited && <Button onClick={this.nextPhase}>Next</Button>}
                {this.state.isTimelimited && <Typography variant="h2">{this.state.counter}</Typography>}
                <Typography variant="h2">{this.state.question.question}</Typography>
                <Typography variant="h3">Answers collected:{answersCollected}</Typography>
                <Grid container spacing={8}>
                    {answers.map((answer, index) =>
                        <Grid key={index} item xs={6}>
                            <AnswerOption answer={answer} index={index} />
                        </Grid>)}
                </Grid>
            </div>
        );

    }
}

export default HostSetup;