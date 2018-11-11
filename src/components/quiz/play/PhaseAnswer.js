import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import AnswerOption from '../AnswerOption';

class PhaseAnswer extends Component {
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
        let answers = [];
        if (this.props.game) {
            answers = this.props.game.quiz.questions[this.props.game.quiz.currentQuestion].answers;
        }

        if (this.props.game.quiz.remoteMode) {
            if (this.state.hasAnswered) {
                return (
                    <div className="phase-container">
                        <div className="quiz-top-section">
                            <Typography variant="h4">
                                {this.props.game.quiz.questions[this.props.game.quiz.currentQuestion].question}
                            </Typography>
                        </div>
                        <div className='quiz-middle-section'>
                            <Typography variant="h4">
                                You answered: {this.state.selectedAnswer}
                            </Typography>
                        </div>
                        <div className="quiz-bottom-section">
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="phase-container">
                        <div className="quiz-top-section">
                            <Typography variant="h4">
                                {this.props.game.quiz.questions[this.props.game.quiz.currentQuestion].question}
                            </Typography>
                        </div>
                        <div className="quiz-middle-and-bottom-section">
                            <Grid container spacing={8} className="full-height">
                                {answers.map((answer, index) =>
                                    <Grid key={index} item xs={6}>
                                        <AnswerOption answer={answer} index={index} answerQuestion={this.answerQuestion} remoteMode={true} />
                                    </Grid>)}
                            </Grid>
                        </div>
                    </div>
                );
            }
        } else {
            if (this.state.hasAnswered) {
                return (
                    <div className="phase-container">
                        <div className="quiz-top-section">
                        </div>
                        <div className='quiz-middle-section'>
                            <Typography variant="h4">
                                You answered: {this.state.selectedAnswer}
                            </Typography>
                        </div>
                        <div className="quiz-bottom-section">
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="phase-container">
                        <div className="quiz-complete-section">
                            <Grid container spacing={8} className="full-height">
                                {answers.map((answer, index) =>
                                    <Grid key={index} item xs={6}>
                                        <AnswerOption answer={answer} index={index} answerQuestion={this.answerQuestion} />
                                    </Grid>)}
                            </Grid>
                        </div>
                    </div>
                );
            }
        }
    }
}
export default PhaseAnswer;