import './style.css'
import katex from 'katex'
import 'katex/dist/katex.min.css'

type Flashcard = {
  sekcja: string
  zagadnienie: string
  opracowanie: string
}

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('Brak elementu #app')
}

app.innerHTML = `
  <div class="app">
    <header class="topbar">
      <div>
        <h1>Fiszki</h1>
        <p class="subtitle">Ucz się szybciej dzięki kartom pytań i odpowiedzi.</p>
      </div>
      <div class="deck" id="deck-name">Talia: —</div>
    </header>

    <main>
      <section class="card-area">
        <button class="card" id="card-button" type="button" aria-live="polite">
          <div class="card-inner" id="card-inner">
            <div class="card-face card-front">
              <span class="label">Pytanie</span>
              <h2 class="card-question" id="card-question">Ładowanie…</h2>
            </div>
            <div class="card-face card-back">
              <span class="label">Odpowiedź</span>
              <p class="card-answer" id="card-answer">—</p>
            </div>
          </div>
        </button>
        <p class="hint">Kliknij kartę lub użyj spacji, aby odwrócić.</p>
      </section>

      <section class="controls">
        <div class="buttons">
          <button id="prev-button" type="button">Poprzednia</button>
          <button id="flip-button" type="button" class="primary">Pokaż odpowiedź</button>
          <button id="next-button" type="button">Następna</button>
        </div>
        <div class="buttons secondary">
          <button id="shuffle-button" type="button">Tasuj</button>
          <button id="reset-button" type="button">Resetuj</button>
        </div>
        <div class="status">
          <span id="progress-text">0 / 0</span>
          <span id="position-text">—</span>
        </div>
      </section>
    </main>
  </div>
`

const cardButton = document.querySelector<HTMLButtonElement>('#card-button')
const cardInner = document.querySelector<HTMLDivElement>('#card-inner')
const questionEl = document.querySelector<HTMLHeadingElement>('#card-question')
const answerEl = document.querySelector<HTMLParagraphElement>('#card-answer')
const deckNameEl = document.querySelector<HTMLDivElement>('#deck-name')
const progressEl = document.querySelector<HTMLSpanElement>('#progress-text')
const positionEl = document.querySelector<HTMLSpanElement>('#position-text')
const prevButton = document.querySelector<HTMLButtonElement>('#prev-button')
const nextButton = document.querySelector<HTMLButtonElement>('#next-button')
const flipButton = document.querySelector<HTMLButtonElement>('#flip-button')
const shuffleButton = document.querySelector<HTMLButtonElement>('#shuffle-button')
const resetButton = document.querySelector<HTMLButtonElement>('#reset-button')

if (
  !cardButton ||
  !cardInner ||
  !questionEl ||
  !answerEl ||
  !deckNameEl ||
  !progressEl ||
  !positionEl ||
  !prevButton ||
  !nextButton ||
  !flipButton ||
  !shuffleButton ||
  !resetButton
) {
  throw new Error('Nie znaleziono wymaganych elementów interfejsu.')
}

let originalCards: Flashcard[] = []
let cards: Flashcard[] = []
let currentIndex = 0
let showAnswer = false

const setButtonsDisabled = (disabled: boolean) => {
  prevButton.disabled = disabled
  nextButton.disabled = disabled
  flipButton.disabled = disabled
  shuffleButton.disabled = disabled
  resetButton.disabled = disabled
  cardButton.disabled = disabled
}

const updateDeckLabel = (card?: Flashcard) => {
  const sekcja = card?.sekcja?.trim()
  deckNameEl.textContent = sekcja ? `Sekcja: ${sekcja}` : 'Sekcja: —'
}

const renderMath = (text: string): string => {
  // Replace inline math $...$ and display math $$...$$
  let result = text
  
  // Display math ($$...$$)
  result = result.replace(/\$\$([^$]+)\$\$/g, (_, math) => {
    try {
      return katex.renderToString(math, { displayMode: true, throwOnError: false })
    } catch {
      return `$$${math}$$`
    }
  })
  
  // Inline math ($...$)
  result = result.replace(/\$([^$]+)\$/g, (_, math) => {
    try {
      return katex.renderToString(math, { displayMode: false, throwOnError: false })
    } catch {
      return `$${math}$`
    }
  })
  
  return result
}

const render = () => {
  if (cards.length === 0) {
    questionEl.textContent = 'Brak fiszek do wyświetlenia'
    answerEl.textContent = 'Dodaj pytania i odpowiedzi w pliku JSON.'
    progressEl.textContent = '0 / 0'
    positionEl.textContent = '—'
    updateDeckLabel()
    setButtonsDisabled(true)
    cardInner.classList.remove('is-flipped')
    flipButton.textContent = 'Pokaż odpowiedź'
    return
  }

  const card = cards[currentIndex]
  questionEl.innerHTML = renderMath(card.zagadnienie)
  answerEl.innerHTML = renderMath(card.opracowanie)
  progressEl.textContent = `${currentIndex + 1} / ${cards.length}`
  positionEl.textContent = showAnswer ? 'Odpowiedź' : 'Pytanie'
  updateDeckLabel(card)

  if (showAnswer) {
    cardInner.classList.add('is-flipped')
    flipButton.textContent = 'Pokaż pytanie'
  } else {
    cardInner.classList.remove('is-flipped')
    flipButton.textContent = 'Pokaż odpowiedź'
  }

  setButtonsDisabled(false)
}

const setCards = (data: Flashcard[]) => {
  originalCards = [...data]
  cards = [...data]
  currentIndex = 0
  showAnswer = false
  render()
}

const nextCard = () => {
  if (cards.length === 0) return
  currentIndex = (currentIndex + 1) % cards.length
  showAnswer = false
  render()
}

const prevCard = () => {
  if (cards.length === 0) return
  currentIndex = (currentIndex - 1 + cards.length) % cards.length
  showAnswer = false
  render()
}

const toggleFlip = () => {
  if (cards.length === 0) return
  showAnswer = !showAnswer
  render()
}

const shuffleCards = () => {
  const shuffled = [...cards]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  cards = shuffled
  currentIndex = 0
  showAnswer = false
  render()
}

const resetCards = () => {
  cards = [...originalCards]
  currentIndex = 0
  showAnswer = false
  render()
}

prevButton.addEventListener('click', prevCard)
nextButton.addEventListener('click', nextCard)
flipButton.addEventListener('click', toggleFlip)
shuffleButton.addEventListener('click', shuffleCards)
resetButton.addEventListener('click', resetCards)
cardButton.addEventListener('click', toggleFlip)

window.addEventListener('keydown', (event) => {
  const target = event.target as HTMLElement | null
  if (target && ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName)) {
    return
  }

  if (event.key === 'ArrowRight') {
    nextCard()
  } else if (event.key === 'ArrowLeft') {
    prevCard()
  } else if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    toggleFlip()
  }
})

const loadCards = async () => {
  try {
    const response = await fetch('/data/flashcards.json')
    if (!response.ok) {
      throw new Error('Nie udało się pobrać danych.')
    }
    const data = (await response.json()) as Flashcard[]
    setCards(data)
  } catch (error) {
    questionEl.textContent = 'Nie udało się wczytać fiszek'
    answerEl.textContent = 'Sprawdź plik public/data/flashcards.json.'
    progressEl.textContent = '0 / 0'
    positionEl.textContent = '—'
    updateDeckLabel()
    setButtonsDisabled(true)
  }
}

loadCards()
