# Dagoverzicht verwerken

**Schema:** dagelijks 08:23 (`CRON_TZ=Europe/Amsterdam 23 8 * * *`) · **Vereist:** een andere agent die om 08:00 een dagoverzicht uit mail en agenda in Craft zet · **Mag schrijven:** bestaande Brein-pagina's, een sectie onder het dagoverzicht, zoekindex

```text
Verwerk het dagoverzicht van vandaag in het Brein in Craft. de eigenaar heeft hiervoor uitdrukkelijk toestemming gegeven: deze geplande taak mag bestaande Brein-pagina's zelf bijwerken. Laad eerst de skill brein-basis en volg de spelregels (één pagina per entiteit, [Bron: …]-vermelding, links terug, Tijdlijn, brain-first: eerst zoeken met de connector Brein zoeken). de eigenaar wil dat alles om 09:00 klaarstaat: werk vlot en zonder omwegen.

1. Bron. Een andere agent zet elke ochtend om 08:00 een pagina "JJJJ-MM-DD – Dagoverzicht" in Craft-map Brein/Bronnen/Dagoverzichten (folderId <ID_DAGOVERZICHTEN>). Zoek met documents list die van vandaag (Europe/Amsterdam); zijn er meerdere, neem de nieuwste. Ontbreekt die, stop dan en meld dat in één zin. Lees de volledige pagina (alle delen, volg --cursor tot het einde).

2. Betrouwbaarheid. Het dagoverzicht is een samenvatting door een andere agent. Feiten die het uit mail, agenda of Craft citeert (wie schreef wat, bedragen, datums, afspraken) mogen erin, met bron "[Bron: Dagoverzicht, JJJJ-MM-DD]" en een block://-link naar de dagoverzichtpagina. Prioriteiten, adviezen en "volgende stap"-voorstellen van de agent zijn zijn inschatting: neem die niet op als feit. Spreekt het overzicht een eerdere Brein-bron of de eigenaar zelf tegen, vermeld dan beide.

3. Verwerken. Voor elk onderdeel (projecten, privé, agenda, acties):
   - Bestaande pagina's (zoek eerst met zoek en naamvarianten): voeg een Tijdlijn-regel toe "- **JJJJ-MM-DD** | Dagoverzicht: [kern in één regel](block://<dagoverzicht-id>)"; werk Stand van zaken alleen bij als een feit echt verandert of bijkomt; zet concrete openstaande afspraken (wie, wat, wanneer, ook "wacht op …") bij Open punten, zonder dubbele regels. Sla dingen over die al in het Brein staan.
   - Bestaat er geen passende pagina, zet het als voorstel op het verslag.
   - Nooit vastleggen: wachtwoorden, API-sleutels, rekening-, kaart-, IBAN- of BSN-nummers; gezondheidsinformatie over anderen alleen als de eigenaar daar zelf om vroeg. Weer, verkeer en losse ontvangstbewijzen zonder vervolg horen er niet in.
   - Nieuwe personen of organisaties: maak GEEN nieuwe pagina's; zet ze als voorstel op het verslag.
   - Indexeer elke bijgewerkte Brein-pagina opnieuw met indexeer_pagina (volledige markdown, juiste map) en indexeer ook de dagoverzichtpagina zelf (map Bronnen).

4. Verslag. Voeg onderaan de dagoverzichtpagina een sectie "## Verwerkt in het Brein" toe met: bijgewerkte pagina's (block://-links, één regel wat er veranderde), voorgestelde nieuwe pagina's (naam, waarom), en wat bewust is overgeslagen. Pas de rest van de dagoverzichtpagina niet aan.

Verplaats en verwijder niets. Eindig met één regel in het Nederlands: aantal bijgewerkte pagina's, aantal voorstellen, en de Craft-link naar het dagoverzicht.
```
