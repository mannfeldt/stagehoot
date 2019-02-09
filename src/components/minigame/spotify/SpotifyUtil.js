import {
  MIN_SONGS_PLAYLIST,
} from './SpotifyConstants';

export function generateQuestions(tracks) {
  // jag vet inte riktigt rätt svar när jag genererar då tracks som kommer in bara är en players tracks
  // så vilka som har en track i sin lista får jag kolla senare live.

  // q types:
  // VILKEN ÄR DEN SENAASTE LÅTEN SOM playerxx lagt till? vilken var den först?
  // vem har flest låtar av artist X?
  // vem har denna låt som mest spelad?
  // vilket låt har person x som mest spelad?
  // ta ut mest spelade artister och låtar från en användare.

  const questions = tracks.map((t) => {
    const q = {
      type: 'guess_owner',
      track: t,
    };
    return q;
  });
  return questions;
}

export function isValidPlaylist(playlist) {
  if (playlist.tracks.total < MIN_SONGS_PLAYLIST) {
    return false;
  }

  return true;
}
export function formatTime(sec) {
  let minutes = Math.floor(sec / 60);
  minutes = (minutes >= 10) ? minutes : `0${minutes}`;
  let seconds = Math.floor(sec % 60);
  seconds = (seconds >= 10) ? seconds : `0${seconds}`;
  return `${minutes}:${seconds}`;
}

export default[generateQuestions, isValidPlaylist, formatTime];
