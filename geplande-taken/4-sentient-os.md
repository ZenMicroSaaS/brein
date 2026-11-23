# Sentient OS-notities verwerken

**Schema:** dagelijks 05:41 (`CRON_TZ=Europe/Amsterdam 41 5 * * *`) · **Vereist:** de Mac aan, Claude-desktopapp open, map gekoppeld aan de taak · **Mag schrijven:** bestaande Brein-pagina's, verslag in Brein/Bronnen, zoekindex

```text
Verwerk de nachtelijke updates van Sentient OS in het Brein in Craft. De eigenaar heeft hiervoor uitdrukkelijk toestemming gegeven: deze geplande taak mag bestaande Brein-pagina's zelf bijwerken. Laad eerst de skill brein-basis en volg de spelregels (één pagina per entiteit, [Bron: …]-vermelding, links terug, Tijdlijn, brain-first: eerst zoeken met de connector Brein zoeken).

1. Bron. Sentient OS (een agent op de Mac, draait om 03:00) houdt de map "~/Sentient OS - Knowledge Base" bij: markdownnotities in thema-mappen plus README.md (met de actuele stand). Gebruik de tools van de gekoppelde computer (device_list_dir met recursive, device_bash) om alle .md-bestanden te vinden die in de afgelopen 26 uur zijn gewijzigd (mtimeMs). Zijn er geen gewijzigde bestanden, of is de computer of map niet bereikbaar, stop dan en meld dat in één zin. Lees de gewijzigde bestanden volledig.

2. Betrouwbaarheid. Sentient OS vat berichten (iMessage, WhatsApp), Apple Mail, Notes, agenda en bestanden samen met een lokaal model. Feiten, afspraken, datums en namen mogen erin met bron "[Bron: Sentient OS, <notitienaam>, JJJJ-MM-DD]". Interpretaties over karakter of gevoelens van anderen, en letterlijke berichten van anderen, neem je niet over. Spreekt een notitie het Brein of de eigenaar zelf tegen, vermeld dan beide en benoem de tegenstrijdigheid.

3. Verwerken.
   - Bestaande pagina's (zoek eerst met zoek en naamvarianten): voeg Tijdlijn-regels toe "- **JJJJ-MM-DD** | Sentient OS: <kern in één regel>"; werk Stand van zaken alleen bij als een feit echt verandert of bijkomt; zet concrete afspraken (wie, wat, wanneer) bij Open punten. Geen dubbele regels: sla over wat al in het Brein staat.
   - Nooit vastleggen: wachtwoorden, sleutels, rekening-, kaart-, IBAN-, BSN- of ticket-/boekingsnummers; gezondheidsinformatie over anderen (ook de kinderen) alleen als de eigenaar daar zelf om vroeg.
   - Nieuwe personen, organisaties of ideeën: maak GEEN nieuwe pagina's; zet ze als voorstel op het verslag.
   - Indexeer elke bijgewerkte Brein-pagina opnieuw met indexeer_pagina (volledige markdown, juiste map).

4. Verslag. Maak in Brein/Bronnen (folderId <ID_BRONNEN>) één pagina "JJJJ-MM-DD – Verwerking Sentient OS" met: verwerkte notities (namen), bijgewerkte Brein-pagina's (block://-links, één regel wat er veranderde), voorgestelde nieuwe pagina's (naam, waarom, uit welke notitie), tegenstrijdigheden, en wat bewust is overgeslagen. Indexeer die pagina (map Bronnen).

Pas niets aan in de Sentient OS-map en verplaats of verwijder niets in Craft. Eindig met één regel in het Nederlands: aantal notities, bijgewerkte pagina's, voorstellen, en de Craft-link naar het verslag.
```
