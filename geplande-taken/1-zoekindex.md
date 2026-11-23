# Zoekindex bijwerken

**Schema:** dagelijks 02:47 (`CRON_TZ=Europe/Amsterdam 47 2 * * *`) · **Mag schrijven:** alleen de zoekindex

```text
Werk de zoekindex van het Brein bij. Laad de skill brein-basis en voer de sectie "Volledige synchronisatie van de zoekindex" uit: vergelijk de documenten in de Brein-mappen in Craft en de collectie Feiten met index_status van de connector Brein zoeken, indexeer nieuwe en gewijzigde pagina's met indexeer_pagina en haal verdwenen pagina's weg met verwijder_pagina. Belangrijk: items in de index met map "Documenten" of een page_id die begint met "gdrive:" zijn Google-documenten uit de dagverwerking en staan bewust niet in Craft — laat die altijd staan en verwijder ze nooit. Pas niets aan in Craft. Is de connector Brein zoeken in deze sessie niet beschikbaar, stop dan meteen en meld dat in één zin. Eindig met één regel: aantallen nieuw, bijgewerkt, verwijderd en ongewijzigd.
```
