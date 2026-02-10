import { getResponsiveImage, type ResponsiveImage } from '../config';

export const eventsContent = [
  {
    title: 'Beauty in Code',
    icon: 'MicVocal',
    body: `Första lördagen i mars arrangerar vi vår egna IT-konferens
**[Beauty in Code](https://beautincode.se)**. Där har du möjlighet att lyssna på talare i
världsklass, träffa kollegor i branschen och fördjupa dig i aktuella
ämnen.

Vår tanke är att skapa en konferens för alla som är involverade inom
IT-industrin. Beauty in Code hålls alltid på en lördag för att så många
som möjligt ska kunna komma. Avgiften är låg, faktum är att du endast
betalar för lunch och fika – själva konferensen bjuder vi på! Vi ser
det som ett sätt att ge tillbaka till kunder, anställda och communityn.

Besök gärna **[beautyincode.se](https://beautincode.se)** och läs mer om
konferensen och hur du anmäler dig! Där kan du också titta på tidigare års föreläsningar!`,
    images: [
      getResponsiveImage('events/beautyincode-1.jpg'),
      getResponsiveImage('events/beautyincode-2.jpg'),
      getResponsiveImage('events/beautyincode-3.jpg'),
    ],
    alt: 'Beauty in Code – föreläsare på scen',
  },
  {
    title: 'Workshops',
    icon: 'Users',
    body: `För dig som vill gå på djupet i ett ämne arrangerar vi workshops i
mindre format. Här bjuder vi in externa experter och föreläsare och
begränsar deltagarantalet för att skapa utrymme för dialog, reflektion
och verkligt lärande.

Workshoparna kan vara en halv- eller heldag och kombinerar ofta teori
med praktiska övningar, diskussioner och konkreta exempel från
verkligheten. Fokus ligger på att verkligen grotta ner sig i ett ämne
– bortom snabba presentationer och ytliga genomgångar.

Våra workshops är öppna både för våra anställda och för externa
deltagare som vill utvecklas tillsammans med oss.`,
    images: [
      getResponsiveImage('events/workshop-1.jpg'),
      getResponsiveImage('events/workshop-2.jpg'),
      getResponsiveImage('events/workshop-3.jpg'),
    ],
    alt: 'Workshop – deltagare i loungemiljö',
  },
  {
    title: 'IT-bio',
    icon: 'Film',
    body: `Två gånger om året – en gång på våren och en på hösten – bjuder vi in
till IT-bio. Det är vårt sätt att tacka våra familjer, vänner, kunder
och branschkollegor för allt de gjort och fortsätter göra för oss.

I Malmö kör vi naturligtvis på Royal, som är Malmös äldsta och största biograf.
Den byggdes 1961 och är med sina 500 sittplatser en fantastisk lokal för våra events.
I Göteborg håller vi till på Biopalatset, också en rymlig salong med modern teknik.

Ta din popcorn och dricka, slå dig ner i salongen och gör dig redo för
kvällens film!`,
    images: [
      getResponsiveImage('events/it-bio-1.jpg'),
      getResponsiveImage('events/it-bio-2.jpg'),
      getResponsiveImage('events/it-bio-3.jpg'),
    ],
    alt: 'IT-bio – presentation före filmvisning',
  },
  {
    title: 'IT-helg',
    icon: 'CalendarDays',
    body: `För att riktigt kunna fördjupa oss i ett ämne så samlas alla
anställda på ett spa, en herrgård, ett gästgiveri eller liknande för en
fantastiskt rolig och inspirerande helg. Med oss har vi en expert som
kombinerar föreläsningar med hands-on övningar i något intressant ämne.

Kombinationen av workshops och sociala aktiviteter ger oss inte bara ny
kunskap, utan också massor av energi och glädje!`,
    images: [
      getResponsiveImage('events/it-helg-1.jpg'),
      getResponsiveImage('events/it-helg-2.jpg'),
      getResponsiveImage('events/it-helg-3.jpg'),
    ],
    alt: 'IT-helg – föreläsning inför grupp',
  },
];
