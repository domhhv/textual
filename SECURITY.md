# Security Policy

## Supported Versions

As this is an early-stage project, we currently support only the latest version.

| Version  | Supported          |
| -------- | ------------------ |
| latest   | :white_check_mark: |
| < latest | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please report it responsibly.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please email security concerns to: domhryshaiev@gmail.com

Include the following information:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if you have one)

### What to Expect

- **Acknowledgment**: We'll acknowledge receipt of your report within 48 hours
- **Updates**: We'll keep you informed of progress as we investigate
- **Resolution**: We'll work to release a fix as quickly as possible
- **Credit**: We'll acknowledge your contribution (unless you prefer to remain anonymous)

## Security Considerations

### API Keys

- Never commit API keys to the repository
- Use environment variables (`.env.local`) for sensitive credentials
- The `.env.example` file should contain placeholder values only

### Dependencies

- We regularly update dependencies to patch security vulnerabilities
- Dependabot alerts are enabled for this repository
- Critical security updates are prioritized

### Data Handling

- User API keys are stored locally in the browser only
- No user data is transmitted to our servers
- All AI interactions go directly to OpenAI's API
- Review OpenAI's security practices: https://openai.com/security

### Best Practices for Users

When using Textual:

- Use your own OpenAI API key (BYOK)
- Don't share API keys or credentials
- Be cautious with sensitive content in documents
- Regularly rotate API keys
- Monitor your OpenAI API usage

## Known Security Limitations

- API keys are stored in browser localStorage (encrypted)
- Document content is processed through OpenAI's API
- The application runs client-side with user-provided credentials

## Security Updates

Security updates will be released as soon as possible after vulnerabilities are identified and fixed. Users should keep their installations up to date.

Thank you for helping keep Textual secure!
