// Conventional Commits (plan 6.5). Para activarlo:
//   npm i -D @commitlint/cli @commitlint/config-conventional husky
//   npx husky init && echo 'npx --no -- commitlint --edit "$1"' > .husky/commit-msg
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'],
    ],
  },
};
