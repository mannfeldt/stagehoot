import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TablePagination from '@material-ui/core/TablePagination';
import PropTypes from 'prop-types';

const styles = theme => ({
  root: {
    width: '100%',
  },
  table: {
    maxWidth: 700,
    whiteSpace: 'nowrap',
  },
});

function getLeaderboardScore(data) {
  if (data.currentqScore === 0) {
    return data.totalScore;
  }
  return `${data.totalScore} (+${data.currentqScore})`;
}

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leaderboardData: props.leaderboardData,
      page: 0,
      rowsPerPage: 10,
    };
    this.startScoreCounter = this.startScoreCounter.bind(this);
    this.getScoreCellWidth = this.getScoreCellWidth.bind(this);
  }

  componentDidMount() {
    setTimeout(this.startScoreCounter, 2000);
  }


  getScoreCellWidth() {
    const { leaderboardData } = this.state;
    let slength = 0;
    for (let i = 0; i < leaderboardData.length; i++) {
      const data = leaderboardData[i];
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
        const newLeaderBoard = that.state.leaderboardData;
        for (let i = 0; i < newLeaderBoard.length; i++) {
          const player = newLeaderBoard[i];
          if (player.currentqScore > 0) {
            done = false;
            player.currentqScore -= 1;
            player.totalScore += 1;
          }
        }
        newLeaderBoard.sort((a, b) => b.totalScore - a.totalScore);
        that.setState({ leaderboard: newLeaderBoard });
        if (done) {
          clearInterval(interval);
        }
      }, 10);
    }

    render() {
      const { classes } = this.props;
      const { leaderboardData, rowsPerPage, page } = this.state;
      return (
        <div className={classes.root}>
          <Table className={classes.table}>
            <TableBody>
              {leaderboardData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => (
                <TableRow key={data.key}>
                  <TableCell padding="dense">{index + 1}</TableCell>
                  <TableCell>{data.name}</TableCell>
                  <TableCell style={{ width: this.getScoreCellWidth() }}>{getLeaderboardScore(data)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {leaderboardData.length > 10 && (
          <TablePagination
            component="div"
            count={leaderboardData.length}
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
};
export default withStyles(styles)(Leaderboard);
