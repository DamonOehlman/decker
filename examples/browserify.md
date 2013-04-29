# Browserify Goodness 

---

## What is Browserify?

[Browserify](https://github.com/substack/node-browserify) is a tool for building client-side application using [node](https://nodejs.org/) patterns and practices.

It is good.

---

## Why use Browserify?

- It is good.
- The module `require` syntax in node is __simple and effective__ - browserify is the best implementation of that in the browser.
- You can leverage the awesome node package ecosystem powered by [npm](https://npmjs.org/).
- It makes you think `<small>` and rage against frameworks.

---

## Super Simple Demo

demo.js:
```js
var key = require('keymaster');

key('up', function() {
    console.log('you pressed up'); 
});
```

package.json:

```json
{
    "dependencies": {
        "keymaster": "1.0.x"
    }
}
```

command-line:

```
npm install
browserify demo.js > demo-bundle.js
```

---

## Improving the Development Flow

Some helpful development tools exist that make working with a browserify friendly project a more enjoyable experience:

- [browservefy](https://github.com/chrisdickinson/browservefy)
- [bde](https://github.com/DamonOehlman/bde) (Browserify Development Environment)

Both tools aim to make round tripping dev in a browserify environment more pleasant.  I'll be demoing `bde` because I got found there was some things that `browservefy` didn't make easy and `bde` was pretty easy to write.

---

## Using BDE

Install:

```
sudo npm install -g bde
```

Head to your project, and start bde:

```
bde
```

By default, this will start a server on port `8080` but you can start it on a different port by supplying it as the first argument:

```
bde 8090
```

---

## Browserify is Smart

So you should be too.

V2 of Browserify introduced static-analysis of your code, and only includes those parts of an imported package that you have used. 

This should impact how you build your browserify friendly packages.

---

## Package Example

```
- testpackage
|-- index.js (core functionality)
|-- extension1.js
|-- extension2.js
```

In the example structure above, the `index.js` file contains only core functionality for your module and the extension files (`extension1.js` and `extension1.js` include extra stuff).

```js
// just include the extension stuff we need
var ext = require('testpackage/extension1');
```

---

## Concrete Example

__NOTE__: All of this stuff is alpha!

We all know that [Modernizr](http://modernizr.com/) is awesome, and while it does offer customized builds I find the process clunky.  So I started having a go at writing an [alternative](https://github.com/DamonOehlman/feature):

```js
var transform = require('feature/css/transform');

// check if transforms are available
if (transform) {
    // if they are you can use the transform return value (which is in fact a function)
    // to get the value and modify the transform value
    transform(testElement, 'scale(2.0, 2.0)');
}
```

Even though the `feature` package contains lots of other stuff (well will eventually), you only pay for what you use.

---

## Browserify supports UMD

Since V2, Browserify has become more modular and less opinionated.  Writing your libraries using the "Browserify approach" does not stop it being used in other environments.

Build your library with the `--standalone` option to package a UMDjs compatible build:

```
browserify index.js --standalone blah > blah.js
```

--- 

## Understanding Browserify Transforms

V2 introduced the concept of transforms.  The transform pipeline gives developers the opportunity to integrate other languages (and general coolness) into their build process.

### Examples

- coffeeify
- brfs
- stylify

---

## Browserify Isn't Perfect

There are definitely limitations within browserify, but for the most part it's great.  One thing that I often try is to specify a _dynamic_ include.  Consider the following example (which is something I was trying to do in decker):

```js
function useTheme(theme) {
    require ('./themes/' + theme);
}

useTheme('default');
```

---

## An Example Project

A good example of most of the things I've talked about is the project running this slide deck:

<https://github.com/DamonOehlman/decker>

Makes use of:

- [brfs](https://github.com/substack/brfs)
- [insert-css](https://github.com/substack/insert-css)
- [stylify](https://github.com/DamonOehlman/stylify)

Use [bde](https://github.com/DamonOehlman/bde) if you want to play around and get quick feedback.

---

# Questions?

