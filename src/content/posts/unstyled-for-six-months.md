---
title: My site was unstyled for six months because of one line
description: A custom domain, a stale baseURL, and the mixed-content rule that quietly blocked my CSS.
date: 2026-11-25
tags: [web, guide]
draft: true
---

In May I pointed `jalenchen.me` at my GitHub Pages site. Some time after that, the site lost its theme: no terminal look, just default serif text and blue links. Nothing in the repo had changed, so it took a while to see why.

## What was actually wrong

My Hugo config still had the old address:

```toml
baseurl = "https://jalenchen0.github.io/"
```

Hugo uses that value to build absolute URLs, so every stylesheet link on every page pointed at `https://jalenchen0.github.io/...`.

Once a custom domain is set, GitHub Pages redirects the `github.io` address to it. Mine redirected to **`http://`**`jalenchen.me`, because HTTPS wasn't being enforced. So when someone opened the site over HTTPS, the chain for each stylesheet went:

1. The page loads securely from `https://jalenchen.me`.
2. It asks for CSS at `https://jalenchen0.github.io/...`.
3. GitHub redirects that request to an insecure `http://` address.
4. The browser refuses to load insecure CSS into a secure page (mixed content), so the page renders unstyled.

There's no error on the page itself. The only place it shows up is the browser console.

## The fix

- Point the site at the real domain: `baseURL = "https://jalenchen.me/"`.
- Link stylesheets with relative paths (`relURL` instead of `absURL`), so a domain change can't break them again.
- Keep a `CNAME` file in the site's source, so every build carries the custom domain with it.
- Turn on **Enforce HTTPS** in the repository's Pages settings, so nothing redirects to `http://`.

## What I'd tell myself in May

- After changing anything about a domain, open the site over `https://` and check the console.
- Don't hard-code a domain you might change. Relative links survive moves.
- A setting you change in a web UI (like adding a custom domain) can commit files to your repo. Pull before you build.
