import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const homePage = await readFile(new URL('../docs/index.md', import.meta.url), 'utf8');
const themeCss = await readFile(new URL('../docs/.vitepress/theme/custom.css', import.meta.url), 'utf8');
let builtHomePage;
try {
  builtHomePage = await readFile(new URL('../docs/.vitepress/dist/index.html', import.meta.url), 'utf8');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const expectedIcons = [
  { name: 'fa-code-branch', title: 'Git Publication', viewBox: '0 0 448 512' },
  { name: 'fa-code', title: 'Professional Engineering', viewBox: '0 0 576 512' },
  { name: 'fa-magnifying-glass', title: 'Code Audit', viewBox: '0 0 512 512' },
  { name: 'fa-route', title: 'Feature Audit', viewBox: '0 0 512 512' },
  { name: 'fa-cubes', title: 'Architecture & Principles', viewBox: '0 0 512 512' },
  { name: 'fa-puzzle-piece', title: 'OOP & Design Patterns', viewBox: '0 0 512 512' },
  { name: 'fa-gauge-high', title: 'Features & Performance', viewBox: '0 0 512 512' }
];

const svgIcons = [...homePage.matchAll(/(<svg\b[^>]*class="([^"]*fa-icon[^"]*)"[^>]*>([\s\S]*?)<\/svg>)\s*title:\s*([^\n]+)/g)];
assert.equal(svgIcons.length, expectedIcons.length, 'home page should define one inline SVG icon per skill card');

for (const { name, title, viewBox } of expectedIcons) {
  const matches = svgIcons.filter(([, , classes, , iconTitle]) => classes.split(/\s+/).includes(name) && iconTitle === title);
  assert.equal(matches.length, 1, `${name} should appear exactly once beside ${title}`);
}

for (const [svg, , , content] of svgIcons) {
  assert.match(svg, /aria-hidden="true"/, 'decorative SVG icons should be hidden from screen readers');
  assert.match(svg, /focusable="false"/, 'decorative SVG icons should not receive keyboard focus');
  assert.ok(expectedIcons.some(({ name, viewBox }) => svg.includes(name) && svg.includes(`viewBox="${viewBox}"`)), 'SVG should retain its source viewBox');
  assert.match(content, /fill="currentColor"/, 'SVG paths should inherit a theme-aware color');
  assert.match(content, /Font Awesome Free 7\.3\.1/, 'SVG should preserve Font Awesome attribution');
}

if (builtHomePage) {
  for (const { name } of expectedIcons) {
    assert.match(builtHomePage, new RegExp(`class="fa-icon ${name}"[^>]*aria-hidden="true"`), `${name} should render in the built homepage`);
  }
  assert.equal([...builtHomePage.matchAll(/Font Awesome Free 7\.3\.1/g)].length, expectedIcons.length, 'built SVGs should retain their Font Awesome attribution comments');
}
assert.match(themeCss, /\.VPFeature \.icon \.fa-icon[\s\S]*?width:\s*20px;[\s\S]*?height:\s*20px;[\s\S]*?color:\s*var\(--vp-c-brand-1\);/);

console.log(`Verified ${svgIcons.length} accessible inline Font Awesome icons in source${builtHomePage ? ' and built HTML' : ''}.`);
