import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = join(repositoryRoot, 'docs', '.vitepress', 'dist');
const siteUrl = 'https://amirtaherkhani.github.io/nestjs-skills';
const siteBasePath = '/nestjs-skills';

async function readBuiltPage(route) {
  const file = join(distRoot, route);
  return { file, html: await readFile(file, 'utf8') };
}

function getMetaContent(html, attribute, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = html.match(new RegExp(`<meta\\s+${attribute}="${escapedName}"\\s+content="([^"]*)"`));
  assert.ok(match, `built page should include meta ${attribute}=${name}`);
  return match[1];
}

function decodeHtmlAttribute(value) {
  return value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
}

async function assertLocalLinksResolve(route, html) {
  const hrefs = [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map((match) => decodeHtmlAttribute(match[1]));
  const sourceRoute = route.replace(/index\.html$/, '').replace(/\.html$/, '');
  const pageUrl = `${siteUrl}/${sourceRoute}`;

  for (const href of hrefs) {
    if (/^(?:https?:|mailto:|tel:|#|javascript:|data:|\/\/)/i.test(href)) continue;

    const url = new URL(href, pageUrl);
    if (url.origin !== new URL(siteUrl).origin) continue;
    assert.ok(url.pathname === siteBasePath || url.pathname.startsWith(`${siteBasePath}/`), `${route} link should stay inside the site base: ${href}`);

    const pagePath = url.pathname.slice(siteBasePath.length).replace(/^\//, '');
    const candidates = pagePath.endsWith('.html')
      ? [join(distRoot, pagePath)]
      : pagePath.endsWith('/')
        ? [join(distRoot, pagePath, 'index.html')]
        : [join(distRoot, `${pagePath}.html`), join(distRoot, pagePath, 'index.html')];

    let resolved = false;
    for (const candidate of candidates) {
      try {
        await access(candidate, constants.R_OK);
        resolved = true;
        break;
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }
    assert.ok(resolved, `${route} has a broken internal link: ${href}`);
  }
}

const pages = [
  { route: 'index.html', canonical: `${siteUrl}/`, lang: 'en-US', title: 'NestJS Skills', languageTarget: `${siteBasePath}/fa/` },
  { route: 'guide/getting-started.html', canonical: `${siteUrl}/guide/getting-started`, lang: 'en-US', title: 'Getting Started', languageTarget: `${siteBasePath}/fa/guide/getting-started` },
  { route: 'fa/index.html', canonical: `${siteUrl}/fa/`, lang: 'fa-IR', title: 'مهارت‌های NestJS', languageTarget: `${siteBasePath}/` },
  { route: 'fa/guide/getting-started.html', canonical: `${siteUrl}/fa/guide/getting-started`, lang: 'fa-IR', title: 'شروع به کار', languageTarget: `${siteBasePath}/guide/getting-started` }
];

const builtPages = new Map();
for (const page of pages) {
  const built = await readBuiltPage(page.route);
  builtPages.set(page.route, built.html);
  assert.match(built.html, new RegExp(`<html\\b[^>]*lang="${page.lang}"`), `${page.route} should render its locale language`);
  assert.equal((built.html.match(/rel="canonical"/g) ?? []).length, 1, `${page.route} should have exactly one canonical URL`);
  assert.match(built.html, new RegExp(`<link rel="canonical" href="${page.canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
  assert.equal(getMetaContent(built.html, 'property', 'og:url'), page.canonical, `${page.route} should have a route-specific Open Graph URL`);
  assert.equal(getMetaContent(built.html, 'property', 'og:title'), page.title, `${page.route} should have a localized Open Graph title`);
  assert.equal(getMetaContent(built.html, 'name', 'twitter:title'), page.title, `${page.route} should have a localized social title`);
  assert.ok(getMetaContent(built.html, 'name', 'twitter:description').length > 20, `${page.route} should have a useful social description`);
  const languageLink = built.html.match(/<a class="[^"]*locale-switcher[^"]*" href="([^"]+)" aria-label="Switch to (?:Persian|English) documentation"/);
  assert.ok(languageLink, `${page.route} should render a language switcher`);
  assert.equal(languageLink[1], page.languageTarget, `${page.route} should switch to its translated page`);
  await assertLocalLinksResolve(page.route, built.html);
}

for (const [englishRoute, persianRoute] of [
  ['index.html', 'fa/index.html'],
  ['guide/getting-started.html', 'fa/guide/getting-started.html']
]) {
  for (const route of [englishRoute, persianRoute]) {
    const html = builtPages.get(route);
    assert.match(html, /<link rel="alternate" hreflang="en" href="https:\/\/amirtaherkhani\.github\.io\/nestjs-skills\//, `${route} should link to its English translation`);
    assert.match(html, /<link rel="alternate" hreflang="fa" href="https:\/\/amirtaherkhani\.github\.io\/nestjs-skills\/fa\//, `${route} should link to its Persian translation`);
    assert.match(html, /فارسی/, `${route} should expose the language switcher`);
  }
}

assert.match(builtPages.get('fa/index.html'), /<html\b[^>]*dir="rtl"/, 'Persian homepage should render right-to-left');
assert.match(builtPages.get('fa/guide/getting-started.html'), /<html\b[^>]*dir="rtl"/, 'Persian guide should render right-to-left');
assert.match(builtPages.get('fa/index.html'), /aria-label="جستجوی مستندات"/, 'Persian homepage search controls should be localized');
assert.match(builtPages.get('fa/index.html'), /حالت نمایش/, 'Persian appearance controls should be localized');
const customCss = await readFile(join(repositoryRoot, 'docs', '.vitepress', 'theme', 'custom.css'), 'utf8');
assert.match(customCss, /html\[dir='rtl'\] \.vp-doc :not\(pre\) > code\s*\{\s*direction:\s*ltr;\s*white-space:\s*normal;\s*overflow-wrap:\s*anywhere;\s*unicode-bidi:\s*isolate;/, 'inline technical code should remain left-to-right and wrap in Persian text');
assert.match(customCss, /html\[dir='rtl'\] \.VPContent\s*\{\s*overflow-x:\s*clip;/, 'Persian document content should not create page-level horizontal scrolling');
assert.match(customCss, /html\[dir='rtl'\] \.vp-doc div\[class\*='language-'\]\s*\{\s*direction:\s*ltr;\s*text-align:\s*left;\s*unicode-bidi:\s*isolate;/, 'Persian guide code blocks should remain left-to-right');

const sitemap = await readFile(join(distRoot, 'sitemap.xml'), 'utf8');
assert.match(sitemap, /xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/, 'sitemap should declare the xhtml namespace');
for (const pair of [
  [`${siteUrl}/`, `${siteUrl}/fa/`],
  [`${siteUrl}/guide/getting-started`, `${siteUrl}/fa/guide/getting-started`]
]) {
  for (const url of pair) {
    const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const entry = sitemap.match(new RegExp(`<url><loc>${escapedUrl}<\\/loc>([\\s\\S]*?)<\\/url>`))?.[1];
    assert.ok(entry, `sitemap should include ${url}`);
    assert.match(entry, /<xhtml:link rel="alternate" hreflang="en"/);
    assert.match(entry, /<xhtml:link rel="alternate" hreflang="fa"/);
  }
}

const untranslatedEntry = sitemap.match(/<url><loc>https:\/\/amirtaherkhani\.github\.io\/nestjs-skills\/concepts\/request-lifecycle<\/loc>([\s\S]*?)<\/url>/)?.[1];
assert.ok(untranslatedEntry, 'sitemap should retain the English concepts page');
assert.doesNotMatch(untranslatedEntry, /xhtml:link/, 'untranslated routes should not advertise a Persian alternate');
const untranslatedPage = await readBuiltPage('concepts/request-lifecycle.html');
assert.match(untranslatedPage.html, /href="\/nestjs-skills\/fa\/" aria-label="Switch to Persian documentation"/, 'untranslated English pages should switch to the Persian landing page rather than a missing route');

const robots = await readFile(join(distRoot, 'robots.txt'), 'utf8');
assert.match(robots, /^User-agent: \*\s+Allow: \/\s+Sitemap: https:\/\/amirtaherkhani\.github\.io\/nestjs-skills\/sitemap\.xml\s*$/);

console.log(`Verified ${pages.length} localized page builds, canonical/social metadata, reciprocal hreflang, sitemap alternates, robots.txt, and internal links.`);
