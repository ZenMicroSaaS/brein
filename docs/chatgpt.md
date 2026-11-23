# Brein met ChatGPT

De Brein-kit is gebouwd en getest met Claude. De zoekdienst is een gewone MCP-server, dus andere assistenten die MCP ondersteunen kunnen hem ook gebruiken. Voor ChatGPT werkt het zo, met wat kanttekeningen.

> Niet getest met ChatGPT. De mogelijkheden verschillen per abonnement en veranderen snel: controleer de actuele documentatie van OpenAI.

## Wat overeenkomt

| Claude | ChatGPT |
| --- | --- |
| Aangepaste connector (MCP) | Aangepaste connector / app via de ontwikkelaarsmodus (Settings › Connectors › Advanced) |
| Skills | Projectinstructies, een eigen GPT, of de skill-tekst als bijlage in een project |
| Geplande taken | Taken (Tasks), voor zover je abonnement die met connectoren laat werken |
| Voorkeuren / geheugen | Custom instructions en geheugen |

## Stappen

1. **Zoekdienst.** Rol de zoekdienst uit zoals in [`zoekdienst/README.md`](../zoekdienst/README.md). ChatGPT kan alleen een **externe** MCP-server via HTTPS gebruiken; dat is de Cloudflare-worker al.
2. **Connector.** Zet in ChatGPT de ontwikkelaarsmodus aan en voeg de connector-URL toe als aangepaste connector. De sleutel zit in de URL; kies dus geen extra inlogmethode. Behandel de URL als een wachtwoord.
   - Let op: volgens OpenAI kunnen sommige abonnementen alleen lezen via aangepaste connectoren. Zoeken werkt dan wel, `indexeer_pagina` misschien niet.
3. **Werkwijze.** Maak een project of eigen GPT en plak de inhoud van [`skills/brein-basis/SKILL.md`](../skills/brein-basis/SKILL.md) in de instructies. Voeg de andere skills toe als bijlagen, of plak de skill die je nodig hebt in het gesprek.
4. **Opslag.** ChatGPT heeft geen Craft-connector die schrijft zoals in Claude. De makkelijkste route is een Markdown-map (zie [obsidian.md](obsidian.md)) die je via een andere MCP-server of via je computer laat bijwerken, of ChatGPT alleen laten **zoeken en antwoorden** terwijl Claude het bijhouden doet.

## Aanbevolen combinatie

Gebruik Claude voor het bijhouden (skills, geplande taken, schrijven in Craft) en geef ChatGPT dezelfde zoekconnector om vragen te beantwoorden. Beide werken dan op hetzelfde Brein.
