// ============================================
// SITE CONFIGURATION
// ============================================

// ============================================
// RESPONSIVE IMAGE UTILITIES
// ============================================

/**
 * Responsive image configuration for srcset and picture elements
 */
export interface ResponsiveImage {
  mobile: string;
  tablet: string;
  desktop: string;
}

/**
 * Creates a responsive image object from a base path
 * Automatically generates paths for mobile, tablet, and desktop versions
 * 
 * @param baseImagePath - The path without device prefix, e.g., "events/beautyincode.jpg" or "contact/emil-sigvant.jpg"
 * @returns ResponsiveImage object with mobile, tablet, and desktop paths
 * 
 * @example
 * const image = getResponsiveImage("events/beautyincode.jpg");
 * // Returns:
 * // {
 * //   mobile: "/images/mobile/events/beautyincode.jpg",
 * //   tablet: "/images/tablet/events/beautyincode.jpg",
 * //   desktop: "/images/desktop/events/beautyincode.jpg"
 * // }
 */
export function getResponsiveImage(baseImagePath: string): ResponsiveImage {
  // Remove leading slash if present
  const cleanPath = baseImagePath.replace(/^\/+/, '');

  return {
    mobile: `/images/mobile/${cleanPath}`,
    tablet: `/images/tablet/${cleanPath}`,
    desktop: `/images/desktop/${cleanPath}`,
  };
}

/**
 * Generates a srcset string from a ResponsiveImage object
 * 
 * @param image - ResponsiveImage object with mobile, tablet, and desktop paths
 * @returns srcset string for use in img elements
 * 
 * @example
 * const srcset = getImageSrcSet(getResponsiveImage("events/beautyincode.jpg"));
 * // Returns: "/images/mobile/events/beautyincode.jpg 640w, /images/tablet/events/beautyincode.jpg 1024w, /images/desktop/events/beautyincode.jpg 1920w"
 */
export function getImageSrcSet(image: ResponsiveImage): string {
  return image.mobile + ' 640w, ' + image.tablet + ' 1024w, ' + image.desktop + ' 1920w';
}

/**
 * Predefined sizes configurations for different image types
 */
export const imageSizes = {
  /** For contact/team member photos in a grid */
  contactPhoto: '(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw',

  /** For event images in alternating layout */
  eventImage: '(min-width: 768px) 33vw, 100vw',

  /** For hero carousel images */
  carouselImage: '(min-width: 1024px) 50vw, 100vw',
} as const;

export const siteConfig = {
  // ============================================
  // SITE METADATA & SEO
  // ============================================
  site: {
    name: 'Living IT',
    title: 'Living IT',
    description: 'Vi är ett konsultföretag i Malmö och Göteborg som värnar livet utanför jobbet – men alltid strävar efter att överträffa våra kunders förväntningar.',
    keywords: 'konsult, management, IT, Malmö, Göteborg',
    email: 'hello@livingit.se',
    url: 'https://livingit.se'
  },

  // ============================================
  // NAVIGATION
  // ============================================
  navigation: {
    links: [
      {
        name: 'Mjukvarukonsulting',
        href: '/mjukvarukonsulting',
        icon: 'Code2',
      },
      {
        name: 'Ledarskapskonsulting',
        href: '/ledarskapskonsulting',
        icon: 'Users',
      },
      {
        name: 'Events',
        href: '/events',
        icon: 'CalendarDays',
      },
    ],
    cta: {
      text: 'Kontakta oss',
      href: '/kontakt',
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
      getResponsiveImage('carousel/10.jpg'),
      getResponsiveImage('carousel/01.jpg'),
      getResponsiveImage('carousel/02.jpg'),
      getResponsiveImage('carousel/03.jpg'),
      getResponsiveImage('carousel/04.jpg'),
      getResponsiveImage('carousel/05.jpg'),
      getResponsiveImage('carousel/06.jpg'),
      getResponsiveImage('carousel/07.jpg'),
      getResponsiveImage('carousel/08.jpg'),
      getResponsiveImage('carousel/09.jpg'),
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
        address: 'Gustav Adolfs torg 12\n211 39 Malmö\nSverige',
        mapsUrl: 'https://maps.google.com/?q=55.60191580297133,12.999251168084095',
      },
      {
        title: 'Göteborg',
        address: 'Norra Hamngatan 18\n411 06 Göteborg\nSverige',
        mapsUrl: 'https://maps.google.com/?q=57.70710852992462,11.968320826032762',
      },
      {
      },
      {
        logo: '/images/logo-dark.svg',
        legalInfo: `Living IT Consulting Group AB\nVAT Number: SE559291387401\n© ${new Date().getFullYear()} Living IT`,
        social: [
          { name: 'LinkedIn', href: 'https://www.linkedin.com/company/living-it/', icon: 'linkedin' },
          { name: 'Facebook', href: 'https://www.facebook.com/LivingITConsulting', icon: 'facebook' },
          { name: 'Twitter', href: 'https://x.com/LivingITConsult', icon: 'twitter' },
          { name: 'Instagram', href: 'https://www.instagram.com/LivingITConsulting/', icon: 'instagram' },
          { name: 'Cookies', href: '#', icon: 'cookie', isCookieButton: true },
        ],
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
        Vi använder inga spårnings- eller analyscookies.',
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
