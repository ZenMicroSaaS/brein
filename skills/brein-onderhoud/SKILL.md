---
name: "brein-onderhoud"
description: "Controleer en onderhoud het Brein in Craft: ontbrekende links terug, dubbele of losse pagina's, verouderde info, open afspraken. Bij \"onderhoud/check mijn Brein\" of als periodieke taak."
---

# Brein-onderhoud — het Brein gezond houden

Lees eerst de skill **brein-basis** voor mappen, folderId's, sjablonen en spelregels.

Werkwijze: **eerst controleren en rapporteren, dan pas repareren na jouw akkoord.** Verwijder nooit iets zonder expliciete toestemming; samenvoegen of verwijderen gebeurt alleen per pagina na een ja.

## 1. Inventariseer

Haal per submap de documenten op met `documents list --folder <folderId>` (Mensen, Organisaties, Gesprekken, Ideeën & Concepten, Bronnen) en controleer de hoofdmap Brein op losse documenten. Batch de aanroepen met puntkomma's.

Bij een groot Brein (meer dan ±50 pagina's): controleer per keer één of twee mappen, of alleen pagina's die sinds de vorige controle zijn gewijzigd, en zeg dat erbij.

## 2. Controles

Voer deze controles uit, in deze volgorde:

1. **Ontbrekende links terug (de ijzeren wet).** Voor elke gesprekspagina: haal de uitgaande links op (`internal-links get --from-document <id>`). Elke gelinkte persoon of organisatie moet op zijn eigen pagina een tijdlijnregel met link naar dat gesprek hebben (`internal-links get --from-document <persoon-id>` moet het gesprek bevatten).
2. **Losse pagina's.** Pagina's in Mensen, Organisaties of Ideeën zonder enige inkomende link (`internal-links get --to-document <id>` leeg). Niet per se fout, wel melden.
3. **Dubbele pagina's.** Titels die op dezelfde persoon of organisatie lijken (alleen voornaam vs. volledige naam, afkortingen, spelling). Melden met beide links; niet zelf samenvoegen.
4. **Pagina's zonder bron.** Feiten in "Stand van zaken" zonder `[Bron: …]`.
5. **Verouderd.** Persoons- of organisatiepagina's waarvan de laatste tijdlijnregel ouder is dan zes maanden, terwijl ze als actief contact worden beschreven.
6. **Open punten.** Openstaande taken (`- [ ]`) in Gesprekken, Mensen en Organisaties die ouder zijn dan vier weken. Groepeer per persoon, met de afspraak en de datum van het gesprek.
7. **Verkeerde plek.** Pagina's die niet in hun map passen (bijvoorbeeld een projectdocument in het Brein, een gesprek in Mensen, een analyse in Bronnen) of documenten los in de hoofdmap Brein naast "Over dit Brein".
8. **Lege of halve pagina's.** Pagina's zonder "In één zin"-regel, met lege secties of met alleen een titel.

## 3. Rapporteer

Geef een kort rapport in de chat:

```
Brein-controle — JJJJ-MM-DD
Pagina's: X mensen, Y organisaties, Z gesprekken, … ideeën, … bronnen

Direct te repareren (geen inhoudelijke keuze nodig):
- N ontbrekende links terug — [lijst]
- …

Jouw keuze nodig:
- Mogelijk dubbel: [A] en [B]
- Verouderd: [pagina] — laatste update JJJJ-MM-DD
- …

Open afspraken ouder dan 4 weken:
- [persoon] — afspraak — uit [gesprek] (JJJJ-MM-DD)
```

Elke genoemde pagina als Craft-link: `craftdocs://open?spaceId=<SPACE_ID>&blockId=<rootBlockId>`.

Is alles in orde, zeg dat in één zin, met de aantallen.

## 4. Repareer (na akkoord)

- **Ontbrekende links terug:** tijdlijnregel toevoegen volgens brein-basis. Mag na een algemeen akkoord voor de hele lijst.
- **Pagina's zonder bron:** alleen een bron toevoegen als die aantoonbaar is (bijvoorbeeld uit het gelinkte gesprek); anders aan de eigenaar vragen.
- **Dubbele pagina's samenvoegen:** per paar akkoord vragen; inhoud van de ene in de andere overnemen (tijdlijnen samenvoegen op datum), links op andere pagina's omzetten, daarna de lege pagina naar de prullenbak (`documents delete`), alleen na een ja.
- **Verkeerde plek:** verplaatsen naar de juiste map na akkoord.
- **Open afspraken:** niet zelf afvinken; vraag de eigenaar welke klaar zijn.

Lees na het repareren de gewijzigde pagina's terug en meld wat er is aangepast.

## Als periodieke taak

Draait deze skill als geplande taak, dan alleen controleren en rapporteren (stap 1–3), niets repareren. Het rapport eindigt met de vraag welke reparaties de eigenaar wil laten uitvoeren.