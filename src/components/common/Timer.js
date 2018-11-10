import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
const styles = theme => ({
    text: {
        marginBottom: '-200px',
        fontSize: '86px',
        paddingTop: '160px',
    },
    circle: {
        color: '#6JpDK4',

    }
});
class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const { classes } = this.props;
        //let currentCount = this.props.startValue - this.props.value;
        let currentCount = this.props.value === null ? this.props.startValue : this.props.value;
        let startValue = this.props.startValue;
        if (startValue < 1) {
            startValue = 1;
        }
        if (currentCount < 0) {
            currentCount = 0;
        }
        let completed = currentCount / startValue;


        return (
            <div className={classes.container}>
                <Typography variant="caption" className={classes.text}>{this.props.text}</Typography>
                <CircularProgress className={classes.circle}
                    classes={{
                        colorSecondary: classes.circle,
                    }}
                    variant="static"
                    value={completed * 100}
                    thickness={4}
                    size={300}
                />
            </div>
        );
    }
}
export default withStyles(styles)(Timer);