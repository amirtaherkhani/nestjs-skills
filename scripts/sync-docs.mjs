import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const generatedRoot = join(repositoryRoot, 'docs', 'reference');

const skills = [
  {
    directory: 'nestjs-git-commit-pr-message',
    route: 'git-publication',
    title: 'Git Commit and Pull Request',
    description: 'Intentional staging, secret scanning, commit and PR messages, safe pushes, releases, CI, and GitHub Pages follow-up.'
  },
  {
    directory: 'nestjs-professional-software-engineering',
    route: 'professional-engineering',
    title: 'Professional Software Engineering',
    description: 'Project-aware implementation, idiomatic syntax, safe syntactic sugar, testing, and evidence-backed verification.'
  },
  {
    directory: 'nestjs-code-audit',
    route: 'code-audit',
    title: 'Code Audit',
    description: 'Read-only whole-repository checks, cross-skill finding ownership, and evidence-backed code-quality reports.'
  },
  {
    directory: 'nestjs-feature-audit',
    route: 'feature-audit',
    title: 'Feature Audit',
    description: 'Branch-specific roadmap validation, feature traceability, gap analysis, and blocker reporting.'
  },
  {
    directory: 'nestjs-architecture-principles',
    route: 'architecture',
    title: 'Architecture & Principles',
    description: 'Architecture levels, module boundaries, dependency direction, and pragmatic engineering principles.'
  },
  {
    directory: 'nestjs-oop-design-patterns',
    route: 'oop-patterns',
    title: 'OOP & Design Patterns',
    description: 'Object design, SOLID diagnostics, NestJS-native patterns, and safe refactoring guidance.'
  },
  {
    directory: 'nestjs-features-performance',
    route: 'features-performance',
    title: 'Features & Performance',
    description: 'NestJS lifecycle features, production readiness, performance diagnosis, and safe scaling.'
  }
];

function stripFrontmatter(markdown) {
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
}

function titleFromMarkdown(markdown, fallback) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? fallback;
}

function pageFrontmatter(title, description) {
  return [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    'editLink: false',
    '---',
    ''
  ].join('\n');
}

function sourceFooter(sourcePath) {
  const repoPath = relative(repositoryRoot, sourcePath).split('\\').join('/');
  const sourceUrl = `https://github.com/amirtaherkhani/nestjs-skills/blob/main/${repoPath}`;

  return `\n\n---\n\n<small>Canonical source: [\`${repoPath}\`](${sourceUrl}). This page is generated during the documentation build.</small>\n`;
}

await rm(generatedRoot, { recursive: true, force: true });
await mkdir(generatedRoot, { recursive: true });

for (const skill of skills) {
  const sourceRoot = join(repositoryRoot, 'skills', skill.directory);
  const targetRoot = join(generatedRoot, skill.route);
  const skillSource = join(sourceRoot, 'SKILL.md');
  const skillMarkdown = stripFrontmatter(await readFile(skillSource, 'utf8'));

  await mkdir(targetRoot, { recursive: true });
  await writeFile(
    join(targetRoot, 'index.md'),
    pageFrontmatter(skill.title, skill.description) + skillMarkdown + sourceFooter(skillSource)
  );

  const referencesSource = join(sourceRoot, 'references');
  const referencesTarget = join(targetRoot, 'references');
  await mkdir(referencesTarget, { recursive: true });

  const referenceFiles = (await readdir(referencesSource))
    .filter((file) => file.endsWith('.md'))
    .sort();

  for (const file of referenceFiles) {
    const sourcePath = join(referencesSource, file);
    const markdown = await readFile(sourcePath, 'utf8');
    const title = titleFromMarkdown(markdown, basename(file, '.md'));
    const description = `${title} reference for the ${skill.title} agent skill.`;
    const targetPath = join(referencesTarget, file);

    await writeFile(
      targetPath,
      pageFrontmatter(title, description) + markdown + sourceFooter(sourcePath)
    );
  }
}

const publicNoJekyll = join(repositoryRoot, 'docs', 'public', '.nojekyll');
await mkdir(dirname(publicNoJekyll), { recursive: true });
await writeFile(publicNoJekyll, '');

console.log(`Generated ${skills.length} skill references in ${relative(repositoryRoot, generatedRoot)}.`);
