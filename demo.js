var decker = require('./'),
    deck = decker(),
    insertCss = require('insert-css'),
    fs = require('fs');

insertCss(require('./themes/basic.styl'));
insertCss(fs.readFileSync('./themes/code/default.css'));
deck.add(fs.readFileSync('./examples/browserify.md'));

document.body.appendChild(deck.render());
