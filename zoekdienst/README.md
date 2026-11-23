# brein-zoek

Zoekdienst voor het Brein in Craft. Draait op je eigen Cloudflare-account en werkt als connector in Claude, ook op je telefoon.

## Wat hij doet

- **Zoeken op betekenis én trefwoord (hybride).** Elke Brein-pagina wordt in stukken verdeeld. Elk stuk wordt twee keer opgeslagen: als vector (model `bge-m3`, meertalig, dus Nederlands en Engels) in Cloudflare Vectorize, en als tekst in een FTS5-zoekindex in Cloudflare D1. Een zoekvraag doorzoekt beide, en de resultaten worden samengevoegd met reciprocal rank fusion. Zo vind je "die zorgen over budget" ook in een notitie waarin "financieel geen goede jaren" staat. Een exacte naam als "Kidos" wordt ook gevonden.
- **Netwerk van verbanden.** Bij het indexeren leest de dienst alle `block://`-links en de getypeerde regels in de sectie `## Relaties` (`- klant van → [Nova Health](block://…)`). De tool `relaties` geeft per pagina de verbanden in beide richtingen.
- **Vergelijkbare pagina's.** Pagina's die inhoudelijk het meest op elkaar lijken.

Craft blijft de bron. De zoekdienst is een index erbovenop, die Claude bijwerkt na elke wijziging. Een volledige synchronisatie draait ook als geplande taak.

## Tools in Claude

| Tool | Wat |
|---|---|
| `zoek` | Hybride zoeken, optioneel binnen één map |
| `relaties` | Verbanden van één pagina (op id of naam) |
| `vergelijkbaar` | Inhoudelijk vergelijkbare pagina's |
| `index_status` | Welke pagina's in de index staan en wanneer ze zijn geïndexeerd |
| `indexeer_pagina` | Pagina toevoegen of bijwerken |
| `verwijder_pagina` | Pagina uit de index halen |

## Installeren (eenmalig, ongeveer 10 minuten)

Je hebt nodig: je Mac, Node.js (LTS, via nodejs.org) en je Cloudflare-account.

1. Pak deze map uit, bijvoorbeeld in `~/brein-zoek`.
2. Open Terminal in die map en voer uit:
   ```bash
   chmod +x setup.sh && ./setup.sh
   ```
   Het script logt in bij Cloudflare, maakt de vectorindex en de database aan, stelt een geheime sleutel in en zet de dienst live. Aan het eind toont het de connector-URL.
3. Ga in Claude naar **Instellingen → Connectors → Aangepaste connector toevoegen**. Geef hem de naam *Brein zoeken* en plak de URL uit stap 2.
4. Zeg in een chat: *"Indexeer mijn hele Brein"*. Claude zet dan alle bestaande pagina's in de index.

Je kunt ook in Claude Code op je Mac de map openen en zeggen: *"voer setup.sh uit"*.

## Beveiliging

- De dienst is alleen bereikbaar via een URL met een lange geheime sleutel (`/mcp/<sleutel>`). Elk ander adres geeft "Not found".
- Behandel de connector-URL als een wachtwoord. Een nieuwe sleutel maak je met `rm .mcp-secret && ./setup.sh`. Pas daarna de URL in Claude aan.
- Opgeslagen worden de tekst van je Brein-pagina's, de vectoren en de links, allemaal in jouw eigen Cloudflare-account. Er is geen andere opslag of doorgifte.

## Kosten

Bij de omvang van een persoonlijk Brein (honderden tot enkele duizenden pagina's) valt dit binnen of dicht bij de gratis limieten van Workers, D1, Vectorize en Workers AI. Controleer je verbruik in het Cloudflare-dashboard.

## Ontwikkelen

```bash
npm install
npx tsx --test test/*.test.ts       # tests met nagebootste D1, Vectorize en AI
npx tsc -p .                          # typecheck
npx wrangler deploy --dry-run         # proefbuild
```
