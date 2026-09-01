# Project Protocol

This project spans multiple sessions. PROJECT-STATE.md is the record of
what's already been done.

## At the start of every session

1. Read PROJECT-STATE.md in full.
2. Tell the user which tutorial and step they left off on.

## After completing any step

Append an entry to PROJECT-STATE.md. Update the Current Facts table if a
value changed. Never rewrite or delete prior log entries.

## Things to never write to PROJECT-STATE.md

Private keys, .pem file contents, passwords, API tokens, AWS access keys.
Record file *locations* only (e.g. "key at ~/.ssh/landing-key.pem").

### Example PROJECT-STATE.md

```markdown
# Project State

## Current Facts

| Item             | Value                    | Set on     |
| ---------------- | ------------------------ | ---------- |
| AWS region       | us-east-2                | 2026-08-01 |
| Domain           | example.co               | 2026-08-02 |
| EC2 instance ID  | i-0abc123                | 2026-08-02 |
| Elastic IP       | 3.14.15.92               | 2026-08-02 |
| SSH key location | ~/.ssh/landing-key.pem   | 2026-08-02 |
| Hosted zone ID   | Z1234567890ABC           | 2026-08-02 |

## Log

### 2026-08-02 â Tutorial 3, steps 1-4

- Launched t3.micro, Ubuntu 24.04, 20GB gp3 root
- Created security group web-server-sg (SSH from home IP, 80/443 open)
- Allocated and associated Elastic IP
- STOPPED at step 5 â user needs to configure nginx next session
```

# Database changes

- Always record schema changes as migration files in supabase/migrations/.
  Never change the database directly in the Supabase dashboard.
- After any schema change, regenerate the TypeScript types.
- After any schema change, confirm Row Level Security is enabled on every
  affected table, and report the result.
- Explain every schema change in plain language before moving on.

# Testing

- The user is following a course that teaches them agentic engineering. Once
  they reach the step where tests exist, run the test suite after every major
  change.

# Editing this file

- Keep the file organized, and don't duplicate anything that's already there.

