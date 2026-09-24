# Davenport Books website

A single-page website for **Davenport Books**, a Davenport Labs company.
Built with plain HTML, CSS, and JavaScript. No frameworks, no build step, no
external files to download.

```
davenport-books/
├── index.html          <- all the page content (text, sections, forms)
├── css/
│   └── style.css       <- all the styling (colors, fonts, layout)
├── js/
│   └── script.js       <- menu, animations, contact form behaviour
├── assets/
│   ├── images/         <- photos, covers, mockups, portfolio images
│   │   └── team/       <- team member photos
│   ├── logos/          <- Davenport Books + Davenport Labs logos
│   └── icons/          <- favicon and any icon files
└── README.md           <- this file
```

---

## 1. Open the website locally

1. Open the `davenport-books` folder in **Zed** (File > Open Folder).
2. Double-click `index.html` in your file manager. It opens in your browser.
3. Edit a file in Zed, save it, then refresh the browser tab to see the change.

No server or installation is needed.

---

## 2. Where do my logos go?

Save them in **`assets/logos/`**, for example:

- `davenport-books-logo.svg`
- `davenport-labs-logo.svg`

Then in `index.html`, search for **`LOGO PLACEHOLDER`**. There are two places:

- **Header** (top of the page): delete the two `<span>` tags inside
  `<a class="brand">` and use
  `<img src="assets/logos/davenport-books-logo.svg" alt="Davenport Books" height="40">`
- **About section**: inside each `.placeholder-box`, delete the label text and
  the yellow badge, then add an `<img>` pointing to the logo file.

SVG logos stay sharp at any size. If you use PNG, export at twice the display
size with a transparent background.

---

## 3. Where do my images go?

Save them in **`assets/images/`**.

- **Hero artwork**: search `index.html` for `HERO ARTWORK PLACEHOLDER` and
  follow the steps in that comment.
- **Portfolio items**: search for `7. PORTFOLIO`. The comment shows how to
  replace a placeholder box with an `<img>`.
- **Social sharing image**: see the Open Graph comment near the top of
  `index.html`.

Always fill in the `alt="..."` text with a short description of the image.
Keep images small (under about 300 KB) so the site stays fast.

---

## 4. Where do I change the colors?

Open **`css/style.css`** and look at the very top, under
`1. DESIGN TOKENS`. Change the values inside `:root { ... }`:

| Variable | Used for |
| --- | --- |
| `--color-primary` | buttons, links, key accents |
| `--color-primary-dark` | button hover color |
| `--color-secondary` | deep navy: headings, dark sections, footer |
| `--color-accent` | yellow: process numbers and **Placeholder** badges |
| `--color-text` / `--color-text-muted` | body text |
| `--color-bg` / `--color-surface` / `--color-tint` | page and card backgrounds |

The same section also holds the fonts (`--font-heading`, `--font-body`),
spacing (`--space-*`), and rounded corners (`--radius-*`).

Tip: after changing colors, check that text is still easy to read against its
background (aim for good contrast, especially white text on your primary color).

### Change the fonts

The site uses fonts already installed on the visitor's device, so nothing is
downloaded. To use a Google Font instead, add its `<link>` tag inside the
`<head>` of `index.html` (Google Fonts gives you the exact code), then put the
font name at the start of `--font-heading` or `--font-body`. This adds an
external request, so only do it if you really want a specific font.

---

## 5. Where do I change the services?

Open `index.html` and search for **`3. SERVICES`**. Each service is one block:

```html
<article class="service-card">
  <div class="service-icon"> ...icon... </div>
  <h4 class="service-title">Service name</h4>
  <p class="service-text">Short explanation.</p>
  <p class="service-price">Pricing: on request</p>
  <a class="service-link" href="#contact" data-service="Service name">Link text</a>
</article>
```

- **Change a name or description:** edit the text.
- **Change a price:** edit the `service-price` line (for example `From $150`).
  To hide prices, delete those lines.
- **Add a service:** copy a whole `<article>` block into the same group.
- **Remove a service:** delete its `<article>` block.
- Keep `data-service="..."` identical to the matching `<option>` in the contact
  form (search for `cf-service`) so clicking the card pre-selects it.
- Icons are inline SVG. You can swap one for an `<img>` from `assets/icons/`.

The same file also has the tagline, the process steps, the FAQ, the
testimonials, and the portfolio items. Each is marked with a comment box.

---

## 6. Where do I change the contact information?

The email address appears in **two files**. Search for it and update every
match:

1. `index.html`, section **10. CONTACT**: the `href="mailto:..."` and the
   visible link text (two matches on the same line).
2. `js/script.js`, `FORM_CONFIG.email` at the top of the file.

No phone number, address, or social media links are included. When you have
them, add them in the contact section, and in the footer (there is a commented
example under `SOCIAL LINKS`).

