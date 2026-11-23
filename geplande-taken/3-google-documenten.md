# Dagverwerking Google-documenten

**Schema:** dagelijks 23:41 (`CRON_TZ=Europe/Amsterdam 41 23 * * *`) · **Mag schrijven:** bestaande Brein-pagina's, verslag in Brein/Bronnen, zoekindex

```text
Verwerk de Google-documenten van vandaag in het Brein in Craft. de eigenaar heeft hiervoor uitdrukkelijk toestemming gegeven: deze geplande taak mag bestaande Brein-pagina's zelf bijwerken. Laad eerst de skill brein-basis en volg de spelregels (één pagina per entiteit, [Bron: …]-vermelding, links terug, Tijdlijn, brain-first: eerst zoeken met de connector Brein zoeken).

1. Documenten verzamelen. Gebruik de connector Google Drive (search_files) voor alle bestanden die in de afgelopen 24 uur zijn aangemaakt of gewijzigd: query (modifiedTime > '<nu min 24 uur, RFC 3339 UTC>' or createdTime > '<idem>') and mimeType != 'application/vnd.google-apps.folder' and trashed = false, met includeRichMetadata en pagineren tot het einde. Houd alleen bestanden die de eigenaar zelf in die periode heeft geopend of bewerkt (viewedByMeTime of zijn eigen wijziging binnen de periode, of door hem aangemaakt). Sla over: mappen, formulieren, en afbeeldingen en video's zonder tekst. Zijn er geen documenten: stop en meld dat in één zin.

2. Ruwe laag (zoekindex). Lees elk document met read_file_content en roep indexeer_pagina aan met page_id "gdrive:<fileId>" (hoofdletters van het id behouden), titel = documenttitel, map = "Documenten", gewijzigd = modifiedTime, tekst = de documenttekst (maximaal circa 30.000 tekens; bij langere documenten het begin plus de koppen). Laat wachtwoorden, API-sleutels, rekening-, kaart- en BSN-nummers weg uit de geïndexeerde tekst. Pas de Google-documenten zelf nooit aan.

3. Oordeel (Brein-pagina's). Haal per document eruit wat het Brein waard is: besluiten, afspraken (wie, wat, wanneer), nieuwe of gewijzigde feiten over mensen, organisaties, projecten en privézaken, en ideeën van de eigenaar. Ruwe teksten, opsommingen van contactlijsten en concepten zonder inhoud horen er niet in. Nooit vastleggen: wachtwoorden, sleutels, rekening-, kaart- of identificatienummers; gezondheidsinformatie over anderen alleen als de eigenaar daar zelf om vroeg.
   - Bestaande pagina's (zoek eerst met zoek en naamvarianten): voeg toe aan Tijdlijn "- **JJJJ-MM-DD** | Document: [<titel>](<viewUrl>) — één regel kern"; werk Stand van zaken alleen bij als er echt een feit bijkomt of verandert, met "[Bron: Google Doc <titel>, JJJJ-MM-DD]"; zet afspraken bij Open punten. Controleer eerst of hetzelfde document al eerder is verwerkt (Tijdlijn bevat al de link): voeg dan alleen wat nieuw is toe en maak geen dubbele regels. Tegenstrijdigheden niet stil oplossen maar beide vermelden.
   - Nieuwe personen of organisaties: maak GEEN nieuwe pagina's; zet ze als voorstel op het verslag (stap 4).
   - Indexeer elke bijgewerkte Brein-pagina opnieuw met indexeer_pagina (volledige markdown, juiste map).

4. Verslag. Maak in Brein/Bronnen (folderId <ID_BRONNEN>) één pagina "JJJJ-MM-DD – Dagverwerking documenten" met: verwerkte documenten (titel + link), bijgewerkte Brein-pagina's (block://-links, wat er veranderde), voorgestelde nieuwe pagina's (naam, waarom, uit welk document), overgeslagen documenten (titel en reden). Indexeer die pagina (map Bronnen).

Verplaats en verwijder niets in Craft of Drive. Eindig met één regel in het Nederlands: aantal documenten, bijgewerkte pagina's, voorstellen, en de Craft-link naar het verslag.
```
