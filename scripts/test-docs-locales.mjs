import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncDocumentLocale } from '../docs/.vitepress/theme/sync-document-locale.mjs';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = join(repositoryRoot, 'docs', '.vitepress', 'dist');
const siteUrl = 'https://amirtaherkhani.github.io/nestjs-skills';
const siteBasePath = '/nestjs-skills';

const locales = [
  { key: 'root', slug: '', lang: 'en-US', hreflang: 'en', ogLocale: 'en_US', name: 'English', menuLabel: 'Select language', sidebarMenuLabel: 'Menu', homeTitle: 'NestJS Skills', guideTitle: 'Getting Started', homeNav: 'Guide', direction: 'ltr' },
  { key: 'fa', slug: 'fa', lang: 'fa-IR', hreflang: 'fa', ogLocale: 'fa_IR', name: 'فارسی', menuLabel: 'انتخاب زبان', sidebarMenuLabel: 'فهرست', homeTitle: 'مهارت‌های NestJS', guideTitle: 'شروع به کار', homeNav: 'شروع کنید', direction: 'rtl' },
  { key: 'fr', slug: 'fr', lang: 'fr-FR', hreflang: 'fr', ogLocale: 'fr_FR', name: 'Français', menuLabel: 'Choisir la langue', sidebarMenuLabel: 'Menu', homeTitle: 'Compétences NestJS', guideTitle: 'Premiers pas', homeNav: 'Guide', direction: 'ltr' },
  { key: 'zh-CN', slug: 'zh-CN', lang: 'zh-CN', hreflang: 'zh-CN', ogLocale: 'zh_CN', name: '简体中文', menuLabel: '选择语言', sidebarMenuLabel: '菜单', homeTitle: 'NestJS 技能集', guideTitle: '快速开始', homeNav: '指南', direction: 'ltr' },
  { key: 'ja', slug: 'ja', lang: 'ja-JP', hreflang: 'ja', ogLocale: 'ja_JP', name: '日本語', menuLabel: '言語を選択', sidebarMenuLabel: 'メニュー', homeTitle: 'NestJS スキル', guideTitle: 'はじめに', homeNav: 'ガイド', direction: 'ltr' }
];

const translatedPages = [
  { key: 'home', route: (locale) => locale.slug ? `/${locale.slug}/` : '/', title: (locale) => locale.homeTitle, file: (locale) => locale.slug ? `${locale.slug}/index.html` : 'index.html' },
  { key: 'guide', route: (locale) => locale.slug ? `/${locale.slug}/guide/getting-started` : '/guide/getting-started', title: (locale) => locale.guideTitle, file: (locale) => locale.slug ? `${locale.slug}/guide/getting-started.html` : 'guide/getting-started.html' }
];

for (const sequence of [
  [['root', 'en-US', 'ltr'], ['fa', 'fa-IR', 'rtl']],
  [['fa', 'fa-IR', 'rtl'], ['root', 'en-US', 'ltr'], ['fa', 'fa-IR', 'rtl']]
]) {
  const documentElement = { lang: 'en-US', dir: 'ltr' };
  for (const [locale, lang, dir] of sequence) {
    syncDocumentLocale(documentElement, { lang, dir });
    assert.equal(documentElement.lang, lang, `${locale} navigation should update the document language immediately`);
    assert.equal(documentElement.dir, dir, `${locale} navigation should update the document direction immediately`);
  }
}

