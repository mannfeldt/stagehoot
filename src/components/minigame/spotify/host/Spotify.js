import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import SpotifyResultQuestion from './SpotifyResultQuestion';
import SpotifyProgressbar from '../SpotifyProgressbar';
import TrackPlayer from '../TrackPlayer';
import * as util from '../SpotifyUtil';
import {
  AUTH_EXPIRE_MS,
  MISSING_ALBUM_COVER,
  CLIENT_ID,
  SONG_VOLUME_FADE_TIME,
  SPOTIFY_AUTH_SCOPES,
} from '../SpotifyConstants';

class Spotify extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spotifytoken: localStorage.getItem('spotifytoken') || '',
      tokentimestamp: localStorage.getItem('spotifytoken_timestamp') || '',
      playlists: [],
      tracks: [],
      questionTracks: [],
      questions: [],
      usedQuestions: [],
      topArtistTracks: [],
      questionPlaying: false,
      progress: 0,
      progressText: '',
      songCurrentTime: 0,
      counter: 0,
      songDuration: 30,
    };

    this.nextPhase = this.nextPhase.bind(this);
    this.playQuestion = this.playQuestion.bind(this);
    this.saveGame = this.saveGame.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
  }


  async componentDidMount() {
    const { game } = this.props;
    const { spotifytoken, tokentimestamp } = this.state;
    const t0 = performance.now();

    if (!spotifytoken || Date.now() - tokentimestamp > AUTH_EXPIRE_MS) {
      const authEndpoint = 'https://accounts.spotify.com/authorize';
      const redirectUri = window.location.origin + window.location.pathname;
      localStorage.setItem('spotify_type', 'host');

      window.location = `${authEndpoint}?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=${SPOTIFY_AUTH_SCOPES.join('%20')}&response_type=token&show_dialog=true`;
    }

    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${spotifytoken}`);
    const getHeader = {
      method: 'GET',
      headers: myHeaders,
    };
    const playerArray = Object.values(game.players);
    const maxQuestionsPerList = Math.ceil((game.minigame.questions) / playerArray.length);
    const playerProgressRatio = 100 / playerArray.length;
    // Get an Artist's Top Tracks. om minigame.qArtists är satt så ska ett till state objekt skapas. topArtists [{artist: 'kanye', img: 'url', song: 'prewview_url'}]

    for (let i = 0; i < playerArray.length; i++) {
      const player = playerArray[i];
      this.setState(() => ({
        progressText: `Läser spellista för ${player.name}`,
      }));
      let hasNext = true;
      let offset = 0;
      const playlistTracks = [];
      while (hasNext) {
        // from_token ska kunna hämta flera previewUrls. kanske lösa problem med låtar som får 404?
        // &market=from_token
        const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${player.playlist}/tracks?offset=${offset}&market=from_token`, getHeader);
        const playlistResult = await playlistResponse.json();
        playlistTracks.push(...playlistResult.items);
        if (playlistResult.items.length < 100) {
          hasNext = false;
        } else {
          offset += 100;
        }
      }
      this.setState(state => ({
        progress: state.progress + playerProgressRatio / 2,
      }));

      const validTracks = util.getValidTracks(playlistTracks);
      const tracksTmp = validTracks.map((t) => {
        const track = {
          name: t.track.name,
          audio: t.track.preview_url,
          artists: t.track.artists.map(a => a.name).join(', '),
          artistList: t.track.artists.map(a => a.name),
          img: t.track.album.images.length > 0 ? t.track.album.images[0].url : MISSING_ALBUM_COVER,
          playerKey: player.key,
          playerName: player.name,
          id: t.track.id,
          popularity: t.track.popularity,
        };
        return track;
      });

      const playlist = {
        playerKey: player.key,
        playerName: player.name,
        totalTracks: tracksTmp.length,
      };


      // vill inte göra anrop i onödan om inte qtyp finns för den typen av fråga
      let topArtistTrack = {};
      if (game.minigame.qArtist || game.minigame.qGenre) {
        const artistsIds = playlistTracks.map(t => t.track.artists.map(a => a.id).join(',')).join(',').split(',');
        const artistIdsFrequencyMap = util.getIdFrequencyMap(artistsIds);
        const uniqArtistIds = Object.keys(artistIdsFrequencyMap);
        const chunks = [];
        const size = 50;

        while (uniqArtistIds.length > 0) {
          chunks.push(uniqArtistIds.splice(0, size));
        }

        const playlistArtists = [];
        for (const ids of chunks) {
          const inputids = ids.join(',');
          const artistsResponse = await fetch(`https://api.spotify.com/v1/artists?ids=${inputids}`, getHeader);
          const result = await artistsResponse.json();
          playlistArtists.push(...result.artists);
        }

        const playlistGenres = [];
        playlistArtists.forEach((artist) => {
          // optimerat så att jag bara använder api på de unika artisterna och sen räknar jag på frekvensen efteråt igen
          const frequency = artistIdsFrequencyMap[artist.id];
          for (let k = 0; k < frequency; k++) {
            playlistGenres.push(...artist.genres);
          }
        });
        playlist.genres = util.getGenresFrequencyMap(playlistGenres, playlist.totalTracks);

        if (game.minigame.qArtist) {
          playlist.artists = util.getArtistFrequencyMap(tracksTmp);
          const topArtistName = Object.keys(playlist.artists).reduce((a, b) => (playlist.artists[a] > playlist.artists[b] ? a : b));
          const topArtistRaw = playlistArtists.find(a => a.name === topArtistName);
          const topTracksResponse = await fetch(`https://api.spotify.com/v1/artists/${topArtistRaw.id}/top-tracks?market=from_token`, getHeader);
          const topTracksResult = await topTracksResponse.json();

          topArtistTrack = {
            name: topTracksResult.tracks[0].name,
            topArtistName: topArtistRaw.name,
            img: topArtistRaw.images.length > 0 ? topArtistRaw.images[0].url : MISSING_ALBUM_COVER,
            audio: topTracksResult.tracks[0].preview_url,
            artists: topTracksResult.tracks[0].artists.map(a => a.name).join(', '),
          };
        }
      }

      if (game.minigame.qFeatures) {
        playlist.popularity = util.getAvaragePopularity(tracksTmp);

        const tracksIds = tracksTmp.map(t => t.id);
        const chunks = [];
        const size = 100;

        while (tracksIds.length > 0) { chunks.push(tracksIds.splice(0, size)); }

        const trackFeatures = [];
        for (const ids of chunks) {
          const inputids = ids.join(',');
          const artistsResponse = await fetch(`https://api.spotify.com/v1/audio-features?ids=${inputids}`, getHeader);
          const result = await artistsResponse.json();
          trackFeatures.push(...result.audio_features);
        }

        playlist.danceability = trackFeatures.reduce((acc, curr) => acc + curr.danceability, 0) / trackFeatures.length;
        playlist.energy = trackFeatures.reduce((acc, curr) => acc + curr.energy, 0) / trackFeatures.length;
        playlist.tempo = trackFeatures.reduce((acc, curr) => acc + curr.tempo, 0) / trackFeatures.length;
        playlist.valence = trackFeatures.reduce((acc, curr) => acc + curr.valence, 0) / trackFeatures.length;
      }
      this.setState(state => ({
        playlists: [...state.playlists, playlist],
        tracks: [...state.tracks, ...tracksTmp],
        topArtistTracks: [...state.topArtistTracks, topArtistTrack],
        progress: state.progress + playerProgressRatio / 2,
      }), () => {
        if (i + 1 === playerArray.length) {
          const { playlists, tracks, topArtistTracks } = this.state;
          const filteredQuestionTracks = [];
          const questionTracksIds = [];
          const questionTracks = util.getQuestionTracks(tracks);
          playlists.forEach((p) => {
            const playerQuestionTracks = questionTracks.filter(x => x.playerKey === p.playerKey && !questionTracksIds.includes(x.id));
            playerQuestionTracks.sort(() => Math.random() - 0.5);
            let uniqAlbumTracks = playerQuestionTracks.filter((x, index) => index === playerQuestionTracks.findIndex(y => y.img === x.img && y.playerKey === x.playerKey));
            if (uniqAlbumTracks.length > maxQuestionsPerList) {
              uniqAlbumTracks.length = maxQuestionsPerList;
            } else {
              uniqAlbumTracks = playerQuestionTracks.filter((x, index) => index === playerQuestionTracks.findIndex(y => y.img === x.img && y.playerKey === x.playerKey && y.artists === x.artists));
              if (uniqAlbumTracks.length > maxQuestionsPerList) {
                uniqAlbumTracks.length = maxQuestionsPerList;
              }
            }
            questionTracksIds.push(...uniqAlbumTracks.map(x => x.id));
            filteredQuestionTracks.push(...uniqAlbumTracks);
          });

          const questionsTmp = util.generateQuestions(playlists, filteredQuestionTracks, topArtistTracks, game.minigame);
          questionsTmp.sort(() => Math.random() - 0.5);
          if (questionsTmp.length > game.minigame.questions) {
            questionsTmp.length = game.minigame.questions;
          }
          // track_owner tenderar att läggas först. kanske kan byta taktik till att lägga ett visst antal track-owner qs först
          questionsTmp.sort((a, b) => (b.qtype === 'track_owner') - (a.qtype === 'track_owner'));

          const questionsFirst = questionsTmp.splice(0, Math.min(3, questionsTmp.length - 1));
          const questionsSecond = questionsTmp.splice(0, questionsTmp.length);
          questionsSecond.sort((a, b) => {
            if (a.qtype === 'track_owner' && b.qtype !== 'track_owner') {
              return Math.random() - 0.6;
            }
            if (a.qtype !== 'track_owner' && b.qtype === 'track_owner') {
              return Math.random() - 0.4;
            }
            return Math.random() - 0.5;
          });
          const finalQuestions = questionsFirst.concat(questionsSecond);


          this.setState(() => {
            console.table(finalQuestions);
            return ({
              questions: finalQuestions,
            });
          }, () => {
            const { questions } = this.state;
            if (questions.length < game.minigame.questions) {
              game.minigame.questions = questions.length;
              this.saveGame(game);
            }
            const t1 = performance.now();
            console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
            if (game.phase === 'gameplay') {
              this.playQuestion();
            }
          });
        }
      });
    }
  }

  shouldComponentUpdate() {
    // kan jag ha det här?

    return true;
  }


  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };


  handleChangeSelect = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  nextQuestion() {
    this.playQuestion();
  }

  playQuestion() {
    const { questions, tracks } = this.state;
    const { game } = this.props;
    const currentQuestion = questions[game.minigame.currentq];
    this.setState({ questionPlaying: true });
    if (currentQuestion.track) {
      const audio = new Audio(currentQuestion.track.audio);
      audio.onerror = () => {
        console.log(`error on track audio:${currentQuestion.track}`);
        setTimeout(this.nextPhase(), 15000);
      };
      audio.volume = 0.1;
      audio.play();
      audio.onended = () => {
        this.nextPhase();
      };
      audio.canplay = () => {
        this.setState(() => ({
          songDuration: audio.duration,
        }));
      };
      // fade in and out
      audio.ontimeupdate = () => {
        const left = audio.duration - audio.currentTime;
        const fadeout = left <= SONG_VOLUME_FADE_TIME;
        if (fadeout) {
          audio.volume = left / SONG_VOLUME_FADE_TIME;
        } else if (audio.volume < 1) {
          audio.volume = Math.min(1, audio.volume + 0.2);
        }
        this.setState(() => ({
          songCurrentTime: audio.currentTime,
        }));
      };
    } else {
      let counter = currentQuestion.time * 10;
      const i = setInterval(() => {
        /*
        Funktion för att avsluta om alla svar är inne
        let answersCollected = 0;
        for (let i = 0; i < playerKeys.length; i++) {
          if (that.props.game.players[playerKeys[i]].answers && that.props.game.players[playerKeys[i]].answers[question.id]) {
            answersCollected++;
          }
        }
        if(answersCollected === playerKeys.lengt)
        */

        counter -= 1;
        this.setState(() => ({
          counter,
        }), () => {
          if (this.state.counter <= 0) {
            this.nextPhase();
            clearInterval(i);
          }
        });
      }, 100);
      // om det inte finns en track som ska spelas och styra när frågan är klar så skapas en timer
      // alt skapa ett interval som räknas ner sekundrar och använd det till att visa en progress likt den i trackPlayer. kolla på quiz
      // testa igenom hela flödet
      // fixa till jest testfall
      // testa massa olika testfall för olika scenarion för frågor quiz playlists tracks etc
      // denna fungerar inte
    }
  }

  saveGame(game) {
    const { gameFunc } = this.props;
    gameFunc.update(game);
  }

  nextPhase() {
    const { game } = this.props;
    this.setState({ questionPlaying: false });
    game.phase = 'level_completed';
    this.saveGame(game);
  }

  render() {
    const { game, gameFunc } = this.props;
    const {
      tracks, questions, questionPlaying, songCurrentTime, songDuration, playlists, progress, counter, progressText,
    } = this.state;

    if (game.phase === 'gameplay' && !questionPlaying) {
      return (
        <div style={{ marginTop: 30 }}>
          <Typography style={{ fontSize: 28, padding: 15, fontWeight: 400 }}>{progressText}</Typography>
          <SpotifyProgressbar progress={progress} />
        </div>
      );
    }
    const question = questions[game.minigame.currentq];

    if (game.phase === 'level_completed') {
      // game behöver vara uppdaterat med svar från spelarna och den senaste frågan?
      // i firebase kommer man bara se player.answers och inte quiz.questions. men vi behöver synka currentquestionindex kanske?
      // det är i resultqestion som jag rättar svaren så jag behöver ju hela tracks där och currentquestion
      return (
        <SpotifyResultQuestion game={game} playlists={playlists} gameFunc={gameFunc} tracks={tracks} question={question} nextQuestion={this.nextQuestion} />
      );
    }

    let progressTime;
    if (question.time) {
      const hundreds = question.time * 10;
      progressTime = (hundreds - counter) / 10;
    }
    switch (question.qtype) {
      case 'track_owner':
      case 'artist':
        return (
          <div>
            <TrackPlayer text={question.text} track={{ ...question.track, currentTime: songCurrentTime, duration: songDuration }} />
          </div>
        );
      case 'popularity':
      case 'tempo':
      case 'energy':
      case 'valence':
      case 'danceability':
      case 'totalTracks':
      case 'genre':
        return (
          <div>
            <TrackPlayer text={question.text} track={{ img: MISSING_ALBUM_COVER, currentTime: progressTime, duration: question.time }} />
          </div>
        );
      default:
        return (null);
    }
  }
}
Spotify.propTypes = {
  gameFunc: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired,
};
export default Spotify;
