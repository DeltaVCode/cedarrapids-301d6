'use strict';

let name = 'Code Fellows';

function say(words) {
  let normalized = normalize(words);
  render(normalized);
}

function normalize(str) {
  return str.toUpperCase();
}

function render(stuff) {
  console.log(stuff);
  //console.trace();

  if (stuff === 'CRAIG') throw new Error('oops');
}

say(name);

console.log(normalize('Rosie'));


function roleCall() {
  ['Keith', 'Marc', 'Craig', 'Jon'].forEach(function sayForEach(name) {
    try {
      say(name);
    } catch (err) {
      console.log(err);
    }
  });
}

roleCall();

const sayLater = () => {
  say('Keith is usually late');
};

setTimeout(sayLater, 5000);
