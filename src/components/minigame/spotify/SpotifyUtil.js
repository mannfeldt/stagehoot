import {
  MIN_SONGS_PLAYLIST, MISSING_ALBUM_COVER,
} from './SpotifyConstants';


// SKRIV TESTFALL TILL ALLA METODER HÄR
export function getAvaragePopularity(tracks) {
  const popularity = tracks.reduce((acc, cur) => acc + cur.popularity, 0) / tracks.length;
  return popularity;
}

export function getArtistFrequencyMap(tracks) {
  // detta genererar en array som t.ex. [kanye:2,eminem:3]
  // men jag kanske vill ha en simpel object array för att kunna göra enkelare filter funktioner på det senare? ex: [{artist:'kanye',uses:2},{artist:'eminem',uses:5}]
  const result = {};
  const artists = [];
  tracks.forEach((track) => {
    artists.push(...track.artists.map(a => a.name));
  });
  artists.forEach((artist) => {
    result[artist] = result[artist] + 1 || 1;
  });
  return result;
}

export function getAvarageReleasedate(tracks) {
  // const avarageReleaseDate = tracks.reduce((acc,cur) => acc + cur.rele)
  // realse_date är inte en del av tracks. finns på album  ...
}

export function generateQuestions(playlists, tracks, minigame) {
  const { questions } = minigame;
  // jag vet inte riktigt rätt svar när jag genererar då tracks som kommer in bara är en players tracks
  // så vilka som har en track i sin lista får jag kolla senare live.

  // q types:
  // VILKEN ÄR DEN SENAASTE LÅTEN SOM playerxx lagt till? vilken var den först?

  const result = [];

  if (minigame.qPopularity) {
    result.push({
      qtype: 'popularity',
      atype: 'single',
      subtype: 'max',
      text: 'Vem har den trendigaste spellistan?',
      time: 10,
    });
    result.push({
      qtype: 'popularity',
      atype: 'single',
      subtype: 'min',
      text: 'Vem har den minst trendiga spellistan?',
      time: 10,
    });
    // skapa två frågor

    // vem är den minst trendande och vem har den mest trendande listan?
    // ska dessa frågor alltid vara med och track_owner är utfyllnaden för att nå questionsamount?
    // jag tror vi kör på helt random, ta ut ett godtyckligt antal track_owner och sen random sort och retunera rätt antal

    // qtype: popularity,
    // atype: single,
    // size: max/min
  }
  if (minigame.qSize) {
    result.push({
      qtype: 'size',
      atype: 'single',
      subtype: 'min',
      text: 'Vem har kortast spellista?',
      time: 10,
    });
    result.push({
      qtype: 'size',
      atype: 'single',
      subtype: 'max',
      text: 'Vem har längst spellista?',
      time: 10,
    });
    // skapa två frågor vem har störst lista vem har minst lista

    // qtype: size,
    // atype: single,
    // size: max/min
  }
  if (minigame.qArtist) {
    // skapa flera olika typer av frågor, blanda och filtrera innan push till result
    const artistQs = [];

    playlists.forEach((playlist) => {
      const mostCommonArtist = Object.keys(playlist.artists).reduce((a, b) => (playlist.artists[a] > playlist.artists[b] ? a : b));
      const question = {
        qtype: 'artist',
        subtype: 'max',
        artist: mostCommonArtist,
        image: '?',
        text: `Vem har flest låtar med ${mostCommonArtist}?`,
        time: 15,
      };
      if (!artistQs.some(a => a.text === question.text)) {
        artistQs.push(question);
      }
    });
    // ?
    if (artistQs.length > tracks.lenth / 2) {
      artistQs.length = Math.floor(tracks.length / 2);
    }
    result.push(...artistQs);

    // kan använda playlist.artists för att få till flera frågor här:
    // vem är den ända som inte har en låt med x?
    // ...
  }
  if (minigame.qTrackOwner) {
    // tracks är lika med antalet totala frågor när den kommer in. om vi redan skapat frågor ovan så mindksar vi antalet trackowner-frågor
    tracks.length -= Math.floor(result.length / 2);
    result.push(...tracks.map((t) => {
      const q = {
        qtype: 'track_owner',
        atype: 'multi',
        track: t,
        text: 'Vem har denna låt i sin spellista?',
      };
      return q;
    }));
  }
  if (result.length > questions) {
    result.length = questions;
  }

  return result.sort(() => Math.random() - 0.5);
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
