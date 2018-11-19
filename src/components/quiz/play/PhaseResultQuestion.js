import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import AnswerOption from '../AnswerOption';
import { Typography } from '@material-ui/core';
import AnswerChart from '../AnswerChart';
import Leaderboard from '../Leaderboard';

class PhaseResultQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.getPlayerAnswerData = this.getPlayerAnswerData.bind(this);
    }
    getPlayerAnswerData() {
        let answerData = {
            totalScore: 0,
            currentQuestionScore: 0,
            newLeaderboardPosition: 1,
            oldLeaderboardPosition: 1,
            answerTime: 0,
            hasAnswered: false,
        };
        let currentQuestion = this.props.game.quiz.questions[this.props.game.quiz.currentQuestion];
        let currentPlayer = this.props.game.players[this.props.playerKey];
        for (let j = 0; j < Object.keys(currentPlayer.answers).length; j++) {
            let question = this.props.game.quiz.questions[j];
            let answer = currentPlayer.answers[question.id];
            if (answer) {
                if (answer.questionId === currentQuestion.id) {
                    answerData.hasAnswered = true;
                    answerData.currentQuestionScore = answer.score;
                    answerData.answerTime = answer.answerTime;
                }
                answerData.totalScore += answer.score;
            }
        }

        let playerKeys = this.props.game.players ? Object.keys(this.props.game.players) : [];
        for (let i = 0; i < playerKeys.length; i++) {
            if (playerKeys[i] === currentPlayer.key) {
                continue;
            }
            let player = this.props.game.players[playerKeys[i]];
            let totalScore = 0;
            let currentQuestionScore = 0;
            for (let j = 0; j < Object.keys(player.answers).length; j++) {
                let question = this.props.game.quiz.questions[j];
                let answer = player.answers[question.id];
                if (answer) {
                    if (answer.questionId === currentQuestion.id) {
                        currentQuestionScore = answer.score;
                    }
                    totalScore += answer.score;
                }
            }
            if (totalScore > answerData.totalScore) {
                answerData.newLeaderboardPosition++;
            }
            if (totalScore - currentQuestionScore > answerData.totalScore - answerData.currentQuestionScore) {
                answerData.oldLeaderboardPosition++;
            }
        }

        return answerData;
    }
    render() {
        let playerData = this.getPlayerAnswerData();
        let wrongAnswer = playerData.hasAnswered && playerData.currentQuestionScore === 0;
        let correctAnswer = playerData.currentQuestionScore > 0;
        let noAnswer = !playerData.hasAnswered;


        if (this.props.game.quiz.remoteMode) {
            let answers = [];
            let currentQuestion = "";
            if (this.props.game) {
                currentQuestion = this.props.game.quiz.questions[this.props.game.quiz.currentQuestion];
                answers = currentQuestion.answers;
            }
            return (
                <div className="phase-container">
                    <div className="quiz-top-section">
                        {correctAnswer > 0 && <Typography variant="h5">Correct answer!</Typography>}
                        {wrongAnswer && <Typography variant="h5">Wrong answer!</Typography>}
                        {noAnswer && <Typography variant="h5">You did not answer the question</Typography>}
                        {!noAnswer &&
                            <div>
                                <Typography variant="body1">Score:  <span className="dynamic-text">{playerData.totalScore}</span> Time:  <span className="dynamic-text">{playerData.answerTime / 1000}</span> seconds</Typography>
                            </div>
                        }
                        {playerData.oldLeaderboardPosition !== playerData.newLeaderboardPosition &&
                            <div>
                                <Typography variant="body1">Old position:{playerData.oldLeaderboardPosition} New position:{playerData.newLeaderboardPosition}</Typography>
                            </div>
                        }
                        {playerData.oldLeaderboardPosition === playerData.newLeaderboardPosition &&
                            <Typography variant="body1">Position:{playerData.newLeaderboardPosition}</Typography>
                        }
                    </div>
                    <div className='quiz-middle-section'>
                        <Grid container>
                            <Grid item md={6} xs={12}>
                                <div className="quiz-answer-chart">

                                    <AnswerChart game={this.props.game} />
                                </div>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <div>
                                    <Leaderboard game={this.props.game} />
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                    <div className="quiz-bottom-section">
                        <Grid container>
                            {answers.map((answer, index) =>
                                <Grid key={index} item xs={6}>
                                    <AnswerOption answer={answer} index={index} />
                                </Grid>)}
                        </Grid>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="phase-container">
                    <div className="quiz-top-section">
                        {correctAnswer > 0 && <Typography paragraph variant="h5">Correct answer!</Typography>}
                        {wrongAnswer && <Typography paragraph variant="h5">Wrong answer!</Typography>}
                        {noAnswer && <Typography paragraph variant="h5">You did not answer the question</Typography>}

                    </div>
                    <div className='quiz-middle-section'>
                        {!noAnswer &&
                            <div>
                                <Typography variant="body1">Score:{playerData.totalScore}</Typography>
                                <Typography variant="body1">Time:{playerData.answerTime / 1000} seconds</Typography>
                            </div>
                        }
                        {playerData.oldLeaderboardPosition !== playerData.newLeaderboardPosition &&
                            <div>
                                <Typography variant="body1">Old position:{playerData.oldLeaderboardPosition}</Typography>
                                <Typography variant="body1">New position:{playerData.newLeaderboardPosition}</Typography>
                            </div>
                        }
                        {playerData.oldLeaderboardPosition === playerData.newLeaderboardPosition &&
                            <Typography variant="body1">Position:{playerData.newLeaderboardPosition}</Typography>
                        }

                    </div>
                    <div className="quiz-bottom-section">
                        <Typography variant="subtitle1">Look at the screen to se overall player results</Typography>
                    </div>
                </div>
            );
        }
    }
}

export default PhaseResultQuestion;