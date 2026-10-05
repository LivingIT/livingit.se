import type { SupportedLanguage } from '../types/api';

const sv = [
  {
    groupTitle: 'Interim Management',
    items: [
      {
        icon: 'Zap',
        title: 'Krislösaren',
        description:
          'Vi dyker in när det blåser hårt – inte för att lappa ' +
          'ihop, utan för att vässa till. Vi rör om, hittar nya ' +
          'vägar och gör problemen till möjligheter. Snabbt, modigt ' +
          'och med massor av erfarenhet i bagaget.',
      },
      {
        icon: 'ShieldCheck',
        title: 'Trygga handen',
        description:
          'Behöver ni en kapten som håller kursen? Vi ser till att ' +
          'verksamheten flyter stabilt och tryggt – utan onödigt ' +
          'drama. En erfaren interimschef som styr, balanserar och ' +
          'skapar lugn i organisationen.',
      },
      {
        icon: 'Compass',
        title: 'Kompassen',
        description:
          'Vill ni ha en klok sparringpartner som både lyssnar och ' +
          'utmanar? Vi ser helheten, visar riktningen och guidar er ' +
          'säkert genom förändring. En senior ledare som blir din ' +
          'och organisationens egen strategiska vän.',
      },
    ],
  },
  {
    groupTitle: 'Projektledning',
    items: [
      {
        icon: 'Star',
        title: 'Visionären',
        description:
          'Snabb, flexibel och alltid steget före. Vi leder projekt ' +
          'med moderna metoder, skapar energi i teamet och får ' +
          'innovation att hända på riktigt. Resultatet? Leveranser i ' +
          'tid, inom budget – och med ett gäng motiverade människor ' +
          'på vägen.',
      },
      {
        icon: 'ChartBar',
        title: 'Strategiska mästaren',
        description:
          'Här får ni projektledaren som planerar, strukturerar och ' +
          'levererar med kirurgisk precision. Certifierad, trygg och ' +
          'van vid att hålla kursen i komplexa projekt. För er som ' +
          'vill ha tydlig riktning, smart riskhantering och en ' +
          'ledare som får styrgruppen att andas ut.',
      },
      {
        icon: 'Users',
        title: 'Relationsexperten',
        description:
          'Människor först – alltid. Vi bygger starka team som trivs, ' +
          'utvecklas och presterar på topp. Med fokus på ' +
          'kommunikation, kultur och samarbete förvandlar vi grupper ' +
          'till vinnarlag och projekt till framgångssagor.',
      },
    ],
  },
  {
    groupTitle: 'Förändringsledning',
    items: [
      {
        icon: 'Sparkles',
        title: 'Utveckla & förfina',
        description:
          'Vi skruvar, slipar och vässar det som redan finns. Små ' +
          'justeringar, stora resultat – utan krånglig ' +
          'förändringsresa. Tänk förfining av en klassiker, fast för ' +
          'era processer och system.',
      },
      {
        icon: 'Maximize2',
        title: 'Komplexa förflyttningar',
        description:
          'När pusslet blir knepigt är vi där. Vi tar oss an de ' +
          'riktigt kluriga projekten – de som kräver nya lösningar, ' +
          'smart anpassning och lite mer förändringsledning. Som att ' +
          'lösa Rubiks kub med precision och tålamod.',
      },
      {
        icon: 'Flame',
        title: 'Större transformationer',
        description:
          'Dags att tänka stort? Vi hjälper er att rita om kartan – i ' +
          'struktur, system och kultur. Här handlar det om modiga ' +
          'steg, radikala förändringar och att gå från gnistor till ' +
          'en hel galax av möjligheter.',
      },
    ],
  },
];

const en: typeof sv = [
  {
    groupTitle: 'Interim Management',
    items: [
      {
        icon: 'Zap',
        title: 'The Crisis Solver',
        description:
          'We step in when things get rough – not to patch things ' +
          'up, but to sharpen them. We shake things up, find new ' +
          'paths and turn problems into opportunities. Fast, bold ' +
          'and with plenty of experience in the bag.',
      },
      {
        icon: 'ShieldCheck',
        title: 'The Steady Hand',
        description:
          'Need a captain who holds the course? We make sure ' +
          'the business runs stably and safely – without unnecessary ' +
          'drama. An experienced interim manager who steers, balances and ' +
          'creates calm in the organization.',
      },
      {
        icon: 'Compass',
        title: 'The Compass',
        description:
          'Want a wise sparring partner who both listens and ' +
          'challenges? We see the big picture, point the way and guide you ' +
          'safely through change. A senior leader who becomes your ' +
          'and your organization\'s own strategic friend.',
      },
    ],
  },
  {
    groupTitle: 'Project Management',
    items: [
      {
        icon: 'Star',
        title: 'The Visionary',
        description:
          'Fast, flexible and always one step ahead. We lead projects ' +
          'with modern methods, create energy in the team and make ' +
          'innovation happen for real. The result? Deliveries on ' +
          'time, within budget – and with a bunch of motivated people ' +
          'along the way.',
      },
      {
        icon: 'ChartBar',
        title: 'The Strategic Master',
        description:
          'Here you get the project manager who plans, structures and ' +
          'delivers with surgical precision. Certified, steady and ' +
          'used to holding the course in complex projects. For those ' +
          'who want clear direction, smart risk management and a ' +
          'leader who makes the steering committee breathe out.',
      },
      {
        icon: 'Users',
        title: 'The Relationship Expert',
        description:
          'People first – always. We build strong teams that thrive, ' +
          'develop and perform at their best. With a focus on ' +
          'communication, culture and collaboration, we turn groups ' +
          'into winning teams and projects into success stories.',
      },
    ],
  },
  {
    groupTitle: 'Change Management',
    items: [
      {
        icon: 'Sparkles',
        title: 'Develop & Refine',
        description:
          'We tweak, polish and sharpen what\'s already there. Small ' +
          'adjustments, big results – without a complicated ' +
          'change journey. Think of it as refining a classic, but for ' +
          'your processes and systems.',
      },
      {
        icon: 'Maximize2',
        title: 'Complex Moves',
        description:
          'When the puzzle gets tricky, we\'re there. We take on the ' +
          'truly tricky projects – the ones that require new solutions, ' +
          'smart adaptation and a bit more change management. Like ' +
          'solving a Rubik\'s cube with precision and patience.',
      },
      {
        icon: 'Flame',
        title: 'Larger Transformations',
        description:
          'Time to think big? We help you redraw the map – in ' +
          'structure, systems and culture. This is about bold ' +
          'steps, radical change and going from sparks to ' +
          'a whole galaxy of possibilities.',
      },
    ],
  },
];

const content = { sv, en };

export function getConsultingIMContent(lang: SupportedLanguage) {
  return content[lang];
}
