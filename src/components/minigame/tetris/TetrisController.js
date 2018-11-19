import React, { Component } from 'react';

class TetrisController extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <div className="phase-container">
                TetrisController.js

                här  ska jag visa knappar för moves. och en metod här som tar knapptrycket och updaterar en specifik property i firebase baserat på gameid, playerkey etc.
                måste ha med snakeId in i dnena kommmponent?
            </div>
        );
    }
}

export default TetrisController;