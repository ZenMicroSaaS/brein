---
name: "brein-gesprek"
description: "Verwerk een gesprek of meeting (Plaud-opname, transcript, notities of samenvatting) in het Brein in Craft: gesprekspagina plus updates van deelnemers en organisaties."
---

# Brein-gesprek — gesprekken verwerken in het Brein

Lees eerst de skill **brein-basis** voor de mappen, folderId's, sjablonen en spelregels. De aanroep van deze skill geldt als jouw opdracht om het gesprek op te slaan.

## 1. Haal de bron op

Mogelijke bronnen, in volgorde van voorkeur:

- **Plaud-opname** (alleen als de Plaud-tools beschikbaar zijn, dus als de Claude-desktopapp op je computer open is):
  - Zoek de opname met `plaud__list_files` (filter op `date_from`/`date_to`, eventueel `query` op naam).
  - Haal de samenvatting met `plaud__get_note` en het transcript met `plaud__get_transcript` (standaard `transaction`, met sprekers en tijden; blader verder met `next_cursor` tot het einde).
  - Haal ook `block: "mark_memo"` op: momenten waarop de eigenaar tijdens het gesprek op de knop drukte zijn extra belangrijk.
- **Transcript of notities** die de eigenaar plakt of bijvoegt.
- **Mondelinge samenvatting** van de eigenaar in de chat. Dat is ook een volwaardige bron: `[Bron: De eigenaar, <datum>]`.

Is onduidelijk welk gesprek bedoeld is of op welke datum, vraag het dan in één korte vraag.

## 2. Bewaar de ruwe bron (bij transcripten)

Bij een transcript van meer dan een paar alinea's: maak in **Brein/Bronnen** een pagina `JJJJ-MM-DD – Transcript – <onderwerp>` met de volledige tekst (sprekers en tijden behouden). Zo blijft de oorspronkelijke formulering terug te vinden. Mondelinge samenvattingen van de eigenaar hoeven geen aparte bronpagina.

## 3. Haal de inhoud eruit

- **Deelnemers** en andere genoemde **personen en organisaties**.
- **Waar het over ging en wat de uitkomst is.**
- **Besluiten** die genomen zijn.
- **Afspraken**: wie doet wat, wanneer. Ook toezeggingen van de eigenaar zelf.
- **Opvallende uitspraken**: alleen letterlijke citaten uit het transcript, nooit geparafraseerd als citaat.
- **Nieuwe feiten over mensen en organisaties**: rolwisselingen, plannen, standpunten, cijfers.
- **Ideeën** die het onthouden waard zijn.

## 4. Controleer wat er al is

Zoek voor elke persoon en organisatie of er al een Brein-pagina is (`search`, naamvarianten, `documents list --folder` voor Mensen en Organisaties). Maak een overzicht:

- bestaande pagina's die worden bijgewerkt
- voorgestelde **nieuwe** pagina's (alleen wie de drempel uit brein-basis haalt)
- genoemde namen die géén pagina krijgen

**Leg de voorgestelde nieuwe pagina's in één lijst aan de eigenaar voor** en wacht op akkoord. Bestaande pagina's bijwerken en de gesprekspagina maken mag zonder extra vraag.

## 5. Schrijf

In deze volgorde:

1. **Nieuwe persoons- en organisatiepagina's** (na akkoord), volgens het sjabloon, met wat uit dit gesprek bekend is. Geen lege pagina's: minstens de "In één zin"-regel en één feit met bron.
2. **De gesprekspagina** in **Brein/Gesprekken**, volgens het sjabloon `JJJJ-MM-DD – Onderwerp – met <naam/organisatie>`. Deelnemers en genoemde entiteiten als `block://`-links. Onder "Bron" een link naar de transcriptpagina of de naam en datum van de Plaud-opname.
3. **Bijwerken van elke betrokken persoon en organisatie** (de ijzeren wet):
   - Tijdlijn: `- **JJJJ-MM-DD** | Gesprek: [titel](block://<gesprek-id>) — één regel kern`
   - Stand van zaken: alleen bijwerken als er een feit is veranderd of bijgekomen, met `[Bron: gesprek <onderwerp>, JJJJ-MM-DD]`.
   - Open punten: afspraken met of van die persoon toevoegen als taak.
4. **Ideeën**: alleen een pagina in Ideeën & Concepten als de eigenaar dat wil of het idee duidelijk herbruikbaar is. Anders volstaat de vermelding op de gesprekspagina.
5. **Afspraken van de eigenaar zelf**: vraag of ze ook als taak in Craft (`tasks add`) moeten komen, met de deadline als die genoemd is.

Lees elke geschreven pagina terug voordat je zegt dat het gelukt is.

## 6. Meld het resultaat

Kort:
- de gesprekspagina (link)
- welke pagina's zijn bijgewerkt en aangemaakt (links)
- de afspraken, met wie wat wanneer doet
- wat bewust niet is opgeslagen, als dat relevant is

## Let op

- Twee personen met dezelfde naam: vraag welke bedoeld is in plaats van te gokken.
- Vertrouwelijke of gevoelige onderwerpen in het gesprek (gezondheid, conflicten, salarissen van anderen): niet overnemen op persoonspagina's tenzij de eigenaar dat expliciet wil; houd het bij een neutrale vermelding op de gesprekspagina en vraag het na.
- Sprekerlabels uit Plaud kunnen fout zijn ("Speaker 2"). Leid namen alleen af als het transcript het duidelijk maakt; vraag het anders na.