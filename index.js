var classtweak = require('classtweak'),
    crel = require('crel'),
    insertCss = require('insert-css'),
    key = require('keymaster'),
    Stream = require('stream'),
    md = require('markdown').markdown,
    util = require('util'),
    reSlideBreak = /\n\r?\-{2,}/m,
    reLeadingAndTrailingSpaces = /^\s*(.*)\s*$/m;

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
## add(data)
*/
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
            data: md.toHTML(slide.replace(reLeadingAndTrailingSpaces, '$1'))
        }
    }

    // add the slide to the list
    this.slides.push(slide);
};

/**
## render() -> HTMLElement

Render a new slide deck as an HTML element ready for insertion into the DOM.
*/
Deck.prototype.render = function(options) {

    var deck = this;

    function createSlide(slide, index) {
        var section;

        switch (slide.type) {
            case 'html':
                section = crel('section');
                section.innerHTML = slide.data;

                break;
        }

        // set the data attributes
        section.dataset.index = index;

        return section;
    }

    // create the dom elements
    this._elements = this.slides.map(createSlide);

    // set the index to 0 if not already defined
    this.index = this.index || 0;

    // bind keys
    key('right, space, left', this._handleKey.bind(this));

    // ensure we have the baseline css
    insertCss(require('./assets/decker.styl'));

    // create the container article
    return crel.apply(null, ['article', { class: 'decker '}].concat(this._elements));
};

/**
## write(data)
*/
Deck.prototype.write = function(data) {
    // apply the action from the deck
};

/**
## _handleKey(evt, handler)

Handle key events as per [keymaster](https://github.com/madrobby/keymaster) docs.
*/
Deck.prototype._handleKey = function(evt, handler) {
    switch (handler.shortcut) {
        case 'left': 
            this.index -= 1;
            break;

        default:
            this.index += 1;
    }
}

/* deck properties */

Object.defineProperty(Deck.prototype, 'index', {
    get: function() {
        return this._index;
    },

    set: function(value) {
        // constrain the value to within valid bounds
        value = this._elements.length ? Math.max(0, Math.min(parseInt(value, 10), this._elements.length - 1)) : -1;

        if (this._index !== value) {
            // unset active for the articles
            classtweak(this._elements, '-decker-active -decker-past');

            // set the current section to active
            if (value >= 0) {
                classtweak(this._elements.slice(0, value), '+decker-past');
                classtweak(this._elements[value], '+decker-active');
                this._index = value;
            }
        }
    }
});

module.exports = function(options) {
    var opts = options || {};

    return new Deck();
};