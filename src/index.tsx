import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

app.use(renderer)

/* =========================================================
   API: Formularz kontaktowy / zgłoszenie szkody
   (Na produkcji warto podpiąć KV / D1 / email Resend.
    Tutaj: walidacja + log + sukces.)
   ========================================================= */
app.post('/api/contact', async (c) => {
  try {
    const data = await c.req.json<{
      name?: string
      phone?: string
      email?: string
      subject?: string
      message?: string
      consent?: boolean
    }>()

    const name = (data.name || '').trim()
    const phone = (data.phone || '').trim()
    const email = (data.email || '').trim()
    const message = (data.message || '').trim()
    const subject = (data.subject || 'Zapytanie ogólne').trim()

    if (!name || name.length < 2) return c.json({ ok: false, error: 'Podaj imię i nazwisko.' }, 400)
    if (!phone && !email) return c.json({ ok: false, error: 'Podaj numer telefonu lub e-mail.' }, 400)
    if (!message || message.length < 5) return c.json({ ok: false, error: 'Opisz krótko sprawę.' }, 400)
    if (!data.consent) return c.json({ ok: false, error: 'Wymagana zgoda na kontakt.' }, 400)

    console.log('[AC Opolony][contact]', { name, phone, email, subject, len: message.length })

    return c.json({
      ok: true,
      message:
        'Dziękujemy za wiadomość. Oddzwonimy w godzinach pracy warsztatu. W pilnych sprawach prosimy o kontakt telefoniczny do właściwego działu.'
    })
  } catch (e) {
    return c.json({ ok: false, error: 'Nie udało się wysłać wiadomości. Spróbuj ponownie.' }, 500)
  }
})

/* =========================================================
   Strona główna — one-page
   ========================================================= */
