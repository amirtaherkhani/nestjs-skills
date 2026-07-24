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

record(skillDirectories.length === 5, `Expected 5 skills, found ${skillDirectories.length}.`);

for (const skillDirectory of skillDirectories) {
  const directoryName = relative(skillsRoot, skillDirectory);
  const skillPath = join(skillDirectory, 'SKILL.md');
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
  for (const heading of coordinationHeadings) {
    record(markdown.includes(heading), `${directoryName}/SKILL.md is missing ${heading}.`);
  }
  record(
    markdown.includes('before editing files') && markdown.includes('Read-only'),
    `${directoryName}: conflict guard must run before mutation while allowing read-only inspection.`,
  );
  for (const otherSkillDirectory of skillDirectories) {
    const otherSkillName = relative(skillsRoot, otherSkillDirectory);
    if (otherSkillName === directoryName) continue;
    record(
      markdown.includes(`\`${otherSkillName}\``),
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

  if (directoryName === 'professional-software-engineering') {
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
}

if (errors.length > 0) {
  console.error('Skill validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${skillDirectories.length} Agent Skills successfully.`);
}
