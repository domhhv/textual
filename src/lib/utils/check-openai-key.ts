export type OpenAIKeyIssueCode =
  | 'empty'
  | 'whitespace'
  | 'bad_prefix'
  | 'length_short'
  | 'length_long'
  | 'invalid_charset'
  | 'looks_truncated';

type OpenAIKeyIssue = {
  code: OpenAIKeyIssueCode;
};

type OpenAIKeyCheckResult = {
  issues: OpenAIKeyIssue[];
  normalized: string;
  ok: boolean;
};

export default function checkOpenAIKey(input: string | null | undefined): OpenAIKeyCheckResult {
  const issues: OpenAIKeyIssue[] = [];
  const normalized = (input ?? '').trim();

  if (!normalized) {
    return { issues: [{ code: 'empty' }], normalized, ok: false };
  }

  if (normalized !== input) {
    issues.push({ code: 'whitespace' });
  }

  const prefixes = ['sk-proj-', 'sk-live-', 'sk-test-', 'sk-'];
  const matchedPrefix = prefixes.find((p) => {
    return normalized.startsWith(p);
  });

  if (!matchedPrefix) {
    issues.push({ code: 'bad_prefix' });
  }

  const len = normalized.length;
  const MIN_LEN = 40;
  const MAX_LEN = 256;

  if (len < MIN_LEN) {
    issues.push({ code: len >= 10 ? 'looks_truncated' : 'length_short' });
  } else if (len > MAX_LEN) {
    issues.push({ code: 'length_long' });
  }

  if (matchedPrefix) {
    const suffix = normalized.slice(matchedPrefix.length);

    if (!/^[A-Za-z0-9\-_]+$/.test(suffix)) {
      issues.push({ code: 'invalid_charset' });
    }
  }

  const ok =
    !!matchedPrefix &&
    len >= MIN_LEN &&
    len <= MAX_LEN &&
    !issues.some((i) => {
      return i.code === 'invalid_charset';
    });

  return { issues, normalized, ok };
}
