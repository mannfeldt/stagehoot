import React, { Component } from 'react';
import Podium from './Podium';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';

class PhaseFinalResult extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <div className="phase-container">
                <div className='quiz-middle-section'>
                    <Typography variant="h2">Final score</Typography>

                    <Podium game={this.props.game} />
                </div>
                <div className="align-bottom ">
                    <div>
                        <Button onClick={() => alert('new game')}>Save results</Button>
                        <Button onClick={() => alert('new game')}>Analyse results</Button>
                        <Button onClick={() => alert('new game')}>Start survey</Button>
                        <Button onClick={() => alert('new game')}>Create new game</Button>
                        <Button onClick={() => alert('new game')}>Quit game</Button>
                    </div>

                </div>
            </div>
        );
    }
}

export default PhaseFinalResult;