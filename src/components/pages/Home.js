import React, { Component } from 'react';
import { Typography, Card } from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { Link, withRouter } from 'react-router-dom';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    const timestamp = localStorage.getItem('spotifytoken_timestamp');
    const spotifyType = localStorage.getItem('spotify_type');
    if (Date.now() - timestamp < 2000 && spotifyType) {
      props.history.push(`/${spotifyType}`);
    }
  }

  render() {
    return (
      <div className="app-page home-page">
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Typography variant="h3">Welcome to stagehoot</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Link to="/play">
              <Card className="card-button">
                <CardHeader title="Play" />
                <CardContent>
                  <Typography variant="subtitle1" align="center">Connect to a game as player</Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Link to="/host">
              <Card className="card-button">
                <CardHeader title="Host" />
                <CardContent>
                  <Typography variant="subtitle1" align="center">Host a created game using game pin</Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={12}>
            <Link to="/create">
              <Card className="card-button">
                <CardHeader title="Create" />
                <CardContent>
                  <Typography variant="subtitle1" align="center">Setup a new game and recive a related game pin</Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withRouter(Home);
