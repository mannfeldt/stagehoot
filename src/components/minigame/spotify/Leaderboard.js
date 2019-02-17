import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import ArrowUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDownIcon from '@material-ui/icons/ArrowDropDown';
import RemoveIcon from '@material-ui/icons/Remove';
import { Typography } from '@material-ui/core';
import {
  SPOTIFY_GREEN,
} from './SpotifyConstants';

const styles = theme => ({
  root: {
    width: '100%',
  },
  table: {
    maxWidth: 700,
    whiteSpace: 'nowrap',
    margin: '0 auto',
  },
  player: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  playerText: {
    marginLeft: 15,
  },
  faded: {
    opacity: 0.7,
  },
});

function getLeaderboardScore(data) {
  if (data.currentqScore === 0) {
    return `${data.totalScore}`;
  }
  return `${data.totalScore} (+${data.currentqScore})`;
}

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leaderboard: props.leaderboardData,
      page: 0,
      rowsPerPage: 10,
    };
    this.startScoreCounter = this.startScoreCounter.bind(this);
    this.getScoreCellWidth = this.getScoreCellWidth.bind(this);
  }

  componentDidMount() {
    const { leaderboard } = this.state;
    for (let i = 0; i < leaderboard.length; i++) {
      const player = leaderboard[i];
      player.totalScore += player.currentqScore;
    }
    leaderboard.sort((a, b) => b.totalScore - a.totalScore);
    for (let i = 0; i < leaderboard.length; i++) {
      const player = leaderboard[i];
      const oldPlayerIndex = [...leaderboard].sort((a, b) => (b.totalScore - b.currentqScore) - (a.totalScore - a.currentqScore)).findIndex(x => x.key === player.key);
      const newIndex = leaderboard.findIndex(x => x.key === player.key);
      player.posChange = oldPlayerIndex - newIndex;
    }
    this.setState({ leaderboard });
    // setTimeout(this.startScoreCounter, 2000);
  }

  getScoreCellWidth() {
    const { leaderboard } = this.state;
    let slength = 0;
    for (let i = 0; i < leaderboard.length; i++) {
      const data = leaderboard[i];
      const scoreWidth = getLeaderboardScore(data);
      if (scoreWidth.length > slength) {
        slength = scoreWidth.length;
      }
    }
    return (slength * 6) + 65;
  }

    handleChangePage = (event, page) => {
      this.setState({ page });
    };

    handleChangeRowsPerPage = (event) => {
      this.setState({ rowsPerPage: event.target.value });
    };

    startScoreCounter() {
      const that = this;
      const interval = setInterval(() => {
        let done = true;
        const newLeaderBoard = that.state.leaderboard;
        for (let i = 0; i < newLeaderBoard.length; i++) {
          const player = newLeaderBoard[i];
          if (!player.addedScore) player.addedScore = 0;
          if (player.currentqScore > 0) {
            done = false;
            player.currentqScore -= 1;
            player.addedScore += 1;
            player.totalScore += 1;
          }
        }
        newLeaderBoard.sort((a, b) => b.totalScore - a.totalScore);
        for (let i = 0; i < newLeaderBoard.length; i++) {
          const player = newLeaderBoard[i];
          const oldPlayerIndex = [...newLeaderBoard].sort((a, b) => (b.totalScore - b.addedScore) - (a.totalScore - a.addedScore)).findIndex(x => x.key === player.key);
          const newIndex = newLeaderBoard.findIndex(x => x.key === player.key);
          player.posChange = oldPlayerIndex - newIndex;
        }
        that.setState({ leaderboard: newLeaderBoard });
        if (done) {
          clearInterval(interval);
        }
      }, 10);
    }

    render() {
      const { classes } = this.props;
      const { leaderboard, rowsPerPage, page } = this.state;
      return (
        <div className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell padding="dense">#</TableCell>
                <TableCell padding="dense" />
                <TableCell align="right">Namn</TableCell>
                <TableCell align="right">Poäng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboard.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => (
                <TableRow key={data.key}>
                  <TableCell padding="dense" className={classes.faded} style={{ width: 40 }}>{index + 1}</TableCell>
                  <TableCell padding="dense" style={{ width: 80 }}>
                    {!data.posChange && <RemoveIcon style={{ opacity: 0.7 }} />}
                    {data.posChange > 0 && <ArrowUpIcon style={{ color: SPOTIFY_GREEN }} />}
                    {data.posChange < 0 && <ArrowDownIcon style={{ color: 'red' }} />}
                  </TableCell>
                  <TableCell>
                    <div className={classes.player}>
                      {data.avatar ? (
                        <Avatar
                          alt={data.name}
                          src={data.avatar}
                        />
                      ) : <Avatar><PersonIcon /></Avatar>}
                      <div className={classes.playerText}>
                        <Typography>{data.name}</Typography>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="right" className={classes.faded} style={{ width: 100 }}>{data.totalScore}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {leaderboard.length > 10 && (
          <TablePagination
            component="div"
            count={leaderboard.length}
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
Leaderboard.propTypes = {
  leaderboardData: PropTypes.array,
  classes: PropTypes.any,
};
export default withStyles(styles)(Leaderboard);
