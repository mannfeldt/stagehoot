import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

class HostAwaitingQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: 0,
            started: false
        }
        this.nextPhase = this.nextPhase.bind(this);
    }
    componentDidMount() {
        let that = this;
        let counter = 6;
        that.setState({ counter: 5, started: true });

        let i = setInterval(function () {
            counter--;
            that.setState({ counter: counter, started: true });
            if (counter === 0) {
                that.nextPhase();
                clearInterval(i);
            }
        }, 1000);
    }

    nextPhase() {
        this.props.updateGame({ phase: "show_question" });
    }
    //på componentDidMount så starta en timer eller liknande. koppla timern till något visuellt. typ en materialUI progressbar. 0-100 som visas.
    //när timern är klar så updateras phase till nästa

    render() {
        return (
            <div className="phase-container">
                <Typography variant="h2">{this.state.counter}
                </Typography>
                HostAwaitingQuestion. 
            </div>
        );
    }
}

export default HostAwaitingQuestion;