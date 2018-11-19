import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

class PhaseStarting extends Component {
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
                    <Typography variant="h5">Starting quiz...</Typography>
                </div>
                <div className="quiz-bottom-section">
                </div>
            </div>
        );
    }
}

export default PhaseStarting;