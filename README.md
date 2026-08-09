# MightyLINK Antigravity Live Demo

This public repository is used only for the August 26 Antigravity workshop demonstration. The goal is to show how an AI agent can clarify requirements, add a reusable capability, build, improve, verify, and publish a polished result in a short session.

- All content is synthetic.
- No customer, employee, credential, or production data is permitted.
- The live demo uses seven IDE prompts plus read-only CLI and SDK audit prompts over 30 minutes.
- The IDE creates and improves the site; the CLI and SDK inspect the same repository without modifying it.
- `/grill-me` and `/find-skills` are baseline workspace Skills in `.agents/skills/`.
- `anthropics/skills@frontend-design` is installed project-locally during the demo and removed after rehearsal.
- GitHub MCP is read-only; if it is not already connected, the MCP step is skipped.
- Publishing starts only after the presenter says exactly `公開して`.
- The production MightyLINK repository and Firebase Hosting are not used.

## Demo files

1. `PROMPT_00_GRILL_ME.txt`
2. `PROMPT_01_FIND_SKILLS.txt`
3. `PROMPT_02_INSTALL_SKILL.txt`
4. `PROMPT_03_BUILD.txt`
5. `PROMPT_04_APPLY_SKILL.txt`
6. `PROMPT_05_MCP_CHECK.txt`
7. `PROMPT_06_PUBLISH.txt`
8. `PROMPT_10_CLI_READONLY.txt`
9. `PROMPT_11_SDK_READONLY.txt`

`antigravity_sdk_readonly.py` runs the SDK audit with `BuiltinTools.read_only()`. Install `google-antigravity` in a disposable virtual environment and provide `GEMINI_API_KEY` only through the local environment. Never commit the key. For the CLI demo, use the interactive `agy` TUI, pre-approve reads for the four named files, and do not use `--dangerously-skip-permissions`.

Definitions and the five-product comparison are in `DEMO_CONCEPTS.md`. `Steering` and `Powers` are Kiro feature names; Antigravity uses Rules, Workflows, Skills, MCP, and Artifacts.

## Rehearsal reset

Remove only the live-installed Skill, then revert the rehearsal publish commit and push the revert. Do not use `reset --hard` or force push.

```powershell
npx skills remove frontend-design --agent antigravity -y
$skillsRoot = (Resolve-Path .agents/skills).Path
$skillPath = Join-Path $skillsRoot 'frontend-design'
if (Test-Path -LiteralPath $skillPath) {
  if ((Split-Path $skillPath -Parent) -ne $skillsRoot) { throw 'Unexpected Skill path' }
  Get-ChildItem -LiteralPath $skillPath -File | Remove-Item -Force
  Remove-Item -LiteralPath $skillPath -Force
}
if (Test-Path -LiteralPath .\skills-lock.json) { Remove-Item -LiteralPath .\skills-lock.json -Force }
npx skills list --json
git revert --no-edit <rehearsal-publish-commit-sha>
git push origin main
```

The explicit folder check is required because a copied Skill and its generated `skills-lock.json` can remain after the CLI reports successful removal.
