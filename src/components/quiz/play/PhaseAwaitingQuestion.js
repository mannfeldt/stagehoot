import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

class PhaseAwaitingQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <div className="phase-container">
                <div className="quiz-top-section">
                </div>
                <div className='quiz-middle-section'>
                    <Typography variant="h3">Look at the screen.</Typography>

                </div>
                <div className="quiz-bottom-section">
                </div>
            </div>
        );
    }
}

export default PhaseAwaitingQuestion;