import { getResponsiveImage, type ResponsiveImage } from '../config';

export const contactContent = {
  header: 'Kontakta oss',

  contactGeneral: {
    icon: 'MessageCircle',
    text: `
Har ni behov av en IT- eller ledarskapskonsult? Intresserad av att veta mer om våra events? 🤔

Skicka ett mail till ***hello@livingit.se*** eller ta kontakt med någon av våra affärsutvecklare nedan!`,
  },
  contactStart: {
    icon: 'Sparkles',
    text: `
  Är du nyfiken på hur det är att jobba hos oss? ⭐
  
  Eller känner du dig rent av ***ready to start Living IT?***
  
  Maila ***start@livingit.se***, så tar vi det därifrån! 🙂`,
  },

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
      name: 'Jörgen Nilsson',
      title: 'Affärsutvecklare',
      phoneDisplay: '076-832 90 22',
      phoneNumber: '+46768329022',
      email: 'jorgen.nilsson@livingit.se',
      photo: getResponsiveImage('contact/jorgen-nilsson.jpg'),
    },
    {
      name: 'Martin Stenlund',
      title: 'Grundare och visionär',
      phoneDisplay: '072-201 07 20',
      phoneNumber: '+46722010720',
      email: 'martin.stenlund@livingit.se',
      photo: getResponsiveImage('contact/martin-stenlund.jpg'),
    },
    {
      name: 'Mattias Larsson',
      title: 'Grundare och ordningsman',
      phoneDisplay: '076-390 60 54',
      phoneNumber: '+46763906054',
      email: 'mattias.larsson@livingit.se',
      photo: getResponsiveImage('contact/mattias-larsson.jpg'),
    },
  ],
};
