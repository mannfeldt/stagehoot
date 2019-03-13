/* eslint no-case-declarations: 0 */
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import AnswerChart from '../AnswerChart';
import Leaderboard from '../Leaderboard';
import PlayerList from '../PlayerList';
import { SPOTIFY_GREEN, SONG_VOLUME_FADE_TIME } from '../SpotifyConstants';

function getWinners(leaderboardData) {
  const topScorer = leaderboardData.reduce((a, b) => (a.totalScore + a.currentqScore > b.totalScore + b.currentqScore ? a : b));
  const topScore = topScorer.totalScore + topScorer.currentqScore;
  return leaderboardData
    .filter(d => d.totalScore + d.currentqScore === topScore)
    .map(x => x.key);
}

const styles = theme => ({
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
    fontSize: 28,
    padding: 15,
    fontWeight: 400,
  },
  subheader: {
    fontSize: 24,
    padding: 15,
    opacity: 0.7,
    fontWeight: 400,
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
  headcontainer: {
    padding: 15,
  },
});
class SpotifyResultQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'correct',
    };
    this.nextQuestion = this.nextQuestion.bind(this);
    this.finalizeQuiz = this.finalizeQuiz.bind(this);
    this.getCorrectAnswer = this.getCorrectAnswer.bind(this);
    this.getLeaderboardData = this.getLeaderboardData.bind(this);
    this.answersCollected = this.answersCollected.bind(this);
    this.getPlayers = this.getPlayers.bind(this);
    this.toggleView = this.toggleView.bind(this);
  }

  componentDidMount() {
    const { game } = this.props;
    if (game.minigame.autoplay) {
      const answer = this.getCorrectAnswer() || [];
      setTimeout(this.toggleView, Math.min(6000, 2000 + answer.length * 500));
    }
  }

  // returnera en array med playerkeys för de som är rätt
  getCorrectAnswer() {
    const {
      game, tracks, question, playlists,
    } = this.props;
    if (!question) {
      return null;
    }
    switch (question.qtype) {
      case 'track_owner':
        return tracks
          .filter(t => t.id === question.track.id)
          .map(tr => tr.playerKey);
      case 'popularity':
      case 'danceability':
      case 'energy':
      case 'valence':
      case 'tempo':
      case 'totalTracks':
        if (question.subtype === 'max') {
          const maxSize = playlists.reduce((a, b) => (a[question.qtype] > b[question.qtype] ? a : b))[question.qtype];
          const answer = playlists
            .filter(p => p[question.qtype] === maxSize)
            .map(p => p.playerKey);
          return answer;
        }
        if (question.subtype === 'min') {
          const minSize = playlists.reduce((a, b) => (a[question.qtype] < b[question.qtype] ? a : b))[question.qtype];
          const answer = playlists
            .filter(p => p[question.qtype] === minSize)
            .map(p => p.playerKey);
          return answer;
        }
        return null;
      case 'artist':
        const maxArtist = playlists.reduce(
          (a, b) => (b.artists[question.artist] > a ? b.artists[question.artist] : a),
          0,
        );
        const answer = playlists
          .filter(p => p.artists[question.artist] === maxArtist)
          .map(p => p.playerKey);
        return answer;
      case 'genre':
        const maxGenre = playlists.reduce(
          (a, b) => (b.genres[question.genre] > a ? b.genres[question.genre] : a),
          0,
        );
        const answerg = playlists
          .filter(p => p.genres[question.genre] === maxGenre)
          .map(p => p.playerKey);
        return answerg;
      default:
        return null;
    }
  }

  getLeaderboardData(correctAnswer) {
    const { game } = this.props;
    const players = Object.values(game.players);
    if (!game.answers) return [];
    const answers = Object.values(game.answers);
    const leaderboardData = players.map((p) => {
      // behövs den första listan?
      // const currentPlayerAnswers = answers.filter(a => a.playerKey === p.key);
      let currentScore = 0;
      const currentPlayerCurrentAnswer = answers.find(
        a => a.playerKey === p.key && a.question === game.minigame.currentq,
      );
      if (currentPlayerCurrentAnswer && currentPlayerCurrentAnswer.answer) {
        currentPlayerCurrentAnswer.answer = currentPlayerCurrentAnswer.answer.filter(
          x => x !== 'default',
        );
        currentScore = currentPlayerCurrentAnswer.answer.reduce((acc, cur) => {
          if (correctAnswer && correctAnswer.includes(cur)) {
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

  getPlayers(keys) {
    const { game } = this.props;
    const players = [];
    if (!keys) return players;
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

  toggleView() {
    const { view } = this.state;
    const { game } = this.props;
    const isLastQuestion = game.minigame.currentq + 1 >= game.minigame.questions;

    if (view === 'correct') {
      if (game.minigame.autoplay) {
        setTimeout(
          this.toggleView,
          Math.min(10000, 3000 + Object.values(game.players).length * 500),
        );
      }
      this.setState(() => ({
        view: 'answer',
      }));
    } else if (view === 'answer') {
      if (game.minigame.autoplay) {
        if (!isLastQuestion) {
          setTimeout(
            this.nextQuestion,
            Math.min(10000, 2000 + Object.values(game.players).length * 500),
          );
        } else {
          setTimeout(
            this.finalizeQuiz,
            Math.min(10000, 3000 + Object.values(game.players).length * 500),
          );
        }
      }
      this.setState(() => ({
        view: 'leaderboard',
      }));
    }
  }

  finalizeQuiz() {
    const { gameFunc, game } = this.props;
    // gameFunc.update({ phase: 'final_result' });
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

  playWinningSong(winners) {
    const { tracks } = this.props;
    const randomWinner = winners[Math.floor(Math.random() * winners.length)];
    const celebrationTrack = tracks
      .filter(x => x.playerKey === randomWinner.key && x.audio)
      .sort(() => Math.random() - 0.5)[0];
    const audio = new Audio(celebrationTrack.audio);
    audio.volume = 0.1;
    audio.play();
    audio.onended = () => {
      // this.nextPhase();
    };
    audio.canplay = () => {
      // this.setState(() => ({
      //   songDuration: audio.duration,
      // }));
    };
    // fade in and out
    audio.ontimeupdate = () => {
      const left = audio.duration - audio.currentTime;
      const fadeout = left <= SONG_VOLUME_FADE_TIME;
      if (fadeout) {
        audio.volume = left / SONG_VOLUME_FADE_TIME;
      } else if (audio.volume < 1) {
        audio.volume = Math.min(1, audio.volume + 0.2);
      }
    };
  }

  answersCollected() {
    const { game } = this.props;
    if (!game.answers) return false;
    const answers = Object.values(game.answers);
    const answersCollected = answers.filter(
      a => a.question === game.minigame.currentq,
    );
    return answersCollected.length === Object.keys(game.players).length;
  }

  render() {
    const { game, gameFunc, classes } = this.props;
    const { view } = this.state;
    const isLastQuestion = game.minigame.currentq + 1 >= game.minigame.questions;
    const correctAnswer = this.getCorrectAnswer();
    const leaderboardData = this.getLeaderboardData(correctAnswer);
    const correctPlayers = this.getPlayers(correctAnswer);

    if (view === 'leaderboard') {
      let winners;
      if (isLastQuestion) {
        const winnerKeys = getWinners(leaderboardData);
        winners = this.getPlayers(winnerKeys);
        this.playWinningSong(winners);
      }
      return (
        <div className="phase-container">
          <div className="quiz-top-section">
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
              className={classes.headcontainer}
            >
              <Grid item>
                <Typography className={classes.subheader}>{`Fråga ${game.minigame.currentq + 1} av ${game.minigame.questions}  `}</Typography>
              </Grid>
              <Grid item>
                {isLastQuestion ? (
                  <Typography className={classes.header}>Winner</Typography>
                ) : (
                  <Typography className={classes.header}>Leaderboard</Typography>
                )
              }
              </Grid>
              <Grid item>
                <Typography className={classes.subheader}>{`${game.gameId}`}</Typography>
              </Grid>
            </Grid>
            <Divider />
            {isLastQuestion && <PlayerList players={winners} />}
          </div>
          <div className="quiz-middle-section">
            <div>
              <Leaderboard leaderboardData={leaderboardData} />
            </div>
          </div>
          <div className="quiz-bottom-section">
            {!game.minigame.autoplay
              && (
              <div className={classes.actions}>
                {isLastQuestion && <Button onClick={this.finalizeQuiz} color="primary">Finalize result</Button>}
                {!isLastQuestion && <Button onClick={this.nextQuestion} color="primary">Next question</Button>}
                <Button onClick={gameFunc.restart} color="secondary">Restart quiz</Button>
                <Button onClick={gameFunc.quit} color="secondary">Quit quiz</Button>
                <Button onClick={gameFunc.end} color="secondary">End quiz</Button>
              </div>
              )
            }
          </div>
        </div>
      );
    }
    if (view === 'answer') {
      return (
        <div className="phase-container">
          <div className="quiz-top-section">
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
              className={classes.headcontainer}
            >
              <Grid item>
                <Typography className={classes.subheader}>{`Fråga ${game.minigame.currentq + 1} av ${game.minigame.questions}  `}</Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.header}>Svarsfördelning</Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.subheader}>{`${game.gameId}`}</Typography>
              </Grid>
            </Grid>
            <Divider />
          </div>
          <div className="quiz-middle-section">
            <div>
              <AnswerChart game={game} correctAnswer={correctAnswer || []} />
            </div>
          </div>
          <div className="quiz-bottom-section">
            {!game.minigame.autoplay
              && (
                <div className={classes.actions}>
                  <Button onClick={this.toggleView} color="primary">Next</Button>
                </div>
              )}
          </div>
        </div>
      );
    }
    return (
      <div className="phase-container">
        <div className="quiz-top-section">
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            className={classes.headcontainer}
          >
            <Grid item>
              <Typography className={classes.subheader}>{`Fråga ${game.minigame.currentq + 1} av ${game.minigame.questions}  `}</Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.header}>Rätt svar</Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.subheader}>{`${game.gameId}`}</Typography>
            </Grid>
          </Grid>
          <Divider />
        </div>
        <div className="quiz-middle-section">
          <div>
            <PlayerList players={correctPlayers} />
          </div>
        </div>
        <div className="quiz-bottom-section">
          {!game.minigame.autoplay
            && (
              <div className={classes.actions}>
                <Button onClick={this.toggleView} color="primary">Next</Button>
              </div>
            )}
        </div>
      </div>
    );
  }
}
SpotifyResultQuestion.propTypes = {
  gameFunc: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired,
  playlists: PropTypes.array.isRequired,
  nextQuestion: PropTypes.func.isRequired,
  question: PropTypes.object,
  tracks: PropTypes.array.isRequired,
  classes: PropTypes.any,
};
export default withStyles(styles)(SpotifyResultQuestion);
