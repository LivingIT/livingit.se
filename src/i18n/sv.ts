// src/i18n/sv.ts
export const sv = {
  common: {
    timeAndLocation: 'Tid och plats',
    contactUsAt: 'Kontakta oss på',
    weWillHelpYou: 'så hjälper vi dig!',
    somethingWentWrong: 'Något gick fel. Försök igen senare.',
    pleaseWait: 'Vänta...',
    cancel: 'Avbryt',
    eventPromotion: 'Event promotion',
    opensInGoogleMaps: 'öppnas i Google Maps',
  },
  form: {
    labelName: 'Namn',
    labelFirstName: 'Förnamn',
    labelLastName: 'Efternamn',
    labelEmail: 'E-post',
    labelBuyerEmail: 'Köparens e-post',
    labelEmployer: 'Företag',
    labelReferralCode: 'Anmälningskod',
    labelFoodPreference: 'Matpreferens',
    labelAllergies: 'Allergier',
    labelChooseOption: 'Välj ett alternativ',
    labelTicketCount: 'Antal biljetter:',
    submitButton: 'Registrera',
    validateCode: 'Validera kod',
    validating: 'Validerar...',
    buyTicket: 'Köp biljett',
    saleClosed: 'Biljettförsäljningen är stängd',
    haveCode: 'Jag har en kod',
    goToPayment: 'Gå till betalning',
    joinQueue: 'Ställ dig i kö',
    ariaDecrement: 'Minska',
    ariaIncrement: 'Öka',
    errorRequired: 'Detta fält är obligatoriskt',
    errorEmail: 'E-postadressen är inte giltig',
    errorGeneric: 'Något gick fel. Försök igen senare.',
  },
  validation: {
    required: 'Detta fält är obligatoriskt',
    firstNameRequired: 'Förnamn är obligatoriskt',
    lastNameRequired: 'Efternamn är obligatoriskt',
    emailRequired: 'E-post är obligatoriskt',
    emailInvalid: 'E-postadressen är inte giltig',
    companyRequired: 'Företag är obligatoriskt',
    referralCodeRequired: 'Anmälningskod är obligatoriskt',
    referralCodeBad: 'Ogiltig anmälningskod',
    seatCountMin: 'Du måste välja minst en biljett',
    seatCountMax: 'Max {{max}} biljetter per reservation',
    foodPreferenceRequired: 'Matpreferens är obligatorisk',
    termsRequired: 'Du måste acceptera villkoren för att fortsätta',
  },
  event: {
    statusUpcoming: 'Kommande',
    statusPast: 'Avslutat',
    statusFull: 'Fullbokat',
    registrationClosed: 'Anmälan stängd',
    registrationFull: 'Det här eventet är fullbokat',
    notFound: 'Eventet hittades inte',
    languageLabel: 'Språk',
    languageNames: { sv: 'Svenska', en: 'Engelska' },
  },
  messages: {
    queueSuccessLine1: 'Du har nu blivit placerad i kö. ⌛️',
    queueSuccessLine2: 'Vi kommer att kontakta dig via e-post om en plats blir ledig.',
    registrationNeedToConfirmLine1: 'Nu är det nästan klart! 🎉',
    registrationNeedToConfirmLine2: 'Innan vi ses behöver vi bekräfta din e-postadress. Vi har skickat en bekräftelse till din e-post. Glöm inte att kolla din skräppost om du inte fått ett mail av oss.',
    registrationConfirmationLine1: 'Nu är det klart! 🎉',
    registrationConfirmationLine2: 'Vi har skickat en bekräftelse till din e-post. Glöm inte att kolla din skräppost om du inte fått ett mail av oss.',
    registrationFailedLine1: 'Något gick fel! 🤔',
    registrationFailedLine2: 'Vi kunde inte skicka en bekräftelse till din e-post. Vänligen kontakta oss.',
    fewTicketsLeft: 'OBS! Fåtal biljetter kvar!',
    soldOutMessage: 'Tyvärr, biljetterna är slut men ställ dig gärna i kö så kontaktar vi dig om några platser blir lediga!',
    confirmationFailed: 'Något gick fel på vår sida. Försök ladda om sidan eller kontakta oss för hjälp.',
    confirmationExpired: 'Bekräftelselänken är ogiltig eller har löpt ut. Vänligen kontakta oss för hjälp.',
    lookingForward: 'Vi ser fram emot att träffa dig!',
    purchaseSuccess: 'Tack för ditt köp!',
    purchaseEmailSent: 'Ni kommer nu att få ett mail med biljetter och vidare instruktioner.',
  },
  confirmation: {
    title: 'Tack!',
    thankYou: 'Tack!',
    thankYouNamed: 'Tack,',
    registered: 'Din bokning är nu bekräftad!',
  },
  nav: {
    back: 'Tillbaka',
    backToEvents: 'Tillbaka till event',
    upcomingEvents: 'Kommande evenemang',
  },
  invoice: {
    payByInvoice: 'Betala med faktura?',
    minimumTicketsRequired: 'Fakturabetalning är möjlig vid köp av minst {{count}} biljetter.',
    contactForInvoice: 'Kontakta oss på {{email}} så hjälper vi dig!',
  },
  price: {
    sek: 'SEK',
    includingVat: 'Inklusive {{percentage}} % moms',
  },
  error: {
    noActiveEvents: 'För tillfället har vi inget planerat - kom tillbaka senare!',
    oops: 'Hoppsan! Något gick snett.',
    fillRequiredFields: 'Vänligen fyll i alla obligatoriska fält',
    somethingWentWrong: 'Något gick fel 😞',
  },
  terms: {
    acceptBoth: 'Jag accepterar {{terms}} och {{privacy}}',
    acceptTerms: 'Jag accepterar {{terms}}',
    acceptPrivacy: 'Jag accepterar {{privacy}}',
    termsLink: 'Användarvillkoren',
    privacyLink: 'Integritetspolicyn',
  },
  site: {
    description:
      'Vi är ett konsultföretag med kontor i Malmö, Helsingborg och Göteborg som värnar livet utanför jobbet – men alltid strävar efter att överträffa våra kunders förväntningar.',
    keywords: 'konsult, management, IT, Malmö, Helsingborg, Göteborg',
  },
  siteNav: {
    software: 'Mjukvarukonsulting',
    leadership: 'Ledarskapskonsulting',
    events: 'Event',
    cta: 'Kontakta oss',
  },
  hero: {
    description:
      'Vi är ett konsultföretag med kontor i Malmö, Helsingborg och Göteborg som tycker att familjen, vännerna och fritiden är det viktigaste vi har, men när vi är på jobbet gör vi alltid vårt bästa för att leverera över våra kunders förväntningar.',
  },
  heroCarousel: {
    imageAltPrefix: 'Living IT karusellbild',
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
Det är **The Living IT Way**.`,
  },
  services: {
    title: 'Vad vi gör',
    subtitle: 'Här är de tjänster vi erbjuder våra kunder för att hjälpa dem nå sina mål:',
  },
  footer: {
    officeIn: 'Kontor i {{city}}',
    addressLabel: 'Kontorsadress',
    logoSection: 'Living IT-information och länkar till sociala medier',
    socialSection: 'Länkar till sociala medier',
  },
  cookiesBanner: {
    title: 'Cookiesamtycke',
    description:
      'Vi använder endast cookies för rent tekniska ändamål för att förbättra din webbupplevelse. Vi använder inga spårnings- eller analyscookies.',
    acceptText: 'Jag förstår',
    policyLinkText: 'Läs mer om vår cookie-policy',
  },
  cookiesPolicy: {
    pageTitle: 'Cookie Policy - Living IT',
    metaDescription: 'Läs mer om hur Living IT använder cookies och hur du kan hantera dina inställningar.',
    title: 'Cookie Policy',
    lastUpdated: 'Senast uppdaterad',
    aboutHeading: 'Om Cookies',
    aboutPara1:
      'Cookies är små textfiler som lagras på din enhet när du besöker en webbsajt. De används för att förbättra din webbupplevelse och ge oss information om hur besökare använder sajten.',
    aboutPara2:
      'Vi respekterar din integritet och följer EU:s dataskyddsregler (GDPR) och ePrivacy-direktivet. Du har rätt att veta vilka cookies vi använder och att kontrollera vilka du godkänner.',
    essentialTitle: 'Nödvändiga Cookies (Tekniska)',
    essentialDescription:
      'Dessa cookies är nödvändiga för att sajten ska fungera. De sparar inte personlig data och kan inte avaktiveras.',
    essentialExamples: ['Säkerhet', 'Load balancing'],
    statusLabel: 'Status:',
    statusText: 'Dessa cookies är alltid aktiverade för att sajten ska fungera korrekt.',
    contactHeading: 'Kontakt',
    contactIntro: 'Om du har frågor om vår cookie-policy eller hur vi hanterar dina data, kontakta oss gärna:',
    emailLabel: 'Email:',
  },
  eventsPage: {
    recurringHeading: 'Våra återkommande event',
  },
  contactPage: {
    metaTitlePrefix: 'Kontakta oss',
    phoneLabel: 'Telefon',
    emailLabel: 'E-post',
    companyDetailsHeading: 'Bolagsuppgifter',
    companyLabel: 'Bolag',
    orgNumberLabel: 'Org.nr',
    bankgiroLabel: 'Bankgiro',
    photoAlt: 'Foto på {{name}}',
  },
};

export type Translations = typeof sv;
