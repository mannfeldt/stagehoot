import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import * as util from '../SpotifyUtil';
import SpotifyPlayListSelector from '../SpotifyPlaylistSelector';
import {
  AUTH_EXPIRE_MS,
  CLIENT_ID,
  SPOTIFY_AUTH_SCOPES,
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
      invalidSpotifyToken: !localStorage.getItem('spotifytoken') || Date.now() - localStorage.getItem('spotifytoken_timestamp') > AUTH_EXPIRE_MS,

    };
    this.createPlayer = this.createPlayer.bind(this);
    this.setPlaylist = this.setPlaylist.bind(this);
  }

  async componentDidMount() {
    const { game } = this.props;
    const { invalidSpotifyToken } = this.state;
    const token = localStorage.getItem('spotifytoken');


    // If there is no token, redirect to Spotify authorization. kolla om token gått ut också
    // jag kan sätta redirect till någon anna route och lösa det så att när man kommer dit så går den direkt och kollar i firebase och connectar än till rätt game?

    if (invalidSpotifyToken) {
      const authEndpoint = 'https://accounts.spotify.com/authorize';
      // Replace with your app's client ID, redirect URI and desired scopes
      const redirectUri = window.location.origin + window.location.pathname;
      localStorage.setItem('spotify_type', 'play');

      localStorage.setItem('RecentGameIdPlay', game.gameId);
      window.location = `${authEndpoint}?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=${SPOTIFY_AUTH_SCOPES.join('%20')}&response_type=token&show_dialog=true`;
    }
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);
    const getHeader = {
      method: 'GET',
      headers: myHeaders,
    };

    const profileResponse = await fetch('https://api.spotify.com/v1/me', getHeader);
    const profileResult = await profileResponse.json();

    let hasNext = true;
    let offset = 0;
    const limit = 50;
    const userPlaylists = [];
    while (hasNext) {
      const playlistsResponse = await fetch(`https://api.spotify.com/v1/users/${profileResult.id}/playlists?limit=${limit}&offset=${offset}`, getHeader);
      const playlistsResult = await playlistsResponse.json();
      userPlaylists.push(...playlistsResult.items);
      if (playlistsResult.items.length < limit) {
        hasNext = false;
      } else {
        offset += limit;
      }
    }

    const existingPlaylists = Object.values(game.players || {}).map(x => x.playlist);
    const selectablePlaylists = userPlaylists.filter(x => !existingPlaylists.includes(x.id) && util.isValidPlaylist(x));

    this.setState(() => ({
      playlists: selectablePlaylists,
      name: profileResult.display_name,
      avatar: profileResult.images.length > 0 ? profileResult.images[0].url : null,
    }));
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
    const {
      playlists, selectedPlaylist, invalidSpotifyToken,
    } = this.state;
    if (invalidSpotifyToken) {
      return (
        <span>Loading...</span>
      );
    }
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
                  <span>Välkommen </span>
                  <span className="dynamic-text">{playerName}</span>
                </Typography>
                <Typography variant="subtitle1" style={{ marginTop: 15 }}>
                  {'Ditt namn syns nu på spelskärmen. När spelet startar kommer frågor att presenteras och du svarar här på din enhet. Du kan välja ett eller flera svarsalternativ. Du får ett poäng för varje rätt svar och ett minus för varje felaktigt svar. Du kan inte få minuspoäng på en fråga.'}
                </Typography>
              </div>
              <div className="quiz-bottom-section" />
            </div>
          )
          : (
            <div>
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
