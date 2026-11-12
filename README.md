# Work Different AI

Static marketing site for **Jason Galoob** / Work Different AI.

A sparse consulting landing — human genius first, AI as leverage. Not a product page.

## Public site

- `index.html` / `styles.css` / `script.js` — campaign landing with a cycling B&W tribute
- `data-worth/` — “What is your data worth?”, the first action: a browser-only ballpark of what an AI lab might pay to license a company’s data, then a prefilled email to book a conversation. Heuristics live in `data-worth/action.js`.
- `masterclass/` — registration page for the free live self-love masterclass with Kristiana Morell, hosted by Michelle Galoob (Nov 30, 2026). Styled after kristianamorell.com, not this site. Set `REGISTER_ENDPOINT` in `masterclass/masterclass.js` before promoting; the page is `noindex` until then.
- `fonts/` — self-hosted EB Garamond (lockup) and Source Sans 3 (body); Libre Baskerville and DM Sans for the masterclass page
- `assets/genius/` — public-domain stills (Einstein, Picasso, Earhart, Gandhi, Edison)
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
