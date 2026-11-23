# Brein in Obsidian of een andere Markdown-map

Craft is in deze kit de opslag, maar de werkwijze werkt net zo goed met gewone Markdown-bestanden: **Obsidian**, Logseq, iA Writer, VS Code of een map in iCloud of Dropbox. Het voordeel: losse `.md`-bestanden die van jou blijven en die elk programma kan lezen.

> De zoekdienst ondersteunt Markdown-mappen (wikilinks en Obsidian-links). De skills zijn geschreven voor Craft; de tabel hieronder vertaalt ze. Deze variant is minder beproefd dan de Craft-route.

## Mappen

Maak in je kluis (vault) dezelfde mappen:

```text
Brein/
  Mensen/
  Organisaties/
  Gesprekken/
  Ideeën & Concepten/
  Bronnen/
    Dagoverzichten/
  Reflecties/
  Werkwijze/
  Feiten.md
```

## Vertaling van Craft naar Markdown

| In de skills (Craft) | In een Markdown-map |
| --- | --- |
| Pagina in een map met folderId | Bestand `Brein/<map>/<Naam>.md` |
| Link `[Naam](block://<id>)` | Wikilink `[[Naam]]` of `[[Naam\|andere tekst]]` |
| Relatieregel `- klant van → [Naam](block://id)` | `- klant van → [[Naam]]` |
| `page_id` bij indexeren = rootBlockId | `page_id` = `md:<bestandsnaam zonder .md>`, bijvoorbeeld `md:Jan Jansen` |
| Craft-link in antwoorden | `obsidian://open?vault=<kluis>&file=<naam>` (zet `MD_VAULT` in `wrangler.jsonc`) |
| `documents create`, `blocks add` | Bestand aanmaken of tekst toevoegen |
| `search`, `documents list` | Zoeken in de map, of eerst `zoek` van de zoekdienst |
| Collectie Feiten | Een tabel in `Feiten.md`, één regel per feit |
| Taken (`- [ ]`) | Hetzelfde; Obsidian toont ze als vinkjes |

Bestandsnamen moeten uniek zijn in de hele kluis, want `[[Naam]]` verwijst naar de bestandsnaam.

## Hoe de AI bij de bestanden komt

- **Claude-desktopapp** met toegang tot de map op je computer: Claude leest en schrijft de bestanden direct. Geplande taken die de map nodig hebben, werken alleen als je computer aan staat.
- **Claude Code** of een andere agent op de command line, gestart in de kluis.
- **Een MCP-server voor Obsidian of het bestandssysteem**, als je assistent (bijvoorbeeld ChatGPT) alleen via connectoren werkt.

Voeg aan het begin van `brein-basis` een korte regel toe: *"Opslag is de Markdown-map `<pad>`; volg docs/obsidian.md voor de vertaling van Craft-opdrachten."*

## Volledige synchronisatie van de zoekindex

In plaats van de Craft-mappen te vergelijken, loopt de taak alle `.md`-bestanden onder `Brein/` langs: elk bestand dat nieuw of gewijzigd is (wijzigingsdatum) wordt geïndexeerd met `page_id` `md:<bestandsnaam>`, en items in de index waarvan het bestand verdwenen is worden verwijderd. Laat `gdrive:`-items altijd staan.
