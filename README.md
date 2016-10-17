# Flash cards js

An example: [Learn Japanese kana](https://nanvel.github.io/kanalearn/)

## Setup

### Use the template

There is a template available: [https://github.com/nanvel/flashcards](https://github.com/nanvel/flashcards), just clone and set a questions list.

### Compile

```bash
git clone https://github.com/nanvel/flashcardsjs.git
cd flashcardsjs
npm install
webpack
npm run-script server
open http://localhost:8000
```

Optimize:
```bash
webpack -p --progress
```

Create a new repository.

Copy `build/app.bundle.js` -> new repository root.

Copy `build/index.html` -> new repository root.

Add questions csv to the `questions` div:
```html
<div id="questions">
question1,answer1[,set1]
...
<div>
```
or set a csv file url to the `questions` div `data-url` attribute:
```html
<div id="questions" data-url="questions.csv"></div>
```

Customize `index.html`: title, favicon, ....

Create a new branch `gh-pages`, push.

```bash
open https://<username>.github.io/<repository_name>/
```

## Links

[Spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition) on Wikipedia
