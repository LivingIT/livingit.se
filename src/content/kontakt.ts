import { getResponsiveImage, type ResponsiveImage } from '../config';

export const kontaktContent = {
  header: 'Kontakta oss',
  ingress: `Är du nyfiken på att börja jobba hos oss?
Har ni behov av en IT- eller ledarskapskonsult?

Intresserad av att veta mer om våra events?

**Hör av dig, så tar vi det därifrån!**`,
  company: {
    name: 'Living IT Consulting Group AB',
    orgNumber: '559291-3874',
    bankgiro: '5597-2194',
  },
  people: [
    {
      name: 'Emil Sigvant',
      title: 'Säljchef',
      phoneDisplay: '070-940 72 66',
      phoneNumber: '+46709407266',
      email: 'emil.sigvant@livingit.se',
      photo: getResponsiveImage('contact/emil-sigvant.jpg'),
    },
    {
      name: 'Paul Histrand',
      title: 'VD Göteborg',
      phoneDisplay: '073-330 38 30',
      phoneNumber: '+46733303830',
      email: 'paul.histrand@livingit.se',
      photo: getResponsiveImage('contact/paul-histrand.jpg'),
    },
    {
      name: 'Jesper Bjelvebo',
      title: 'Affärsutvecklare Malmö',
      phoneDisplay: '070-379 09 14',
      phoneNumber: '+46703790914',
      email: 'jesper.bjelvebo@livingit.se',
      photo: getResponsiveImage('contact/jesper-bjelvebo.jpg'),
    },
    {
      name: 'Victor Sigvardsson',
      title: 'Affärsutvecklare Göteborg',
      phoneDisplay: '070-815 18 53',
      phoneNumber: '+46708151853',
      email: 'victor.sigvardsson@livingit.se',
      photo: getResponsiveImage('contact/victor-sigvardsson.jpg'),
    },
    {
      name: 'Daniel Weberg',
      title: 'Ledarskapskonsult',
      phoneDisplay: '076-119 49 96',
      phoneNumber: '+46761194996',
      email: 'daniel.weberg@livingit.se',
      photo: getResponsiveImage('contact/daniel-weberg.jpg'),
    },
    {
      name: 'Linn Wähler',
      title: 'Ledarskapskonsult',
      phoneDisplay: '070-972 27 62',
      phoneNumber: '+46709722762',
      email: 'linn.wahler@livingit.se',
      photo: getResponsiveImage('contact/linn-wahler.jpg'),
    },
    {
      name: 'Martin Stenlund',
      title: 'Grundare och visionär',
      phoneDisplay: '0722-01 07 20',
      phoneNumber: '+46722010720',
      email: 'martin.stenlund@livingit.se',
      photo: getResponsiveImage('contact/martin-stenlund.jpg'),
    },
    {
      name: 'Mattias Larsson',
      title: 'Grundare och ordningsman',
      phoneDisplay: '0763-90 60 54',
      phoneNumber: '+46763906054',
      email: 'mattias.larsson@livingit.se',
      photo: getResponsiveImage('contact/mattias-larsson.jpg'),
    },
  ],
};
