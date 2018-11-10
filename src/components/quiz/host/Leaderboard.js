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

    }
    componentDidMount() {
        setTimeout(this.startScoreCounter, 2000);


    }
    startScoreCounter() {
        let that = this;
        let i = setInterval(function () {
            let newLeaderBoard = that.state.leaderboardData;
            let done = true;
            for (let i = 0; i < newLeaderBoard.players.length; i++) {
                let player = newLeaderBoard.players[i];
                if (player.currentQuestionScore > 0) {
                    done = false;
                    player.currentQuestionScore--;
                    player.totalScore++;
                }
            }
            newLeaderBoard.players.sort(function (a, b) {
                return (b.totalScore < a.totalScore) ? -1 : (b.totalScore > a.totalScore) ? 1 : 0;
            });
            that.setState({ leaderboard: newLeaderBoard });
            if (done) {
                clearInterval(i);
            }
        }, 10);
    }

    getLeaderboardData() {
        let leaderboard = {
            players: [],
        };
        let playerKeys = this.props.game.players ? Object.keys(this.props.game.players) : [];

        let currentQuestion = this.props.game.quiz.questions[this.props.game.quiz.currentQuestion];
        let playerList = [];
        for (let i = 0; i < playerKeys.length; i++) {
            let playerScoreData = {};
            let player = this.props.game.players[playerKeys[i]];
            let score = 0;
            if (player.answers) {
                for (let j = 0; j < Object.keys(player.answers).length; j++) {
                    let question = this.props.game.quiz.questions[j];
                    let answer = player.answers[question.id];
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

        playerList.sort(function (a, b) {
            return (b.totalScore < a.totalScore) ? -1 : (b.totalScore > a.totalScore) ? 1 : 0;
        });
        leaderboard.players = playerList;
        leaderboard.currentQuestionId = currentQuestion.id;
        return leaderboard;

    }
    getLeaderboardScore(player) {
        if (player.currentQuestionScore === 0) {
            return player.totalScore + " (+" + player.lastScore + ")";
        } else {
            return player.totalScore + "           ";
            //return player.totalScore + " (+" + player.currentQuestionScore + ")";
        }
    }
    handleChangePage = (event, page) => {
        this.setState({ page });
    };
    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };
    render() {
        const { classes } = this.props;
        const { leaderboardData, rowsPerPage, page } = this.state;
        return (
            <div className={classes.root}>
                <Table className={classes.table}>
                    <TableBody>
                        {leaderboardData.players.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((player, index) =>
                            <TableRow key={player.key}>
                                <TableCell padding="dense" numeric>{index + 1}</TableCell>
                                <TableCell>{player.name}</TableCell>
                                <TableCell>{this.getLeaderboardScore(player)}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {leaderboardData.players.length > 10 && <TablePagination
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

                />}
            </div>
        );

    }
}

export default withStyles(styles)(Leaderboard);
