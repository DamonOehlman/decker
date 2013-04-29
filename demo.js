var decker = require('./'),
    deck = decker(),
    insertCss = require('insert-css'),
    fs = require('fs');

insertCss(require('./themes/basic.styl'));
deck.add(fs.readFileSync('./examples/browserify.md'));

document.body.appendChild(deck.render());
