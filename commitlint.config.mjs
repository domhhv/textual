const configuration = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'always', ['lower-case', 'pascal-case', 'camel-case']],
    'type-case': [2, 'always', 'lower-case'],
  },
};

export default configuration;
