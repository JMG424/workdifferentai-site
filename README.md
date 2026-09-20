# Work Different AI

Static marketing site for **Jason Galoob** / Work Different AI.

A sparse consulting landing — human genius first, AI as leverage. Not a product page.

## Public site

- `index.html` / `styles.css` — campaign landing
- `fonts/` — self-hosted EB Garamond (lockup) and Source Sans 3 (body)
- `assets/genius/` — public-domain stills, treated as a quiet B&W strip (no captions)
- `404.html`, `robots.txt`, `sitemap.xml`, `CNAME`, `.nojekyll`

Primary contact: [jason@meta57.xyz](mailto:jason@meta57.xyz) — on the page as “A conversation →”

## Not on the homepage

`board.html`, `demo.html`, and `media/` are leftover Deal Machines pages. They are unlinked from the public landing and disallowed in `robots.txt`.

## Hosting

Static site for GitHub Pages (`main` / root) or Netlify. Custom domain: [workdifferentai.com](https://workdifferentai.com/).

## Local preview

```bash
python3 -m http.server 4173
```

Open http://127.0.0.1:4173/
