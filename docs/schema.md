# Schema's

## Architectuur

```mermaid
flowchart TB
  subgraph Bronnen
    D["Google Docs<br/>(alleen lezen)"]
    O["Dagoverzicht<br/>andere agent, 08:00"]
    S["Sentient OS op de Mac<br/>lokaal model, 03:00"]
    E["Jij<br/>chat, Plaud, notities"]
  end
  subgraph Verwerking
    V["Claude-agents + brein-skills<br/>zoek eerst · werk bij · bron · links terug · indexeer"]
  end
  subgraph Opslag
    C[("Craft: map Brein<br/>Mensen · Organisaties · Gesprekken<br/>Ideeën & Concepten · Bronnen · Reflecties<br/>Werkwijze · Feiten")]
    Z[("Brein zoeken<br/>Cloudflare Worker + Vectorize + D1<br/>zoek · relaties · vergelijkbaar")]
  end
  subgraph Gebruik
    Q["Vragen en briefing<br/>brein-vraag · brein-briefing"]
    R["Reflectie<br/>brein-droom"]
    K["Controle<br/>brein-onderhoud"]
  end
  D --> V
  O --> V
  S --> V
  E --> V
  V -->|bijwerken| C
  V <-->|zoek / indexeer_pagina| Z
  C -->|sync 02:47| Z
  C --> Q
  C --> R
  Z --> K
```

## Dagritme

```mermaid
flowchart LR
  A["23:41<br/>Google-documenten"] --> B["02:47<br/>Zoekindex bijwerken"] --> C["03:00<br/>Sentient OS (Mac)"] --> D["03:29<br/>Dagdroom"] --> E["05:41<br/>Sentient verwerken"] --> F["08:00<br/>Dagoverzicht (andere agent)"] --> G["08:23<br/>Dagoverzicht verwerken"] --> H["09:00<br/>Alles staat klaar"]
```

Wekelijks: **zondag 19:42** de weekdroom (reflectie plus een lijst *Ter goedkeuring* met voorgestelde nieuwe pagina's) en **maandag 07:13** de controle (links terug, dubbelingen, verouderde info, zoekindex).

| Taak | Tijd | Mag schrijven | Prompt |
| --- | --- | --- | --- |
| Google-documenten | dagelijks 23:41 | bestaande pagina's + verslag | [3](../geplande-taken/3-google-documenten.md) |
| Zoekindex bijwerken | dagelijks 02:47 | alleen de index | [1](../geplande-taken/1-zoekindex.md) |
| Dagdroom | dagelijks 03:29 | alleen Reflecties | [2](../geplande-taken/2-dagdroom.md) |
| Sentient OS verwerken | dagelijks 05:41 | bestaande pagina's + verslag | [4](../geplande-taken/4-sentient-os.md) |
| Dagoverzicht verwerken | dagelijks 08:23 | bestaande pagina's + sectie op het overzicht | [5](../geplande-taken/5-dagoverzicht.md) |
| Wekelijkse controle | maandag 07:13 | niets, alleen rapport | [6](../geplande-taken/6-wekelijkse-controle.md) |
| Weekdroom | zondag 19:42 | alleen Reflecties | [7](../geplande-taken/7-weekdroom.md) |

## Skills

| Skill | Wanneer | Schrijft? |
| --- | --- | --- |
| brein-basis | vóór elke lees- of schrijfactie | — |
| brein-vraag | "wat weet ik over…", "wie is…" | nee |
| brein-vastleggen | "zet in mijn Brein…" | bestaande pagina's |
| brein-persoon | pagina maken of verrijken | nieuw na akkoord |
| brein-gesprek | opname, transcript of samenvatting | gesprekspagina + deelnemers |
| brein-briefing | dagbriefing, mail verwerken | bestaande pagina's |
| brein-droom | reflectie, patronen, voorstellen | alleen Reflecties |
| brein-onderhoud | links, dubbelingen, verouderde info | rapport; repareren na akkoord |
