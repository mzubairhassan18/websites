# websites

Static sites in this repository. Each one publishes to GitHub Pages automatically.

## How it works

- Any subfolder under **`sites/<name>/`** that contains an `index.html` publishes to:
  `https://mzubairhassan18.github.io/websites/<name>/`
- A site placed at the **repo root** (`index.html`, `styles.css`, `assets/`) publishes to:
  `https://mzubairhassan18.github.io/websites/`
  If there is no root site, that URL serves a small generated index of the sites instead.

Two pieces cooperate:

1. **`.github/workflows/deploy.yml`** assembles every site into `_site/` and force-pushes it
   to the `gh-pages` branch (on every push to `main`, or manually via *Run workflow*).
2. **GitHub Pages** serves that branch: *Settings → Pages → Build and deployment →
   Source: Deploy from a branch → Branch: `gh-pages` / root*.

Publishing to a **public** repository's standard runners is free, and GitHub Pages itself is
free — no billing plan required.

## Sites

| Site | Folder | Live URL |
| --- | --- | --- |
| Mr Mechanic — Texas City, TX | `sites/mrmechanic/` | https://mzubairhassan18.github.io/websites/mrmechanic/ |

## Adding a new site

1. Create `sites/<new-site-name>/` with an `index.html` inside it.
2. Use **relative** asset paths only (`assets/...` or `./assets/...`), never root-absolute
   (`/assets/...`), so files resolve under the `/websites/<name>/` sub-path.
3. Commit and push to `main`. The workflow republishes `gh-pages`, and Pages redeploys.

### Keeping `gh-pages` in sync

Pushing to `main` regenerates `gh-pages` automatically. If you ever need to publish by hand
(e.g. while Actions is unavailable), build the site locally and force-push `_site/` to
`gh-pages`:

```bash
# assemble _site/ (same steps the workflow runs), then:
git checkout --orphan gh-pages && git rm -rq --cached .
# copy _site/* into the repo root, then:
git add -A && git commit -m "Publish sites"
git push --force origin gh-pages
```

After any publish, GitHub Pages rebuilds on its own. Trigger it manually if needed:

```bash
gh api -X POST repos/<owner>/websites/pages/builds
```

## Repository docs

`sites/<name>/RESEARCH.md` holds research and design notes. It is committed to git but
excluded from the published site.
