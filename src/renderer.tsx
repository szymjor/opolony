import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title, description }) => {
  const pageTitle = title || 'Auto Centrum Opolony — Blacharz, Lakiernik i Mechanik w Raciborzu | od 1986 roku'
  const pageDesc = description || 'Auto Centrum Opolony – kompleksowe naprawy powypadkowe, blacharstwo, lakiernictwo, mechanika pojazdowa i serwis klimatyzacji w Raciborzu. Doświadczenie od 1986 roku, rozliczenia bezgotówkowe, auta zastępcze, obsługa wszystkich marek.'
  const siteUrl = 'https://opolony.pl'

  // Schema.org LocalBusiness / AutoRepair
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: 'Auto Centrum Opolony',
    image: `${siteUrl}/static/img/hero.jpg`,
    '@id': siteUrl,
    url: siteUrl,
    telephone: '+48 32 415 31 43',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ul. Rybnicka 129a',
      addressLocality: 'Racibórz',
      postalCode: '47-400',
      addressCountry: 'PL'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 50.0775,
      longitude: 18.2248
    },
    areaServed: ['Racibórz', 'Kuźnia Raciborska', 'Krzanowice', 'Rudnik', 'Kornowac', 'Pietrowice Wielkie', 'Nędza', 'Rydułtowy', 'Wodzisław Śląski'],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:30',
        closes: '17:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '08:00',
        closes: '13:00'
      }
    ],
    sameAs: [],
    foundingDate: '1986',
    description: pageDesc,
    makesOffer: [
      { '@type': 'Offer', name: 'Naprawy powypadkowe' },
      { '@type': 'Offer', name: 'Blacharstwo i lakiernictwo' },
      { '@type': 'Offer', name: 'Mechanika pojazdowa' },
      { '@type': 'Offer', name: 'Serwis klimatyzacji' },
      { '@type': 'Offer', name: 'Likwidacja szkód komunikacyjnych' }
    ]
  }

  return (
    <html lang="pl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0b0d10" />

        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="keywords" content="mechanik Racibórz, blacharz lakiernik Racibórz, naprawy powypadkowe Racibórz, serwis klimatyzacji Racibórz, warsztat samochodowy Racibórz, blacharstwo Racibórz, lakiernictwo Racibórz, Auto Centrum Opolony, likwidacja szkód Racibórz, rozliczenia bezgotówkowe, auto zastępcze Racibórz" />
        <meta name="author" content="Auto Centrum Opolony" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={siteUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pl_PL" />
        <meta property="og:site_name" content="Auto Centrum Opolony" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={`${siteUrl}/static/img/og-image.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={`${siteUrl}/static/img/og-image.jpg`} />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

        {/* Font Awesome */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" />

        {/* Styles */}
        <link href="/static/style.css" rel="stylesheet" />

        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/static/img/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/static/img/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/static/img/favicon-16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/static/img/apple-touch-icon.png" />

        {/* Schema.org */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </head>
      <body>
        {children}
        <script src="/static/app.js" defer></script>
      </body>
    </html>
  )
})
