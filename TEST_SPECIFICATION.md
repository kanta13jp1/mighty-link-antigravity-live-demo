# AI Agent Decision Guide Test Specification

The canonical acceptance criteria are in `TEST_SPEC.md`. This file remains as the entry point used by the Antigravity-installed E2E testing Skill and maps those criteria to the Node test suite.

## Automated coverage

| Area | Contract | Automated check |
| --- | --- | --- |
| Product scope | Exactly five named products | Node DOM test and Python data test |
| Official icons | Local, non-empty, official provenance | Python file test and browser natural-size check |
| Freshness | Version, date, update, video, blog | Python schema and exact-version tests |
| Decision depth | Thirteen dimensions per product | Python schema and Node rendered-row tests |
| Comparison | One or two products, never three | Node interaction test and browser test |
| Sources | At least 40 rendered evidence links | Node DOM and Python allowlist tests |
| Accessibility | ARIA state, live status, skip link, visible focus | Static contract and browser keyboard test |
| GCP / MCP Integration | Google Cloud Data Agent Kit & GitHub MCP read-only verification | `get_active_gcp_connection` read-only check and MCP fallback assertion |
| Responsive layout | No page overflow at 320-1440px | Chromium viewport checks |
| Review | Ten independent review passes | Python document test |

## Commands

```powershell
npm ci
npm test
python -m unittest discover -s tests -v
node --check app.js
node --check product-data.js
```

Publication is blocked unless both suites and the browser checks pass.
