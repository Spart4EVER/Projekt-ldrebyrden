# Lokale events (app)

En moderne webapp hvor du kan finde, oprette og tilmelde dig lokale events i nærheden.

## Funktioner

- **Find events**: Gennemse events med søgning og kategorifilter
- **Opret events**: Opret nye events med sted, tid, kategori og beskrivelse
- **Tilmeld events**: Tilmeld dig events du er interesseret i og hold styr på dine tilmeldinger
- **Placering (GPS)**: Find events i nærheden via GPS-koordinater
- **Eventdetaljer**: Se fulde detaljer og antal deltagere
- **LocalStorage**: Events gemmes lokalt i din browser
- **Responsivt design**: Virker på desktop, tablet og mobil

## Kom godt i gang

1. Åbn `app/index.html` i din browser
2. Se events under fanen "Events"
3. Brug "📍 Find i nærheden" for at se events tæt på (kræver placeringstilladelse)
4. Opret et nyt event under fanen "Opret event"
5. Se dine tilmeldte events under fanen "Mine events"

## Brug

### Se events
- Se alle events under fanen "Events"
- Søg efter events via titel eller beskrivelse
- Filtrér efter kategori (Sport, Musik, Mad & drikke, Udendørs, Socialt, Uddannelse, Kunst & kultur)
- Se afstand til events, hvis du deler din placering

### Opret events
1. Gå til fanen "Opret event"
2. Udfyld detaljer (titel, dato, tidspunkt, sted)
3. Brug knappen "📍 Brug min placering" for at udfylde koordinater automatisk
4. Tilføj beskrivelse og maks. antal deltagere
5. Klik "Opret event" for at oprette

### Tilmeld/afmeld events
1. Klik på et event-kort for at se detaljer
2. Klik "Tilmeld event"
3. Se dine tilmeldte events under fanen "Mine events"
4. Klik "Forlad event" for at afmelde dig

## Tekniske detaljer

### Arkitektur
- **`EventManager`**: Håndterer event-logik og datalagring
- **`UIController`**: Styrer UI og brugerinteraktioner
- **LocalStorage**: Events gemmes i browserens localStorage

### Data
- Events gemmes i nøglen `events` i localStorage
- Tilmeldte events spores i nøglen `joinedEvents`
- Data bevares mellem browser-sessioner

### Funktioner
- Søgning og filtrering i realtid
- Afstandsberegning med Haversine-formlen
- Deltagersporing med kapacitetsgrænser
- Kategoribaseret organisering
- Standard demo-events

## Browser-kompatibilitet

- Chrome/Edge: ✓ Fuld support
- Firefox: ✓ Fuld support
- Safari: ✓ Fuld support
- Mobilbrowsere: ✓ Fuld support

## Teknologier

- HTML5
- CSS3 (med Flexbox og Grid)
- Vanilla JavaScript (ES6+)
- Browser-API'er (localStorage, Geolocation)

## Mulige forbedringer

- Filtrering efter afstands-radius
- Brugerlogin og profiler
- Kommentarer og ratings på events
- Push-notifikationer for kommende events
- Kalender-visning
- Eksport til kalender
- Deling på sociale medier
- Backend-server til central event-håndtering
- Admin-kontrol og moderation

## Noter

- Alle events gemmes lokalt i din browser
- Hvis du rydder browserdata, nulstilles appen
- Placering kræver bruger-tilladelse
- Afstand er “fugleflugtslinje” (ikke rejseafstand)
