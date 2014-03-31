var decker = require('./');
var deck = decker();
var insertCss = require('insert-css');
var fs = require('fs');

insertCss(require('./themes/basic.styl'));
insertCss(fs.readFileSync('./themes/code/default.css', 'utf8'));
deck.add(fs.readFileSync('./examples/browserify.md', 'utf8'));

document.body.appendChild(deck.render());
