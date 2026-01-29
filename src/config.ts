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
      { name: 'Features', href: '#features' },
      { name: 'How It Works', href: '#how-it-works' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'FAQ', href: '#faq' },
    ],
    cta: {
      text: 'Get Started',
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
  // FEATURES SECTION
  // ============================================
  features: {
    title: 'Powerful Capabilities',
    subtitle:
      'Everything you need to build, deploy, and scale intelligent automation',
    items: [
      { icon: 'lightning', title: 'Autonomous Execution' },
      { icon: 'code', title: 'Smart Integration' },
      { icon: 'chart', title: 'Real-Time Analytics' },
      { icon: 'chat', title: 'Natural Language' },
      { icon: 'shield', title: 'Enterprise Security' },
      { icon: 'clock', title: '24/7 Operation' },
      { icon: 'brush', title: 'Custom Workflows' },
      { icon: 'layers', title: 'Multi-Agent Teams' },
      { icon: 'zap', title: 'Instant Scaling' },
    ],
  },

  // ============================================
  // HOW IT WORKS
  // ============================================
  howItWorks: {
    title: 'How It Works',
    subtitle: 'Get started in minutes with our simple 5-step process',
  },

  // ============================================
  // TESTIMONIALS
  // ============================================
  testimonials: {
    title: 'Loved by Teams Worldwide',
    subtitle: 'See what our customers have to say about Living IT',
    companyLogos: [
      'TECHFLOW',
      'INNOVATE',
      'DATASTREAM',
      'CLOUDSYNC',
      'NEXUSAI',
    ],
  },

  // ============================================
  // PRICING
  // ============================================
  pricing: {
    title: 'Simple, Transparent Pricing',
    subtitle:
      'Choose the plan that fits your needs. Upgrade or downgrade anytime.',
    plans: [
      {
        name: 'Free',
        price: '$0',
        period: '/month',
        description: 'Perfect for individuals and testing',
        features: [
          'Up to 3 agents',
          '1,000 tasks/month',
          'Basic integrations',
          'Email support',
        ],
        cta: {
          text: 'Get Started',
          href: '#contact',
        },
        featured: false,
      },
      {
        name: 'Pro',
        price: '$49',
        period: '/month',
        description: 'For growing teams and businesses',
        badge: 'MOST POPULAR',
        features: [
          'Unlimited agents',
          '50,000 tasks/month',
          'All integrations',
          'Priority support',
          'Advanced analytics',
          'Team collaboration',
        ],
        cta: {
          text: 'Start Free Trial',
          href: '#contact',
        },
        featured: true,
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'For large-scale operations',
        features: [
          'Unlimited everything',
          'Custom integrations',
          'Dedicated support',
          'SLA guarantee',
          'On-premise option',
          'Custom training',
        ],
        cta: {
          text: 'Contact Sales',
          href: '#contact',
        },
        featured: false,
      },
    ],
  },

  // ============================================
  // FAQ
  // ============================================
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about Living IT',
  },

  // ============================================
  // CONTACT
  // ============================================
  contact: {
    title: 'Start Building Today',
    subtitle:
      'Join thousands of teams using AI agents to automate their workflows. Get started in minutes with our free tier.',
    benefits: [
      'No credit card required',
      'Setup in under 5 minutes',
      'Cancel anytime',
      '24/7 customer support',
    ],
    email: 'hello@aiagentplatform.com',
    form: {
      cta: 'Get Started Free',
      fields: {
        name: {
          label: 'Full Name',
          placeholder: 'John Doe',
          required: true,
        },
        email: {
          label: 'Work Email',
          placeholder: 'john@company.com',
          required: true,
        },
        company: {
          label: 'Company',
          placeholder: 'Your Company Inc.',
          required: false,
        },
        message: {
          label: 'What would you like to automate?',
          placeholder: 'Tell us about your workflow and automation needs...',
          required: false,
        },
      },
    },
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
      },
    ],
    copyright: `${new Date().getFullYear()} Living IT. All rights reserved.`,
  },
};
