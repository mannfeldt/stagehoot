import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import SpotifyResultQuestion from './SpotifyResultQuestion';
import TrackPlayer from '../TrackPlayer';
import * as util from '../SpotifyUtil';
import {
  AUTH_EXPIRE_MS,
  MISSING_ALBUM_COVER,
  CLIENT_ID,
  SONG_VOLUME_FADE_TIME,
} from '../SpotifyConstants';

class Spotify extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spotifytoken: localStorage.getItem('spotifytoken') || '',
      tokentimestamp: localStorage.getItem('spotifytoken_timestamp') || '',
      tracks: [],
      questions: [],
      usedQuestions: [],
      songplaying: false,
      songCurrentTime: 0,
      songDuration: 30,
    };

    this.nextPhase = this.nextPhase.bind(this);
    this.playQuestion = this.playQuestion.bind(this);
    this.saveGame = this.saveGame.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
  }


  componentDidMount() {
    const { game } = this.props;
    const { spotifytoken, tokentimestamp } = this.state;

    if (!spotifytoken || Date.now() - tokentimestamp > AUTH_EXPIRE_MS) {
      const authEndpoint = 'https://accounts.spotify.com/authorize';
      // Replace with your app's client ID, redirect URI and desired scopes
      const redirectUri = window.location.origin + window.location.pathname;
      localStorage.setItem('spotify_type', 'host');
      const scopes = [
        'user-top-read',
      ];
      window.location = `${authEndpoint}?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
    }
    // const playlists = Object.values(game.players).map(player => player.playlist);

    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${spotifytoken}`);
    const playerArray = Object.values(game.players);
    // playerArray = playerArray.concat(playerArray).concat(playerArray);
    const maxQuestionsPerList = Math.ceil((game.minigame.questions * 2) / playerArray.length);
    playerArray.forEach((player, index) => {
      fetch(`https://api.spotify.com/v1/playlists/${player.playlist}/tracks`, {
        method: 'GET',
        headers: myHeaders,
      }).then(response => response.json())
        .then((data) => {
          console.table(data);
          const tracks = data.items.map((t) => {
            const track = {
              added_at: t.added_at.split('T')[0],
              name: t.track.name,
              audio: t.track.preview_url,
              artists: t.track.artists.map(a => a.name).join(', '),
              img: t.track.album.images.length > 0 ? t.track.album.images[0] : MISSING_ALBUM_COVER,
              playerKey: player.key,
              playerName: player.name,
              id: t.track.id,
            };
            return track;
          }).filter(t => t.audio);
          // ta bort för många. sortera alla på popularitet och sen sätt length till 10(?) om det är över 10
          // ta bort dem frårn question inte från track för då riskerar rätt svar att bli felaktiga
          // då är alla playlists åtminstone samma storlek. kan även lägga till validering på playlistSelector att det måste finnas minst 10låtar med preview_url
          this.setState((state) => {
            // sortera efter populäritet eller något annat? senast tillagda?
            const questionTracks = tracks.sort(() => Math.random() - 0.5);
            if (questionTracks.length > maxQuestionsPerList) {
              questionTracks.length = maxQuestionsPerList;
            }
            const questions = util.generateQuestions(questionTracks);
            return ({
              questions: [...state.questions, ...questions].sort(() => Math.random() - 0.5),
              tracks: [...state.tracks, ...tracks],
            });
          }, () => {
            if (index + 1 === playerArray.length && game.phase === 'gameplay') {
              // det är sista loopen
              this.playQuestion();
            }
          });
        });
    });


    // här ska jag plocka ut alla spelares playlists
    // skapa upp förståelig struktur av det, plocka ut det vesentliga så som artist, låt, prewvie_url, cover_art, ownerName, id
    // generera frågor och svar. börja med frågan: vem har denna låt i sin spellista? frågan innehåller: frågetext, rätta svar [], songId,
    // rätt svar vet jag inte riktigt när jag genererar
    // rätta svar sätts genom svar= songs.filter(x=> x.id===songId).map(song=> song.ownerName);
    // alltså en array med alla ownernames som har denna sång.
    // vad behöver sparas till firebase? inget? i play.js får man se vad man svarade. i host visas allas svar likt quiz.
    // så länge svarsalterntiven alltid är detsamma (spelarna) så behöver jagi nte updatera firebase med information om frågorna.
    //
    // score likt quiz beroende på hur snabb man var. jag kan visa albumart direkt och sen namn och artitst kommer senare för att försvårar?
    // livlinor?
    // spara frågor och svar till state
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
    const currentQuestion = game.minigame.currentq;
    // testa detta med fuskgrejen igen att skapa 4 players till foreachen
    // testa köra en await eller then på setstate? här eller tidigare i loopen. jag vill vara säker på att ha fått alla frågor här
    // blanda frågorna random?
    // https://medium.learnreact.com/setstate-takes-a-callback-1f71ad5d2296


    // /kör någon metod som är "nextquestion"
    // initquiz körs bara en gång, nextquestion körs inför varje fråga.

    this.setState({ songplaying: true });
    console.table(questions);
    const audio = new Audio(questions[currentQuestion].track.audio);
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

    // generera questions här istället?
    // kolla PhaseAnswer.js
    // behöver en timer likt det fast får ligga undern ågon metod som denna?
    // hårt på 30sek, inte bry sig om om folk svarat innan
    // nextphase blir till level_complete
    // nästafråga får jag klicka på inne i resultquestion. då ska phase sättas tillabka till gameplay och currentquiestion ska ökas på 1.
    // synka currenteustion på game.minigame i firebase. om det inte fungerar får jag pdatera den genom någon extra metod som pekat till parent från resultquestion component.

    // kolla på quiz hur jag löser flödet, hur vet jag när en fråga är besvarad?
    // måste kolla mot gameObj
    // jag behöver också ta in en timer likt quizet! det är den som styr när det är klart, när nästa fråga ska köras osv.
    // någon metod körs konstant under timern, typ render för att updatera timern och rendrera ledtrådar under spelets gång?
    // när timern är klar körs en "eventhandler" som kör nextphase
    // i SpotifyResultQuestion så sätts nextphase tillbaka till gameplay för att få nästa fråga. currentquestion räknas upp vid det klicket? behöver en action in till komponenten isf
    // annars kan vi räkna upp den här inne på något sätt säkert.
  }

  saveGame(game) {
    const { gameFunc } = this.props;
    gameFunc.update(game);
  }

  nextPhase() {
    const { game } = this.props;
    this.setState({ songplaying: false });
    if (game.minigame.currentq >= game.minigame.questions) {
      game.phase = 'final_result';
    } else {
      game.phase = 'level_completed';
    }
    this.saveGame(game);
  }

  render() {
    const { game, gameFunc } = this.props;
    const {
      tracks, questions, songplaying, songCurrentTime, songDuration,
    } = this.state;

    if (game.phase === 'gameplay' && !songplaying) {
      return (
        <div>loading questions</div>
      );
    }
    const question = questions[game.minigame.currentq];

    if (game.phase === 'level_completed') {
      // game behöver vara uppdaterat med svar från spelarna och den senaste frågan?
      // i firebase kommer man bara se player.answers och inte quiz.questions. men vi behöver synka currentquestionindex kanske?
      // det är i resultqestion som jag rättar svaren så jag behöver ju hela tracks där och currentquestion
      return (
        <SpotifyResultQuestion game={game} gameFunc={gameFunc} tracks={tracks} question={question} nextQuestion={this.nextQuestion} />
      );
    }

    const trackData = { ...question.track, currentTime: songCurrentTime, duration: songDuration };
    return (
      <div>
        {question.type === 'guess_owner' && (
          <TrackPlayer track={trackData} />
        )}
      </div>
    );
  }
}
Spotify.propTypes = {
  gameFunc: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired,
};
export default Spotify;
