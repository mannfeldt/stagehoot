import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import SpotifyPlayListSelector from '../SpotifyPlaylistSelector';
import {
  AUTH_EXPIRE_MS,
  CLIENT_ID,
} from '../SpotifyConstants';

class SpotifyConnection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      selectedPlaylist: '',
      spotifyUser: null,
      avatar: null,
      playlists: [],
    };
    this.createPlayer = this.createPlayer.bind(this);
    this.setPlaylist = this.setPlaylist.bind(this);
  }

  componentDidMount() {
    const { game } = this.props;
    const token = localStorage.getItem('spotifytoken');
    const timestamp = localStorage.getItem('spotifytoken_timestamp');

    // If there is no token, redirect to Spotify authorization. kolla om token gått ut också
    // jag kan sätta redirect till någon anna route och lösa det så att när man kommer dit så går den direkt och kollar i firebase och connectar än till rätt game?

    if (!token || Date.now() - timestamp > AUTH_EXPIRE_MS) {
      const authEndpoint = 'https://accounts.spotify.com/authorize';
      // Replace with your app's client ID, redirect URI and desired scopes
      const redirectUri = window.location.origin + window.location.pathname;
      const scopes = [
        'user-top-read',
        'playlist-read-private',
      ];
      localStorage.setItem('RecentGameIdPlay', game.gameId);
      window.location = `${authEndpoint}?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
    }
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

    // Make a call using the token

    const result = fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: myHeaders,
    }).then(response => response.json())
      .then((data) => {
        this.setState({ name: data.display_name, avatar: data.images.length > 0 ? data.images[0].url : null });
        return fetch(`https://api.spotify.com/v1/users/${data.id}/playlists`, {
          method: 'GET',
          headers: myHeaders,
        });
      })
      .then(response => response.json());

    result.then((r) => {
      this.setState({ playlists: r.items });
      console.table(r.items); // 2nd request result
    });

    // spara till state:
    // spotifyUser
    // user.name
    // playlist.id
    // playlists
    //
  }

  setPlaylist(selectedPlaylist) {
    this.createPlayer(selectedPlaylist);
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  createPlayer(selectedPlaylist) {
    const { name, avatar } = this.state;
    const { addPlayer } = this.props;
    // jag skulle kunna spara userid istället för name och avatar. och sen i host ta ut avatar och name
    const player = {
      name,
      playlist: selectedPlaylist,
      score: 0,
      avatar,
    };
    addPlayer(player);
    this.setState({ selectedPlaylist });
  }


  render() {
    const { game, playerKey } = this.props;
    const { name, playlists, selectedPlaylist } = this.state;
    let playerName = '';
    if (game.players && playerKey && game.players[playerKey]) {
      playerName = game.players[playerKey].name;
    }
    // fiska fram info om vilken playlist som blev vald här? använd playlists och selectedplaylist (id) för att göra det
    return (
      <div className="phase-container">
        {selectedPlaylist
          ? (
            <div>
              <div className="quiz-top-section" />
              <div className="quiz-middle-section">
                <Typography variant="h5">
                  <span>Welcome </span>
                  <span className="dynamic-text">{playerName}</span>
                </Typography>
                <Typography variant="subtitle1"> Watch the screen, your name should show.</Typography>
              </div>
              <div className="quiz-bottom-section" />
            </div>
          )
          : (
            <div>
              <Typography variant="subtitle1">Select a playlist</Typography>
              <SpotifyPlayListSelector setSelection={this.setPlaylist} playlists={playlists} />
            </div>
          )
            }
      </div>
    );
  }
}
SpotifyConnection.propTypes = {
  game: PropTypes.object.isRequired,
  playerKey: PropTypes.string,
  addPlayer: PropTypes.func.isRequired,
};
export default SpotifyConnection;
