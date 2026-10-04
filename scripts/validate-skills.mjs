import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const skillsRoot = join(repositoryRoot, 'skills');
const errors = [];
const coordinationHeadings = [
  '## Pre-execution conflict guard',
  '### Prerequisites',
  '### Primary ownership',
  '### Conflict test',
];

function record(condition, message) {
  if (!condition) errors.push(message);
}

function frontmatterValue(frontmatter, field) {
  const match = frontmatter.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
  if (!match) return undefined;
  return match[1].trim().replace(/^(['"])(.*)\1$/, '$2');
}

function markdownSection(markdown, heading) {
  const headingLevel = heading.match(/^#+/)?.[0].length;
  const start = markdown.indexOf(`${heading}\n`);
  if (!headingLevel || start === -1) return '';

  const contentStart = start + heading.length + 1;
  const content = markdown.slice(contentStart);
  const nextHeading = content.search(new RegExp(`^#{1,${headingLevel}}\\s+`, 'm'));
  return nextHeading === -1 ? content : content.slice(0, nextHeading);
}

function validateLinks(markdown, markdownPath, skillRoot) {
  const linkPattern = /\[[^\]]*\]\(([^)]+)\)/g;
  for (const match of markdown.matchAll(linkPattern)) {
    const destination = match[1].split('#')[0].trim();
    if (!destination || /^(?:https?:|mailto:|#)/.test(destination)) continue;

    const resolved = resolve(dirname(markdownPath), destination);
    record(
      resolved.startsWith(`${skillRoot}/`) || resolved === skillRoot,
      `${relative(repositoryRoot, markdownPath)} links outside its skill: ${destination}`,
    );
    record(
      existsSync(resolved),
      `${relative(repositoryRoot, markdownPath)} has a missing link: ${destination}`,
    );
  }
}

record(existsSync(skillsRoot), 'Missing skills directory.');

const skillDirectories = existsSync(skillsRoot)
  ? readdirSync(skillsRoot)
      .map((name) => join(skillsRoot, name))
      .filter((entry) => statSync(entry).isDirectory())
      .sort()
  : [];

record(skillDirectories.length === 7, `Expected 7 skills, found ${skillDirectories.length}.`);

for (const skillDirectory of skillDirectories) {
  const directoryName = relative(skillsRoot, skillDirectory);
  const skillPath = join(skillDirectory, 'SKILL.md');
  record(
    directoryName.startsWith('nestjs-'),
    `${directoryName}: every skill in this collection must use the nestjs- prefix.`,
  );
  record(existsSync(skillPath), `${directoryName} is missing SKILL.md.`);
  if (!existsSync(skillPath)) continue;

  const markdown = readFileSync(skillPath, 'utf8');
  const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\n/);
  record(Boolean(frontmatterMatch), `${directoryName}/SKILL.md has invalid YAML frontmatter markers.`);
  if (!frontmatterMatch) continue;

  const frontmatter = frontmatterMatch[1];
  const name = frontmatterValue(frontmatter, 'name');
  const description = frontmatterValue(frontmatter, 'description');

  record(Boolean(name), `${directoryName}/SKILL.md is missing name.`);
  record(Boolean(description), `${directoryName}/SKILL.md is missing description.`);
  record(name === directoryName, `${directoryName}: frontmatter name must match its directory.`);
  record(
    Boolean(name && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) && name.length <= 64),
    `${directoryName}: name violates the Agent Skills naming rules.`,
  );
  record(
    Boolean(description && description.length <= 1024),
    `${directoryName}: description must contain 1-1024 characters.`,
  );
  record(
    Boolean(description?.includes('reconcile ownership before mutation')),
    `${directoryName}: description must disclose cross-skill coordination.`,
  );
  const conflictGuard = markdownSection(markdown, coordinationHeadings[0]);
  record(Boolean(conflictGuard), `${directoryName}/SKILL.md is missing ${coordinationHeadings[0]}.`);
  for (const heading of coordinationHeadings.slice(1)) {
    record(
      conflictGuard.includes(heading),
      `${directoryName}/SKILL.md conflict guard is missing ${heading}.`,
    );
  }
  record(
    /before editing files/i.test(conflictGuard) && /\bRead-only\b/i.test(conflictGuard),
    `${directoryName}: conflict guard must run before mutation while allowing read-only inspection.`,
  );
  record(
    /\bstop before mutation\b/i.test(conflictGuard),
    `${directoryName}: conflict guard must stop before mutation when a material conflict remains.`,
  );
  for (const otherSkillDirectory of skillDirectories) {
    const otherSkillName = relative(skillsRoot, otherSkillDirectory);
    if (otherSkillName === directoryName) continue;
    record(
      conflictGuard.includes(`\`${otherSkillName}\``),
      `${directoryName}: conflict guard must define a handoff with ${otherSkillName}.`,
    );
  }
  record(markdown.split('\n').length <= 500, `${directoryName}/SKILL.md exceeds 500 lines.`);
  validateLinks(markdown, skillPath, skillDirectory);

  const referencesDirectory = join(skillDirectory, 'references');
  record(existsSync(referencesDirectory), `${directoryName} is missing references/.`);
  if (existsSync(referencesDirectory)) {
    const referenceFiles = readdirSync(referencesDirectory).filter((name) => name.endsWith('.md'));
    record(referenceFiles.length >= 3, `${directoryName} should have at least 3 reference files.`);
    for (const referenceFile of referenceFiles) {
      const referencePath = join(referencesDirectory, referenceFile);
      const content = readFileSync(referencePath, 'utf8');
      record(content.trim().length > 100, `${directoryName}/references/${referenceFile} is too small.`);
      validateLinks(content, referencePath, skillDirectory);
    }
  }

  const evalPath = join(skillDirectory, 'evals', 'evals.json');
  record(existsSync(evalPath), `${directoryName} is missing evals/evals.json.`);
  if (existsSync(evalPath)) {
    try {
      const evaluation = JSON.parse(readFileSync(evalPath, 'utf8'));
      record(evaluation.skill === directoryName, `${directoryName}: eval skill name does not match.`);
      record(
        Array.isArray(evaluation.cases) && evaluation.cases.length >= 5,
        `${directoryName}: expected at least 5 evaluation cases.`,
      );
      record(
        Array.isArray(evaluation.cases) &&
          evaluation.cases.some(
            (evaluationCase) =>
              typeof evaluationCase?.id === 'string' &&
              /(?:conflict|handoff)/i.test(evaluationCase.id),
          ),
        `${directoryName}: expected a conflict or handoff evaluation case.`,
      );
    } catch (error) {
      errors.push(`${directoryName}: invalid eval JSON (${error.message}).`);
    }
  }

  if (directoryName === 'nestjs-code-audit') {
    record(
      existsSync(join(skillDirectory, 'scripts', 'collect-quality-evidence.mjs')),
      `${directoryName} is missing its evidence collector.`,
    );
    record(
      existsSync(join(repositoryRoot, 'integrations', 'codex', 'prompts', 'nestjs-audit.md')),
      `${directoryName} is missing the Codex prompt alias.`,
    );
    record(
      existsSync(join(skillDirectory, 'agents', 'openai.yaml')),
      `${directoryName} is missing Codex UI metadata.`,
    );
  }

  if (directoryName === 'nestjs-feature-audit') {
    record(
      markdown.includes('Require a non-empty feature name') && markdown.includes('defaulting to `main` only when no branch is named'),
      `${directoryName} must preserve the feature-name requirement and omitted-branch default.`,
    );
    const requiredFeatureAuditReferences = [
      'roadmap-discovery.md',
      'evidence-classification.md',
      'report-template.md',
    ];
    for (const referenceFile of requiredFeatureAuditReferences) {
      record(
        existsSync(join(skillDirectory, 'references', referenceFile)),
        `${directoryName} is missing references/${referenceFile}.`,
      );
    }
    record(
      /If no clear roadmap exists in `docs\/`, stop before implementation comparison/.test(markdown),
      `${directoryName} must enforce the docs roadmap hard stop.`,
    );
    const featureReportTemplate = join(skillDirectory, 'references', 'report-template.md');
    if (existsSync(featureReportTemplate)) {
      const template = readFileSync(featureReportTemplate, 'utf8');
      const categoryOffsets = [
        '## ✅ Implemented',
        '## ❌ Missing/Not Implemented',
        '## ⚠️ Legacy Code',
        '## 🛑 Bugs & Blockers',
      ].map((heading) => template.indexOf(heading));
      record(
        categoryOffsets.every((offset) => offset >= 0) &&
          categoryOffsets.every((offset, index) => index === 0 || offset > categoryOffsets[index - 1]),
        `${directoryName} report template must preserve the four required categories in order.`,
      );
    }
    record(
      existsSync(join(skillDirectory, 'agents', 'openai.yaml')),
      `${directoryName} is missing Codex UI metadata.`,
    );
    record(
      existsSync(join(repositoryRoot, 'integrations', 'codex', 'prompts', 'audit_feature.md')),
      `${directoryName} is missing the optional Codex compatibility prompt.`,
    );
  }

  if (directoryName === 'nestjs-professional-software-engineering') {
    record(
      existsSync(join(skillDirectory, 'agents', 'openai.yaml')),
      `${directoryName} is missing Codex UI metadata.`,
    );
    record(
      existsSync(join(repositoryRoot, 'integrations', 'codex', 'AGENTS.md')),
      `${directoryName} is missing the Codex AGENTS.md template.`,
    );
    record(
      existsSync(join(repositoryRoot, 'integrations', 'claude', 'CLAUDE.md')),
      `${directoryName} is missing the Claude Code CLAUDE.md template.`,
    );
  }

  if (directoryName === 'nestjs-git-commit-pr-message') {
    record(
      existsSync(join(skillDirectory, 'agents', 'openai.yaml')),
      `${directoryName} is missing Codex UI metadata.`,
    );
    const pagesWorkflow = join(repositoryRoot, '.github', 'workflows', 'deploy-pages.yml');
    record(existsSync(pagesWorkflow), `${directoryName} is missing the GitHub Pages workflow.`);
    if (existsSync(pagesWorkflow)) {
      const pagesYaml = readFileSync(pagesWorkflow, 'utf8');
      record(
        /push:\s*\n\s*branches:\s*\[main\]/.test(pagesYaml),
        `${directoryName}: GitHub Pages must deploy after pushes to main.`,
      );
    }
  }
}

if (errors.length > 0) {
  console.error('Skill validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${skillDirectories.length} Agent Skills successfully.`);
}
