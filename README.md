# Auto Centrum Opolony — Strona WWW warsztatu

## Przegląd projektu
- **Nazwa**: Auto Centrum Opolony
- **Cel**: Nowoczesna, profesjonalna strona warsztatu samochodowego w Raciborzu (blacharstwo, lakiernictwo, mechanika, serwis klimatyzacji, likwidacja szkód komunikacyjnych). Ma pozyskiwać lokalnych klientów, budować zaufanie i ułatwić kontakt z właściwym działem.
- **Klient**: Auto Centrum Opolony, ul. Rybnicka 129a, 47-400 Racibórz (działa od 1986 r.)
- **Język interfejsu**: polski

## Zakończone funkcje
- ✅ Strona w formacie one-page z sekcjami: Hero, O firmie, Usługi, Likwidacja szkód (proces 5 kroków), Dlaczego my, Kontakt.
- ✅ Sticky header z nawigacją, CTA "Zgłoś szkodę" i telefonem.
- ✅ Górny pasek z adresem, godzinami otwarcia, mailem i głównym telefonem.
- ✅ Sekcje usług (4 karty) z ikonami, zdjęciami i listami zakresu prac.
- ✅ Sekcja procesu likwidacji szkody (5 kroków) + 3 paski zaufania (bezgotówkowo, auto zastępcze, wsparcie prawne).
- ✅ Formularz kontaktowy / zgłoszenia szkody z walidacją frontend + backend (Hono API).
- ✅ Responsywność mobile-first (breakpointy: 1080 / 820 / 520 px) + menu mobilne.
- ✅ Wszystkie numery telefonów są klikalne (`tel:`), e-maile klikane (`mailto:`).
- ✅ Interaktywna mapa OpenStreetMap (wstylizowana ciemnym filtrem, bez kosztów API).
- ✅ Lekka animacja reveal-on-scroll (IntersectionObserver).
- ✅ SEO: `<title>`, meta description, meta keywords, Open Graph, Twitter Card, canonical.
- ✅ Schema.org `AutoRepair` JSON-LD z adresem, geo, godzinami otwarcia, zakresem usług.
- ✅ Preconnect do Google Fonts, `loading="lazy"` na zdjęciach, spakowane obrazy (2.1 MB łącznie).
- ✅ Favicon SVG inline (nie wymaga dodatkowych requestów).

## Adresy funkcjonalne (URI)
- **`GET /`** — strona główna (one-page, cały content).
- **`POST /api/contact`** — endpoint formularza.
  - Body JSON: `{ name, phone, email?, subject?, message, consent }`
  - Odpowiedź sukcesu: `{ ok: true, message: string }`
  - Odpowiedź błędu: `{ ok: false, error: string }` z kodem 400/500
- **`/static/style.css`**, **`/static/app.js`** — zasoby statyczne
- **`/static/img/*.jpg`** — zdjęcia (hero, lakiernia, blacharstwo, mechanika, klimatyzacja, detal)

## Struktura danych
- **Zgłoszenie kontaktu** (`POST /api/contact`):
  ```
  name     string  (min 2)
  phone    string  (wymagany jeśli brak email)
  email    string  (opcjonalny, wymagany jeśli brak phone)
  subject  string  (np. "Zgłoszenie szkody", "Naprawa powypadkowa")
  message  string  (min 5 znaków)
  consent  boolean (musi być true)
  ```
- **Obecnie**: zgłoszenia są tylko logowane do `console.log` (widoczne w logach workera).
  W kolejnym kroku można podpiąć: Cloudflare KV / D1, albo integrację mailową (Resend / MailChannels) — patrz "Rekomendowane kolejne kroki".

## Usługi storage
- **Aktualnie nie używa** żadnych storage’y Cloudflare (brak KV / D1 / R2).
- Strona jest w całości renderowana przez Hono na edge — pełny static + 1 endpoint API.

## Kolorystyka i styl
- Bazowe tło: grafit / stal (`#0b0d10` → `#14181d`)
- Akcent główny: safety orange (`#ff6a1a`)
- Akcent wtórny: deep red (`#e53e1b`)
- Typografia: **Barlow Condensed** (nagłówki, UPPERCASE) + **Inter** (treść)
- Styl: automotive premium, precyzja, warsztat, bez gradientów startupowych.

