import { getResponsiveImage, type ResponsiveImage } from '../config';
import type { SupportedLanguage } from '../types/api';

const sv = [
  {
    title: 'Beauty in Code',
    icon: 'MicVocal',
    body: `Första lördagen i mars arrangerar vi vår egna IT-konferens
**[Beauty in Code](https://beautyincode.se)**. Där har du möjlighet att lyssna på talare i
världsklass, träffa kollegor i branschen och fördjupa dig i aktuella
ämnen.

Vår tanke är att skapa en konferens för alla som är involverade inom
IT-industrin. Beauty in Code hålls alltid på en lördag för att så många
som möjligt ska kunna komma. Avgiften är låg, faktum är att du endast
betalar för lunch och fika – själva konferensen bjuder vi på! Vi ser
det som ett sätt att ge tillbaka till kunder, anställda och communityn.

Besök gärna **[beautyincode.se](https://beautyincode.se)** och läs mer om
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

const en: typeof sv = [
  {
    title: 'Beauty in Code',
    icon: 'MicVocal',
    body: `On the first Saturday of March, we run our own IT conference,
**[Beauty in Code](https://beautyincode.se)**. There you get to listen to world-class
speakers, meet colleagues from the industry, and dive deep into
current topics.

Our idea is to create a conference for everyone involved in the
IT industry. Beauty in Code is always held on a Saturday so that as many
people as possible can attend. The fee is low – in fact, you only
pay for lunch and coffee breaks, the conference itself is on us! We see
it as a way to give back to clients, employees, and the community.

Feel free to visit **[beautyincode.se](https://beautyincode.se)** to read more about
the conference and how to register! You can also watch previous years' talks there!`,
    images: [
      getResponsiveImage('events/beautyincode-1.jpg'),
      getResponsiveImage('events/beautyincode-2.jpg'),
      getResponsiveImage('events/beautyincode-3.jpg'),
    ],
    alt: 'Beauty in Code – speaker on stage',
  },
  {
    title: 'Workshops',
    icon: 'Users',
    body: `For those who want to go deep on a topic, we organize smaller-format
workshops. Here we invite external experts and speakers and
limit the number of participants to create space for dialogue, reflection,
and real learning.

The workshops can run for half a day or a full day and often combine theory
with hands-on exercises, discussions, and concrete real-world
examples. The focus is on really digging into a topic
– beyond quick presentations and surface-level overviews.

Our workshops are open to both our employees and external
participants who want to grow together with us.`,
    images: [
      getResponsiveImage('events/workshop-1.jpg'),
      getResponsiveImage('events/workshop-2.jpg'),
      getResponsiveImage('events/workshop-3.jpg'),
    ],
    alt: 'Workshop – participants in a lounge setting',
  },
  {
    title: 'IT Movie Night',
    icon: 'Film',
    body: `Twice a year – once in spring and once in autumn – we host an
IT movie night. It's our way of thanking our families, friends, clients,
and industry colleagues for everything they've done and continue to do for us.

In Malmö, we naturally go to Royal, Malmö's oldest and largest cinema.
Built in 1961 and seating 500, it's a fantastic venue for our events.
In Gothenburg, we use Biopalatset, also a spacious theater with modern technology.

Grab your popcorn and a drink, settle into your seat, and get ready for
tonight's film!`,
    images: [
      getResponsiveImage('events/it-bio-1.jpg'),
      getResponsiveImage('events/it-bio-2.jpg'),
      getResponsiveImage('events/it-bio-3.jpg'),
    ],
    alt: 'IT Movie Night – presentation before the screening',
  },
  {
    title: 'IT Weekend',
    icon: 'CalendarDays',
    body: `To really dive deep into a topic, all employees gather at a
spa, a manor house, an inn, or similar for a
fantastically fun and inspiring weekend. We bring in an expert who
combines talks with hands-on exercises on some interesting topic.

The combination of workshops and social activities gives us not just new
knowledge, but also tons of energy and joy!`,
    images: [
      getResponsiveImage('events/it-helg-1.jpg'),
      getResponsiveImage('events/it-helg-2.jpg'),
      getResponsiveImage('events/it-helg-3.jpg'),
    ],
    alt: 'IT Weekend – talk in front of a group',
  },
];

const content = { sv, en };

export function getEventsContent(lang: SupportedLanguage) {
  return content[lang];
}
