import { getResponsiveImage, type ResponsiveImage } from '../config';
import type { SupportedLanguage } from '../types/api';

const people = [
  {
    name: 'Emil Sigvant',
    titleSv: 'Säljchef',
    titleEn: 'Head of Sales',
    phoneDisplay: '070-940 72 66',
    phoneNumber: '+46709407266',
    email: 'emil.sigvant@livingit.se',
    photo: getResponsiveImage('contact/emil-sigvant.jpg'),
  },
  {
    name: 'Paul Histrand',
    titleSv: 'VD Göteborg',
    titleEn: 'CEO Gothenburg',
    phoneDisplay: '073-330 38 30',
    phoneNumber: '+46733303830',
    email: 'paul.histrand@livingit.se',
    photo: getResponsiveImage('contact/paul-histrand.jpg'),
  },
  {
    name: 'Jesper Bjelvebo',
    titleSv: 'Affärsutvecklare Malmö',
    titleEn: 'Business Developer Malmö',
    phoneDisplay: '070-379 09 14',
    phoneNumber: '+46703790914',
    email: 'jesper.bjelvebo@livingit.se',
    photo: getResponsiveImage('contact/jesper-bjelvebo.jpg'),
  },
  {
    name: 'Victor Sigvardsson',
    titleSv: 'Affärsutvecklare Göteborg',
    titleEn: 'Business Developer Gothenburg',
    phoneDisplay: '070-815 18 53',
    phoneNumber: '+46708151853',
    email: 'victor.sigvardsson@livingit.se',
    photo: getResponsiveImage('contact/victor-sigvardsson.jpg'),
  },
  {
    name: 'Jörgen Nilsson',
    titleSv: 'Affärsutvecklare',
    titleEn: 'Business Developer',
    phoneDisplay: '076-832 90 22',
    phoneNumber: '+46768329022',
    email: 'jorgen.nilsson@livingit.se',
    photo: getResponsiveImage('contact/jorgen-nilsson.jpg'),
  },
  {
    name: 'Martin Stenlund',
    titleSv: 'Grundare och visionär',
    titleEn: 'Founder and Visionary',
    phoneDisplay: '072-201 07 20',
    phoneNumber: '+46722010720',
    email: 'martin.stenlund@livingit.se',
    photo: getResponsiveImage('contact/martin-stenlund.jpg'),
  },
  {
    name: 'Mattias Larsson',
    titleSv: 'Grundare och ordningsman',
    titleEn: 'Founder and Steward',
    phoneDisplay: '076-390 60 54',
    phoneNumber: '+46763906054',
    email: 'mattias.larsson@livingit.se',
    photo: getResponsiveImage('contact/mattias-larsson.jpg'),
  },
];

const company = {
  name: 'Living IT Consulting Group AB',
  orgNumber: '559291-3874',
  bankgiro: '5597-2194',
};

const sv = {
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
  company,
  people: people.map(({ name, titleSv, phoneDisplay, phoneNumber, email, photo }) => ({
    name,
    title: titleSv,
    phoneDisplay,
    phoneNumber,
    email,
    photo,
  })),
};

const en: typeof sv = {
  header: 'Contact us',
  contactGeneral: {
    icon: 'MessageCircle',
    text: `
Do you need an IT or leadership consultant? Curious to learn more about our events? 🤔

Send an email to ***hello@livingit.se*** or get in touch with one of our business developers below!`,
  },
  contactStart: {
    icon: 'Sparkles',
    text: `
  Curious what it's like to work with us? ⭐

  Or maybe you're simply ***ready to start Living IT?***

  Email ***start@livingit.se***, and we'll take it from there! 🙂`,
  },
  company,
  people: people.map(({ name, titleEn, phoneDisplay, phoneNumber, email, photo }) => ({
    name,
    title: titleEn,
    phoneDisplay,
    phoneNumber,
    email,
    photo,
  })),
};

const content = { sv, en };

export function getContactContent(lang: SupportedLanguage) {
  return content[lang];
}

export type ContactContent = typeof sv;
