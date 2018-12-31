import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TablePagination from '@material-ui/core/TablePagination';

const styles = theme => ({
  root: {
    width: '100%',
  },
  table: {
    maxWidth: 700,
    whiteSpace: 'nowrap',
  },
});

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leaderboardData: this.getLeaderboardData(),
      page: 0,
      rowsPerPage: 10,
    };
    this.startScoreCounter = this.startScoreCounter.bind(this);
    this.getScoreCellWidth = this.getScoreCellWidth.bind(this);
  }

  componentDidMount() {
    setTimeout(this.startScoreCounter, 2000);
  }

  startScoreCounter() {
    const that = this;
    const i = setInterval(() => {
      const newLeaderBoard = that.state.leaderboardData;
      let done = true;
      for (let i = 0; i < newLeaderBoard.players.length; i++) {
        const player = newLeaderBoard.players[i];
        if (player.currentQuestionScore > 0) {
          done = false;
          player.currentQuestionScore--;
          player.totalScore++;
        }
      }
      newLeaderBoard.players.sort((a, b) => ((b.totalScore < a.totalScore) ? -1 : (b.totalScore > a.totalScore) ? 1 : 0));
      that.setState({ leaderboard: newLeaderBoard });
      if (done) {
        clearInterval(i);
      }
    }, 10);
  }

  getLeaderboardData() {
    const leaderboard = {
      players: [],
    };
    const playerKeys = this.props.game.players ? Object.keys(this.props.game.players) : [];

    const currentQuestion = this.props.game.quiz.questions[this.props.game.quiz.currentQuestion];
    const playerList = [];
    for (let i = 0; i < playerKeys.length; i++) {
      const playerScoreData = {};
      const player = this.props.game.players[playerKeys[i]];
      let score = 0;
      if (player.answers) {
        for (let j = 0; j < this.props.game.quiz.questions.length; j++) {
          const question = this.props.game.quiz.questions[j];
          const answer = player.answers[question.id];
          if (answer) {
            if (answer.questionId === currentQuestion.id) {
              playerScoreData.currentQuestionScore = answer.score;
              playerScoreData.lastScore = answer.score;
            } else {
              score += answer.score;
            }
          }
        }
      }
      playerScoreData.totalScore = score;
      playerScoreData.name = player.name;
      playerScoreData.key = player.key;
      playerList.push(playerScoreData);
    }

    playerList.sort((a, b) => ((b.totalScore < a.totalScore) ? -1 : (b.totalScore > a.totalScore) ? 1 : 0));
    leaderboard.players = playerList;
    return leaderboard;
  }

  getLeaderboardScore(player) {
    if (player.currentQuestionScore === 0) {
      return `${player.totalScore} (+${player.lastScore})`;
    }
    return `${player.totalScore}           `;
    // return player.totalScore + " (+" + player.currentQuestionScore + ")";
  }

  getScoreCellWidth() {
    let length = 0;
    const leaderboardData = this.getLeaderboardData();
    for (let i = 0; i < leaderboardData.players.length; i++) {
      const player = leaderboardData.players[i];
      const scoreWidth = `${player.totalScore} (+${player.lastScore})`;
      if (scoreWidth.length > length) {
        length = scoreWidth.length;
      }
    }


    return (length * 6) + 65;
  }

    handleChangePage = (event, page) => {
      this.setState({ page });
    };

    handleChangeRowsPerPage = (event) => {
      this.setState({ rowsPerPage: event.target.value });
    };

    render() {
      const { classes } = this.props;
      const { leaderboardData, rowsPerPage, page } = this.state;
      return (
        <div className={classes.root}>
          <Table className={classes.table}>
            <TableBody>
              {leaderboardData.players.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((player, index) => (
                <TableRow key={player.key}>
                  <TableCell padding="dense">{index + 1}</TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell style={{ width: this.getScoreCellWidth() }}>{this.getLeaderboardScore(player)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {leaderboardData.players.length > 10 && (
          <TablePagination
            component="div"
            count={leaderboardData.players.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
          )}
        </div>
      );
    }
}

export default withStyles(styles)(Leaderboard);
