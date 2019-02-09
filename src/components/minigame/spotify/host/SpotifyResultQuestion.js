import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AnswerChart from '../AnswerChart';
import Leaderboard from '../Leaderboard';
import CorrectAnswer from '../CorrectAnswer';
import {
  SPOTIFY_GREEN,
} from '../SpotifyConstants';

const styles = theme => ({
  pin: {
    position: 'absolute',
    right: 0,
    marginRight: 15,
    fontSize: 16,

  },
  actions: {
    position: 'absolute',
    bottom: 15,
    left: '50%',
    marginLeft: '-426px',
  },
  itemtext: {
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#282828',
    padding: 10,
    marginBottom: 10,
  },
  itemtextDense: {
    paddingLeft: 2,
    paddingRight: 2,
    overflow: 'hidden',
  },
  listitem: {
    paddingLeft: 12,
    paddingRight: 38,
  },
  container: {
    height: '100vh',
    width: '100vw',
  },
});
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
    this.getCorrectPlayers = this.getCorrectPlayers.bind(this);
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
      if (currentPlayerCurrentAnswer && currentPlayerCurrentAnswer.answer) {
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
        avatar: p.avatar,
        currentqScore: Math.max(0, currentScore),
        totalScore: p.score,
      };
      return data;
    });
    return leaderboardData;
  }

  getCorrectPlayers(keys) {
    const { game } = this.props;
    const players = [];
    keys.forEach((key) => {
      const player = game.players[key];
      players.push({
        name: player.name,
        avatar: player.avatar,
        key: player.key,
      });
    });
    return players;
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
    const { game, gameFunc, classes } = this.props;
    const isAnswersCollected = this.answersCollected();
    const isLastQuestion = game.minigame.currentq === game.minigame.questions;
    if (isAnswersCollected) {
      const correctAnswer = this.getCorrectAnswer();
      const leaderboardData = this.getLeaderboardData(correctAnswer);
      const correctPlayers = this.getCorrectPlayers(correctAnswer);
      return (
        <div className="phase-container">
          <div className="quiz-top-section">
            <Typography className={classes.pin}>{`Game PIN:${game.gameId} `}</Typography>
            <CorrectAnswer answer={correctPlayers} />
          </div>
          <div className="quiz-middle-section">
            <Grid container>
              <Grid item md={6} xs={12}>
                <div>
                  <AnswerChart game={game} />
                </div>
              </Grid>
              <Grid item md={6} xs={12}>
                <div>
                  <Leaderboard leaderboardData={leaderboardData} />
                </div>
              </Grid>
            </Grid>

          </div>
          <div className="quiz-bottom-section">
            <div className={classes.actions}>
              {isLastQuestion && <Button onClick={this.finalizeQuiz} color="primary">Finalize result</Button>}
              {!isLastQuestion && <Button onClick={this.nextQuestion} color="primary">Next question</Button>}
              <Button onClick={gameFunc.restart} color="secondary">Restart quiz</Button>
              <Button onClick={gameFunc.quit} color="secondary">Quit quiz</Button>
              <Button onClick={gameFunc.end} color="secondary">End quiz</Button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="phase-container">
        <div className="quiz-top-section">
          <Typography className={classes.pin}>{`Game PIN:${game.gameId} `}</Typography>
        </div>
        <div className="quiz-middle-section" />
        <div className="quiz-bottom-section">
          <div>
            {isLastQuestion && <Button onClick={this.finalizeQuiz} color="primary">Finalize result</Button>}
            {!isLastQuestion && <Button onClick={this.nextQuestion} color="primary">Next question</Button>}
            <Button onClick={gameFunc.restart} color="secondary">Restart quiz</Button>
            <Button onClick={gameFunc.quit} color="secondary">Quit quiz</Button>
            <Button onClick={gameFunc.end} color="secondary">End quiz</Button>
          </div>
        </div>
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
  classes: PropTypes.any,

};
export default withStyles(styles)(SpotifyResultQuestion);
