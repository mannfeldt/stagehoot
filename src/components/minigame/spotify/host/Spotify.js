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
      playlists: [],
      tracks: [],
      questionTracks: [],
      questions: [],
      usedQuestions: [],
      questionPlaying: false,
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
    const maxQuestionsPerList = Math.ceil((game.minigame.questions) / playerArray.length);
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
          });
          // jag kommer behöva värden till playlistan från andra anrop till api.
          // ska jag lägga till hela strukturen med async await?
          // gör inget om det tar lite tid. lägg till en "generating questons loader" kan uppdatera den med progress efter varje steg :)
          const playlist = {
            playerKey: player.key,
            playerName: player.name,
            totalTracks: tracks.length,
            popularity: util.getAvaragePopularity(tracks),
            artists: util.getArtistFrequencyMap(tracks),
          };

          const questionTracks = tracks.filter(t => t.audio).sort(() => Math.random() - 0.5);
          if (questionTracks.length > maxQuestionsPerList) {
            questionTracks.length = maxQuestionsPerList;
          }
          // ta bort för många. sortera alla på popularitet och sen sätt length till 10(?) om det är över 10
          // ta bort dem frårn question inte från track för då riskerar rätt svar att bli felaktiga
          // då är alla playlists åtminstone samma storlek. kan även lägga till validering på playlistSelector att det måste finnas minst 10låtar med preview_url
          this.setState(state => ({
            playlists: [...state.playlist, playlist],
            tracks: [...state.tracks, ...tracks],
            questionTracks: [...state.questionTracks, ...questionTracks],
          }), () => {
            if (index + 1 === playerArray.length && game.phase === 'gameplay') {
              // när alla playlists har genererats så genereras frågorna och sen ställs första frågan.
              this.setState((state) => {
                // använd minigame för att se vilka options som är satta för vilka frågor som ska genereras.
                // lägg till true false på de olika frågetyperna i setup/create game.
                const questions = util.generateQuestions(state.playlists, state.questionTracks, game.minigame);
                return ({
                  questions: questions.sort(() => Math.random() - 0.5),
                });
              }, () => {
                this.playQuestion();
              });
              // det är sista loopen
              // här vill jag generera questions.
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
    const currentQuestion = questions[game.minigame.currentq];
    this.setState({ questionPlaying: true });
    if (currentQuestion.track) {
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
    } else {
      // om det inte finns en track som ska spelas och styra när frågan är klar så skapas en timer
      // alt skapa ett interval som räknas ner sekundrar och använd det till att visa en progress likt den i trackPlayer. kolla på quiz
      setTimeout(this.nextPhase, currentQuestion.time);
    }
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
    this.setState({ questionPlaying: false });
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
      tracks, questions, questionPlaying, songCurrentTime, songDuration,
    } = this.state;

    if (game.phase === 'gameplay' && !questionPlaying) {
      return (
        <div>loading questions: lägg till genererar frågor som en progressbar här. skapa en questionBuffer i state som uppdateras lite efter varje steg i componentDidMount</div>
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


    switch (question.type) {
      case 'track_owner':
        return (
          <div>
            <TrackPlayer track={{ ...question.track, currentTime: songCurrentTime, duration: songDuration }} />
          </div>
        );
      case 'popularity':
        return (
          <div>
            <span>En enkel textfråga med en progressbar nertill likt trackplayer som är timern</span>
            {question.text}

          </div>
        );
      case 'artist':
        return (
          <div>
            <span>Liknande popularity fast lägg till en bild på artisten. spela kanske hans mest spelade låt?</span>
            {question.text}

          </div>
        );
      case 'size':
        return (
          <div>
            <span>En enkel textfråga med en progressbar nertill likt trackplayer som är timern</span>
            {question.text}
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
