import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';

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
        if (playerData.hasAnswered) {

            return (
                <div className="phase-container">
                    <div className="quiz-top-section">
                        {playerData.currentQuestionScore > 0 && <Typography variant="h3">Correct answer!</Typography>}
                        {playerData.currentQuestionScore === 0 && <Typography variant="h3">Wrong answer!</Typography>}

                    </div>
                    <div className='quiz-middle-section'>
                        <Typography>Score:{playerData.totalScore}</Typography>
                        <Typography>Time:{playerData.answerTime/1000} seconds</Typography>
                        {playerData.oldLeaderboardPosition !== playerData.newLeaderboardPosition &&
                            <div>
                                <Typography>Old position:{playerData.oldLeaderboardPosition}</Typography>
                                <Typography>New position:{playerData.newLeaderboardPosition}</Typography>
                            </div>
                        }
                        {playerData.oldLeaderboardPosition === playerData.newLeaderboardPosition &&
                            <Typography>Position:{playerData.newLeaderboardPosition}</Typography>
                        }

                    </div>
                    <div className="quiz-bottom-section">
                        <Typography>Look at the screen to se overall player results</Typography>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="phase-container">
                    <div className="quiz-top-section">
                        <Typography variant="h3">You did not answer the question</Typography>

                    </div>
                    <div className='quiz-middle-section'>
                        <Typography>Score:{playerData.totalScore}</Typography>
                        <Typography>Position:{playerData.newLeaderboardPosition}</Typography>
                    </div>
                    <div className="quiz-bottom-section">

                    </div>
                </div>
            );
        }
    }
}

export default PhaseResultQuestion;