---

## 7. How do I add more pages later?

1. In the folder, copy `index.html` and rename the copy, for example
   `services.html`.
2. In the copy, keep the `<head>`, header, and footer, and replace the content
   inside `<main>` with the new page's content.
3. Change the `<title>` and `<meta name="description">` so each page has its
   own.
4. Link to it. From `index.html`, add `<li><a href="services.html">...</a></li>`
   to the menu. On the new page, menu links to sections of the home page must
   include the file name: `index.html#contact` instead of `#contact`.
5. Both pages share `css/style.css` and `js/script.js`, so they look and behave
   the same. The script safely ignores parts a page doesn't have.

When the site grows, you can split `style.css` into several files (for example
`css/base.css`, `css/components.css`) and link each one in `<head>`.

---

## 8. Connect the contact form

The form is handled in **`js/script.js`**, in the `FORM_CONFIG` block at the
top. It has three modes:

| `mode` | What happens |
| --- | --- |
| `"mailto"` (default) | Opens the visitor's email app with the message pre-written, addressed to your email. Works immediately, but only if the visitor has an email app set up. |
| `"endpoint"` | Sends the form to an online form service. Best for a live site. |
| `"demo"` | Sends nothing and says the form isn't connected. |

To send messages to your inbox through a form service:

1. Sign up with a form service such as **Formspree** or **Web3Forms** (they
   have free tiers; check their current terms).
2. Create a form there and copy the URL they give you.
3. In `js/script.js`, set:
   ```js
   const FORM_CONFIG = {
     mode: "endpoint",
     email: "jeffrey.davenport.000@gmail.com",
     subject: "New enquiry from the Davenport Books website",
     endpoint: "https://the-url-your-service-gave-you"
   };
   ```
4. Test it. Some services only accept submissions from the website address you
   registered, so test again once the site is online.

The form fields are named `name`, `email`, `service`, and `message`. Use those
names if your form service asks which fields to expect. Other options include
EmailJS, Netlify Forms (if you host on Netlify), or your own server code.

---

## Add or edit team members

Open `index.html` and search for **`6b. TEAM`**. Each person is one block:

```html
<article class="team-card">
  <div class="team-photo"> ...photo or placeholder... </div>
  <div class="team-info">
    <h3 class="team-name">Name</h3>
    <p class="team-role">Role / title</p>
    <p class="team-bio">Short bio</p>
    <!-- optional <ul class="team-links"> block -->
  </div>
</article>
```

- **Add a person:** copy a whole `<article> ... </article>` block and paste it
  after the last one, inside `<div class="team-grid">`. Then edit the text.
  The layout adjusts by itself (one person = one wide card, two or more = a grid).
- **Photo:** save it in `assets/images/team/` and follow the `PHOTO PLACEHOLDER`
  comment inside the card. Square photos work best.
- **Links (optional):** remove the comment markers around the `team-links`
  block in a card and put in real addresses. Leave the block out if there
  are no links.
- **Remove a person:** delete their `<article>` block.
- The menu link for this section is `<a href="#team">Team</a>` in the header
  and footer menus.

---

## Placeholders: what to replace before going live

Every **yellow "Placeholder" badge** marks content that is not real yet.
Before publishing, replace or remove:

- [ ] Hero artwork placeholder
- [ ] Logo placeholders (header, About section)
- [ ] Founder / company information (About section)
- [ ] Team photo and bio (Team section)
- [ ] Portfolio items (only show work you are allowed to show)
- [ ] Testimonials (only publish real quotes you have permission to use) and the yellow notice above them
- [ ] Prices (`Pricing: on request`)
- [ ] Favicon (`assets/icons/favicon.svg`)
- [ ] Open Graph web address and image (`<head>` of `index.html`)

The copy avoids guarantees (sales, reviews, rankings). Keep it that way when
you edit.

---

## Quick edit map

| I want to change... | Go to |
| --- | --- |
| Company name / tagline | `index.html` (search "Davenport Books", "We Do Things") |
| Hero headline | `index.html`, `2. HERO` |
| Services and prices | `index.html`, `3. SERVICES` |
| Process steps | `index.html`, `5. PROCESS` |
| About text | `index.html`, `6. ABOUT` |
| Team members | `index.html`, `6b. TEAM` |
| Portfolio | `index.html`, `7. PORTFOLIO / WORK` |
| Testimonials | `index.html`, `8. TESTIMONIALS` |
| FAQ | `index.html`, `9. FAQ` |
| Email / contact | `index.html` `10. CONTACT` and `js/script.js` |
| Social links | `index.html`, footer (`SOCIAL LINKS` comment) |
| Colors, fonts, spacing | `css/style.css`, `1. DESIGN TOKENS` |
| Form behaviour | `js/script.js`, `FORM_CONFIG` |
