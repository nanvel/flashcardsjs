# Flash cards js

## Example

[Learn japanese kana](https://nanvel.github.io/kanalearn/)

## Algorithm

Don't ask the same question twice in a row.

Options must be selected from the same questions set.

Repeat asking a small amount of questions until they will be learned (~10).

Ask questions considered learned only if there were a few wrong answers before (to improve mood).

## Setup

```bash
git clone https://github.com/nanvel/flashcardsjs.git
cd flashcardsjs
npm install
webpack
npm run-script server
open http://localhost:8000
```

## Publish on GitHub pages

```bash
webpack -p --progress
```

Create a new repository.

copy:

- `build/app.bundle.js` -> new repository root
- `build/index.html` -> new repository root

Add questions csv to the `questions` div:
```html
<div id="questions">
question1,answer1[,set1]
...
<div>
```
or set a csv file url to `questions` div `data-url` attribute:
```html
<div id="questions" data-url="questions.csv"></div>
```

Customize `index.html`: title, favicon, ....

Create a new branch `gh-pages`, push.

```bash
open https://<name>.github.io/<repository_name>/
```

## Links

[Spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition) on Wikipedia
