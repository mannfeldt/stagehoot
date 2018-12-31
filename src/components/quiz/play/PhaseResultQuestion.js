import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import AnswerOption from '../AnswerOption';
import AnswerChart from '../AnswerChart';
import Leaderboard from '../Leaderboard';

PlayerQuestionResult.propTypes = {
  playerData: PropTypes.object.isRequired,
};
function PlayerQuestionResult(props) {
  const { playerData } = props;
  const wrongAnswer = playerData.hasAnswered && playerData.currentQuestionScore === 0;
  const correctAnswer = playerData.currentQuestionScore > 0;
  return (
    <div>
      {correctAnswer > 0 && <Typography variant="h5">Correct answer!</Typography>}
      {wrongAnswer && <Typography variant="h5">Wrong answer!</Typography>}
      {!playerData.hasAnswered && <Typography variant="h5">You did not answer the question</Typography>}
      {playerData.hasAnswered && (
      <div>
        <Typography variant="body1">
          <div>
            <span>Score: </span>
            {' '}
            <span className="dynamic-text">{playerData.currentQuestionScore}</span>
          </div>
          <div>
            <span>Time: </span>
            {' '}
            <span className="dynamic-text">{playerData.answerTime}</span>
          </div>
          <div>
            <span>Total score: </span>
            {' '}
            <span className="dynamic-text">{playerData.totalScore}</span>
          </div>
        </Typography>
      </div>
      )}
      {playerData.oldLeaderboardPosition !== playerData.newLeaderboardPosition && (
      <div>
        <Typography variant="body1">
          <span>Old position:</span>
          <span>
            {' '}
            {playerData.oldLeaderboardPosition}
          </span>
          <span>New position: </span>
          <span>{playerData.newLeaderboardPosition}</span>
        </Typography>
      </div>
      )}
      {playerData.oldLeaderboardPosition === playerData.newLeaderboardPosition && (
      <div>
        <Typography variant="body1">
          <span>Position: </span>
          <span>
            {' '}
            {playerData.newLeaderboardPosition}
          </span>
        </Typography>
      </div>
      )}
    </div>
  );
}

class PhaseResultQuestion extends Component {
  constructor(props) {
    super(props);
    this.getPlayerAnswerData = this.getPlayerAnswerData.bind(this);
  }

  getPlayerAnswerData() {
    const { game, playerKey } = this.props;
    const answerData = {
      totalScore: 0,
      currentQuestionScore: 0,
      newLeaderboardPosition: 1,
      oldLeaderboardPosition: 1,
      answerTime: 0,
      hasAnswered: false,
    };
    const currentQuestion = game.quiz.questions[game.quiz.currentQuestion];
    const currentPlayer = game.players[playerKey];
    // answers kan vara undefined. refactorera hela klassen
    // den här läsningen håller inte. kan bli fel värden som man missar att svara på en fråga.
    // gör om till reduce och se om det ska vara iteration på answers eller på quiz.questions kanske?

    for (let j = 0; j < game.quiz.questions.length; j++) {
      const question = game.quiz.questions[j];
      const answer = currentPlayer.answers ? currentPlayer.answers[question.id] : false;
      if (answer) {
        if (answer.questionId === currentQuestion.id) {
          answerData.hasAnswered = true;
          answerData.currentQuestionScore = answer.score;
          answerData.answerTime = answer.answerTime;
        }
        answerData.totalScore += answer.score;
      }
    }

    const playerKeys = game.players ? Object.keys(game.players) : [];
    for (let i = 0; i < playerKeys.length; i++) {
      if (playerKeys[i] === currentPlayer.key) {
        continue;
      }
      const opponent = game.players[playerKeys[i]];
      let totalScore = 0;
      let currentQuestionScore = 0;
      for (let j = 0; j < game.quiz.questions.length; j++) {
        const question = game.quiz.questions[j];
        const answer = opponent.answers ? opponent.answers[question.id] : false;
        if (answer) {
          if (answer.questionId === currentQuestion.id) {
            currentQuestionScore = answer.score;
          }
          totalScore += answer.score;
        }
      }
      if (totalScore > answerData.totalScore) {
        answerData.newLeaderboardPosition += 1;
      }
      if (totalScore - currentQuestionScore > answerData.totalScore - answerData.currentQuestionScore) {
        answerData.oldLeaderboardPosition += 1;
      }
    }

    return answerData;
  }

  render() {
    const { game } = this.props;
    const playerData = this.getPlayerAnswerData();

    if (game.quiz.remoteMode) {
      let currentQuestion;
      if (game) {
        currentQuestion = game.quiz.questions[game.quiz.currentQuestion];
      }
      const { answers } = currentQuestion;
      return (
        <div className="phase-container">
          <div className="quiz-top-section">
            <PlayerQuestionResult playerData={playerData} />
          </div>
          <div className="quiz-middle-section">
            <Grid container>
              <Grid item md={6} xs={12}>
                <div className="quiz-answer-chart">

                  <AnswerChart game={game} />
                </div>
              </Grid>
              <Grid item md={6} xs={12}>
                <div>
                  <Leaderboard game={game} />
                </div>
              </Grid>
            </Grid>
          </div>
          <div className="quiz-bottom-section">
            <Grid container>
              {answers.map((answer, index) => (
                <Grid key={answer} item xs={6}>
                  <AnswerOption answer={answer} index={index} />
                </Grid>
              ))}
            </Grid>
          </div>
        </div>
      );
    }
    return (
      <div className="phase-container">
        <div className="quiz-top-section" />
        <div className="quiz-middle-section">
          <PlayerQuestionResult playerData={playerData} />
        </div>
        <div className="quiz-bottom-section">
          <Typography variant="subtitle1">Look at the screen to se overall player results</Typography>
        </div>
      </div>
    );
  }
}
PhaseResultQuestion.propTypes = {
  game: PropTypes.object.isRequired,
  playerKey: PropTypes.string.isRequired,
};
export default PhaseResultQuestion;
