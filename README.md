# ClearMechanic — DMS Integration Guide

An interactive guide in 3 languages (ES / EN / PT-BR) for integrating DMSs with ClearMechanic.
All the content lives in **one file**: [`apps-script/Content.gs`](apps-script/Content.gs).

The same code is published two ways:

| Target | URL | When to use it |
|---|---|---|
| **Cloudflare Pages** (main) | `https://integrationdocs.clearmechanic.com` | Public site with our own domain. Every push to `main` publishes. |
| Google Apps Script (optional) | `https://script.google.com/macros/s/.../exec` | To embed in Google Sites. Has automatic translation for missing text. |

## Structure

```
apps-script/
  Content.gs        ← ALL the content (texts T('es','en','pt'), endpoints, flows, checklist)
  Code.gs           ← Apps Script server + shared logic (markup, translation)
  index.html        ← HTML shell
  brand.html        ← ClearMechanic logo (embedded CM isotype)
  styles.html       ← styles (ClearMechanic design system tokens)
  app.html          ← client: navigation, diagrams, explorer, checklist
  appsscript.json   ← Apps Script manifest
tools/build.js      ← generates the static site in dist/ (validates content)
package.json        ← npm run build / npm run serve
```

## Edit content

1. Edit `apps-script/Content.gs`. Each text is `T('español', 'english', 'português')`.
   Markup: `` `code` ``, `**bold**`, `[text](https://url)`, `[text](#section)`.
2. Update `meta.version`, `meta.updated` and add an entry to `meta.changelog`.
3. Check it locally:
   ```bash
   npm run serve
   ```
   Open `http://localhost:8765/#/es/appointments` (format `#/<lang>/<section>`).
4. Commit + push to a branch → open a PR → Cloudflare creates a **preview URL** for review.
5. Merge to `main` → published to production within about 1 minute.

> On the static site there is no automatic translation: if `en`/`pt` is missing, the text shows in Spanish.
> The build warns how many texts are missing a translation.

Shareable URLs: `https://integrationdocs.clearmechanic.com/#/pt/orders`
Sections: `overview, onboarding, auth, catalogs, appointments, orders, quotes, crm, planner, errors, reference, checklist, support`.

---

## Initial setup (one time)

### 1. GitHub repository

```bash
cd dms-guide-site
git init -b main
git add .
git commit -m "DMS integration guide v2.0"
git remote add origin git@github.com:<org>/dms-integration-guide.git
git push -u origin main
```

It can be a **private** repo (Cloudflare Pages supports it at no cost).

### 2. Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Authorize GitHub and choose the repo.
3. Build configuration:
   | Field | Value |
   |---|---|
   | Production branch | `main` |
   | Framework preset | `None` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | `/` (or `dms-guide-site` if the repo contains more things) |
4. **Save and Deploy** → you get a URL like `https://dms-integration-guide.pages.dev`.

### 3. Custom domain

1. In the Pages project → **Custom domains → Set up a custom domain**.
2. Enter `integrationdocs.clearmechanic.com` → **Activate domain**.
3. Since `clearmechanic.com` is already on Cloudflare, the `CNAME` record and SSL certificate are created automatically (a few minutes).

### 4. Search engine indexing

The site is published with `noindex` by default (it doesn't appear on Google).
To allow indexing: Pages → **Settings → Environment variables** → `ALLOW_INDEXING = true` (Production) and redeploy.

### 5. (Optional) Restrict access with Cloudflare Access

If the guide should only be visible to DMSs in onboarding:

1. **Zero Trust → Access → Applications → Add an application → Self-hosted**.
2. Domain: `integrationdocs.clearmechanic.com`.
3. Policy *Allow* with, for example:
   - *Emails ending in* `@clearmechanic.com` (internal team), and/or
   - *Emails* of each DMS's contacts (they receive a one-time code by email).
4. Free up to 50 users. The site needs no changes.

> Also protect the `*.pages.dev` URL: Pages → Settings → **Enable access policy** for previews.

---

## Google Apps Script (optional, for Google Sites)

1. In script.google.com create the files `Code.gs`, `Content.gs`, `index.html`, `brand.html`, `styles.html`, `app.html` with the contents of `apps-script/` and paste in `appsscript.json` (Project Settings → show manifest).
2. **Deploy → New deployment → Web app** · Execute as: *Me* · Access: *Anyone*.
3. To update: **Manage deployments → ✏️ → New version** (don't create a new deployment, or the URL changes).
4. In Google Sites: Insert → Embed → `/exec` URL (`?lang=pt&page=orders` optional).
   You can also embed `https://integrationdocs.clearmechanic.com` directly.

With [`clasp`](https://github.com/google/clasp) you can push from the repo: `clasp push && clasp deploy -i <deploymentId>`.

Maintenance utilities (run in the Apps Script editor):
- `listMissingTranslations()` — lists texts without a manual translation.
- `clearTranslationCache()` — clears the automatic-translation cache.
