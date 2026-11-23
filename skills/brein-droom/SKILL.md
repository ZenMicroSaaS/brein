---
name: "brein-droom"
description: "Wekelijkse droomronde over het Brein in Craft: reflectie met patronen, verschuivingen, open afspraken en voorstellen. Bij \"droomronde\", \"weekreflectie\", \"wat valt je op in mijn Brein\"."
---

# Brein-droom — de wekelijkse droomronde

Lees eerst de skill **brein-basis** voor mappen, folderId's, zoekdienst en spelregels.

GBrain laat 's nachts een "dream cycle" draaien die de gesprekken van de dag omzet in langetermijngeheugen: samenvatten, patronen zoeken, verbanden leggen. Deze skill doet dat wekelijks voor het Brein in Craft. Het resultaat is één reflectiepagina; **bestaande pagina's worden niet zelf aangepast**, maar als voorstel opgenomen, zodat de eigenaar kiest wat er doorgevoerd wordt.

## 1. Bepaal de periode

Standaard de afgelopen 7 dagen (of sinds de vorige reflectie in `Brein/Reflecties`, folderId `<ID_REFLECTIES>`; kijk naar de datum in de titel van de laatste).

## 2. Verzamel wat er nieuw is

- **Gesprekken** in Brein/Gesprekken met een datum in de periode (datum staat vooraan in de titel).
- **Gewijzigde pagina's** in Mensen, Organisaties en Ideeën & Concepten: `blocks get <id> --depth 0 --fetchMetadata --format json` en filter op `metadata.lastModifiedAt` in de periode. Of gebruik `index_status` van de zoekdienst (veld `gewijzigd`).
- **Nieuwe feiten** in de collectie Feiten met een datum in de periode.

Lees de gesprekken en gewijzigde pagina's volledig. Is er niets nieuw, maak dan geen reflectie maar meld dat in één zin.

## 3. Analyseer

Werk de volgende vragen af. Alles wat je opschrijft moet herleidbaar zijn tot een pagina in het Brein; noem geen getallen, datums of uitspraken die niet in de bron staan.

1. **Wat is er veranderd?** Per persoon of organisatie: welke nieuwe feiten, wisselingen, besluiten. Klopt de "Stand van zaken" nog met de nieuwste tijdlijnregels? Zo niet: formuleer de voorgestelde nieuwe regel.
2. **Terugkerende thema's.** Onderwerpen die in twee of meer gesprekken van deze periode (of van de periode daarvoor) terugkomen, bijvoorbeeld prijsmodellen, budgetdruk bij klanten, capaciteit. Gebruik `zoek` van de zoekdienst om te controleren of een thema ook al eerder in het Brein voorkwam.
3. **Tegenstrijdigheden.** Uitspraken in verschillende bronnen die elkaar tegenspreken. Benoem ze met beide bronnen.
4. **Open afspraken van de eigenaar.** Alle openstaande taken (`- [ ]`) waar de eigenaar eigenaar van is, oudste eerst, met bron. Markeer wat ouder is dan twee weken.
5. **Ontbrekende verbanden.** Pagina's die naar elkaar linken maar geen getypeerde relatie hebben waar dat wel zou passen (controleer met `relaties`); personen of organisaties die in meerdere gesprekken voorkomen maar nog geen eigen pagina hebben.
6. **Ideeën.** Gedachten of voorstellen die in meerdere gesprekken terugkomen en de moeite waard zijn als eigen pagina in Ideeën & Concepten. Gebruik `vergelijkbaar` om te kijken of er al een verwante ideepagina is.
7. **Wat de eigenaar zelf vindt.** Uitspraken van de eigenaar die een voorkeur of overtuiging laten zien en nog niet in Feiten staan.

## 4. Schrijf de reflectie

Maak in Brein/Reflecties een pagina `JJJJ-Www – Droomronde` (ISO-weeknummer), met:

```
**Periode:** JJJJ-MM-DD t/m JJJJ-MM-DD · **Bronnen:** N gesprekken, N gewijzigde pagina's, N nieuwe feiten

## In het kort
3–5 zinnen: wat speelde er deze week, wat valt op.

## Terugkerende thema's
- **Thema** — waar het terugkomt (links), wat de lijn is

## Tegenstrijdigheden
- … [bron A] vs [bron B]

## Open afspraken van de eigenaar
- [ ] afspraak — uit [gesprek] (datum) ⚠️ als ouder dan twee weken

## Voorstellen
### Stand van zaken bijwerken
- [Pagina](block://…): huidige regel → voorgestelde regel (bron)
### Nieuwe relaties
- [A](block://…) — soort → [B](block://…) (bron)
### Nieuwe pagina's
- Naam — waarom (genoemd in …)
### Nieuwe feiten
- Feit — soort — bron
### Ideeën
- Idee — waar het vandaan komt (links)
```

Laat secties zonder inhoud weg. Links altijd als `block://`. Indexeer de reflectie met `indexeer_pagina` (map `Reflecties`).

## 5. Afronden

- **Interactief** (de eigenaar is erbij): geef de kern in een paar regels met de link naar de reflectie, en vraag welke voorstellen doorgevoerd mogen worden. Voer gekozen voorstellen uit volgens brein-basis (inclusief tijdlijnregels, links terug en indexeren).
- **Als geplande taak**: voer niets door. Eindig met een korte samenvatting (wat speelt er, hoeveel voorstellen) en de link naar de reflectie, zodat de eigenaar er later naar kan kijken.