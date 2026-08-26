# Relic — Architecture Diagrams

Improved Mermaid diagrams for the Warframe Relic Vault Checker project.

## Files

| File | Description |
|------|-------------|
| `relic-system-architecture.mmd` | System architecture: app, item matching, personal inventory, Wiki API, and future marketplace integration |
| `relic-user-process.mmd` | Readable left-to-right process for relics, prime parts, blueprints, mods, rivens, arcanes, and other tradeables |
| `index.html` | Interactive browser viewer (opens both diagrams with Mermaid.js) |

## Quick View

Open `index.html` in a browser to see both diagrams rendered instantly.

## Export to SVG/PNG

Requires the [Mermaid CLI](https://mermaid.js.org/setup/):

```bash
npx @mermaid-js/mermaid-cli -i docs/diagrams/relic-system-architecture.mmd -o docs/diagrams/relic-system-architecture.svg
npx @mermaid-js/mermaid-cli -i docs/diagrams/relic-user-process.mmd -o docs/diagrams/relic-user-process.svg
```

For PNG:

```bash
npx @mermaid-js/mermaid-cli -i docs/diagrams/relic-system-architecture.mmd -o docs/diagrams/relic-system-architecture.png
npx @mermaid-js/mermaid-cli -i docs/diagrams/relic-user-process.mmd -o docs/diagrams/relic-user-process.png
```

## Diagram Legend

### Architecture diagram

| Color | Meaning |
|-------|---------|
| Gold | User |
| Blue | UI / features |
| Purple | Processing / matching logic |
| Green | Data sources / state |
| Red dashed | Future / unimplemented |

### Process flow

| Shape | Meaning |
|-------|---------|
| Rounded pill | Start / end |
| Rectangle | Action |
| Diamond | Decision |
| Hexagon (result) | Output shown to user |
