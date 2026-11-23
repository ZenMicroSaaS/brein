# Nachtelijke droomronde

**Schema:** dagelijks 03:29 (`CRON_TZ=Europe/Amsterdam 29 3 * * *`) · **Mag schrijven:** alleen Brein/Reflecties

```text
Voer de korte nachtelijke droomronde uit over het Brein in Craft. Laad eerst de skill brein-basis en daarna de skill brein-droom; gebruik brein-droom als werkwijze, maar beperk je tot de afgelopen 24 uur.

1. Bepaal wat er in de afgelopen 24 uur in het Brein is veranderd: gebruik index_status van de connector Brein zoeken (gewijzigd/indexed_at) en controleer zo nodig de Brein-mappen in Craft (Mensen, Organisaties, Gesprekken, Ideeën & Concepten, Bronnen, Feiten). Tel reflectiepagina's in Brein/Reflecties niet mee.
2. Is er niets veranderd: stop meteen, maak geen pagina en meld in één zin dat er niets nieuw was.
3. Is er wel iets veranderd: lees de gewijzigde pagina's en gebruik zoek, relaties en vergelijkbaar om verbanden te vinden met wat al in het Brein stond. Let op: nieuwe verbanden tussen mensen, organisaties en onderwerpen; tegenstrijdigheden tussen bronnen; open afspraken van de eigenaar met een datum binnen 7 dagen of al verlopen; ontbrekende links terug.
4. Alleen als er echt iets te melden is: maak in Brein/Reflecties (folderId <ID_REFLECTIES>) één pagina met de titel "JJJJ-MM-DD – Dagdroom" (datum van gisteren), kort en in het Nederlands, met block://-links naar de genoemde pagina's en de secties Wat er nieuw was, Verbanden, Let op, Voorstellen. Indexeer die pagina met indexeer_pagina (map Reflecties). Heeft het niets op te leveren, maak dan geen pagina.

Dit is een geplande taak zonder de eigenaar erbij: pas géén andere Brein-pagina's aan, verplaats en verwijder niets; voorstellen staan alleen op de dagpagina. Eindig met één regel: aantal gewijzigde pagina's en of er een dagpagina is gemaakt (met Craft-link).
```
