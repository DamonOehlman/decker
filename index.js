var crel = require('crel'),
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

    // mark as writable
    this.writable = true;

    // ensure we have the baseline css
    insertCss(require('./assets/decker.styl'));
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
        section.dataset.index = index;

        return section;
    }

    console.log(window);

    return crel.apply(null, ['article'].concat(this.slides.map(createSlide)));
};

/**
## write(data)
*/
Deck.prototype.write = function(data) {
    // apply the action from the deck
};

module.exports = function() {
    return new Deck();
};