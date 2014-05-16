/* jshint node: true */
/* global window: false */
'use strict';

/**
  # Welcome to Decker

  ## What is Decker?

  Decker is a tool for generating presentations using
  [browserify](https://github.com/substack/node-browserify).

  ## Why Decker?

  Because if you are talking about Browserify, then using presentation
  software built another way feels kind of wrong :/

**/

var classtweak = require('classtweak');
var crel = require('crel');
var insertCss = require('insert-css');
var Stream = require('stream');
var hljs = require('highlight.js');
var marked = require('marked');
var util = require('util');
var fs = require('fs');

var reSlideBreak = /\n\r?\-{2,}/m;
var reLeadingAndTrailingSpaces = /^\s*(.*)\s*$/m;

var hljsLangMappings = {
  js: 'javascript'
};

module.exports = function(options) {
  return new Deck(options || {});
};

/* initialise marked */

marked.setOptions({
  highlight: function(code, lang) {
    lang = hljsLangMappings[lang] || lang;

    // if this is a known hljs language then highlight
    if (hljs.getLanguage(lang)) {
      return hljs.highlight(lang, code).value;
    }
    else {
      return code;
    }
  }
});


/**

  ## Decker Reference

**/

function Deck() {
  Stream.call(this);

  // initialise the slides array
  this.slides = [];

  // initialise the elements array that will contain the section elements
  this._elements = [];

  // mark as writable
  this.writable = true;
}

util.inherits(Deck, Stream);

/**
  ### add(data)
**/
Deck.prototype.add = function(slide) {
  var textData = typeof slide == 'string' || (slide instanceof String);

  if (textData && reSlideBreak.test(slide)) {
    return slide.split(reSlideBreak).forEach(this.add.bind(this));
  }

  // attempt a converstion to html if a string
  if (textData) {
    // trim trailing line breaks and spaces
    slide = {
      type: 'html',
      data: marked(slide.replace(reLeadingAndTrailingSpaces, '$1'))
    };
  }

  // add the slide to the list
  this.slides.push(slide);
};

/**
  ### render() -> HTMLElement

  Render a new slide deck as an HTML element ready for insertion into
  the DOM.
**/
Deck.prototype.render = function() {
  function createSlide(slide, index) {
    var section;

    switch (slide.type) {
    case 'html':
      section = crel('section');
      section.innerHTML = slide.data;

      break;
    }

    // set the data attributes
    if (section) {
      section.dataset.index = index;
    }

    return section;
  }

  // create the dom elements
  this._elements = this.slides.map(createSlide);

  // set the index to 0 if not already defined
  this.index = this.index || this.hashIndex || 0;

  // bind keys
  document.body.addEventListener('keydown', this._handleKey.bind(this));

  // ensure we have the baseline css
  insertCss(fs.readFileSync(__dirname + '/assets/decker.css'));

  // create the container article
  return crel.apply(
    null,
    ['article', { class: 'decker '}].concat(this._elements)
  );
};

/**
  ### write(data)
**/
Deck.prototype.write = function() {
    // apply the action from the deck
};

/**
  ### _handleKey(evt, handler)

  Handle key events as per
  [keymaster](https://github.com/madrobby/keymaster) docs.
**/
Deck.prototype._handleKey = function(evt) {
  var increment = 0;

  if (evt.keyCode === 32 || evt.keyCode === 39) {
    increment = 1;
  }
  else if (evt.keyCode ===  37) {
    increment = -1;
  }

  this.index += increment;
};

/* deck properties */

/**
  ### deck@index

**/
Object.defineProperty(Deck.prototype, 'index', {
  get: function() {
    return this._index;
  },

  set: function(value) {
    // constrain the value to within valid bounds
    value = this._elements.length ?
      Math.max(0, Math.min(parseInt(value, 10), this._elements.length - 1)) :
      -1;

    if (this._index !== value) {
      // unset active for the articles
      classtweak(this._elements, '-decker-active -decker-past');

      // set the current section to active
      if (value >= 0) {
        classtweak(this._elements.slice(0, value), '+decker-past');
        classtweak(this._elements[value], '+decker-active');
        this._index = value;

        if (typeof window != 'undefined') {
          window.location.hash = value;
        }
      }
    }
  }
});

/**
  ### deck@hashIndex

**/
Object.defineProperty(Deck.prototype, 'hashIndex', {
  get: function() {
    if (typeof window != 'undefined') {
      return parseInt(window.location.hash.slice(1), 10);
    }
  }
});
