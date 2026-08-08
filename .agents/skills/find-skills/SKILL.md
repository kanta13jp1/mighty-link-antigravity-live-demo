---
name: find-skills
description: Discover and assess installable Agent Skills by use case, source reputation, adoption, audit evidence, and installation scope.
---

# Find Skills

Use this Skill when the user wants a reusable capability that may exist in the open Agent Skills ecosystem.

## Search workflow

1. Clarify the domain and the concrete outcome.
2. Check the skills.sh leaderboard for established candidates.
3. Run `npx skills find "<specific query>"` when a CLI search is requested.
4. Limit the shortlist to three relevant candidates.
5. For each candidate, verify its purpose, install count, publisher, repository activity, audit information, install command, and skills.sh URL.
6. Read the candidate `SKILL.md` before recommending installation whenever possible.
7. Recommend one candidate and state what it will improve.

## Safety

- Do not install a Skill while the user is only asking for discovery.
- Treat third-party Skills as instructions and code that may run with the agent's permissions.
- Prefer reputable publishers and actively maintained repositories.
- Prefer project-local installation for demos and isolated workspaces.
- Do not use global installation unless the user explicitly requests it.
