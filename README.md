# prl.github.io

Website of the Phenomena Replication Laboratory (PRL), served by GitHub Pages at
[phenomenareplicationlab.ca](https://phenomenareplicationlab.ca).

Plain static HTML/CSS/JS, no build step.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Layout

- `index.html`: landing page with the list of journal posts
- `journal/`: one HTML file per post; start new posts from `journal/template.html`
- `assets/css/main.css`, `assets/js/main.js`: shared styles and behaviour
- `sitemap.xml`: add each new post here

After changing `main.css` or `main.js`, bump the `?v=` number where every page
links them so visitors don't get a cached copy.

## Credits

Based on [Dimension](https://html5up.net/dimension) by HTML5 UP, used under the
CC BY 3.0 license (see `LICENSE.txt`). Icons by Font Awesome; uses jQuery.
