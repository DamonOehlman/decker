var decker = require('./'),
    deck = decker(),
    fs = require('fs');

deck.add(fs.readFileSync('./intro.md'));

document.body.appendChild(deck.render());