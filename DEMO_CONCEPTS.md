# Antigravity demo concepts

## Steering

Human feedback on an artifact, such as a plan, code diff, or browser result, that changes the next direction of execution.

## Skills

Reusable packages centered on `SKILL.md`. They bundle specialized instructions, knowledge, and resources and are loaded when relevant. This demo uses `/grill-me` before implementation and `/find-skills` before selecting reusable capability.

Verified candidate on 2026-08-08: `anthropics/skills@frontend-design`. The live demo performs discovery and quality review only; it does not install the Skill.

## MCP

Model Context Protocol connects an AI agent to local tools, data sources, and external APIs through a standard interface. This demo uses GitHub MCP only for optional read-only checks. It never starts authentication or performs writes on stage.

## Power

Power is training shorthand for the combined execution capability of Steering, Skills, MCP, Browser, and permission boundaries. It is not presented as an official independent Antigravity feature or setting.
