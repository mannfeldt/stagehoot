import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import SpotifyResultQuestion from './SpotifyResultQuestion';
import SpotifyProgressbar from '../SpotifyProgressbar';
import TrackPlayer from '../TrackPlayer';
import * as util from '../SpotifyUtil';
import * as SpotifyWS from '../SpotifyServiceInterface';
import {
  AUTH_EXPIRE_MS,
  MISSING_ALBUM_COVER,
  CLIENT_ID,
  SONG_VOLUME_FADE_TIME,
  SPOTIFY_AUTH_SCOPES,
} from '../SpotifyConstants';


function testAudio(tracks) {
  console.table(tracks);
  let i = 0;
  const audio = new Audio(tracks[i].audio);
  audio.onerror = (e) => {
    console.log(`error on track:${i}`);
    console.log(e);
    i += 1;
    if (i < tracks.length) {
      audio.src = tracks[i].audio;
      audio.play();
    }
  };
  audio.oncanplay = () => {
    i += 1;
    if (i < tracks.length) {
      audio.pause();
      audio.src = tracks[i].audio;
      audio.play();
    } else {
      console.log(`done testing tracks:${i}`);
    }
  };
  audio.play();
}

class Spotify extends Component {
  constructor(props) {
    super(props);
    const nrOfPlayers = Object.values(props.game.players).length;
    this.state = {
      spotifytoken: localStorage.getItem('spotifytoken') || '',
      tokentimestamp: localStorage.getItem('spotifytoken_timestamp') || '',
      playlists: [],
      tracks: [],
      questionTracks: [],
      questions: [],
      usedQuestions: [],
      topArtists: [],
      questionPlaying: false,
      progress: 0,
      progressText: '',
      songCurrentTime: 0,
      counter: 0,
      songDuration: nrOfPlayers < 10 ? 20 : 30,
    };

    this.nextPhase = this.nextPhase.bind(this);
    this.playQuestion = this.playQuestion.bind(this);
    this.saveGame = this.saveGame.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.getArtistTopTrack = this.getArtistTopTrack.bind(this);
    this.initQuiz = this.initQuiz.bind(this);
    this.setProgress = this.setProgress.bind(this);
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

    const playerArray = Object.values(game.players);
    const maxQuestionsPerList = Math.ceil((game.minigame.questions) / playerArray.length);
    const playerProgressRatio = 80 / playerArray.length;

    for (let i = 0; i < playerArray.length; i++) {
      const player = playerArray[i];
      this.setProgress(0, true, `Läser spellista för ${player.name}`);
      const playlistTracks = await SpotifyWS.getPlaylistTracks(player.playlist, spotifytoken);
      this.setProgress(playerProgressRatio / 2, true);

      const validTracks = util.getValidTracks(playlistTracks);
      const minifiedTracks = validTracks.map((t) => {
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
        totalTracks: minifiedTracks.length,
      };
      // genre och artist kan vara bakvänt..
      // vill inte göra anrop i onödan om inte qtyp finns för den typen av fråga
      // get artist toptracks kanske behöver ett filter på tracks som har preview_url?
      // error on track audio:[object Object] på spellistan yaaaaaas postmalone sunflower tror jag. lösningen är att den låten inte ska kunna spelas upp alls?
      // testa min validering som jag testat innan. behöver ha någon form av validering när frågorna genereras så att allt ljud fungerar..?


      if (game.minigame.qArtist || game.minigame.qGenre) {
        const artistsIds = validTracks.map(t => t.track.artists.map(a => a.id).join(',')).join(',').split(',');
        const artistIdsFrequencyMap = util.getIdFrequencyMap(artistsIds);
        const uniqArtistIds = Object.keys(artistIdsFrequencyMap);

        const playlistArtists = await SpotifyWS.getArtists(uniqArtistIds, spotifytoken);
        const playlistGenres = [];
        playlistArtists.forEach((artist) => {
          const frequency = artistIdsFrequencyMap[artist.id];
          for (let k = 0; k < frequency; k++) {
            playlistGenres.push(...artist.genres);
          }
        });
        playlist.genres = util.getGenresFrequencyMap(playlistGenres, playlist.totalTracks);

        if (game.minigame.qArtist) {
          playlist.artists = util.getArtistFrequencyMap(minifiedTracks);
          const topArtistName = Object.keys(playlist.artists).reduce((a, b) => ((playlist.artists[a] > playlist.artists[b]) && (minifiedTracks.find(x => x.artists.includes(a) && x.audio)) ? a : b));
          const topArtistRaw = playlistArtists.find(a => a.name === topArtistName);
          playlist.topArtist = {
            id: topArtistRaw.id,
            name: topArtistRaw.name,
            img: topArtistRaw.images.length > 0 ? topArtistRaw.images[0].url : MISSING_ALBUM_COVER,
          };
        }
      }

      if (game.minigame.qFeatures) {
        playlist.popularity = util.getAvaragePopularity(minifiedTracks);

        const tracksIds = minifiedTracks.map(t => t.id);
        const trackFeatures = await SpotifyWS.getTrackFeatures(tracksIds, spotifytoken);

        playlist.danceability = trackFeatures.reduce((acc, curr) => acc + curr.danceability, 0) / trackFeatures.length;
        playlist.energy = trackFeatures.reduce((acc, curr) => acc + curr.energy, 0) / trackFeatures.length;
        playlist.tempo = trackFeatures.reduce((acc, curr) => acc + curr.tempo, 0) / trackFeatures.length;
        playlist.valence = trackFeatures.reduce((acc, curr) => acc + curr.valence, 0) / trackFeatures.length;
      }
      this.setProgress(playerProgressRatio / 2, true);

      this.setState(state => ({
        playlists: [...state.playlists, playlist],
        tracks: [...state.tracks, ...minifiedTracks],
      }), () => {
        if (i + 1 === playerArray.length) {
          this.setProgress(85, false, 'Genererar frågor');
          const { playlists, tracks } = this.state;
          const questionTracks = util.getQuestionTracks(tracks);
          // testAudio(questionTracks);

          const filteredQuestionTracks = util.filterQuestionTracks(playlists, questionTracks, maxQuestionsPerList);

          const generatedQuestions = util.generateQuestions(playlists, filteredQuestionTracks, game.minigame);
          generatedQuestions.sort(() => Math.random() - 0.5);
          if (generatedQuestions.length > game.minigame.questions) {
            generatedQuestions.length = game.minigame.questions;
          }

          const sortedQuestions = util.sortQuestions(generatedQuestions);

          this.setProgress(90, false);

          this.setState(() => {
            console.table(sortedQuestions);
            return ({
              questions: sortedQuestions,
            });
          }, () => {
            const { questions } = this.state;
            if (questions.length < game.minigame.questions) {
              game.minigame.questions = questions.length;
              this.saveGame(game);
            }
            const t1 = performance.now();
            console.log(`componentDidMount took ${t1 - t0} milliseconds.`);

            this.initQuiz();
          });
        }
      });
    }
  }

  shouldComponentUpdate() {
    // kan jag ha det här?

    return true;
  }

  async getArtistTopTrack(question) {
    const { spotifytoken } = this.state;
    const topTracks = await SpotifyWS.getArtistTopTracks(question.artistId, spotifytoken);

    const trackIndex = Math.floor(Math.random() * Math.min(10, topTracks.length));
    const track = {
      img: question.img,
      audio: topTracks[trackIndex].preview_url,
    };
    return track;
  }

  async getGenreTopTrack(question) {
    const { spotifytoken } = this.state;
    const topTracks = await SpotifyWS.getGenreTopTracks(question.genre, spotifytoken);

    const usableTracks = topTracks.items.filter(x => x.preview_url);
    const trackIndex = Math.floor(Math.random() * Math.min(10, usableTracks.length));
    const selectedTrack = usableTracks[trackIndex];
    const track = {
      name: selectedTrack.name,
      img: selectedTrack.album.images.length > 0 ? selectedTrack.album.images[0].url : MISSING_ALBUM_COVER,
      audio: selectedTrack.preview_url,
      artists: selectedTrack.artists.map(a => a.name).join(', '),
    };
    return track;
  }

  setProgress(progress, incremental, progressText) {
    this.setState(state => ({
      progress: incremental ? state.progress + progress : progress,
      progressText: progressText || state.progressText,
    }));
  }

  handleChangeSelect = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };


  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  async initQuiz() {
    const { questions, tracks } = this.state;
    const { game } = this.props;
    const t0 = performance.now();
    const finalQuestions = [...questions];
    // add questiondata from spotify API to just the questions that will be used
    for (let i = 0, len = finalQuestions.length; i < len; i++) {
      const question = finalQuestions[i];
      switch (question.qtype) {
        case 'artist':
          question.track = await this.getArtistTopTrack(question);
          if (!question.track.audio) {
            const sampleTrack = tracks.find(x => x.artists.includes(question.artist) && x.audio);
            if (sampleTrack) {
              question.track.audio = sampleTrack.audio;
            }
          }
          break;
        case 'genre':
          question.track = await this.getGenreTopTrack(question);
          break;
        default:
          break;
      }
    }
    this.setProgress(100, false);
    this.setState(() => ({
      questions: finalQuestions,
    }), () => {
      if (game.phase === 'gameplay') {
        const t1 = performance.now();
        console.log(`initQuiz took ${t1 - t0} milliseconds.`);
        this.playQuestion();
      }
    });
  }

