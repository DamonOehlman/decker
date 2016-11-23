var decker = require('./');
var deck = decker();
var insertCss = require('insert-css');
var fs = require('fs');

insertCss(fs.readFileSync(__dirname + '/themes/basic.css', 'utf8'));
insertCss(fs.readFileSync(__dirname + '/themes/code/default.css', 'utf8'));
deck.add(fs.readFileSync(__dirname + '/examples/browserify.md', 'utf8'));

document.body.appendChild(deck.render());
