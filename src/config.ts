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
    email: 'info@livingit.se',
    url: 'https://livingit.se'
  },

  // ============================================
  // NAVIGATION
  // ============================================
  // Labels come from t.siteNav in src/i18n — href/icon are locale-independent.
  navigation: {
    links: [
      {
        key: 'software',
        href: '/mjukvarukonsulting',
        icon: 'Code2',
      },
      {
        key: 'leadership',
        href: '/ledarskapskonsulting',
        icon: 'Users',
      },
      {
        key: 'events',
        href: '/events',
        icon: 'CalendarDays',
      },
    ],
    cta: {
      href: '/kontakt',
    },
  },

  // ============================================
  // HERO SECTION
  // ============================================
  // headline/subheadline are the English brand tagline, kept identical across
  // locales. description comes from t.hero.description.
  hero: {
    headline: 'Dreaming today,',
    subheadline: 'living it tomorrow.',
  },

  // ============================================
  // HERO CAROUSEL / ABOUT SECTION
  // ============================================
  // imageAltPrefix/markdown come from t.heroCarousel.
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
    intervalMs: 4500,
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
        title: 'Helsingborg',
        address: 'Redaregatan 48\n252 36 Helsingborg\nSverige',
        mapsUrl: 'https://maps.google.com/?q=56.04241359644715,12.690902828836114',
      },
      {
        logo: '/images/logo-dark.svg',
        legalInfo: `Living IT Consulting Group AB\nVAT Number: SE559291387401\n© ${new Date().getFullYear()} Living IT`,
        social: [
          { name: 'LinkedIn', href: 'https://www.linkedin.com/company/living-it/', icon: 'linkedin' },
          { name: 'Facebook', href: 'https://www.facebook.com/LivingITConsulting', icon: 'facebook' },
          { name: 'X', href: 'https://x.com/LivingITConsult', icon: 'x' },
          { name: 'Instagram', href: 'https://www.instagram.com/LivingITConsulting/', icon: 'instagram' },
          { name: 'Cookies', href: '#', icon: 'cookie', isCookieButton: true },
        ],
      },
    ],
  },
  // Cookie banner/policy copy now lives in t.cookiesBanner / t.cookiesPolicy (src/i18n).
};
