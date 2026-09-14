# Portfolio

An Apple-inspired portfolio for [github.com/jrlabanza](https://github.com/jrlabanza), published at
**https://jrlabanza.github.io/portfolio/**.

Plain HTML, CSS and JavaScript. No build step, no framework, no dependencies.

## How it works

- `index.html`, `css/style.css`, `js/main.js` – the page and its rendering logic.
- `js/content.js` – the curated copy: featured tiles, focus lanes, stack, timeline blurbs and
  fallback descriptions. Edit this file to change what the page says.
- `js/data.js` – generated. Profile, repositories, stars, dates and per-repository languages
  from the GitHub API.
- `scripts/fetch-data.mjs` – regenerates `js/data.js` (Node 18+, no packages).
- `js/work.js` – projects from the private `parallaxx-git` account, shown in the "Built at Parallaxx"
  section. The deploy workflow cannot see private repositories, so this file is committed as-is;
  refresh it with `scripts/fetch-work.mjs --owner parallaxx-git` while signed in to the GitHub CLI
  with an account that can see those repositories, then commit the result. Which of them appear as
  cards, which are excluded, and their summaries live under `work` in `js/content.js`.
- `.github/workflows/deploy.yml` – on every push to `main`, every Monday, or on demand, it
  refreshes the data with the repository's built-in token and deploys the site to GitHub Pages.

## Working locally

```bash
node scripts/fetch-data.mjs          # optional: refresh js/data.js (set GITHUB_TOKEN to avoid rate limits)
npx serve .                          # or any static file server, then open http://localhost:3000
```

## Featuring a project

Add an entry to `featured` in `js/content.js` with the repository name, a title, a tagline, a
short body and a `visual` key (`studio`, `bracket`, `trivia`, `prompt`, `lora`, or leave it out
for a plain tile). Stars, language and last-updated date fill in automatically.
