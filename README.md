# websites

Static sites in this repository. Each one publishes to GitHub Pages automatically.

## How it works

- The site at the **repo root** (`index.html`, `styles.css`, `assets/`) publishes to:
  `https://mzubairhassan18.github.io/websites/`
- Any subfolder under **`sites/<name>/`** that contains an `index.html` publishes to:
  `https://mzubairhassan18.github.io/websites/<name>/`

Every deploy rebuilds automatically via `.github/workflows/deploy.yml` and pushes a single
Pages artifact, so nothing needs to be enabled per site beyond the repo-level Pages setting.

## Sites

| Site | Folder | Live URL |
| --- | --- | --- |
| Mr Mechanic — Texas City, TX | `sites/mrmechanic/` | https://mzubairhassan18.github.io/websites/mrmechanic/ |

## Adding a new site

1. Create `sites/<new-site-name>/` with an `index.html` inside it.
2. Use **relative** asset paths only (`assets/...` or `./assets/...`), never root-absolute
   (`/assets/...`), so files resolve under the `/websites/<name>/` sub-path.
3. Commit and push to `main`. The workflow picks it up and republishes.

## Deploying

```bash
git add -A
git commit -m "Update site"
git push origin main
```

Pages builds run from the `github-pages` environment. To deploy manually, run the
**Deploy sites to GitHub Pages** workflow from the Actions tab (`workflow_dispatch`).