  nextQuestion() {
    this.playQuestion();
  }

  playQuestion() {
    const { questions, tracks, songDuration } = this.state;
    const { game } = this.props;
    const currentQuestion = questions[game.minigame.currentq];
    this.setState({ questionPlaying: true });
    if (currentQuestion.track) {
      const audio = new Audio(currentQuestion.track.audio);
      audio.onerror = () => {
        console.log(`error on track audio:${currentQuestion.track}`);
        setTimeout(this.nextPhase(), 15000);
      };
      audio.volume = 0;
      audio.play();
      // audio.onended = () => {
      //   this.nextPhase();
      // };
      // fade in and out
      audio.ontimeupdate = () => {
        const left = (songDuration || audio.duration) - audio.currentTime;
        if (left <= 0) {
          audio.pause();
          this.nextPhase();
          return;
        }
        const fadeout = left <= SONG_VOLUME_FADE_TIME;
        if (fadeout) {
          audio.volume = left / SONG_VOLUME_FADE_TIME;
        } else if (audio.volume < 1) {
          audio.volume = Math.min(1, audio.volume + 0.1);
        }
        this.setState(() => ({
          songCurrentTime: audio.currentTime,
        }));
      };
    } else {
      let counter = currentQuestion.time * 10;
      const i = setInterval(() => {
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
      case 'genre':
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
