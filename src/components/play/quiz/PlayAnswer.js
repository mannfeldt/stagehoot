import React, { Component } from 'react';
import { fire } from '../../../base';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});

class PlayAnswer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: 0,
            question: {},
            hasAnswered: false,
            selectedAnswer: ''
        };
        this.answerQuestion = this.answerQuestion.bind(this);
    }
    componentDidMount() {
        let question = this.props.game.quiz.questions[this.props.game.quiz.currentQuestion];
        this.setState({ question: question, startTime: Date.now() });

    }
    answerQuestion = answer => {
        this.setState({ selectedAnswer: answer, hasAnswered: true });
        let answerTime = Date.now() - this.state.startTime;
        let correct = this.state.question.correctAnswers.indexOf(answer) > -1;
        let score = 0;
        if (correct) {
            switch (this.state.question.difficulty) {
                case "easy":
                    score += 100;
                    break;
                case "medium":
                    score += 200;
                    break;
                case "hard":
                    score += 300;
                    break;
                case undefined:
                    score += 200;
                    break;
                default:
                    break;
            }
            if (this.props.game.quiz.timelimit && this.state.question.timelimit) {
                //let timeRemaining = this.state.question.timelimit - answerTime;
                let timeFactorUsed = answerTime / (this.state.question.timelimit * 1000);
                score += Math.floor((score / timeFactorUsed) / 10);
            }
        }
        let playerAnswer = {
            answer: answer,
            score: score,
            answerTime: answerTime,
            questionId: this.state.question.id,
        }
        this.props.saveAnswer(playerAnswer);
    };

    render() {
        const { classes } = this.props;
        let answers = [];
        if (this.props.game) {
            answers = this.props.game.quiz.questions[this.props.game.quiz.currentQuestion].answers;
        }
        if (this.state.hasAnswered) {
            return (<div className="phase-container">
                You answered: {this.state.selectedAnswer}
            </div>
            );
        } else {
            return (
                <div className="phase-container">
                    <Grid container spacing={8}>
                        {answers.map((answer, index) =>
                            <Grid key={index} item xs={6}>
                                <Paper onClick={()=>{this.answerQuestion(answer)}} className={classes.paper}>{answer}</Paper>
                            </Grid>)}
                    </Grid>
                </div>
            );
        }
    }
}
export default withStyles(styles)(PlayAnswer);