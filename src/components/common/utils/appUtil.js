function generateGameId() {
  let id = '';
  const possible = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 6; i++) {
    id += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return id;
}
function calculateDefaultTimeLimit(question) {
  if (question.aType === 'multiple' || question.aType === 'boolean') {
    return 10 + Math.floor((question.correctAnswers.join().length + question.wrongAnswers.join().length) / 30);
  } if (question.aType === 'free') {
    return 20;
  } if (question.aType === 'player') {
    // answer blir 4-8 random utvalda till varje fråga
    return 20;
  }
  return 20;
}
function parseDOM(s) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(
    `<!doctype html><body>${s}`,
    'text/html',
  );
  const decodedString = dom.body.textContent;
  return decodedString;
}

function parseDOMArray(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(parseDOM(arr[i]));
  }
  return result;
}
export {
  generateGameId,
  calculateDefaultTimeLimit,
  parseDOMArray,
  parseDOM,
};
