// https://glitch.com/edit/#!/spotify-implicit-grant?path=script.js:21:61
// spotify API:
// 1. varje spelar loggarin på spotify auth
// 2. jag presenterar alla spellistor (börja med bara namnet på listan?)
// 3. spelaren väljer ut en av spellistorna
// 4. spellistans playlist_id sparas till firebase
// 5. host.js läser upp varje spelres playlist_id och anrppar getPLaylist spotifyAPI (ska fungera även för privata spellistor?)
// 6. host.js genererar automatiskt ett antal frågor och svar utfårn spellistorna
// 7. ska kunna anropa spotify api för att spela upp en låt kopplad till en fråga

// bonus: spara mer information om varje spelare. så som mest spelade låt, genre etc. vad som nu må finnas i spotify api som kan synkas till firebase utan att vara för mycket

// att spela upp en sång kräver player SDK https://developer.spotify.com/documentation/web-playback-sdk/quick-start/
// https://developer.spotify.com/documentation/web-playback-sdk/reference/#playing-a-spotify-uri
// https://www.npmjs.com/package/react-spotify-player
// kräver att hosten har spotify premium?
// jag skulle kunna köra en egen "player" genom att köra pewview som är 30sekunder och sen har jag ju albumart

import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import ListItemText from '@material-ui/core/ListItemText';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import { Typography } from '@material-ui/core';

// const play = ({
//   spotify_uri,
//   playerInstance: {
//     _options: {
//       getOAuthToken,
//       id,
//     },
//   },
// }) => {
//   getOAuthToken((access_token) => {
//     fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
//       method: 'PUT',
//       body: JSON.stringify({ uris: [spotify_uri] }),
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${access_token}`,
//       },
//     });
//   });
// };

// TESTA ATT SPELA UPP EN LÅT FRÅN EN AV SPELLISTORNA. kolla på  https://developer.spotify.com/documentation/web-playback-sdk/reference/#playing-a-spotify-uri

// $.ajax({
//   url: 'https://api.spotify.com/v1/me/top/artists',
//   type: 'GET',
//   beforeSend(xhr) { xhr.setRequestHeader('Authorization', `Bearer ${_token}`); },
//   success(data) {
//     // Do something with the returned data
//     data.items.map((artist) => {
//       const item = $(`<li>${artist.name}</li>`);
//       item.appendTo($('#top-artists'));
//     });
//   },
// });

class CreateSpotify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      gametype: 'spotify',
      questions: 18,
      password: '',
      autoplay: true,
      qFeatures: true,
      qSize: true,
      qTrackOwner: true,
      qArtist: true,
      qGenre: true,
    };
    // const hash = window.location.hash
    //   .substring(1)
    //   .split('&')
    //   .reduce((initial, item) => {
    //     if (item) {
    //       const parts = item.split('=');
    //       initial[parts[0]] = decodeURIComponent(parts[1]);
    //     }
    //     return initial;
    //   }, {});
    // window.location.hash = '';

    // Set token
    // spara token i localstorage.
    // det är problem med hastag i redirect url. kommer tillbaka till startsidan när jag ber om ett token helt enkelt.
    // kan leva med det och då spara det i localstorage. Men när dne löper ut och jag behöver ny så kommer jag skickas tillbaka till startisdan igen.
    // Problematiskt om hosten också får samma problem? ett game kan bara vara 60min då?
    // https://example.com/callback#access_token=NwAExz...BV3O2Tk&token_type=Bearer&expires_in=3600&state=123 därför används hashen.
    // jag kan väl ha det tills vidare att man skcikas tillbaka efter inloggning...
    // const _token2 = hash.access_token;
    // i need to get new token if it has expired. i could use it for multiple games tho

    this.createGame = this.createGame.bind(this);
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleChangeBool = name => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  handleChangeSelect = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  createGame() {
    const { createGame } = this.props;
    const {
      password,
      gametype,
      title,
      questions,
      qArtist,
      qFeatures,
      qSize,
      qTrackOwner,
      qGenre,
      autoplay,
    } = this.state;
    const minigame = {
      autoplay,
      questions,
      qGenre,
      qArtist,
      qFeatures,
      qSize,
      qTrackOwner,
    };
    const game = {
      password,
      gametype,
      title,
      minigame,
    };
    createGame(game);
  }

  /*
    validateGame(game) {
      // validera lösenord är tillräckligt starkt här
      //eller direkt efter input om det finns någon smart lösning.
      // kolla på gametype hur ha en secifik validering för varje type
      return true;
    }

    clearForm() {

    }
*/
  render() {
    const {
      password,
      title,
      questions,
      qTrackOwner,
      qArtist,
      qFeatures,
      qSize,
      qGenre,
      autoplay,
    } = this.state;
    return (
      <div className="app-page create-page">
        <Grid container spacing={24}>
          <form autoComplete="off">
            <Grid item xs={12}>
              <Typography variant="h4">New Spotify game</Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <TextField
                  label="questions to play"
                  name="questions"
                  type="number"
                  value={questions}
                  margin="normal"
                  onChange={this.handleChange('questions')}
                />
              </FormControl>
            </Grid>
            <Typography variant="h5">Question types</Typography>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={qTrackOwner}
                      onChange={this.handleChangeBool('qTrackOwner')}
                      value="qTrackOwner"
                    />
)}
                  label="Tracks"
                />
              </FormControl>
              <FormControl component="fieldset">
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={qFeatures}
                      onChange={this.handleChangeBool('qFeatures')}
                      value="qFeatures"
                    />
)}
                  label="Features"
                />
              </FormControl>
              <FormControl component="fieldset">
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={qArtist}
                      onChange={this.handleChangeBool('qArtist')}
                      value="qArtist"
                    />
)}
                  label="Artist"
                />
              </FormControl>
              <FormControl component="fieldset">
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={qGenre}
                      onChange={this.handleChangeBool('qGenre')}
                      value="qGenre"
                    />
)}
                  label="Genres"
                />
              </FormControl>
              <FormControl component="fieldset">
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={qSize}
                      onChange={this.handleChangeBool('qSize')}
                      value="qSize"
                    />
)}
                  label="Playlist size"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={(
                  <Switch
                    checked={autoplay}
                    onChange={this.handleChangeBool('autoplay')}
                    value="autoplay"
                  />
)}
                label="Autoplay questions"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <TextField
                  label="Title"
                  name="title"
                  value={title}
                  margin="normal"
                  onChange={this.handleChange('title')}
                />
              </FormControl>
              <FormControl>
                <TextField
                  label="Password"
                  type="password"
                  name="password"
                  margin="normal"
                  value={password}
                  onChange={this.handleChange('password')}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button onClick={this.createGame} variant="contained">Create</Button>
            </Grid>
          </form>
        </Grid>
      </div>
    );
  }
}
CreateSpotify.propTypes = {
  createGame: PropTypes.func.isRequired,
};
export default CreateSpotify;
