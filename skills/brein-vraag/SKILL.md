---
name: "brein-vraag"
description: "Beantwoord vragen uit zijn Brein in Craft, met links naar de pagina's. Bij \"wat weet ik over…\", \"wie is…\", \"wat spraken we af met…\", \"zoek in mijn Brein\"."
---

# Brein-vraag — antwoorden uit het Brein

Lees eerst de skill **brein-basis** voor de mappen, folderId's en spelregels.

Deze skill **leest alleen**. Er wordt niets opgeslagen, tenzij de eigenaar daar daarna expliciet om vraagt.

## Stappen

1. **Begrijp de vraag.** Welke personen, organisaties, projecten of onderwerpen komen erin voor? Welke tijdsperiode?
2. **Zoek in het Brein.**
   - `search "<naam of trefwoord>" --limit 5` voor elke entiteit; probeer ook naamvarianten en synoniemen (Nederlands én Engels).
   - Controleer welke treffers in een Brein-map staan. Gebruik zo nodig `documents list --folder <folderId>` voor Mensen, Organisaties, Gesprekken of Ideeën & Concepten om titels te vergelijken.
   - Batch onafhankelijke zoekopdrachten met puntkomma's in één `craft_read`-aanroep.
3. **Lees de relevante pagina's.** `blocks get <rootBlockId> --format markdown`. Volg links:
   - `internal-links get --to-document <id>` toont welke pagina's ernaar verwijzen (backlinks), bijvoorbeeld alle gesprekken met een persoon.
   - `internal-links get --from-document <id>` toont waar een pagina naar linkt.
   Lees zo weinig pagina's als nodig; begin bij de entiteitspagina en de meest recente gesprekken.
4. **Kijk zo nodig buiten het Brein.** Staat het antwoord niet (volledig) in het Brein, zoek dan in de rest van Craft (bijvoorbeeld projectdocumenten onder Werk). Zeg er duidelijk bij dat die informatie van buiten het Brein komt. Pas daarna, en alleen als de vraag erom vraagt, het web.
5. **Antwoord.**
   - Begin met het antwoord zelf, kort en direct.
   - Zet bij elke bewering waar het vandaan komt, als Craft-link: `[paginatitel](craftdocs://open?spaceId=<SPACE_ID>&blockId=<rootBlockId>)`.
   - Neem de oorspronkelijke bronvermelding over als die ertoe doet ("volgens de eigenaar zelf", "uit het gesprek van 12 november").
   - Benoem tegenstrijdigheden tussen pagina's in plaats van er één te kiezen.
   - Benoem wat ontbreekt of verouderd lijkt (bijvoorbeeld: laatste tijdlijnregel is meer dan een half jaar oud).

## Als er niets gevonden wordt

Zeg niet alleen "niets gevonden". Meld welke zoektermen zijn geprobeerd, geef wat wél bekend is (ook van buiten het Brein), en bied in één zin aan om er een pagina voor te maken als het onderwerp dat waard is.

## Nieuwe informatie tijdens het gesprek

Vertelt de eigenaar iets nieuws terwijl hij een vraag stelt ("Jan zit trouwens nu bij Acme"), sla het niet automatisch op. Bied aan het bij te werken; doe het pas na een ja, volgens brein-basis.