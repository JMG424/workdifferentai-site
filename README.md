# Work Different AI

Static professional site for **Jason Galoob** / Work Different AI.

Jason helps small businesses and operators run AI agents and multi-agent systems that actually ship — evaluation, SOPs, QA gates, written clarity, and remote ops.

## Public site

- `index.html` — consulting landing page (hero, services, approach, about, contact)
- `styles.css` / `script.js` — page styles and a mailto draft form (no backend)
- `assets/` — favicon and Open Graph image
- `fonts/` — self-hosted Fraunces and JetBrains Mono
- `404.html`, `robots.txt`, `sitemap.xml`, `CNAME`, `.nojekyll`

Primary contact: [jason@meta57.xyz](mailto:jason@meta57.xyz)  
LinkedIn: [jasonmichaelgaloob](https://www.linkedin.com/in/jasonmichaelgaloob)

There is no Calendly (or other booking) URL in this repo. The homepage CTA is email.

## Not on the homepage

`board.html`, `demo.html`, and `media/` are leftover Deal Machines pages. They are unlinked from the public landing, disallowed in `robots.txt`, and should not be treated as the product.

## Hosting

This is a static GitHub Pages site (`main` branch, root).

- GitHub Pages URL: https://jmg424.github.io/workdifferentai-site/
- Custom domain target: https://workdifferentai.com/

`CNAME` is set to `workdifferentai.com`. `.nojekyll` skips Jekyll so the HTML/CSS/JS publish as-is.

### If workdifferentai.com still 404s

The domain currently sits behind Cloudflare and returns 404. GitHub Pages is enabled, but the latest Pages build has been in an error state and no custom domain is attached in the Pages API.

To finish DNS / Pages:

1. In the repo: **Settings → Pages** — source `main` / `/` (root), custom domain `workdifferentai.com`, enforce HTTPS once DNS is green.
2. At the DNS host (Cloudflare today):
   - Apex `A` records to GitHub Pages: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Optional `www` `CNAME` to `jmg424.github.io`
   - For GitHub Pages, keep Cloudflare orange-cloud proxy off (DNS only) unless you have already set that up correctly
3. Wait for GitHub’s DNS check, then HTTPS provisioning.

Until that is done, the live preview is the `github.io` URL above (after this branch is merged and Pages rebuilds).

## Local preview

```bash
python3 -m http.server 4173
```

Open http://127.0.0.1:4173/
