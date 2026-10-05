import type { SupportedLanguage } from '../types/api';

const sv = [
  {
    icon: 'Code2',
    href: '/mjukvarukonsulting',
    title: 'Mjukvaru­konsulting',
    description:
      'Med vår expertis hjälper vi er att skapa digitala lösningar genom att kombinera nyfikenhet, \
precision och ett genuint engagemang. Vårt fokus är att bygga \
hållbara och tydliga system som gör verklig skillnad – för både \
team och verksamhet.',
    body: `Med vår expertis hjälper vi er att skapa digitala lösningar genom att kombinera nyfikenhet,
precision och ett genuint engagemang. Vårt fokus är att bygga
hållbara och tydliga system som gör verklig skillnad – för både
team och verksamhet.

När utvecklingsbehoven växer finns vi där – som en pålitlig
partner genom hela resan. Våra utvecklare och arkitekter kliver in
med säker hand och ny energi, redo att forma strukturer som fungerar
över tid.

Tillsammans med våra specialister inom kvalitetssäkring,
samarbetsflöden och moderna arbetssätt hjälper vi er att frigöra
potentialen i systemen och skapa resultat som märks – i stabilitet,
i tempo och i användarupplevelse.

Vi tror på att framgång byggs tillsammans – med tydlighet, lyhördhet
och fokus på lösningar som håller i längden. Tillsammans skapar vi
digital utveckling som gör skillnad, idag och imorgon.
`,
  },
  {
    icon: 'Users',
    href: '/ledarskapskonsulting',
    title: 'Ledarskaps­konsulting',
    description:
      'Vi förstärker organisationer genom att kombinera nyfikenhet, \
innovation och ett genuint engagemang. Vårt mål är att skapa \
inkluderande och hållbara lösningar som gör skillnad – för både \
människor och verksamhet.',
    body: `Vi förstärker organisationer genom att kombinera nyfikenhet,
innovation och ett genuint engagemang. Vårt mål är att skapa
inkluderande och hållbara lösningar som gör skillnad – för både
människor och verksamhet.

När förändring står för dörren är vi med er – som en partner ni kan
lita på. Våra interimsledare kliver in med trygg hand och ny energi,
redo att driva utvecklingen framåt. Tillsammans med våra experter inom
verksamhetsstyrning och processoptimering hjälper vi er att frigöra
potentialen i organisationen och skapa resultat som märks – både i
vardagen och på sista raden.

Vi tror på att utveckling sker tillsammans – med tydlighet, närvaro
och fokus på konkreta resultat. Tillsammans skapar vi framgång som
håller över tid.
`,
  },
  {
    icon: 'CalendarDays',
    href: '/events',
    title: 'Event',
    description:
      'Sist men inte minst skapar vi mötesplatser genom konferenser, \
workshops och andra tillställningar som inspirerar, fördjupar och bygger gemenskap. Vi vill gärna dela \
kunskap, väcka nyfikenhet och ge tillbaka till branschen och vår community.',
    body: `Vi arrangerar mötesplatser genom konferenser, workshops och andra \
events där kunskap, inspiration och gemenskap står i centrum. \
Genom att samla människor med olika erfarenheter och perspektiv vill vi \
skapa utrymme för lärande, samtal och nya idéer.

Målet är att dela erfarenheter på olika sätt, väcka nyfikenhet och bygga starka \
relationer som lever vidare även efter att eventet är slut – både \
inom branschen och bortom den.`,
  },
];

const en: typeof sv = [
  {
    icon: 'Code2',
    href: '/mjukvarukonsulting',
    title: 'Software Consulting',
    description:
      'With our expertise, we help you build digital solutions by combining curiosity, \
precision and genuine commitment. Our focus is on building \
sustainable, clear systems that make a real difference – for \
both the team and the business.',
    body: `With our expertise, we help you build digital solutions by combining curiosity,
precision and genuine commitment. Our focus is on building
sustainable, clear systems that make a real difference – for
both the team and the business.

When development needs grow, we're there – as a reliable
partner throughout the journey. Our developers and architects step in
with a steady hand and fresh energy, ready to shape structures that hold
up over time.

Together with our specialists in quality assurance,
collaboration flows and modern ways of working, we help you unlock
the potential in your systems and create results that are felt – in
stability, in pace, and in user experience.

We believe success is built together – with clarity, responsiveness,
and a focus on solutions that last. Together we create
digital development that makes a difference, today and tomorrow.
`,
  },
  {
    icon: 'Users',
    href: '/ledarskapskonsulting',
    title: 'Leadership Consulting',
    description:
      'We strengthen organizations by combining curiosity, \
innovation and genuine commitment. Our goal is to create \
inclusive, sustainable solutions that make a difference – for \
both people and the business.',
    body: `We strengthen organizations by combining curiosity,
innovation and genuine commitment. Our goal is to create
inclusive, sustainable solutions that make a difference – for
both people and the business.

When change is on the horizon, we're with you – as a partner you can
rely on. Our interim managers step in with a steady hand and fresh energy,
ready to drive progress forward. Together with our experts in
business governance and process optimization, we help you unlock
the potential in your organization and create results that are felt – both
day to day and on the bottom line.

We believe development happens together – with clarity, presence
and a focus on concrete results. Together we create success that
lasts.
`,
  },
  {
    icon: 'CalendarDays',
    href: '/events',
    title: 'Events',
    description:
      'Last but not least, we create meeting places through conferences, \
workshops and other gatherings that inspire, deepen knowledge and build community. We love sharing \
knowledge, sparking curiosity and giving back to the industry and our community.',
    body: `We arrange meeting places through conferences, workshops and other \
events where knowledge, inspiration and community take center stage. \
By bringing together people with different experiences and perspectives, we want to \
create space for learning, conversation and new ideas.

The goal is to share experiences in different ways, spark curiosity and build strong \
relationships that live on even after the event is over – both \
within the industry and beyond it.`,
  },
];

const content = { sv, en };

export function getServicesContent(lang: SupportedLanguage) {
  return content[lang];
}
