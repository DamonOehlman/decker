var decker = require('./');
var deck = decker();
var insertCss = require('insert-css');
var fs = require('fs');

insertCss(require('./themes/basic.styl'));
insertCss(fs.readFileSync('./themes/code/default.css'));
deck.add(fs.readFileSync('./examples/browserify.md'));

document.body.appendChild(deck.render());