## Stack technologiczny
- **Framework**: Hono 4.x (TSX/JSX SSR)
- **Build**: Vite 6.x + `@hono/vite-build/cloudflare-pages`
- **Runtime**: Cloudflare Pages / Workers
- **CSS**: czysty, własny (bez Tailwind — zachowuje lekkość i kontrolę)
- **Ikony**: Font Awesome 6 (CDN)
- **Fonty**: Google Fonts (preconnect)

## Lokalne uruchomienie
```bash
cd /home/user/webapp
npm run build                        # build do /dist
pm2 start ecosystem.config.cjs       # start wrangler pages dev na :3000
curl http://localhost:3000           # test
pm2 logs webapp --nostream           # podgląd logów
pm2 restart webapp                   # restart po zmianach w /dist
```

### Adres publiczny (sandbox)
Po uruchomieniu PM2 na porcie 3000 strona jest dostępna pod URL-em sandboxa (wygenerowanym przez `GetServiceUrl`).

## Lokalne SEO — frazy docelowe
- mechanik Racibórz
- blacharz lakiernik Racibórz
- naprawy powypadkowe Racibórz
- serwis klimatyzacji Racibórz
- warsztat samochodowy Racibórz
- likwidacja szkód Racibórz
- Auto Centrum Opolony

## Funkcje nie zaimplementowane
- ❌ Integracja mailowa (wysyłka zgłoszeń na `biuro@opolony.pl` / do działu). Obecnie tylko log.
- ❌ Persystencja zgłoszeń (KV / D1) + panel admin.
- ❌ Google Maps (użyto darmowego OpenStreetMap embed; przejście na Google Maps wymaga klucza API).
- ❌ Galeria realizacji (before/after) — można dodać, gdy klient dostarczy zdjęcia.
- ❌ Blog / aktualności (np. sezonowa wymiana opon, porady serwisowe) — do rozważenia pod SEO.
- ❌ Opinie klientów (Google Reviews / opinie lokalne) — wymaga integracji lub ręcznego wklejenia.
- ❌ Panel RODO / polityka prywatności / regulamin — warto dodać przed publikacją produkcyjną.
- ❌ Cookie banner.

## Rekomendowane kolejne kroki
1. **Integracja mailowa** – np. Resend albo MailChannels (darmowy z Cloudflare Workers). Formularz wysyła treść na `biuro@opolony.pl` + kopię do właściwego działu w zależności od wartości `subject`.
2. **Strona RODO / polityka prywatności** + cookie banner.
3. **Galeria realizacji** – sekcja z prawdziwymi zdjęciami aut przed i po naprawie (wymaga materiałów od firmy).
4. **Opinie klientów** – wyciąg z Google Reviews / Facebook, w formie karuzeli.
5. **Deployment** na Cloudflare Pages (domena: `opolony.pl` lub subdomena).
6. **Google Search Console + Mapy Google** – rejestracja profilu firmy (Google Business Profile).
7. **Analytics** – np. Plausible / Umami (prywatne, bez cookie bannera) lub GA4.
8. **Przejście na Google Maps Embed** po dostarczeniu klucza API (bardziej rozpoznawalny widok).
9. **Zdjęcia autentyczne** – docelowo zastąpić wygenerowane zdjęcia prawdziwymi fotografiami warsztatu (profesjonalna sesja).

## Kontakt do firmy (dane wykorzystane na stronie)
- **Adres**: ul. Rybnicka 129a, 47-400 Racibórz
- **Godziny**: Pn–Pt 7:30–17:00 · Sob 8:00–13:00
- **Lakiernictwo**: Rafał +48 608 052 971, tel. 32 415 35 73, `lakiernictwo@opolony.pl`
- **Blacharstwo**: Tomasz +48 604 285 191, Bernard +48 600 738 542, tel. 32 415 31 43, `blacharstwo@opolony.pl`
- **Mechanika**: Krzysztof +48 660 845 982
- **E-mail ogólny**: `biuro@opolony.pl`

## Status wdrożenia
- **Platforma**: Cloudflare Pages (kompatybilne, gotowe do deploy)
- **Status lokalny**: ✅ uruchomione w sandboxie na porcie 3000
- **Ostatnia aktualizacja**: 2026-04-17