app.get('/', (c) => {
  return c.render(
    <>
      {/* ============ TOP BAR ============ */}
      <div class="topbar">
        <div class="container topbar__inner">
          <div class="topbar__left">
            <span><i class="fa-solid fa-location-dot"></i>ul. Rybnicka 129a, 47-400 Racibórz</span>
            <span><i class="fa-regular fa-clock"></i>Pn–Pt 7:30–17:00 · Sob 8:00–13:00</span>
          </div>
          <div class="topbar__right">
            <a href="mailto:biuro@opolony.pl"><i class="fa-regular fa-envelope"></i>biuro@opolony.pl</a>
            <a href="tel:+48324153143"><i class="fa-solid fa-phone"></i>32 415 31 43</a>
          </div>
        </div>
      </div>

      {/* ============ HEADER ============ */}
      <header class="site-header" id="siteHeader">
        <div class="container header__inner">
          <a href="#top" class="logo" aria-label="Auto Centrum Opolony">
            <span class="logo__plate">
              <img src="/static/img/logo-original.png" alt="Auto Centrum Opolony — logo" width="160" height="68" />
            </span>
            <span class="logo__tag">od 1986</span>
          </a>

          <nav class="nav" id="mainNav">
            <a href="#o-firmie">O firmie</a>
            <a href="#uslugi">Usługi</a>
            <a href="#szkody">Likwidacja szkód</a>
            <a href="#dlaczego-my">Dlaczego my</a>
            <a href="#kontakt">Kontakt</a>
          </nav>

          <div class="header__cta">
            <div class="header__phone">
              <div>
                <small>Blacharstwo</small>
                <strong>32 415 31 43</strong>
              </div>
            </div>
            <a href="#zglos-szkode" class="btn btn-primary">
              <i class="fa-solid fa-triangle-exclamation"></i>Zgłoś szkodę
            </a>
            <button class="menu-toggle" id="menuToggle" aria-label="Menu" aria-expanded="false">
              <i class="fa-solid fa-bars"></i>
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* ============ HERO ============ */}
        <section class="hero">
          <div class="container hero__grid">
            <div class="hero__content">
              <span class="eyebrow">Warsztat z tradycją · Racibórz</span>
              <h1>
                Kompleksowa naprawa<br />
                samochodów <span class="hl">w Raciborzu</span>
              </h1>
              <p class="hero__sub">
                Blacharstwo, lakiernictwo, mechanika i pełna obsługa szkód komunikacyjnych
                w jednym miejscu. Obsługujemy samochody osobowe i dostawcze wszystkich marek —
                z doświadczeniem budowanym od 1986 roku.
              </p>
              <div class="hero__actions">
                <a href="#kontakt" class="btn btn-primary btn-wide">
                  <i class="fa-regular fa-calendar-check"></i>Umów wizytę
                </a>
                <a href="#zglos-szkode" class="btn btn-ghost btn-wide">
                  <i class="fa-solid fa-triangle-exclamation"></i>Zgłoś szkodę
                </a>
              </div>

              <div class="hero__stats">
                <div class="hero__stat">
                  <strong>
                    {new Date().getFullYear() - 1986}
                    <span class="plus">+</span>
                  </strong>
                  <span>lat doświadczenia</span>
                </div>
                <div class="hero__stat">
                  <strong>100<span class="plus">%</span></strong>
                  <span>Wartości pojazdu z OC</span>
                </div>
                <div class="hero__stat">
                  <strong>24/7</strong>
                  <span>Pomoc po szkodzie</span>
                </div>
              </div>
            </div>

            <aside class="hero__badge">
              <div class="hero__pill">
                <i class="fa-solid fa-handshake"></i>
                <div>
                  <strong>Rozliczenia bezgotówkowe</strong>
                  <span>Załatwiamy wszystko z ubezpieczycielem — Ty odbierasz naprawione auto.</span>
                </div>
              </div>
              <div class="hero__pill">
                <i class="fa-solid fa-car-side"></i>
                <div>
                  <strong>Auto zastępcze na czas naprawy</strong>
                  <span>Nie zostajesz bez samochodu. Zorganizujemy zastępczy pojazd.</span>
                </div>
              </div>
              <div class="hero__pill">
                <i class="fa-solid fa-screwdriver-wrench"></i>
                <div>
                  <strong>Obsługa wszystkich marek</strong>
                  <span>Osobowe i dostawcze, krajowe i zagraniczne — jedno miejsce dla kierowcy.</span>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* ============ O FIRMIE ============ */}
        <section class="section" id="o-firmie">
          <div class="container about__grid">
            <div class="about__body">
              <span class="eyebrow">O Auto Centrum Opolony</span>
              <h2 class="section-title">Warsztat, któremu kierowcy ufają od 1986 roku</h2>
              <p>
                Jesteśmy lokalną firmą z Raciborza, która od prawie czterech dekad
                zajmuje się naprawą samochodów osobowych i dostawczych. Zaczynaliśmy od
                małego warsztatu — dziś prowadzimy nowoczesne Auto Centrum z pełnym zapleczem
                blacharskim, lakierniczym i mechanicznym.
              </p>
              <p>
                Specjalizujemy się w naprawach powypadkowych i kompleksowej likwidacji szkód
                komunikacyjnych. Współpracujemy ze wszystkimi towarzystwami ubezpieczeniowymi
                — również zagranicznymi. Klient zostawia u nas auto i formalności, a my
                doprowadzamy sprawę od zgłoszenia do wypłaty odszkodowania i odbioru gotowego pojazdu.
              </p>

              <ul class="about__highlights">
                <li><i class="fa-solid fa-check"></i>Auta osobowe i dostawcze</li>
                <li><i class="fa-solid fa-check"></i>Wszystkie marki, krajowe i importowane</li>
                <li><i class="fa-solid fa-check"></i>Nowoczesne zaplecze techniczne</li>
                <li><i class="fa-solid fa-check"></i>Doświadczony, stały zespół</li>
                <li><i class="fa-solid fa-check"></i>Rozliczenia bezgotówkowe z TU</li>
                <li><i class="fa-solid fa-check"></i>Auto zastępcze na czas naprawy</li>
              </ul>
            </div>

            <div class="about__media">
              <img src="/static/img/detail.jpg" alt="Detal lakieru samochodu po naprawie w Auto Centrum Opolony" loading="lazy" />
              <div class="about__stamp">
                <strong>1986</strong>
                <span>Od tego roku</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============ USŁUGI ============ */}
        <section class="section section--alt" id="uslugi">
          <div class="container">
            <div class="section-head">
              <span class="eyebrow">Zakres usług</span>
              <h2 class="section-title">Wszystko, czego potrzebuje Twój samochód — pod jednym dachem</h2>
              <p class="section-lead">
                Cztery filary naszej pracy: naprawy powypadkowe, blacharstwo i lakiernictwo,
                mechanika pojazdowa oraz serwis klimatyzacji. Każdy obszar prowadzony jest
                przez wyspecjalizowany zespół i odpowiednie zaplecze techniczne.
              </p>
            </div>

            <div class="services__grid">
              {/* Naprawy powypadkowe */}
              <article class="service-card">
                <div class="service-card__media">
                  <div class="service-card__icon"><i class="fa-solid fa-car-burst"></i></div>
                  <img src="/static/img/blacharstwo.jpg" alt="Naprawa powypadkowa na ramie naprawczej AUTOROBOT" loading="lazy" />
                </div>
                <div class="service-card__body">
                  <h3>Naprawy powypadkowe</h3>
                  <p>
                    Przywracamy pojazd do stanu sprzed kolizji — od prostych napraw blacharskich
                    po kompleksową odbudowę nadwozia. Pracujemy na ramie naprawczej AUTOROBOT,
                    z precyzyjnym pomiarem geometrii nadwozia.
                  </p>
                  <ul>
                    <li>Pomiar i prostowanie nadwozia na ramie AUTOROBOT</li>
                    <li>Wymiana i regeneracja elementów konstrukcyjnych</li>
                    <li>Naprawy OC do 100% wartości pojazdu</li>
                    <li>Pełna dokumentacja techniczna naprawy</li>
                  </ul>
                  <div class="service-card__foot">
                    <a href="#zglos-szkode">Zgłoś szkodę <i class="fa-solid fa-arrow-right"></i></a>
                  </div>
                </div>
              </article>

              {/* Blacharstwo i lakiernictwo */}
              <article class="service-card">
                <div class="service-card__media">
                  <div class="service-card__icon"><i class="fa-solid fa-spray-can-sparkles"></i></div>
                  <img src="/static/img/lakiernia.jpg" alt="Lakiernia samochodowa — lakiery wodne, komputerowy dobór kolorów" loading="lazy" />
                </div>
                <div class="service-card__body">
                  <h3>Blacharstwo i lakiernictwo</h3>
                  <p>
                    Lakierujemy w ekologicznej technologii lakierów wodnych.
                    Kolor dobieramy komputerowo — tak, by nowy element nie różnił się
                    od reszty karoserii. Współpracujemy z towarzystwami ubezpieczeniowymi w kraju i za granicą.
                  </p>
                  <ul>
                    <li>Lakierowanie w technologii wodnej</li>
                    <li>Komputerowy dobór koloru lakieru</li>
                    <li>Naprawy blacharskie — wgniecenia, rysy, odpryski</li>
                    <li>Renowacja lakieru i polerowanie</li>
                  </ul>
                  <div class="service-card__foot">
                    <a href="#kontakt">Umów wycenę <i class="fa-solid fa-arrow-right"></i></a>
                  </div>
                </div>
              </article>

              {/* Mechanika */}
              <article class="service-card">
                <div class="service-card__media">
                  <div class="service-card__icon"><i class="fa-solid fa-screwdriver-wrench"></i></div>
                  <img src="/static/img/mechanika.jpg" alt="Mechanik samochodowy w Raciborzu — komputerowa diagnostyka silnika" loading="lazy" />
                </div>
                <div class="service-card__body">
                  <h3>Mechanika pojazdowa</h3>
                  <p>
                    Bieżąca obsługa serwisowa i naprawy mechaniczne aut osobowych i dostawczych.
                    Pracujemy w oparciu o komputerową diagnostykę, wysokiej jakości części
                    i sprawdzonych dostawców.
                  </p>
                  <ul>
                    <li>Wymiana olejów, filtrów i płynów eksploatacyjnych</li>
                    <li>Hamulce, zawieszenie, układ kierowniczy</li>
                    <li>Amortyzatory, rozrząd, sprzęgło</li>
                    <li>Geometria kół, wymiana i wyważanie opon</li>
                    <li>Komputerowa diagnostyka silnika</li>
                  </ul>
                  <div class="service-card__foot">
                    <a href="#kontakt">Umów przegląd <i class="fa-solid fa-arrow-right"></i></a>
                  </div>
                </div>
              </article>

              {/* Klimatyzacja */}
              <article class="service-card">
                <div class="service-card__media">
                  <div class="service-card__icon"><i class="fa-solid fa-snowflake"></i></div>
                  <img src="/static/img/klimatyzacja.jpg" alt="Serwis klimatyzacji samochodowej w Raciborzu" loading="lazy" />
                </div>
                <div class="service-card__body">
                  <h3>Serwis klimatyzacji</h3>
                  <p>
                    Pełna obsługa układu klimatyzacji — od napełnienia czynnikiem po diagnozę
                    usterek. Dbamy też o higienę wnętrza: dezynfekcja i ozonowanie usuwają
                    bakterie, grzyby i nieprzyjemne zapachy.
                  </p>
                  <ul>
                    <li>Wymiana czynnika chłodzącego (R134a, R1234yf)</li>
                    <li>Diagnoza usterek i szczelności układu</li>
                    <li>Dezynfekcja i ozonowanie wnętrza</li>
                    <li>Wymiana filtra kabinowego</li>
                  </ul>
                  <div class="service-card__foot">
                    <a href="tel:+48660845982">Zadzwoń do mechanika <i class="fa-solid fa-phone"></i></a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ============ LIKWIDACJA SZKÓD ============ */}
        <section class="section process" id="szkody">
          <div class="container">
            <div class="process__head">
              <div>
                <span class="eyebrow">Likwidacja szkód komunikacyjnych</span>
                <h2 class="section-title">Zajmujemy się szkodą od A do Z</h2>
                <p>
                  Nie musisz biegać z papierami i dzwonić po ubezpieczalniach. Po stłuczce lub
                  kolizji zostawiasz auto u nas — my przejmujemy całą procedurę: zgłoszenie,
                  oględziny, naprawę, rozliczenie bezgotówkowe i odbiór gotowego pojazdu.
                </p>
              </div>
              <div class="process__cta">
                <a href="#zglos-szkode" class="btn btn-primary">
                  <i class="fa-solid fa-triangle-exclamation"></i>Zgłoś szkodę online
                </a>
                <a href="tel:+48604285191" class="btn btn-ghost">
                  <i class="fa-solid fa-phone"></i>604 285 191
                </a>
              </div>
            </div>

            <div class="steps">
              <div class="step">
                <div class="step__num">1</div>
                <i class="fa-solid fa-file-lines step__icon"></i>
                <h3>Zgłoszenie szkody</h3>
                <p>Przyjmujemy zgłoszenie telefoniczne lub online. Pomagamy skompletować dokumenty.</p>
              </div>
              <div class="step">
                <div class="step__num">2</div>
                <i class="fa-solid fa-magnifying-glass step__icon"></i>
                <h3>Oględziny i formalności</h3>
                <p>Umawiamy rzeczoznawcę, weryfikujemy zakres uszkodzeń i przygotowujemy kosztorys.</p>
              </div>
              <div class="step">
                <div class="step__num">3</div>
                <i class="fa-solid fa-wrench step__icon"></i>
                <h3>Naprawa</h3>
                <p>Blacharstwo, lakiernictwo i mechanika w naszym warsztacie — bez przewożenia auta.</p>
              </div>
              <div class="step">
                <div class="step__num">4</div>
                <i class="fa-solid fa-handshake step__icon"></i>
                <h3>Rozliczenie z ubezpieczycielem</h3>
                <p>Wystawiamy faktury i rozliczamy się z TU bezgotówkowo — Ty nie płacisz za naprawę.</p>
              </div>
              <div class="step">
                <div class="step__num">5</div>
                <i class="fa-solid fa-key step__icon"></i>
                <h3>Odbiór auta</h3>
                <p>Oddajemy pojazd umyty, wewnątrz posprzątany — gotowy do dalszej jazdy.</p>
              </div>
            </div>

            <div class="process__badges">
              <div class="badge-strip">
                <i class="fa-solid fa-money-bill-wave"></i>
                <div>
                  <strong>Naprawa OC do 100% wartości</strong>
                  <span>Pełen zakres odszkodowania bez ukrytych dopłat</span>
                </div>
              </div>
              <div class="badge-strip">
                <i class="fa-solid fa-car-side"></i>
                <div>
                  <strong>Auto zastępcze</strong>
                  <span>Organizujemy pojazd zastępczy na czas naprawy</span>
                </div>
              </div>
              <div class="badge-strip">
                <i class="fa-solid fa-scale-balanced"></i>
                <div>
                  <strong>Wsparcie w sprawach spornych</strong>
                  <span>Rzeczoznawcy i pomoc w dochodzeniu odszkodowania</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ DLACZEGO MY ============ */}
        <section class="section" id="dlaczego-my">
          <div class="container">
            <div class="section-head">
              <span class="eyebrow">Dlaczego kierowcy wybierają Opolony</span>
              <h2 class="section-title">Konkretne powody, dla których warto zostawić auto u nas</h2>
            </div>

            <div class="why__grid">
              <div class="why-card">
                <div class="why-card__icon"><i class="fa-solid fa-award"></i></div>
                <h3>Od 1986 roku na rynku</h3>
                <p>Prawie cztery dekady doświadczenia w naprawach powypadkowych i serwisie. Znają nas pokolenia raciborskich kierowców.</p>
              </div>
              <div class="why-card">
                <div class="why-card__icon"><i class="fa-solid fa-car"></i></div>
                <h3>Wszystkie marki</h3>
                <p>Samochody osobowe i dostawcze — polskie, europejskie, japońskie, koreańskie. Zaplecze i wiedza pozwalają nam obsłużyć każdy pojazd.</p>
              </div>
              <div class="why-card">
                <div class="why-card__icon"><i class="fa-solid fa-shield-halved"></i></div>
                <h3>Pełna obsługa szkody</h3>
                <p>Zajmujemy się wszystkim — od zgłoszenia po wypłatę odszkodowania. Klient nie biega między instytucjami.</p>
              </div>
              <div class="why-card">
                <div class="why-card__icon"><i class="fa-solid fa-microchip"></i></div>
                <h3>Nowoczesne technologie</h3>
                <p>Rama naprawcza AUTOROBOT, lakiery wodne, komputerowy dobór kolorów, diagnostyka OBD. Precyzja na każdym etapie.</p>
              </div>
              <div class="why-card">
                <div class="why-card__icon"><i class="fa-solid fa-car-side"></i></div>
                <h3>Auto zastępcze</h3>
                <p>Na czas naprawy organizujemy pojazd zastępczy, żebyś nie musiał zmieniać swojego rytmu dnia.</p>
              </div>
              <div class="why-card">
                <div class="why-card__icon"><i class="fa-solid fa-users-gear"></i></div>
                <h3>Doświadczony zespół</h3>
                <p>Blacharze, lakiernicy i mechanicy z wieloletnim stażem. Stałe ekipy, które odpowiadają za jakość swojej pracy.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ CTA BAND ============ */}
        <section class="cta-band">
          <div class="container cta-band__inner">
            <div>
              <h3>Uszkodziłeś samochód? Oddzwonimy w ciągu godziny.</h3>
              <p>Pomożemy ustalić zakres szkody, uruchomić naprawę i załatwić formalności z ubezpieczycielem.</p>
            </div>
            <a href="tel:+48604285191" class="btn btn-wide">
              <i class="fa-solid fa-phone"></i>Zadzwoń: 604 285 191
            </a>
          </div>
        </section>

        {/* ============ KONTAKT ============ */}
        <section class="section section--dark" id="kontakt">
          <div class="container">
            <div class="section-head">
              <span class="eyebrow">Kontakt</span>
              <h2 class="section-title">Zadzwoń od razu do właściwego działu</h2>
              <p class="section-lead">
                Żeby oszczędzić Twój czas, udostępniamy bezpośrednie numery do lakierni,
                blacharstwa i mechaniki. Wybierz dział, w którym masz sprawę — odbierze
                osoba, która od razu Ci pomoże.
              </p>
            </div>

            <div class="contact__grid">
              <div class="contact__intro">
                <div class="contact-blocks">

                  {/* Blacharstwo */}
                  <div class="contact-dept">
                    <div class="contact-dept__head">
                      <h3>Blacharstwo i szkody</h3>
                      <i class="fa-solid fa-car-burst"></i>
                    </div>
                    <div class="contact-dept__list">
                      <div class="contact-line">
                        <span class="contact-line__who">Tomasz</span>
                        <a href="tel:+48604285191"><i class="fa-solid fa-mobile-screen"></i>+48 604 285 191</a>
                      </div>
                      <div class="contact-line">
                        <span class="contact-line__who">Bernard</span>
                        <a href="tel:+48600738542"><i class="fa-solid fa-mobile-screen"></i>+48 600 738 542</a>
                      </div>
                      <div class="contact-line">
                        <span class="contact-line__who">Warsztat</span>
                        <a href="tel:+48324153143"><i class="fa-solid fa-phone"></i>32 415 31 43</a>
                      </div>
                    </div>
                    <div class="contact-dept__email">
                      E-mail: <a href="mailto:blacharstwo@opolony.pl">blacharstwo@opolony.pl</a>
                    </div>
                  </div>

                  {/* Lakiernictwo */}
                  <div class="contact-dept">
                    <div class="contact-dept__head">
                      <h3>Lakiernictwo</h3>
                      <i class="fa-solid fa-spray-can-sparkles"></i>
                    </div>
                    <div class="contact-dept__list">
                      <div class="contact-line">
                        <span class="contact-line__who">Rafał</span>
                        <a href="tel:+48608052971"><i class="fa-solid fa-mobile-screen"></i>+48 608 052 971</a>
                      </div>
                      <div class="contact-line">
                        <span class="contact-line__who">Warsztat</span>
                        <a href="tel:+48324153573"><i class="fa-solid fa-phone"></i>32 415 35 73</a>
                      </div>
                    </div>
                    <div class="contact-dept__email">
                      E-mail: <a href="mailto:lakiernictwo@opolony.pl">lakiernictwo@opolony.pl</a>
                    </div>
                  </div>

                  {/* Mechanika */}
                  <div class="contact-dept">
                    <div class="contact-dept__head">
                      <h3>Mechanika i klimatyzacja</h3>
                      <i class="fa-solid fa-screwdriver-wrench"></i>
                    </div>
                    <div class="contact-dept__list">
                      <div class="contact-line">
                        <span class="contact-line__who">Krzysztof</span>
                        <a href="tel:+48660845982"><i class="fa-solid fa-mobile-screen"></i>+48 660 845 982</a>
                      </div>
                    </div>
                    <div class="contact-dept__email">
                      E-mail ogólny: <a href="mailto:biuro@opolony.pl">biuro@opolony.pl</a>
                    </div>
                  </div>

                  {/* Adres */}
                  <div class="contact-address">
                    <i class="fa-solid fa-location-dot"></i>
                    <div>
                      <strong>ul. Rybnicka 129a, 47-400 Racibórz</strong>
                      <span>Pn–Pt 7:30–17:00 · Sob 8:00–13:00 · Niedz. nieczynne</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formularz + mapa */}
              <div>
                <div class="map-wrap">
                  <iframe
                    title="Lokalizacja Auto Centrum Opolony — ul. Rybnicka 129a, Racibórz"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=18.21%2C50.065%2C18.24%2C50.09&layer=mapnik&marker=50.0775%2C18.2248"
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade">
                  </iframe>
                </div>

                <div class="form-card" id="zglos-szkode">
                  <h3>Zgłoś szkodę lub umów wizytę</h3>
                  <p>Wypełnij krótki formularz — oddzwonimy w godzinach pracy warsztatu.</p>

                  <form id="contactForm" novalidate>
                    <div class="form-row">
                      <div class="form-group">
                        <label for="name">Imię i nazwisko</label>
                        <input id="name" name="name" type="text" required autocomplete="name" placeholder="Jan Kowalski" />
                      </div>
                      <div class="form-group">
                        <label for="phone">Telefon</label>
                        <input id="phone" name="phone" type="tel" required autocomplete="tel" placeholder="+48 600 000 000" />
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label for="email">E-mail (opcjonalnie)</label>
                        <input id="email" name="email" type="email" autocomplete="email" placeholder="adres@email.pl" />
                      </div>
                      <div class="form-group">
                        <label for="subject">Rodzaj sprawy</label>
                        <select id="subject" name="subject" required>
                          <option value="Zgłoszenie szkody">Zgłoszenie szkody komunikacyjnej</option>
                          <option value="Naprawa powypadkowa">Naprawa powypadkowa</option>
                          <option value="Blacharstwo / lakiernictwo">Blacharstwo / lakiernictwo</option>
                          <option value="Mechanika">Mechanika — serwis</option>
                          <option value="Klimatyzacja">Serwis klimatyzacji</option>
                          <option value="Inna sprawa">Inna sprawa</option>
                        </select>
                      </div>
                    </div>
                    <div class="form-row form-row--full">
                      <div class="form-group">
                        <label for="message">Opis sprawy</label>
                        <textarea id="message" name="message" required placeholder="Marka i model auta, rok produkcji, krótki opis uszkodzeń lub sprawy."></textarea>
                      </div>
                    </div>
                    <label class="form-consent">
                      <input type="checkbox" id="consent" name="consent" required />
                      <span>
                        Wyrażam zgodę na kontakt telefoniczny/e-mail ze strony Auto Centrum Opolony
                        w celu obsługi mojego zgłoszenia. Dane nie są wykorzystywane do innych celów.
                      </span>
                    </label>
                    <button type="submit" class="btn btn-primary btn-wide" id="submitBtn">
                      <i class="fa-solid fa-paper-plane"></i>Wyślij zgłoszenie
                    </button>
                    <div class="form-feedback" id="formFeedback"></div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============ FOOTER ============ */}
      <footer class="footer">
        <div class="container">
          <div class="footer__grid">
            <div>
              <div class="logo logo--footer" style="margin-bottom:18px">
                <span class="logo__plate">
                  <img src="/static/img/logo-original.png" alt="Auto Centrum Opolony — logo" width="180" height="76" />
                </span>
              </div>
              <p>
                Lokalny warsztat samochodowy w Raciborzu. Blacharstwo, lakiernictwo,
                mechanika i kompleksowa obsługa szkód komunikacyjnych.
                Obsługujemy auta wszystkich marek — osobowe i dostawcze.
              </p>
            </div>
            <div>
              <h4>Usługi</h4>
              <ul>
                <li><a href="#uslugi">Naprawy powypadkowe</a></li>
                <li><a href="#uslugi">Blacharstwo i lakiernictwo</a></li>
                <li><a href="#uslugi">Mechanika pojazdowa</a></li>
                <li><a href="#uslugi">Serwis klimatyzacji</a></li>
                <li><a href="#szkody">Likwidacja szkód</a></li>
              </ul>
            </div>
            <div>
              <h4>Kontakt</h4>
              <ul>
                <li><i class="fa-solid fa-location-dot" style="color:var(--accent);margin-right:6px"></i>ul. Rybnicka 129a</li>
                <li style="margin-left:20px">47-400 Racibórz</li>
                <li><a href="tel:+48324153143"><i class="fa-solid fa-phone" style="color:var(--accent);margin-right:6px"></i>32 415 31 43</a></li>
                <li><a href="tel:+48324153573"><i class="fa-solid fa-phone" style="color:var(--accent);margin-right:6px"></i>32 415 35 73</a></li>
                <li><a href="mailto:biuro@opolony.pl"><i class="fa-regular fa-envelope" style="color:var(--accent);margin-right:6px"></i>biuro@opolony.pl</a></li>
              </ul>
            </div>
            <div>
              <h4>Obsługujemy</h4>
              <ul>
                <li>Racibórz</li>
                <li>Kuźnia Raciborska</li>
                <li>Krzanowice</li>
                <li>Rudnik, Kornowac</li>
                <li>Pietrowice Wielkie</li>
                <li>Rydułtowy, Wodzisław Śl.</li>
              </ul>
            </div>
          </div>
          <div class="footer__bottom">
            <span>© {new Date().getFullYear()} Auto Centrum Opolony · Wszystkie prawa zastrzeżone</span>
            <span>Mechanik · Blacharz · Lakiernik Racibórz</span>
          </div>
        </div>
      </footer>
    </>
  )
})

export default app
