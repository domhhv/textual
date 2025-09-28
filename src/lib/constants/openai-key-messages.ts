import type { OpenAIKeyIssueCode } from '../utils/check-openai-key';

const OPENAI_KEY_ISSUE_MESSAGES: Record<OpenAIKeyIssueCode, string> = {
  empty: 'Please paste your API key.',
  length_long: 'This looks longer than typical OpenAI keys.',
  length_short: 'This looks too short to be an OpenAI key.',
  looks_truncated: 'This looks truncated—did the copy/paste cut off?',
  whitespace: 'We removed extra spaces. Double-check the value.',
  bad_prefix:
    'This doesn\'t look like an OpenAI key (expected it to start with "sk-").',
  invalid_charset:
    'Unexpected characters—OpenAI keys after "sk-" are usually alphanumeric.',
};

export default OPENAI_KEY_ISSUE_MESSAGES;
