---
name: "brein-briefing"
description: "Dagbriefing uit je agenda, mail en Brein in Craft, en e-mail verwerken in het Brein. Bij \"briefing\", \"wat staat er vandaag\", \"bereid mijn afspraak voor\", \"verwerk mijn mail in mijn Brein\"."
---

# Brein-briefing — agenda en e-mail met context uit het Brein

Lees eerst de skill **brein-basis** voor mappen, folderId's, zoekdienst en spelregels.

Deze skill heeft twee standen:
- **Briefing** — vooruitkijken: wat staat er vandaag (of op een gevraagde dag), en wat moet de eigenaar weten per afspraak.
- **Inbox naar Brein** — terugkijken: welke e-mail bevat informatie die in het Brein hoort.

Benodigde connectors: Google Agenda (`list_events`, `search_events`, `get_event`) en Gmail (`search_threads`, `get_thread`). Ontbreekt er een, doe dan wat met de andere kan en zeg in één zin welke koppeling ontbreekt.

## Stand 1 — Briefing

### 1. Haal de agenda op
Standaard vandaag (Europe/Amsterdam); bij "morgen" of een datum die dag. Gebruik `list_events` voor de primaire agenda. Sla privé-blokken zonder deelnemers en hele-dag-markeringen zonder inhoud over, tenzij ze relevant lijken.

### 2. Context per afspraak
Voor elke afspraak met andere deelnemers of een duidelijk onderwerp:
- Bepaal personen en organisaties: namen en e-maildomeinen van deelnemers, titel en beschrijving.
- Zoek ze in het Brein: `zoek` met naam of domein/organisatie, daarna `relaties` op de gevonden pagina's. Lees de persoons- of organisatiepagina en het meest recente gesprek (via de tijdlijn).
- Verzamel: wie is het (In één zin), laatste contact en uitkomst, **open afspraken in beide richtingen** (vooral die van de eigenaar), relevante feiten (collectie Feiten), en wat er sinds het laatste gesprek is veranderd.
- Zoek in Gmail naar recente mail met deze mensen: `search_threads` met `from:` / `to:` en `newer_than:14d`; lees de relevante threads met `get_thread` (de zoekresultaten tonen alleen de oudste berichten).
- Niets in het Brein? Zeg dat, en noem wat de agenda en mail wél vertellen.

### 3. Mail die aandacht vraagt
Zoek ongelezen of belangrijke mail van de afgelopen 24 uur (`is:unread newer_than:1d -category:promotions -category:social`) en licht eruit wat afkomstig is van mensen of organisaties uit het Brein of wat raakt aan lopende afspraken.

### 4. Lever de briefing
Kort en scanbaar, in de chat:

```
**Briefing — <dag> <datum>**

**09:30 – Overleg met [Naam](craftdocs-link) (Organisatie)**
Wie: één regel. Laatst: <datum> — kern. Open: de eigenaar → …; zij → …
Let op: wijziging of tegenstrijdigheid, indien relevant.

**Mail die ertoe doet**
- <afzender> — onderwerp — waarom relevant

**Jouw open afspraken die nu spelen**
- …
```

Afspraken zonder Brein-context krijgen één regel. Geen opvulling: als er niets bijzonders is, mag de briefing kort zijn.

Schrijf in deze stand niets in het Brein. Bied aan het eind hooguit aan om na een afspraak het gesprek te verwerken (skill brein-gesprek).

## Stand 2 — Inbox naar Brein

### 1. Haal de mail op
Standaard de afgelopen 7 dagen, inclusief verzonden mail: `search_threads` met `newer_than:7d -category:promotions -category:social -category:updates`. Lees kansrijke threads volledig met `get_thread`.

### 2. Selecteer
Neem alleen mail mee met inhoud die het Brein verrijkt over mensen, organisaties of ideeën die (bijna) in het Brein staan:
- afspraken en toezeggingen (van de eigenaar of aan de eigenaar)
- besluiten, offertes, contracten, data
- rolwisselingen, nieuwe contactpersonen, introducties
- inhoudelijke standpunten of ideeën

Sla over: nieuwsbrieven, notificaties, facturen zonder context, planning-heen-en-weer zonder inhoud, en alles wat privé of gevoelig is (gezondheid, persoonlijke kwesties van anderen) — dat nooit zonder jouw expliciete vraag.

### 3. Stel voor
Geef de eigenaar één lijst, gegroepeerd per Brein-pagina:
- `[Pagina]` — wat er bij moet (nieuw feit, tijdlijnregel, open punt) — uit mail "<onderwerp>" van <afzender>, <datum>
- Nieuwe pagina's die nodig zouden zijn (drempel uit brein-basis)

Wacht op akkoord. Draait dit als geplande taak: alleen de lijst opleveren, niets schrijven.

### 4. Schrijf (na akkoord)
- Tijdlijnregel: `- **JJJJ-MM-DD** | E-mail: <onderwerp> — <kern> [Bron: e-mail <afzender>, JJJJ-MM-DD]`. Voeg de Gmail-link (`viewUrl`) toe als die er is.
- Stand van zaken, open punten en feiten volgens brein-basis, met e-mail als bron.
- Neem geen volledige mails over; vat samen. Citeer alleen een korte, essentiële zin.
- Indexeer elke gewijzigde pagina (`indexeer_pagina`).

Meld daarna kort wat er waar is bijgewerkt.