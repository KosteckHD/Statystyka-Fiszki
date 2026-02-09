import './style.css'

interface DrillQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
}

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('Brak elementu #app')
}

let questions: DrillQuestion[] = []
let currentQuestionIndex = 0
let score = 0
let answered = new Set<number>()
let userAnswers = new Map<number, number>()
let isShuffled = false
let originalOrder: number[] = []

async function loadQuestions() {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/bazy.json`)
    questions = await response.json()
    renderQuestion()
  } catch (error) {
    console.error('Błąd przy ładowaniu pytań:', error)
    app!.innerHTML = '<p>Błąd przy ładowaniu pytań.</p>'
  }
}

function renderQuestion() {
  if (!questions.length) return

  const question = questions[currentQuestionIndex]
  const isAnswered = answered.has(question.id)
  const userAnswer = userAnswers.get(question.id)

  let optionsHTML = question.options
    .map((option, index) => {
      let className = 'option'
      if (isAnswered) {
        if (index === question.correctAnswer) {
          className += ' correct'
        } else if (index === userAnswer && userAnswer !== question.correctAnswer) {
          className += ' incorrect'
        }
      }
      const isSelected = userAnswer === index
      return `
        <button 
          type="button" 
          class="${className} ${isSelected ? 'selected' : ''}"
          data-index="${index}"
          ${isAnswered ? 'disabled' : ''}
        >
          <span class="option-letter">${String.fromCharCode(65 + index)}.</span>
          <span class="option-text">${option}</span>
          ${isAnswered && index === question.correctAnswer ? '<span class="icon">✓</span>' : ''}
          ${isAnswered && index === userAnswer && userAnswer !== question.correctAnswer ? '<span class="icon">✗</span>' : ''}
        </button>
      `
    })
    .join('')

  const progress = `${currentQuestionIndex + 1} / ${questions.length}`
  const percentage = Math.round((score / questions.length) * 100)

  app!.innerHTML = `
    <div class="app">
      <header class="topbar">
        <div>
          <h1>
            <a href="${import.meta.env.BASE_URL}">← Fiszki</a>
          </h1>
          <p class="subtitle">Bazy danych - Trening do egzaminu</p>
        </div>
        <div class="deck">Pytania: ${progress}</div>
      </header>

      <main>
        <section class="drill-container">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(currentQuestionIndex / questions.length) * 100}%"></div>
          </div>

          <div class="question-box">
            <h2 class="question-text">${question.question}</h2>
            
            <div class="options-container">
              ${optionsHTML}
            </div>

            ${
              isAnswered
                ? `<div class="feedback ${userAnswer === question.correctAnswer ? 'correct' : 'incorrect'}">
                    ${
                      userAnswer === question.correctAnswer
                        ? '✓ Poprawna odpowiedź!'
                        : '✗ Błędna odpowiedź. Prawidłowa odpowiedź to: ' +
                          String.fromCharCode(65 + question.correctAnswer)
                    }
                  </div>`
                : ''
            }
          </div>

          <section class="controls">
            <div class="buttons">
              <button 
                id="prev-button" 
                type="button"
                ${currentQuestionIndex === 0 ? 'disabled' : ''}
              >
                ← Poprzednia
              </button>
              ${
                !isAnswered
                  ? `<div class="spacer"></div>`
                  : `<button id="next-or-finish-button" type="button" class="primary">
                      ${currentQuestionIndex === questions.length - 1 ? 'Pokaż wyniki' : 'Następna →'}
                    </button>`
              }
              <button 
                id="next-button" 
                type="button"
                ${currentQuestionIndex === questions.length - 1 ? 'disabled' : ''}
              >
                Następna →
              </button>
            </div>
            <div class="buttons secondary">
              <button id="shuffle-button" type="button">
                ${isShuffled ? '🔀 Przywróć kolejność' : '🔀 Tasuj'}
              </button>
            </div>
          </section>

          <div class="score-preview">
            Wynik: <strong>${score}</strong> / ${questions.length} (${percentage}%)
          </div>
        </section>
      </main>
    </div>
  `

  // Dodaj event listenery do opcji
  document.querySelectorAll('.option').forEach((button) => {
    button.addEventListener('click', () => {
      if (!isAnswered) {
        const index = parseInt((button as HTMLElement).getAttribute('data-index')!)
        selectAnswer(index)
      }
    })
  })

  // Przyciski nawigacji
  const prevBtn = document.getElementById('prev-button')
  const nextBtn = document.getElementById('next-button')
  const nextOrFinishBtn = document.getElementById('next-or-finish-button')

  prevBtn?.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--
      renderQuestion()
    }
  })

  nextBtn?.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++
      renderQuestion()
    }
  })

  nextOrFinishBtn?.addEventListener('click', () => {
    if (currentQuestionIndex === questions.length - 1) {
      showResults()
    } else {
      currentQuestionIndex++
      renderQuestion()
    }
  })

  const shuffleBtn = document.getElementById('shuffle-button')
  shuffleBtn?.addEventListener('click', toggleShuffle)
}

function selectAnswer(answerIndex: number) {
  const question = questions[currentQuestionIndex]
  userAnswers.set(question.id, answerIndex)
  answered.add(question.id)

  if (answerIndex === question.correctAnswer) {
    score++
  }

  renderQuestion()
}

function toggleShuffle() {
  isShuffled = !isShuffled
  
  if (isShuffled) {
    originalOrder = questions.map((_, i) => i)
    const shuffled = [...originalOrder]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    questions = shuffled.map(i => questions[i])
  } else {
    questions = originalOrder.map(i => questions[i])
  }
  
  currentQuestionIndex = 0
  renderQuestion()
}

function showResults() {
  const percentage = Math.round((score / questions.length) * 100)
  let resultMessage = ''

  if (percentage === 100) {
    resultMessage = '🌟 Doskonale! Wszystkie odpowiedzi są poprawne!'
  } else if (percentage >= 80) {
    resultMessage = '⭐ Świetnie! Wiele poprawnych odpowiedzi!'
  } else if (percentage >= 60) {
    resultMessage = '👍 Dobrze. Warto powtórzyć kilka zagadnień.'
  } else if (percentage >= 40) {
    resultMessage = '📚 Potrzebujesz więcej nauki. Spróbuj ponownie!'
  } else {
    resultMessage = '💪 Zacznij od początku i starannie czytaj pytania.'
  }

  app!.innerHTML = `
    <div class="app">
      <header class="topbar">
        <div>
          <h1>
            <a href="${import.meta.env.BASE_URL}">← Fiszki</a>
          </h1>
          <p class="subtitle">Wyniki treningu</p>
        </div>
      </header>

      <main>
        <section class="results-container">
          <div class="results-card">
            <h2>Twój wynik</h2>
            
            <div class="score-large">
              <div class="score-number">${score}/${questions.length}</div>
              <div class="score-percentage">${percentage}%</div>
            </div>

            <p class="result-message">${resultMessage}</p>

            <div class="results-details">
              <div class="result-item">
                <span class="result-label">Poprawne:</span>
                <span class="result-value correct-count">${score}</span>
              </div>
              <div class="result-item">
                <span class="result-label">Błędne:</span>
                <span class="result-value incorrect-count">${questions.length - score}</span>
              </div>
            </div>

            <div class="button-group">
              <button id="restart-button" type="button" class="primary">
                🔄 Spróbuj ponownie
              </button>
              <button id="back-button" type="button">
                ← Wróć do fiszek
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  `

  document.getElementById('restart-button')?.addEventListener('click', () => {
    currentQuestionIndex = 0
    score = 0
    answered.clear()
    userAnswers.clear()
    renderQuestion()
  })

  document.getElementById('back-button')?.addEventListener('click', () => {
    window.location.href = import.meta.env.BASE_URL
  })
}

loadQuestions()
