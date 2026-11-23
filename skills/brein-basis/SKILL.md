---
name: "brein-basis"
description: "Spelregels voor het Brein in Craft (map \"Brein\"), naar GBrain-werkwijze. Lees vóór elke lees- of schrijfactie in het Brein, of als de eigenaar iets wil opslaan, opzoeken of bijwerken."
---
> Werk je met Obsidian of een andere Markdown-map in plaats van Craft? Volg dan `docs/obsidian.md` voor de vertaling van de Craft-opdrachten, links (`[[Naam]]`) en page_id's (`md:<bestandsnaam>`).


# Brein-basis — spelregels voor het Brein in Craft

De eigenaar houdt een persoonlijk kennisbrein bij in Craft, gebaseerd op de werkwijze van GBrain (Garry Tan), maar zonder de GBrain-software. Craft is de opslag en de bron van waarheid; Claude leest en schrijft via de Craft-connector (`craft_read` / `craft_write`). Een eigen zoekdienst op Cloudflare (connector "Brein zoeken") houdt een index bij voor zoeken op betekenis en voor de relaties. Deze skill bevat de regels die elke andere brein-skill volgt.

Andere brein-skills: **brein-vraag** (zoeken en antwoorden), **brein-gesprek** (gesprekken verwerken), **brein-vastleggen** (snel iets vastleggen), **brein-persoon** (pagina's over mensen en organisaties), **brein-onderhoud** (controle), **brein-droom** (wekelijkse synthese), **brein-briefing** (dagbriefing en e-mail verwerken).

## Waar alles staat

Craft-space: "<jouw Craft-space>" (spaceId `<SPACE_ID>`).

| Map | folderId | Wat erin hoort |
|---|---|---|
| Brein (hoofdmap) | `<ID_BREIN>` | Alleen "Over dit Brein" (uitleg en spelregels voor de eigenaar) |
| Brein/Mensen | `<ID_MENSEN>` | Eén pagina per persoon |
| Brein/Organisaties | `<ID_ORGANISATIES>` | Eén pagina per bedrijf, praktijk, instelling of club |
| Brein/Gesprekken | `<ID_GESPREKKEN>` | Eén pagina per gesprek, meeting of call |
| Brein/Ideeën & Concepten | `<ID_IDEEEN>` | Herbruikbare ideeën, denkmodellen, stellingen |
| Brein/Bronnen | `<ID_BRONNEN>` | Alleen ruwe bronnen: transcripten, exports, lange teksten die meerdere pagina's voeden |
| Brein/Reflecties | `<ID_REFLECTIES>` | Droomrondes (brein-droom): wekelijks en de nachtelijke "Dagdroom"; alleen synthese, geen nieuwe feiten |
| Brein/Werkwijze | `<ID_WERKWIJZE>` | Kopieën van de Brein-skills, zodat andere agents dezelfde werkwijze kunnen volgen |
| Zoekindex-map "Documenten" (geen Craft-map) | page_id `gdrive:<fileId>` | Google-documenten uit de dagverwerking: alleen in de zoekindex, als ruwe bron met link naar Drive |
| Brein/Feiten (document) | rootBlockId `<ID_FEITEN_DOC>`, collectie `<ID_FEITEN_COLLECTIE>` | Losse feiten, één rij per feit (zie "Feiten") |

Projecten horen **niet** in het Brein: die staan al elders in Craft (onder meer de map Werk). Het Brein linkt ernaar, het kopieert ze niet.

Als een folderId niet meer werkt, zoek de map opnieuw op met `folders list --filter Brein`.

## Zoekdienst (Brein zoeken)

Naast Craft is er een eigen zoekdienst op Cloudflare: de connector **Brein zoeken** (server `brein-zoek`). Die heeft deze tools:

| Tool | Gebruik |
|---|---|
| `zoek` (vraag, aantal, map) | Hybride zoeken: op betekenis én trefwoord. Eerste stap bij elke vraag over het Brein. |
| `relaties` (page_id of naam) | Getypeerde relaties in beide richtingen, plus welke pagina's ernaar linken. |
| `vergelijkbaar` (page_id) | Inhoudelijk vergelijkbare pagina's. |
| `index_status` | Welke pagina's geïndexeerd zijn en wanneer. |
| `indexeer_pagina` (page_id, titel, map, tekst, gewijzigd) | Pagina toevoegen of bijwerken in de index. |
| `verwijder_pagina` (page_id) | Pagina uit de index halen. |

Is de connector in deze sessie niet beschikbaar, werk dan alleen met Craft (`search`, `documents list`, `internal-links`) en meld aan het eind in één zin dat de zoekindex niet is bijgewerkt.

## Relaties

Persoons- en organisatiepagina's hebben direct onder de "In één zin"-regel een sectie `## Relaties` met getypeerde verbanden, één per regel:

`- <soort> → [Naam](block://<rootBlockId>) (optionele toelichting)`

Zonder eigen Brein-pagina mag de naam zonder link: `- oud-collega van → Sanne (Acme)`.

Gebruik bij voorkeur deze soorten, zodat de zoekdienst ze kan groeperen:
- mensen: `werkt bij`, `werkte bij`, `oprichter van`, `betrokken bij`, `adviseur van`, `collega van`, `oud-collega van`, `partner van`, `beoogd partner van`, `werkt samen met`, `familie van`
- organisaties: `klant van`, `prospect van`, `partner van`, `leverancier van`, `investeerder in`, `onderdeel van`, `concurrent van`

Zet alleen een relatie neer die uit een bron blijkt. Verandert een relatie (iemand stapt over), pas dan de regel aan ("werkte bij") en voeg een nieuwe toe; leg de wisseling ook in de tijdlijn vast. Een relatie hoeft maar aan één kant te staan; de zoekdienst kent beide richtingen. Hubpagina's zoals je belangrijkste klanten of projecten houden daarnaast hun lijsten (Mensen, Klanten) voor de leesbaarheid.

## Feiten

Losse feiten die geen eigen pagina rechtvaardigen, of die meerdere pagina's raken, gaan als rij in de collectie Feiten:

`collections items-add --collection <ID_FEITEN_COLLECTIE> --items [{"feit":"<het feit in één zin>","properties":{"soort":"<Gebeurtenis|Afspraak|Voorkeur|Overtuiging|Feit>","over":"[Naam](block://<id>), …","bron":"[gesprek …](block://<id>) of de eigenaar","datum":"JJJJ-MM-DD","status":"Actueel"}}]`

- Een feit over één persoon of organisatie dat de "Stand van zaken" verandert, hoort óók (of alleen) op die pagina.
- Feiten worden nooit verwijderd: een achterhaald feit krijgt status `Vervangen`, en het nieuwe feit een eigen rij.
- Voorkeuren en overtuigingen van de eigenaar zelf (hoe hij over iets denkt) horen bij uitstek hier.

## De regels

1. **Eerst kijken.** Zoek altijd eerst in het Brein voordat je het web gebruikt, iets aanmaakt of de eigenaar een vraag stelt ("wie is X?"). Gebruik eerst `zoek` van de zoekdienst (vindt ook andere bewoordingen), daarna zo nodig Craft `search "<naam>"` voor exacte namen, en controleer of het resultaat in een Brein-map staat (`documents list --folder <folderId>`). Probeer naamvarianten (voornaam, achternaam, afkorting).
2. **Alleen schrijven als het gevraagd is.** Schrijf naar het Brein bij een expliciete vraag van de eigenaar ("zet in mijn Brein", "verwerk dit gesprek", "werk de pagina van X bij") of wanneer een brein-skill wordt aangeroepen die daarvoor bedoeld is. Informatie die toevallig langskomt wordt niet automatisch opgeslagen; bied het hooguit in één zin aan.
3. **Opslaan bij het onderwerp.** Het hoofdonderwerp bepaalt de map, niet de vorm of de bron. Een artikel over een persoon → Mensen. Bedrijfsinformatie uit een gesprek → óók de pagina van die organisatie bijwerken, niet alleen het gesprek.
4. **Niet alles verdient een pagina.** Maak alleen een nieuwe pagina voor een persoon of organisatie waar de eigenaar waarschijnlijk opnieuw mee te maken krijgt, of een idee dat hij later wil terugvinden. Bij twijfel: niet aanmaken, wel noemen in de tekst. Vraag de eigenaar bij nieuwe pagina's om akkoord (in één lijst, niet per stuk).
5. **Elk feit een bron.** Achter elk feit staat een bronvermelding:
   - `[Bron: De eigenaar, 2026-11-21]` — wat de eigenaar zelf zegt (hoogste gezag)
   - `[Bron: gesprek <onderwerp>, 2026-11-21]` met link naar de gesprekspagina
   - `[Bron: <website/publicatie>, 2026-11-21]` — extern (laagste gezag)
   Spreken bronnen elkaar tegen, laat dan beide staan en benoem de tegenstrijdigheid. Overschrijf nooit wat de eigenaar zelf zei met een zwakkere bron.
6. **Alles linkt terug (de ijzeren wet).** Noemt een pagina een persoon, organisatie of idee met een eigen Brein-pagina, dan:
   - linkt die vermelding naar de pagina: `[Naam](block://<rootBlockId>)`
   - krijgt de pagina van die persoon/organisatie een tijdlijnregel terug: `- **2026-11-21** | Genoemd in [titel](block://<rootBlockId>) — korte context`
   `block://`-links worden in Craft echte interne links en verschijnen als backlinks (`internal-links get --to-document <id>`).
7. **Geen duplicaten.** Bestaat de pagina al, werk hem bij. Voeg alleen toe wat nieuw is.
8. **Index direct bijwerken.** Na elke aangemaakte of gewijzigde Brein-pagina: lees de pagina terug als markdown (`blocks get <id> --format markdown`, alle delen) en roep `indexeer_pagina` aan met page_id, titel, map en de volledige tekst. Voor een nieuwe of gewijzigde rij in Feiten: `indexeer_pagina` met page_id = item-id, map `Feiten`, titel = het feit, tekst = feit plus soort, over, bron, datum en status. Een verwijderde of samengevoegde pagina: `verwijder_pagina`.

## Paginasjablonen

Gebruik `documents create --title "<titel>" --folder <folderId>` en vul daarna de inhoud met `blocks add --id <rootBlockId> --markdown "..."` (zonder de titel te herhalen). Lees na het schrijven de pagina terug (`blocks get <id> --format markdown`) voordat je zegt dat het gelukt is.

### Persoon (titel: volledige naam)
```
**In één zin:** rol, organisatie, en wat hij/zij voor de eigenaar betekent.

## Relaties
- werkt bij → [Organisatie](block://…)

## Stand van zaken
- Rol en organisatie [Bron: …]
- Waar hij/zij nu mee bezig is [Bron: …]
- Wat hij/zij belangrijk vindt, standpunten [Bron: …]

## Relatie met de eigenaar
- Hoe ze elkaar kennen, gezamenlijke projecten (met links) [Bron: …]

## Open punten
- [ ] Afspraak of toezegging, met wie en wanneer [Bron: …]

## Tijdlijn
- **JJJJ-MM-DD** | Gebeurtenis — link naar gesprek of bron
```

### Organisatie (titel: naam organisatie)
```
**In één zin:** wat het is en waarom het voor de eigenaar relevant is.

## Relaties
- klant van → [Organisatie](block://…)

## Stand van zaken
- Wat ze doen, omvang, locatie [Bron: …]
- Relatie met de eigenaar / zijn projecten [Bron: …]

## Mensen
- [Naam](block://…) — rol

## Open punten

## Tijdlijn
- **JJJJ-MM-DD** | Gebeurtenis — link
```

### Gesprek (titel: `JJJJ-MM-DD – Onderwerp – met <naam/organisatie>`)
```
**Datum:** JJJJ-MM-DD · **Deelnemers:** [Naam](block://…), … · **Soort:** meeting / call / informeel

## Samenvatting
3–6 zinnen: waar ging het over, wat is de uitkomst.

## Besluiten
- …

## Afspraken
- [ ] Wie — wat — wanneer

## Opvallende uitspraken
> Letterlijk citaat — spreker

## Bron
Link naar transcript in Brein/Bronnen of de opname (Plaud).
```

### Idee of concept (titel: korte naam van het idee)
```
**In één zin:** de kern van het idee.

## Stand van zaken
De huidige, beste formulering. [Bron: …]

## Herkomst
Waar en wanneer het ontstond (links naar gesprekken, bronnen).

## Verwant
Links naar andere ideeën, mensen, projecten.

## Tijdlijn
- **JJJJ-MM-DD** | Hoe het idee zich ontwikkelde — link
```

## Bijwerken van een bestaande pagina

- Lees eerst de hele pagina (`blocks get <id> --format json`) om de blok-id's te kennen.
- **Stand van zaken** is een samenvatting: herschrijf een regel als het feit veranderd is (oude situatie mag tussen haakjes blijven: "nu bij X (eerder Y)").
- **Tijdlijn** is een logboek: alleen toevoegen, nooit herschrijven. Nieuwste onderaan.
- Voeg nieuwe regels toe met `blocks add --siblingId <laatste blok van die sectie> --position after`.

## Volledige synchronisatie van de zoekindex

Gebruik dit bij "indexeer mijn hele Brein", na de eerste installatie van de zoekdienst, en in de geplande nachtelijke taak.

1. Haal de index op met `index_status` (page_id, gewijzigd, indexed_at per pagina).
2. Haal per Brein-map de documenten op (`documents list --folder <folderId>` voor Mensen, Organisaties, Gesprekken, Ideeën & Concepten, Bronnen en Reflecties) en de rijen van de collectie Feiten (`collections items-get`). Sla "Over dit Brein" en het document Feiten zelf over.
3. Haal per document de wijzigingsdatum op: `blocks get <id> --depth 0 --fetchMetadata --format json` (veld `metadata.lastModifiedAt`); batch dit met puntkomma's.
4. Indexeer elk document dat niet in de index staat, of waarvan `lastModifiedAt` later is dan `indexed_at`: lees de volledige markdown (alle delen, volg `--cursor` tot het einde) en roep `indexeer_pagina` aan met `gewijzigd` = `lastModifiedAt`. Feiten: altijd opnieuw indexeren als de tekst verschilt; bij weinig rijen gewoon alle.
5. Roep `verwijder_pagina` aan voor elke page_id in de index die niet meer in een Brein-map of in Feiten voorkomt. (De index slaat Craft-id's op in kleine letters; vergelijk hoofdletterongevoelig.) **Uitzondering:** items met map "Documenten" of een page_id die begint met `gdrive:` zijn Google-documenten en staan bewust niet in Craft: nooit verwijderen.
6. Meld kort: hoeveel nieuw, bijgewerkt, verwijderd, ongewijzigd.

## Dagverwerking van Google-documenten

Een geplande taak (elke dag 23:41) verwerkt de Google-documenten die de eigenaar die dag heeft aangemaakt of bewerkt. De eigenaar heeft daar uitdrukkelijk toestemming voor gegeven:

- **Ruwe laag:** elk document gaat in de zoekindex met page_id `gdrive:<fileId>` (hoofdletters behouden) en map "Documenten". De documenten zelf worden nooit aangepast.
- **Oordeel:** bestaande Brein-pagina's krijgen Tijdlijn-regels (`Document: [titel](link)`), nieuwe feiten met `[Bron: Google Doc <titel>, JJJJ-MM-DD]` en afspraken bij Open punten.
- **Nieuwe personen en organisaties** worden alleen voorgesteld, op het dagverslag "JJJJ-MM-DD – Dagverwerking documenten" in Brein/Bronnen.
- Gevoelige privédocumenten (financiën, belasting, gezondheid, sollicitaties) worden overgeslagen.

## Skills ook in Craft (Brein/Werkwijze)

De Brein-skills staan als kopie in Brein/Werkwijze (één pagina "Skill: naam" per skill), zodat andere agents dezelfde werkwijze kunnen volgen. Bron van waarheid voor Claude blijft de skill in je Claude-account. Wordt een skill gewijzigd (via een voorstel dat de eigenaar opslaat), werk dan ook de Craft-pagina bij zodat beide gelijk blijven: vervang de inhoud van de pagina door de nieuwe versie, met bovenaan de kopieregel en de datum.

## Wat niet in het Brein hoort

- Wachtwoorden, rekeningnummers, BSN of andere identificatienummers.
- Gezondheidsinformatie over anderen, tenzij de eigenaar daar expliciet om vraagt.
- Roddel of oordelen over mensen die de eigenaar niet zelf zo heeft geformuleerd. Leg vast wat gezegd en gedaan is, met bron, geen eigen interpretaties.

## Na afloop melden

Sluit af met een korte lijst van wat er is aangemaakt of bijgewerkt, elk met een Craft-link: `craftdocs://open?spaceId=<SPACE_ID>&blockId=<rootBlockId>`.