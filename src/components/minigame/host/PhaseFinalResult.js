import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';

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
                    podium
                </div>
                <div className="align-bottom ">
                    <div>
                        <Button onClick={this.props.gameFunc.restart}>Replay quiz</Button>
                        <Button onClick={this.props.gameFunc.quit}>Quit quiz</Button>
                        <Button onClick={() => alert('show results')}>Show results</Button>
                        <Button onClick={() => alert('start survey')}>Start survey</Button>
                        <Button>
                            <Link to={'/create'}>Host game</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default PhaseFinalResult;