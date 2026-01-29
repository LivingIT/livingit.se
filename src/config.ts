// ============================================
// SITE CONFIGURATION
// ============================================

export const siteConfig = {
  // ============================================
  // SITE METADATA & SEO
  // ============================================
  site: {
    name: 'Living IT',
    title: 'Living IT - Dreaming today, living it tomorrow.',
    description:
      'Vi är ett konsultföretag i Malmö och Göteborg som tycker att familjen, vännerna och fritiden är det viktigaste vi har, men när vi är på jobbet gör vi alltid vårt bästa för att leverera över våra kunders förväntningar.',
    keywords:
      'konsult, management, IT, Malmö, Göteborg',
    email: 'hello@livingit.se',

    // Open Graph / Twitter
    ogTitle: 'Living IT - Dreaming today, living it tomorrow.',
    ogDescription:
      'Vi är ett konsultföretag i Malmö och Göteborg som tycker att familjen, vännerna och fritiden är det viktigaste vi har, men när vi är på jobbet gör vi alltid vårt bästa för att leverera över våra kunders förväntningar.',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Living IT',
    twitterDescription: 'Dreaming today, living it tomorrow.',
  },

  // ============================================
  // NAVIGATION
  // ============================================
  navigation: {
    links: [
      {
        name: 'Mjukvarukonsulting',
        href: '/mjukvarukonsulting',
        icon: 'heroicons:code-bracket',
      },
      {
        name: 'Ledarskapskonsulting',
        href: '/ledarskapskonsulting',
        icon: 'heroicons:user-group',
      },
      {
        name: 'Evenemang',
        href: '/evenemang',
        icon: 'heroicons:calendar-days',
      },
    ],
    cta: {
      text: 'Kontakta oss',
      href: '#contact',
    },
  },

  // ============================================
  // HERO SECTION
  // ============================================
  hero: {
    headline: 'Dreaming today,',
    subheadline: 'living it tomorrow.',
    description:
      'Vi är ett konsultföretag i Malmö och Göteborg som tycker att familjen, vännerna och fritiden är det viktigaste vi har, men när vi är på jobbet gör vi alltid vårt bästa för att leverera över våra kunders förväntningar.',
  },

  // ============================================
  // HERO CAROUSEL / ABOUT SECTION
  // ============================================
  heroCarousel: {
    images: [
      {
        mobile: '/images/carousel/mobile/carousel01.jpg',
        tablet: '/images/carousel/tablet/carousel01.jpg',
        desktop: '/images/carousel/desktop/carousel01.jpg',
      },
      {
        mobile: '/images/carousel/mobile/carousel02.jpg',
        tablet: '/images/carousel/tablet/carousel02.jpg',
        desktop: '/images/carousel/desktop/carousel02.jpg',
      },
      {
        mobile: '/images/carousel/mobile/carousel03.jpg',
        tablet: '/images/carousel/tablet/carousel03.jpg',
        desktop: '/images/carousel/desktop/carousel03.jpg',
      },
      {
        mobile: '/images/carousel/mobile/carousel04.jpg',
        tablet: '/images/carousel/tablet/carousel04.jpg',
        desktop: '/images/carousel/desktop/carousel04.jpg',
      },
      {
        mobile: '/images/carousel/mobile/carousel05.jpg',
        tablet: '/images/carousel/tablet/carousel05.jpg',
        desktop: '/images/carousel/desktop/carousel05.jpg',
      },
      {
        mobile: '/images/carousel/mobile/carousel06.jpg',
        tablet: '/images/carousel/tablet/carousel06.jpg',
        desktop: '/images/carousel/desktop/carousel06.jpg',
      },
    ],
    imageAltPrefix: 'Living IT carousel image',
    intervalMs: 4500,
    markdown: `## The Living IT Way

För oss handlar The Living IT Way inte om vilket yrke du har, \
utan hur du möter människor – kollegor såväl som kunder. \
Vi tror på balans. Att livet utanför jobbet är det som ger energi \
till det vi gör på jobbet.

**Familj, vänner, fritid – det är där allt börjar.** \
Det spelar ingen roll om du har en stor eller liten familj, \
om du umgås med hundra vänner eller några få nära, \
om du springer milen, spelar brädspel eller helst kryper upp i soffan med en film.<br />
Det viktiga är att du, när arbetsdagen är slut, \
har både tid och ork kvar till det som betyder mest för dig.

**När människor mår bra, blir resultaten bättre.** \
Vi lägger lika mycket kraft på trygghet och trivsel som på teknik och leverans.<br />
Vi satsar på kompetensutveckling, schyssta villkor och marknadens bästa lönemodell – \
en unik kombination av tryggheten i en anställning och friheten som egenföretagare.

**Och våra kunder? De får samma omtanke.** \
Vi anställer bara erfarna konsulter med hög kompetens och starkt ansvarstagande. \
Det är viktigt för oss att dela kunskap, bygga tillsammans och se till att \
inget projekt står still om någon blir sjuk eller går vidare.<br />
Skulle någon av våra konsulter vilja lämna Living IT påverkar det inte kunden. \
Avtalen är fria från klausuler som förhindrar öppet samarbete. \
Här sticker vi ut från mängden, och det är vi stolta över.

Det är så vi arbetar.<br />
Tryggt, öppet och mänskligt.<br />
Det är **The Living IT Way**.`
  },

  // ============================================
  // SERVICES SECTION
  // ============================================
  services: {
    title: 'Vad vi gör',
    subtitle:
      'Här är de tjänster vi erbjuder våra kunder för att hjälpa dem nå sina mål:',
  },





  // ============================================
  // FOOTER
  // ============================================
  footer: {
    columns: [
      {
        title: 'Malmö',
        address: 'Gustav Adolfs torg 12\n211 39 Malmö\nSweden',
        mapsUrl: 'https://maps.google.com/?q=55.60191580297133,12.999251168084095',
        links: [],
      },
      {
        title: 'Göteborg',
        address: 'Norra Hamngatan 18\n411 06 Göteborg\nSweden',
        mapsUrl: 'https://maps.google.com/?q=57.70710852992462,11.968320826032762',
        links: [],
      },
      {
        title: 'Följ oss',
        social: [
          { name: 'LinkedIn', href: 'https://www.linkedin.com/company/living-it/', icon: 'linkedin' },
          { name: 'Facebook', href: 'https://www.facebook.com/LivingITConsulting', icon: 'facebook' },
          { name: 'Twitter', href: 'https://x.com/LivingITConsult', icon: 'twitter' },
          { name: 'Instagram', href: 'https://www.instagram.com/LivingITConsulting/', icon: 'instagram' },
        ],
      },
      {
        logo: '/images/logo-dark.svg',
        legalInfo: `Living IT Consulting Group AB\nVAT Number: SE559291387401\n© ${new Date().getFullYear()} Living IT`,
        showCookieButton: true,
      },
    ],
  },

  // ============================================
  // COOKIE POLICY
  // ============================================
  cookies: {
    banner: {
      titleSv: 'Cookiesamtycke',
      descriptionSv:
        'Vi använder endast cookies för rent tekniska ändamål för att förbättra din webbupplevelse. \
        Vi använder inga spårnings- eller analyskookies.',
      acceptTextSv: 'Jag förstår',
      policyLinkTextSv: 'Läs mer om vår cookie-policy',
    },
    policy: {
      titleSv: 'Cookie Policy',
      lastUpdatedSv: 'Senast uppdaterad',
      essential: {
        titleSv: 'Nödvändiga Cookies (Tekniska)',
        descriptionSv:
          'Dessa cookies är nödvändiga för att sajten ska fungera. De sparar inte personlig data \
          och kan inte avaktiveras.',
        examples: ['Säkerhet', 'Load balancing'],
      }
    },
  },
};
