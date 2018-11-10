import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import CountdownAnimation from '../../common/CountdownAnimation';

class PhaseStarting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: this.startCounter(),
        }
        this.nextPhase = this.nextPhase.bind(this);
    }
    startCounter() {
        let that = this;
        let counter = 5;

        let i = setInterval(function () {
            counter--;
            that.setState({ counter: counter });
            if (counter === 0) {
                that.nextPhase();
                clearInterval(i);
            }
        }, 1000);
        return 5;
    }

    nextPhase() {
        this.props.gameFunc.update({ phase: "awaiting_question" });
    }
    //på componentDidMount så starta en timer eller liknande. koppla timern till något visuellt. typ en materialUI progressbar. 0-100 som visas.
    //när timern är klar så updateras phase till nästa

    render() {
        return (
            <div className="phase-container">
                <Typography variant="h2">Starting quiz</Typography>
                <CountdownAnimation speed="slow" />

            </div>
        );
    }
}

export default PhaseStarting;