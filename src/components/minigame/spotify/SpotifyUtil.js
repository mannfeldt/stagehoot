import {
  MIN_SONGS_PLAYLIST, MISSING_ALBUM_COVER,
} from './SpotifyConstants';


export function getValidTracks(tracks) {
  const validTracks = tracks.filter(x => x && x.track && x.track.id);

  const uniqTracks = validTracks.filter((x, index, self) => self.findIndex(t => t.track.id === x.track.id) === index);
  // const uniqTracks = validTracks.filter((x, index) => index === validTracks.findIndex(y => y.id === x.id));
  return uniqTracks;
}

export function getQuestionTracks(tracks) {
  const validTracks = tracks.filter(x => x.audio && x.artists);

  const uniqTracks = validTracks.filter((x, index) => index === validTracks.findIndex(y => y.id === x.id));
  return uniqTracks;
}

export function getAvaragePopularity(tracks) {
  const popularity = tracks.reduce((acc, cur) => acc + cur.popularity, 0) / tracks.length;
  return popularity;
}

export function getGenresFrequencyMap(genres, totalTracks) {
  const result = [];
  genres.forEach((genre) => {
    result[`${genre}`] = result[`${genre}`] + 1 || 1;
  });
  result.forEach((genre) => {
    result[`${genre}`] = result[`${genre}`] / totalTracks;
  });
  return result;
}
export function sortQuestions(questions) {
  // track_owner tenderar att läggas först. kanske kan byta taktik till att lägga ett visst antal track-owner qs först
  questions.sort((a, b) => (b.qtype === 'track_owner') - (a.qtype === 'track_owner'));

  const questionsFirst = questions.splice(0, Math.min(3, questions.length - 1));
  const questionsSecond = questions.splice(0, questions.length);
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
  return finalQuestions;
}
export function filterQuestionTracks(playlists, questionTracks, maxQuestionsPerList) {
  const filteredQuestionTracks = [];
  const questionTracksIds = [];
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
  return filteredQuestionTracks;
}

export function getIdFrequencyMap(ids) {
  const result = {};
  ids.forEach((id) => {
    if (id) {
      result[`${id}`] = result[`${id}`] + 1 || 1;
    }
  });
  return result;
}

export function getArtistFrequencyMap(tracks) {
  // detta genererar en array som t.ex. [kanye:2,eminem:3]
  // men jag kanske vill ha en simpel object array för att kunna göra enkelare filter funktioner på det senare? ex: [{artist:'kanye',uses:2},{artist:'eminem',uses:5}]
  const result = {};
  const artists = [];
  tracks.forEach((track) => {
    artists.push(...track.artistList);
  });
  artists.forEach((artist) => {
    result[`${artist}`] = result[`${artist}`] + 1 || 1;
  });
  return result;
}

export function getAvarageReleasedate(tracks) {
  // const avarageReleaseDate = tracks.reduce((acc,cur) => acc + cur.rele)
  // realse_date är inte en del av tracks. finns på album  ...
  return 2;
}

