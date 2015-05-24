# Textshot

A simple way to quote articles and share them on Twitter. Visit it at [textshot.co](http://www.textshot.co). Inspired by [Instapaper](https://medium.com/making-instapaper/instapaper-tweet-shots-5df8587988e8), [Medium](https://medium.com/the-story/text-shots-3f82f2536cc), and [OneShot](http://oneshot.link/).

## How it works

The textshot (image) is generated in the browser using `canvas`. The `canvas` data is passed through a small [Sinatra](http://www.sinatrarb.com/) app, which authenticates the user on Twitter (with [OmniAuth Twitter](https://github.com/arunagw/omniauth-twitter)) then posts the tweet (with the [Twitter gem](https://github.com/sferik/twitter)). The bookmarklet works by adding an `iframe` to the top of an article page—or opening a new window for pages hosted over https—which fills in the textshot based on the user's text selection and the article's metadata.

## Installation notes

Requires Ruby. You must also create an [app on Twitter](http://apps.twitter.com) and set the `CONSUMER_KEY` and `CONSUMER_SECRET` environment variables. You must also set a `SESSION_SECRET` variable for Rack. I always prefer to use [Sass](http://sass-lang.com/) (with the Sass gem), which is enabled in `config.ru`. In development, launch with `rackup`.

## Contact

Textshot is certainly not perfect. Please let me know ([@magicofpi](https://twitter.com/magicofpi), ryan@ryancatalani.com) if you identify problems or have suggestions.

## License

The MIT License (MIT)

Copyright (c) 2015 Ryan Catalani

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.