const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

const requirements = [
  {
    file: 'index.html',
    patterns: [
      'compact-header-all-pages-20261110-v11',
      'navigation-prefetch-20261110-v12',
      '診断結果をPDFで',
      '無料ダウンロード',
      '無料で診断をはじめる',
    ],
  },
  {
    file: 'style.css',
    patterns: [
      '.header.header-concept-a.is-scrolled .header-inner { min-height: 68px; }',
      '.header.header-concept-a.is-scrolled .header-inner { min-height: 64px; }',
    ],
  },
  {
    file: 'site-shell.js',
    patterns: ["header.classList.toggle('is-scrolled', headerScrolled)"],
  },
];

const failures = [];

for (const requirement of requirements) {
  const filePath = path.join(root, requirement.file);
  if (!fs.existsSync(filePath)) {
    failures.push(`${requirement.file}: file is missing`);
    continue;
  }

  const source = fs.readFileSync(filePath, 'utf8');
  for (const pattern of requirement.patterns) {
    if (!source.includes(pattern)) {
      failures.push(`${requirement.file}: required production baseline is missing: ${pattern}`);
    }
  }
}

if (failures.length > 0) {
  console.error('\nPRODUCTION DEPLOY BLOCKED');
  console.error('The protected header or diagnosis UI has been removed or reverted.');
  console.error('Review the change instead of publishing an older baseline.\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Production baseline guard passed: header and diagnosis UI are protected.');