async function readBuiltPage(route) {
  const file = join(distRoot, route);
  return { file, html: await readFile(file, 'utf8') };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getMetaContent(html, attribute, name) {
  const match = html.match(new RegExp(`<meta\\s+${attribute}="${escapeRegExp(name)}"\\s+content="([^"]*)"`));
  assert.ok(match, `built page should include meta ${attribute}=${name}`);
  return match[1];
}

function decodeHtmlAttribute(value) {
  return value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
}

async function assertLocalLinksResolve(route, html) {
  const hrefs = [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map((match) => decodeHtmlAttribute(match[1]));
  const sourceRoute = route.replace(/index\.html$/, '').replace(/\.html$/, '');
  const pageCanonical = `${siteUrl}/${sourceRoute}`;

  for (const href of hrefs) {
    if (/^(?:https?:|mailto:|tel:|#|javascript:|data:|\/\/)/i.test(href)) continue;

    const url = new URL(href, pageCanonical);
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

const builtPages = new Map();
for (const locale of locales) {
  for (const page of translatedPages) {
    const route = page.route(locale);
    const built = await readBuiltPage(page.file(locale));
    builtPages.set(route, built.html);
    const html = built.html;
    const canonical = `${siteUrl}${route}`;

    assert.match(html, new RegExp(`<html\\b[^>]*lang="${escapeRegExp(locale.lang)}"`), `${route} should render its locale language`);
    assert.match(html, new RegExp(`<html\\b[^>]*dir="${locale.direction}"`), `${route} should render the expected text direction`);
    assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1, `${route} should have exactly one canonical URL`);
    assert.match(html, new RegExp(`<link rel="canonical" href="${escapeRegExp(canonical)}"`));
    assert.equal(getMetaContent(html, 'property', 'og:url'), canonical, `${route} should have a route-specific Open Graph URL`);
    assert.equal(getMetaContent(html, 'property', 'og:locale'), locale.ogLocale, `${route} should have a localized Open Graph locale`);
    assert.equal((html.match(/property="og:image:alt"/g) ?? []).length, 1, `${route} should have one localized Open Graph image description`);
    assert.equal((html.match(/name="twitter:image:alt"/g) ?? []).length, 1, `${route} should have one localized Twitter image description`);
    assert.equal(getMetaContent(html, 'property', 'og:title'), page.title(locale), `${route} should have a localized Open Graph title`);
    assert.equal(getMetaContent(html, 'name', 'twitter:title'), page.title(locale), `${route} should have a localized social title`);
    assert.ok(getMetaContent(html, 'property', 'og:description').length > 20, `${route} should have a useful Open Graph description`);
    assert.ok(getMetaContent(html, 'name', 'twitter:description').length > 20, `${route} should have a useful social description`);
    assert.match(html, new RegExp(`aria-label="${escapeRegExp(locale.menuLabel)}: ${escapeRegExp(locale.name)}"`), `${route} should expose a localized language menu`);
    if (page.key === 'guide') {
      assert.match(html, new RegExp(`<span class="menu-text"[^>]*>${escapeRegExp(locale.sidebarMenuLabel)}</span>`), `${route} should expose a localized sidebar menu control`);
    }
    assert.match(html, new RegExp(`>${escapeRegExp(locale.homeNav)}<`), `${route} should expose localized navigation`);

    for (const targetLocale of locales) {
      const targetRoute = page.route(targetLocale);
      const href = `${siteBasePath}${targetRoute}`;
      assert.match(html, new RegExp(`<a class="locale-switcher-option" href="${escapeRegExp(href)}"`), `${route} should offer ${targetLocale.name} at ${href}`);
    }

    await assertLocalLinksResolve(page.file(locale), html);
  }
}

for (const page of translatedPages) {
  const expectedAlternates = locales.map((locale) => ({ locale, route: page.route(locale) }));
  for (const { locale: pageLocale, route } of expectedAlternates) {
    const html = builtPages.get(route);
    const hreflangs = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];
    assert.equal(hreflangs.length, locales.length, `${route} should declare one reciprocal hreflang for each translated version`);
    for (const { locale, route: alternateRoute } of expectedAlternates) {
      assert.ok(hreflangs.some(([, lang, href]) => lang === locale.hreflang && href === `${siteUrl}${alternateRoute}`), `${route} should link to its ${locale.name} version`);
    }
    assert.ok(html.includes(pageLocale.name), `${route} should expose its current locale label in the switcher`);
  }
}

const rtlGuide = builtPages.get('/fa/guide/getting-started');
assert.match(rtlGuide, /<html\b[^>]*dir="rtl"/, 'Persian guide should render right-to-left');
assert.match(rtlGuide, /aria-label="جستجوی مستندات"/, 'Persian search controls should be localized');
assert.match(builtPages.get('/fa/'), /حالت نمایش/, 'Persian appearance controls should be localized');
for (const [route, ariaLabel] of [
  ['/fr/', 'Rechercher dans la documentation'],
  ['/zh-CN/', '搜索文档'],
  ['/ja/', 'ドキュメントを検索']
]) {
  assert.ok(builtPages.get(route).includes(ariaLabel), `${route} should localize search controls`);
}

const customCss = await readFile(join(repositoryRoot, 'docs', '.vitepress', 'theme', 'custom.css'), 'utf8');
const layoutComponent = await readFile(join(repositoryRoot, 'docs', '.vitepress', 'theme', 'Layout.vue'), 'utf8');
assert.match(customCss, /html\[dir='rtl'\] \.vp-doc :not\(pre\) > code\s*\{\s*direction:\s*ltr;\s*white-space:\s*normal;\s*overflow-wrap:\s*anywhere;\s*unicode-bidi:\s*isolate;/, 'inline technical code should remain left-to-right and wrap in Persian text');
assert.match(customCss, /html\[dir='rtl'\] \.VPContent\s*\{\s*overflow-x:\s*clip;/, 'Persian document content should not create page-level horizontal scrolling');
assert.match(customCss, /html\[dir='rtl'\] \.vp-doc div\[class\*='language-'\]\s*\{\s*direction:\s*ltr;\s*text-align:\s*left;\s*unicode-bidi:\s*isolate;/, 'Persian guide code blocks should remain left-to-right');
assert.match(customCss, /html\[dir='rtl'\] \.VPNavBarExtra \.menu\s*\{\s*inset-inline-start:\s*auto;\s*inset-inline-end:\s*0;/, 'RTL extra-navigation menus should anchor to their left edge to stay within the viewport');
assert.match(layoutComponent, /watchEffect\(\(\) =>\s*\{\s*syncDocumentLocale\(document\.documentElement,\s*\{\s*lang:\s*lang\.value,\s*dir:\s*dir\.value\s*\}\);/, 'document language and direction should follow SPA locale changes reactively');

const sitemap = await readFile(join(distRoot, 'sitemap.xml'), 'utf8');
assert.match(sitemap, /xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/, 'sitemap should declare the xhtml namespace');
for (const page of translatedPages) {
  const pageRoutes = locales.map((locale) => page.route(locale));
  for (const route of pageRoutes) {
    const url = `${siteUrl}${route}`;
    const entry = sitemap.match(new RegExp(`<url><loc>${escapeRegExp(url)}</loc>([\\s\\S]*?)</url>`))?.[1];
    assert.ok(entry, `sitemap should include ${url}`);
    const alternateTags = [...entry.matchAll(/<xhtml:link rel="alternate" hreflang="([^"]+)" href="([^"]+)"\/>/g)];
    assert.equal(alternateTags.length, locales.length, `${url} should include all five sitemap alternates`);
    for (const locale of locales) {
      assert.ok(alternateTags.some(([, lang, href]) => lang === locale.hreflang && href === `${siteUrl}${page.route(locale)}`), `${url} sitemap alternates should include ${locale.name}`);
    }
  }
}

const untranslatedUrl = `${siteUrl}/concepts/request-lifecycle`;
const untranslatedEntry = sitemap.match(new RegExp(`<url><loc>${escapeRegExp(untranslatedUrl)}</loc>([\\s\\S]*?)</url>`))?.[1];
assert.ok(untranslatedEntry, 'sitemap should retain the English concepts page');
assert.doesNotMatch(untranslatedEntry, /xhtml:link/, 'untranslated routes should not advertise translated alternates');
const untranslatedPage = await readBuiltPage('concepts/request-lifecycle.html');
for (const locale of locales) {
  assert.match(untranslatedPage.html, new RegExp(`<a class="locale-switcher-option" href="${escapeRegExp(`${siteBasePath}${locale.slug ? `/${locale.slug}/` : '/'}`)}"`), `untranslated English pages should switch to the ${locale.name} landing page`);
}

const robots = await readFile(join(distRoot, 'robots.txt'), 'utf8');
assert.match(robots, /^User-agent: \*\s+Allow: \/\s+Sitemap: https:\/\/amirtaherkhani\.github\.io\/nestjs-skills\/sitemap\.xml\s*$/);

console.log(`Verified ${locales.length * translatedPages.length} translated page builds, localized metadata and navigation, language switching, reciprocal hreflang, sitemap alternates, robots.txt, and internal links.`);
