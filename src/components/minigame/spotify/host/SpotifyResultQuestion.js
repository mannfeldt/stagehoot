import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
// import AnswerOption from '../AnswerOption';
import PropTypes from 'prop-types';
import AnswerChart from '../AnswerChart';
import Leaderboard from '../Leaderboard';

class SpotifyResultQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.nextQuestion = this.nextQuestion.bind(this);
    this.finalizeQuiz = this.finalizeQuiz.bind(this);
    this.getCorrectAnswer = this.getCorrectAnswer.bind(this);
    this.getLeaderboardData = this.getLeaderboardData.bind(this);
    this.answersCollected = this.answersCollected.bind(this);
  }

  getCorrectAnswer() {
    const { game, tracks, question } = this.props;
    const correctPlayers = tracks.filter(t => t.id === question.track.id).map(tr => tr.playerKey);
    return correctPlayers;
  }

  getLeaderboardData(correctAnswer) {
    const { game } = this.props;
    const players = Object.values(game.players);
    const answers = Object.values(game.answers);
    const leaderboardData = players.map((p) => {
      // behövs den första listan?
      // const currentPlayerAnswers = answers.filter(a => a.playerKey === p.key);
      let currentScore = 0;
      const currentPlayerCurrentAnswer = answers.find(a => a.playerKey === p.key && a.question === game.minigame.currentq);
      if (currentPlayerCurrentAnswer) {
        currentScore = currentPlayerCurrentAnswer.answer.reduce((acc, cur) => {
          if (correctAnswer.includes(cur)) {
            return acc + 1;
          }
          return acc - 1;
        }, 0);
      }
      const data = {
        name: p.name,
        key: p.key,
        currentqScore: Math.max(0, currentScore),
        totalScore: p.score,
      };
      return data;
    });
    return leaderboardData;
  }

  finalizeQuiz() {
    const { gameFunc } = this.props;
    gameFunc.update({ phase: 'final_result' });
  }

  // jag måste hantera att alla svar inte finns på plats direkt när spotifyResultQuestion kör componentdidmount? lägg in en hård sleep eller så läser jag updates som kommer in där
  // jag gör alla beräkningar på score i render() och jag sparar först score till firebase på nextphase
  nextQuestion() {
    const { game, gameFunc, nextQuestion } = this.props;
    const leaderboardData = this.getLeaderboardData(this.getCorrectAnswer());
    const gameupdate = { ...game };
    gameupdate.phase = 'gameplay';
    gameupdate.minigame.currentq += 1;
    leaderboardData.forEach((data) => {
      gameupdate.players[data.key].score += data.currentqScore;
    });
    // skulle kunna spara currenquestion +1 här. och sen använda det vid play.js för att matcha svar mot fråga.
    gameFunc.update(gameupdate);
    nextQuestion();
  }

  answersCollected() {
    const { game } = this.props;
    if (!game.answers) return false;
    const answers = Object.values(game.answers);
    const answersCollected = answers.filter(a => a.question === game.minigame.currentq);
    return answersCollected.length === Object.keys(game.players).length;
  }

  render() {
    const { game, gameFunc } = this.props;
    // jag skulle kunna vänta med att köra getLeaderboarddata och kanske hela render tills alla svar är inne?
    const isAnswersCollected = this.answersCollected();
    if (isAnswersCollected) {
      const isLastQuestion = game.minigame.currentq === game.minigame.questions;
      const correctAnswer = this.getCorrectAnswer();
      const leaderboardData = this.getLeaderboardData(correctAnswer);
      return (
        <div className="phase-container">
          <div className="quiz-top-section">
            <Typography variant="h6" style={{ float: 'right' }}>{`Game PIN:${game.gameId} `}</Typography>
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
                  <Leaderboard leaderboardData={leaderboardData} />
                </div>
              </Grid>
            </Grid>
            <div>
              {isLastQuestion && <Button onClick={this.finalizeQuiz}>Finalize result</Button>}
              {!isLastQuestion && <Button onClick={this.nextQuestion}>Next question</Button>}
              <Button onClick={gameFunc.restart}>Restart quiz</Button>
              <Button onClick={gameFunc.quit}>Quit quiz</Button>
              <Button onClick={gameFunc.end}>End quiz</Button>
            </div>
          </div>
          <div className="quiz-bottom-section" />
        </div>
      );
    }
    return (
      <div className="phase-container">
        <div className="quiz-top-section">
          <Typography variant="h6" style={{ float: 'right' }}>{`Game PIN:${game.gameId} `}</Typography>
        </div>
        <div className="quiz-middle-section" />
        <div className="quiz-bottom-section" />
      </div>
    );
  }
}
SpotifyResultQuestion.propTypes = {
  gameFunc: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired,
  nextQuestion: PropTypes.func.isRequired,
  question: PropTypes.object,
  tracks: PropTypes.array.isRequired,

};
export default SpotifyResultQuestion;
