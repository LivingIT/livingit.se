import type { SupportedLanguage } from '../types/api';

const sv = [
  {
    icon: 'Code2',
    title: 'Kodarkitekten',
    description:
      'Våra utvecklare ser skönheten i ren kod och den lilla glädjen i ett väl namngivet interface. \
De ser helheten, hittar mönster och formar lösningar som håller – även när behoven växer och verkligheten förändras. \
Fokus ligger dock alltid på slutresultatet; vi bygger inte bara system – vi bygger trygghet, tydlighet och framtid.',
  },
  {
    icon: 'FlaskConical',
    title: 'Testpiloten',
    description:
      'Våra testare är nyfikna upptäckare som vet att kvalitet inte handlar om att aldrig göra misstag, utan om att alltid lära sig av dem. \
Det handlar inte om att bara trycka "Run Tests" – de tänker, ifrågasätter och verifierar. \
Helt enkelt testar med både hjärta och hjärna – för att våra kunder ska kunna sova gott om nätterna.',
  },
  {
    icon: 'Palette',
    title: 'Formgivaren',
    description:
      'Våra frontendare kombinerar kodhantverk med UX-förståelse för att skapa upplevelser som är begripliga, tillgängliga och pålitliga. \
Teknikmässigt anpassar de sig till kodbasen, eller hjälper till i beslut om vad som passar bäst för behovet. \
Med känsla för både beteenden, design och teknik formas flöden som håller ihop från första klick till sista interaktion.',
  },
  {
    icon: 'GraduationCap',
    title: 'Kunskapsspridaren',
    description:
      'Vi vet att kunskap växer bäst i en miljö där nyfikenhet uppmuntras och erfarenheter delas. \
Ibland sker det över en lunch hos kunden, ibland under en AW på egna kontoret med pizza och skratt. \
För oss handlar kompetensutveckling inte bara om kurser och certifikat, utan om att skapa en kultur där vi lär av varandra – varje dag.',
  },
  {
    icon: 'BrainCircuit',
    title: 'AI-tämjaren',
    description:
      'Vi ser bortom hypen och hjälper organisationer att förstå vad AI faktiskt kan göra – här och nu. \
Våra AI-konsulter kombinerar teknik, nyfikenhet och sunt förnuft för att guida från första idé till fungerande lösning. \
Ibland handlar det om att bygga eget, ibland om att välja rätt verktyg – men alltid med förståelse, ansvar och tydligt syfte.',
  },
  {
    icon: 'Lightbulb',
    title: 'Värdeskaparen',
    description:
      'Våra problemlösare rör sig tryggt i gränslandet mellan verksamhet, användare och teknik. \
Med nyfikenhet, struktur och affärsförståelse ser de till att rätt problem blir lösta, i rätt ordning och med rätt verktyg. \
För problemlösning handlar inte om att leverera mest kod – utan om att skapa verkligt värde som håller över tid.',
  },
  {
    icon: 'CloudCog',
    title: 'Molnmakaren',
    description:
      'Det spelar mindre roll vems moln det är; vi bygger lösningar som fungerar oavsett vilken leverantör som står bakom. \
Våra konsulter ser till att systemen pratar med varandra, skalar när de ska, och helt enkelt bara fungerar. \
Vi tänker arkitektur från början, automatiserar där det går och bygger robusta plattformar som klarar både vardag och tillväxt.',
  },
  {
    icon: 'GitBranchPlus',
    title: 'Devopsaren',
    description:
      'Allt ska flyta; från commit till produktion – utan drama, utan väntan. \
Vi gillar automation, pipelines och tydliga flöden som underlättar vardagen för alla i teamet. \
Devops för oss är inte bara teknik, det är ett löfte om smidighet, kvalitet och glädje i leveransen.',
  },
  {
    icon: 'MessageCircle',
    title: 'Teamkompisen',
    description:
      'Kod och teknik i all ära, det är så klart väldigt viktigt – men människor är viktigare. \
Vi tror på delade skratt, öppen feedback och en laganda som håller även under press när deadlines närmar sig. \
Våra konsulter tar ansvar, samarbetar i teamet och bygger kultur lika självklart som de bygger kod.',
  },
];

const en: typeof sv = [
  {
    icon: 'Code2',
    title: 'The Code Architect',
    description:
      'Our developers see the beauty in clean code and the small joy of a well-named interface. \
They see the big picture, spot patterns, and shape solutions that hold up – even as needs grow and reality changes. \
The focus is always on the end result; we don\'t just build systems – we build confidence, clarity and a future.',
  },
  {
    icon: 'FlaskConical',
    title: 'The Test Pilot',
    description:
      'Our testers are curious explorers who know that quality isn\'t about never making mistakes, but about always learning from them. \
It\'s not just about hitting "Run Tests" – they think, question and verify. \
They simply test with both heart and mind – so our clients can sleep soundly at night.',
  },
  {
    icon: 'Palette',
    title: 'The Designer',
    description:
      'Our frontend developers combine the craft of code with an understanding of UX to create experiences that are intuitive, accessible and reliable. \
Technically, they adapt to the codebase, or help decide what best fits the need. \
With a feel for behavior, design and technology alike, they shape flows that hold together from the first click to the last interaction.',
  },
  {
    icon: 'GraduationCap',
    title: 'The Knowledge Sharer',
    description:
      'We know knowledge grows best in an environment where curiosity is encouraged and experience is shared. \
Sometimes that happens over lunch at a client\'s office, sometimes during an after-work at our own office with pizza and laughs. \
For us, professional development isn\'t just about courses and certificates, but about creating a culture where we learn from each other – every day.',
  },
  {
    icon: 'BrainCircuit',
    title: 'The AI Tamer',
    description:
      'We look beyond the hype and help organizations understand what AI can actually do – here and now. \
Our AI consultants combine technology, curiosity and common sense to guide you from first idea to working solution. \
Sometimes it\'s about building your own, sometimes about choosing the right tool – but always with understanding, responsibility and clear purpose.',
  },
  {
    icon: 'Lightbulb',
    title: 'The Value Creator',
    description:
      'Our problem solvers move confidently in the space between business, users and technology. \
With curiosity, structure and business acumen, they make sure the right problems get solved, in the right order, with the right tools. \
Because problem solving isn\'t about delivering the most code – it\'s about creating real value that lasts.',
  },
  {
    icon: 'CloudCog',
    title: 'The Cloud Maker',
    description:
      'It matters less whose cloud it is; we build solutions that work regardless of the provider behind them. \
Our consultants make sure systems talk to each other, scale when they need to, and simply just work. \
We think architecture from the start, automate wherever we can, and build robust platforms that handle both everyday operations and growth.',
  },
  {
    icon: 'GitBranchPlus',
    title: 'The DevOps Engineer',
    description:
      'Everything should flow; from commit to production – without drama, without waiting. \
We love automation, pipelines and clear workflows that make everyday life easier for everyone on the team. \
To us, DevOps isn\'t just technology, it\'s a promise of agility, quality and joy in delivery.',
  },
  {
    icon: 'MessageCircle',
    title: 'The Team Player',
    description:
      'Code and technology are important, of course – but people matter more. \
We believe in shared laughs, open feedback and a team spirit that holds up even under pressure as deadlines approach. \
Our consultants take ownership, collaborate within the team, and build culture just as naturally as they build code.',
  },
];

const content = { sv, en };

export function getConsultingSWContent(lang: SupportedLanguage) {
  return content[lang];
}
