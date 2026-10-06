import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const readme = await readFile(join(repositoryRoot, 'README.md'), 'utf8');
const section = readme.split('### Find NestJS Skills in marketplaces\n')[1]?.split('\n### ')[0];
assert.ok(section, 'README should include a marketplace discovery section');

const marketplaces = [
  { name: 'Skills.sh', href: 'https://www.skills.sh/amirtaherkhani/nestjs-skills', image: 'docs/assets/marketplaces/skills-sh.png', installText: 'Skills CLI' },
  { name: 'Agensi.io', href: 'https://www.agensi.io/skills/nestjs-skills-professional-software-engineering', image: 'docs/assets/marketplaces/agensi.png', installText: 'Download Free' },
  { name: 'Skillstore', href: 'https://skillstore.io/skills/amirtaherkhani-nestjs-professional-software-engineering', image: 'docs/assets/marketplaces/skillstore.svg', installText: 'Ask an Agent' }
];

for (const marketplace of marketplaces) {
  assert.ok(section.includes(marketplace.href), `README should link directly to the ${marketplace.name} listing`);
  assert.ok(section.includes(marketplace.image), `README should use the local ${marketplace.name} icon`);
  await access(join(repositoryRoot, marketplace.image));
  assert.ok(section.includes(marketplace.installText), `README should describe the ${marketplace.name} install path`);
}

assert.doesNotMatch(section, /<img\b[^>]*src="https?:\/\//i, 'marketplace images should not depend on third-party hotlinks');
assert.match(section, /Skills CLI command above installs from this GitHub repository/i, 'README should distinguish the GitHub Skills CLI source from marketplace install flows');

console.log('Verified direct marketplace listing links, local icons, and distinct install-path descriptions.');
