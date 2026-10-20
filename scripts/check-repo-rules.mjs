// Checks repository rules that ESLint, Prettier and remark cannot:
// CLAUDE.md only imports AGENTS.md (AGENTS.md), and no tracked text file
// contains an em dash (CODING_STANDARDS.md). Run from the repository root
// by `npm run lint`.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const EM_DASH = String.fromCharCode(0x2014);
const errors = [];

if (readFileSync('CLAUDE.md', 'utf8') !== '@AGENTS.md\n') {
  errors.push('CLAUDE.md: must contain only the line @AGENTS.md');
}

const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean);

for (const file of files) {
  let content;
  try {
    content = readFileSync(file, 'utf8');
  } catch {
    continue; // Not a readable file, such as the .claude/skills symlink.
  }
  if (content.includes('\0')) continue; // Binary file.
  content.split('\n').forEach((line, index) => {
    if (line.includes(EM_DASH)) {
      errors.push(`${file}:${index + 1}: em dash; use "-" instead`);
    }
  });
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
