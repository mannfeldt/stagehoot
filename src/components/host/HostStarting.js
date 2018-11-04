import React, { Component } from 'react';
import { fire } from '../../base';

class HostStarting extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    //på componentDidMount så starta en timer eller liknande. koppla timern till något visuellt. typ en materialUI progressbar. 0-100 som visas.
    //när timern är klar så updateras phase till nästa

    render() {
        return (
            <div className="phase-container">
                HostStarting
            </div>
        );
    }
}

export default HostStarting;