// TEST: testa att radion av alla olika quiztyper är rätt med lite olika size på tracks och playlists. och att qtype fungerar
export function generateQuestions(playlists, tracks, minigame) {
  // jag vet inte riktigt rätt svar när jag genererar då tracks som kommer in bara är en players tracks
  // så vilka som har en track i sin lista får jag kolla senare live.

  // q types:
  // VILKEN ÄR DEN SENAASTE LÅTEN SOM playerxx lagt till? vilken var den först?

  const result = [];

  if (minigame.qFeatures) {
    const time = playlists.length < 10 ? 10 : 15;
    result.push({
      qtype: 'popularity',
      atype: 'single',
      subtype: 'max',
      text: 'Vem har den trendigaste spellistan?',
      time,
    });
    result.push({
      qtype: 'popularity',
      atype: 'single',
      subtype: 'min',
      text: 'Vem har den minst trendiga spellistan?',
      time,
    });

    result.push({
      qtype: 'danceability',
      atype: 'single',
      subtype: 'max',
      text: 'Vem har den dansvänligaste spellistan?',
      time,
    });

    result.push({
      qtype: 'danceability',
      atype: 'single',
      subtype: 'min',
      text: 'Vem har den minst dansvänliga spellistan?',
      time,
    });

    result.push({
      qtype: 'tempo',
      atype: 'single',
      subtype: 'max',
      text: 'Vems spellista har högst tempo?',
      time,
    });
    result.push({
      qtype: 'tempo',
      atype: 'single',
      subtype: 'min',
      text: 'Vems spellista har lägst tempo?',
      time,
    });

    result.push({
      qtype: 'energy',
      atype: 'single',
      subtype: 'max',
      text: 'Vem har den mest energifyllda spellistan?',
      time,
    });

    result.push({
      qtype: 'valence',
      atype: 'single',
      subtype: 'max',
      text: 'Vem har den gladaste spellistan?',
      time,
    });
    result.push({
      qtype: 'valence',
      atype: 'single',
      subtype: 'min',
      text: 'Vem har den dystraste spellistan?',
      time,
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
    const time = playlists.length < 10 ? 10 : 15;

    result.push({
      qtype: 'totalTracks',
      atype: 'single',
      subtype: 'min',
      text: 'Vem har kortast spellista?',
      time,
    });
    result.push({
      qtype: 'totalTracks',
      atype: 'single',
      subtype: 'max',
      text: 'Vem har längst spellista?',
      time,
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
      const question = {
        qtype: 'artist',
        subtype: 'max',
        atype: 'single',
        artist: playlist.topArtist.name,
        text: `Vem har flest låtar med ${playlist.topArtist.name}?`,
        img: playlist.topArtist.img,
        artistId: playlist.topArtist.id,
      };
      if (!artistQs.some(a => a.artistId === question.artistId)) {
        artistQs.push(question);
      }
    });
    // ?
    if (artistQs.length > tracks.length) {
      artistQs.length = Math.floor(tracks.length);
    }
    result.push(...artistQs);

    // kan använda playlist.artists för att få till flera frågor här:
    // vem är den ända som inte har en låt med x?
    // ...
  }
  if (minigame.qGenre) {
    // skapa flera olika typer av frågor, blanda och filtrera innan push till result
    const genreQs = [];

    // gör om det till andelar %av tracks som är en viss genre. alltså ge varje genre i playlist.grenres ett värde så att det totalt blir 1000?
    // ta de två vanligaste från varje player och lägg till fråga på dem om de inte redan finns med
    playlists.forEach((playlist) => {
      const mostCommonGenre = Object.keys(playlist.genres).reduce((a, b) => ((playlist.genres[a] > playlist.genres[b]) && a !== 'pop' ? a : b));
      const question = {
        qtype: 'genre',
        subtype: 'max',
        atype: 'single',
        genre: mostCommonGenre,
        text: `Vem har störst andel låtar i genren "${mostCommonGenre}"?`,
        time: playlists.length < 10 ? 15 : 20,
      };
      if (!genreQs.some(a => a.text === question.text)) {
        genreQs.push(question);
      }
      const secondMostCommonGenre = Object.keys(playlist.genres).reduce((a, b) => (playlist.genres[a] > playlist.genres[b] && a !== mostCommonGenre ? a : b));
      const secondQuestion = {
        qtype: 'genre',
        subtype: 'max',
        atype: 'single',
        genre: secondMostCommonGenre,
        text: `Vem har störst andel låtar i genren "${mostCommonGenre}"?`,
        time: playlists.length < 10 ? 15 : 20,
      };
      if (!genreQs.some(a => a.text === secondQuestion.text)) {
        genreQs.push(secondQuestion);
      }
    });
    // ?
    if (genreQs.length > tracks.length / 2) {
      genreQs.length = Math.floor(tracks.length / 2);
    }
    result.push(...genreQs);

    // kan använda playlist.artists för att få till flera frågor här:
    // vem är den ända som inte har en låt med x?
    // ...
  }
  if (minigame.qTrackOwner) {
    // tracks är lika med antalet totala frågor när den kommer in. om vi redan skapat frågor ovan så mindksar vi antalet trackowner-frågor
    tracks.sort(() => Math.random() - 0.5);
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
  // if (!minigame.qTrackOwner && result.length < minigame.questions) {
  //   const trackowner = [];
  //   tracks.sort(() => Math.random() - 0.5);
  //   trackowner.push(...tracks.map((t) => {
  //     const q = {
  //       qtype: 'track_owner',
  //       atype: 'multi',
  //       track: t,
  //       text: 'Vem har denna låt i sin spellista?',
  //     };
  //     return q;
  //   }));
  //   trackowner.length = Math.min(minigame.questions - result.length, trackowner.length);
  //   result.push(...trackowner);
  // }

  console.table(result);
  return result;
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
