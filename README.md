# Fiszki

Prosta aplikacja flashcards w TypeScript (Vite). Dane fiszek wczytywane są z pliku JSON, więc możesz łatwo podmieniać pytania i odpowiedzi.

## Uruchomienie lokalne

1. Zainstaluj zależności:
   - `npm install`
2. Uruchom środowisko deweloperskie:
   - `npm run dev`

## Dane fiszek

Edytuj plik public/data/flashcards.json.

Format danych:

```json
[
  {
    "question": "Pytanie...",
    "answer": "Odpowiedź...",
    "deck": "Opcjonalna nazwa talii"
  }
]
```

Pole `deck` jest opcjonalne.

## Hosting na GitHub Pages

1. Zbuduj aplikację:
   - `npm run build`
2. Wygenerowany folder `dist` opublikuj jako stronę GitHub Pages (np. z gałęzi `gh-pages` lub z katalogu `dist` w wybranym workflow).

Uwaga: konfiguracja `base: './'` w pliku vite.config.ts ułatwia hostowanie w podkatalogu.
