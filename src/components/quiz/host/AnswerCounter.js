import React, { Component } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const styles = theme => ({
    bar: {
        color: '#32386D'
    }
});
class AnswerCounter extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Typography variant="h5">Answers collected</Typography>
                <LinearProgress className={classes.bar} variant="determinate" value={this.props.value} />
            </div>
        );
    }
}

export default withStyles(styles)(AnswerCounter);