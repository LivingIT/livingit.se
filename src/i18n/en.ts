// src/i18n/en.ts
import type { Translations } from './sv';

export const en: Translations = {
  common: {
    timeAndLocation: 'Time and location',
    contactUsAt: 'Contact us at',
    weWillHelpYou: 'and we will help you!',
    somethingWentWrong: 'Something went wrong. Please try again later.',
    pleaseWait: 'Please wait...',
    cancel: 'Cancel',
    eventPromotion: 'Event promotion',
    opensInGoogleMaps: 'opens in Google Maps',
  },
  form: {
    labelName: 'Name',
    labelFirstName: 'First name',
    labelLastName: 'Last name',
    labelEmail: 'Email',
    labelBuyerEmail: 'Buyer email',
    labelEmployer: 'Company',
    labelReferralCode: 'Registration code',
    labelFoodPreference: 'Food preference',
    labelAllergies: 'Food allergies or special requests',
    labelChooseOption: 'Choose an option',
    labelTicketCount: 'Number of tickets:',
    submitButton: 'Register',
    validateCode: 'Validate code',
    validating: 'Validating...',
    buyTicket: 'Buy ticket',
    saleClosed: 'Sale is closed',
    haveCode: 'I have a code',
    goToPayment: 'Go to payment',
    joinQueue: 'Join queue',
    ariaDecrement: 'Decrease',
    ariaIncrement: 'Increase',
    errorRequired: 'This field is required',
    errorEmail: 'The email address is not valid',
    errorGeneric: 'Something went wrong. Please try again later.',
  },
  validation: {
    required: 'This field is required',
    firstNameRequired: 'First name is required',
    lastNameRequired: 'Last name is required',
    emailRequired: 'Email is required',
    emailInvalid: 'The email address is not valid',
    companyRequired: 'Company is required',
    referralCodeRequired: 'Registration code is required',
    referralCodeBad: 'Bad registration code',
    seatCountMin: 'You must select at least one ticket',
    seatCountMax: 'Max {{max}} tickets per reservation',
    foodPreferenceRequired: 'Food preference is required',
    termsRequired: 'You must accept the terms to continue',
  },
  event: {
    statusUpcoming: 'Upcoming',
    statusPast: 'Ended',
    statusFull: 'Fully booked',
    registrationClosed: 'Registration closed',
    registrationFull: 'This event is fully booked',
    notFound: 'Event not found',
    languageLabel: 'Language',
    languageNames: { sv: 'Swedish', en: 'English' },
  },
  messages: {
    queueSuccessLine1: 'You have now been placed in the queue. ⌛️',
    queueSuccessLine2: 'We will contact you by email if a spot becomes available.',
    registrationNeedToConfirmLine1: 'Almost done! 🎉',
    registrationNeedToConfirmLine2: 'Before we meet, we need to confirm your email address. We have sent a confirmation to your email. Don\'t forget to check your spam folder if you haven\'t received an email from us.',
    registrationConfirmationLine1: 'Done! 🎉',
    registrationConfirmationLine2: 'We have sent a confirmation to your email. Don\'t forget to check your spam folder if you haven\'t received an email from us.',
    registrationFailedLine1: 'Something went wrong! 🤔',
    registrationFailedLine2: 'We could not send a confirmation to your email. Please contact us.',
    fewTicketsLeft: 'NOTE! Few tickets left!',
    soldOutMessage: 'Unfortunately, tickets are sold out but feel free to join the queue and we will contact you if spots become available!',
    confirmationFailed: 'Something went wrong on our end. Try refreshing the page or contact us for help.',
    confirmationExpired: 'The confirmation link is invalid or has expired. Please contact us for help.',
    lookingForward: 'We look forward to seeing you!',
    purchaseSuccess: 'Thank you for your purchase!',
    purchaseEmailSent: 'You will now receive an email with tickets and further instructions.',
  },
  confirmation: {
    title: 'Thank you!',
    thankYou: 'Thank you!',
    thankYouNamed: 'Thank you,',
    registered: 'Your booking is now confirmed!',
  },
  nav: {
    back: 'Back',
    backToEvents: 'Back to events',
    upcomingEvents: 'Upcoming events',
  },
  invoice: {
    payByInvoice: 'Pay by invoice?',
    minimumTicketsRequired: 'Invoice payment is possible when purchasing at least {{count}} tickets.',
    contactForInvoice: 'Contact us at {{email}} and we will help you!',
  },
  price: {
    sek: 'SEK',
    includingVat: 'Including {{percentage}} % VAT',
  },
  error: {
    noActiveEvents: 'We don\'t have anything planned at the moment - come back later!',
    oops: 'Oops! Something went wrong.',
    fillRequiredFields: 'Please fill in all required fields',
    somethingWentWrong: 'Something went wrong 😞',
  },
  terms: {
    acceptBoth: 'I accept the {{terms}} and the {{privacy}}',
    acceptTerms: 'I accept the {{terms}}',
    acceptPrivacy: 'I accept the {{privacy}}',
    termsLink: 'Terms & Conditions',
    privacyLink: 'Privacy Policy',
  },
  site: {
    description:
      'We are a consulting company with offices in Malmö, Helsingborg and Gothenburg that values life outside of work – while always striving to exceed our clients\' expectations.',
    keywords: 'consulting, management, IT, Malmö, Helsingborg, Gothenburg, Sweden',
  },
  siteNav: {
    software: 'Software Consulting',
    leadership: 'Leadership Consulting',
    events: 'Events',
    cta: 'Contact us',
  },
  hero: {
    description:
      'We are a consulting company with offices in Malmö, Helsingborg and Gothenburg. We believe family, friends and free time matter most, but when we\'re at work we always do our best to exceed our clients\' expectations.',
  },
  heroCarousel: {
    imageAltPrefix: 'Living IT carousel image',
    markdown: `## The Living IT Way

For us, The Living IT Way isn't about what job you do, \
but how you treat people – colleagues and clients alike. \
We believe in balance. That life outside work is what gives \
energy to the work we do.

**Family, friends, free time – that's where it all begins.** \
It doesn't matter if you have a big family or a small one, \
whether you spend time with a hundred friends or just a few close ones, \
whether you run marathons, play board games, or would rather curl up on the couch with a movie.<br />
What matters is that when the workday is over, \
you still have the time and energy left for what matters most to you.

**When people feel good, the results get better.** \
We put just as much energy into security and well-being as into technology and delivery.<br />
We invest in professional development, fair terms, and the best compensation model on the market – \
a unique combination of the security of employment and the freedom of being your own boss.

**And our clients? They get the same care.** \
We only hire experienced consultants with strong skills and a real sense of responsibility. \
It's important to us to share knowledge, build together, and make sure \
no project grinds to a halt if someone gets sick or moves on.<br />
If one of our consultants ever wants to leave Living IT, it doesn't affect the client. \
Our agreements are free of clauses that prevent open collaboration. \
This is where we stand out from the crowd, and we're proud of it.

That's how we work.<br />
Safely, openly, and humanly.<br />
That's **The Living IT Way**.`,
  },
  services: {
    title: 'What we do',
    subtitle: 'Here are the services we offer our clients to help them reach their goals:',
  },
  footer: {
    officeIn: 'Office in {{city}}',
    addressLabel: 'Office address',
    logoSection: 'Living IT information and social media links',
    socialSection: 'Social media links',
  },
  cookiesBanner: {
    title: 'Cookie consent',
    description:
      'We only use cookies for strictly technical purposes to improve your browsing experience. We do not use any tracking or analytics cookies.',
    acceptText: 'Got it',
    policyLinkText: 'Read more about our cookie policy',
  },
  cookiesPolicy: {
    pageTitle: 'Cookie Policy - Living IT',
    metaDescription: 'Read more about how Living IT uses cookies and how you can manage your preferences.',
    title: 'Cookie Policy',
    lastUpdated: 'Last updated',
    aboutHeading: 'About Cookies',
    aboutPara1:
      'Cookies are small text files stored on your device when you visit a website. They are used to improve your browsing experience and give us information about how visitors use the site.',
    aboutPara2:
      'We respect your privacy and comply with the EU\'s data protection rules (GDPR) and the ePrivacy Directive. You have the right to know which cookies we use and to control which ones you accept.',
    essentialTitle: 'Essential Cookies (Technical)',
    essentialDescription:
      'These cookies are necessary for the site to function. They do not store personal data and cannot be disabled.',
    essentialExamples: ['Security', 'Load balancing'],
    statusLabel: 'Status:',
    statusText: 'These cookies are always enabled for the site to function correctly.',
    contactHeading: 'Contact',
    contactIntro: 'If you have questions about our cookie policy or how we handle your data, feel free to contact us:',
    emailLabel: 'Email:',
  },
  eventsPage: {
    recurringHeading: 'Our recurring events',
  },
  contactPage: {
    metaTitlePrefix: 'Contact us',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    companyDetailsHeading: 'Company details',
    companyLabel: 'Company',
    orgNumberLabel: 'Reg. no.',
    bankgiroLabel: 'Bankgiro',
    photoAlt: 'Photo of {{name}}',
  },
};
