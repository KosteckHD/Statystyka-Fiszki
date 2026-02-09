import"./style-F3p9moS5.js";var e=document.querySelector(`#app`);if(!e)throw Error(`Brak elementu #app`);var t=[],n=[],r=0,i=0,a=new Set,o=new Map,s=!1,c=[];async function l(){try{t=await(await fetch(`/Statystyka-Fiszki/data/drill.json`)).json(),u(t)}catch(t){console.error(`Błąd przy ładowaniu pytań:`,t),e.innerHTML=`<p>Błąd przy ładowaniu pytań.</p>`}}function u(e){n=[...e],r=0,i=0,a.clear(),o.clear(),s=!1,c=[],d()}function d(){if(!n.length)return;let t=n[r],c=a.has(t.id),l=o.get(t.id),u=t.options.map((e,n)=>{let r=`option`;return c&&(n===t.correctAnswer?r+=` correct`:n===l&&l!==t.correctAnswer&&(r+=` incorrect`)),`
        <button 
          type="button" 
          class="${r} ${l===n?`selected`:``}"
          data-index="${n}"
          ${c?`disabled`:``}
        >
          <span class="option-letter">${String.fromCharCode(65+n)}.</span>
          <span class="option-text">${e}</span>
          ${c&&n===t.correctAnswer?`<span class="icon">✓</span>`:``}
          ${c&&n===l&&l!==t.correctAnswer?`<span class="icon">✗</span>`:``}
        </button>
      `}).join(``),h=`${r+1} / ${n.length}`,g=Math.round(i/n.length*100);e.innerHTML=`
    <div class="app">
      <header class="topbar">
        <div>
          <h1>
            <a href="/Statystyka-Fiszki/">← Fiszki</a>
          </h1>
          <p class="subtitle">Trening do egzaminu</p>
        </div>
        <div class="deck">Pytania: ${h}</div>
      </header>

      <main>
        <section class="drill-container">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${r/n.length*100}%"></div>
          </div>

          <div class="question-box">
            <h2 class="question-text">${t.question}</h2>
            
            <div class="options-container">
              ${u}
            </div>

            ${c?`<div class="feedback ${l===t.correctAnswer?`correct`:`incorrect`}">
                    ${l===t.correctAnswer?`✓ Poprawna odpowiedź!`:`✗ Błędna odpowiedź. Prawidłowa odpowiedź to: `+String.fromCharCode(65+t.correctAnswer)}
                  </div>`:``}
          </div>

          <section class="controls">
            <div class="buttons">
              <button 
                id="prev-button" 
                type="button"
                ${r===0?`disabled`:``}
              >
                ← Poprzednia
              </button>
              ${c?`<button id="next-or-finish-button" type="button" class="primary">
                      ${r===n.length-1?`Pokaż wyniki`:`Następna →`}
                    </button>`:`<div class="spacer"></div>`}
              <button 
                id="next-button" 
                type="button"
                ${r===n.length-1?`disabled`:``}
              >
                Następna →
              </button>
            </div>
            <div class="buttons secondary">
              <button id="shuffle-button" type="button">
                ${s?`🔀 Przywróć kolejność`:`🔀 Tasuj`}
              </button>
            </div>
          </section>

          <div class="score-preview">
            Wynik: <strong>${i}</strong> / ${n.length} (${g}%)
          </div>
        </section>
      </main>
    </div>
  `,document.querySelectorAll(`.option`).forEach(e=>{e.addEventListener(`click`,()=>{c||f(parseInt(e.getAttribute(`data-index`)))})});let _=document.getElementById(`prev-button`),v=document.getElementById(`next-button`),y=document.getElementById(`next-or-finish-button`);_?.addEventListener(`click`,()=>{r>0&&(r--,d())}),v?.addEventListener(`click`,()=>{r<n.length-1&&(r++,d())}),y?.addEventListener(`click`,()=>{r===n.length-1?m():(r++,d())}),document.getElementById(`shuffle-button`)?.addEventListener(`click`,p)}function f(e){let t=n[r];o.set(t.id,e),a.add(t.id),e===t.correctAnswer&&i++,d()}function p(){if(s=!s,s){c=[...n];let e=[...n];for(let t=e.length-1;t>0;t--){let n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}n=e}else n=c.length?[...c]:[...n];r=0,d()}function m(){let r=Math.round(i/n.length*100),a=n.filter(e=>o.get(e.id)!==e.correctAnswer),s=a.length,c=``;c=r===100?`🌟 Doskonale! Wszystkie odpowiedzi są poprawne!`:r>=80?`⭐ Świetnie! Wiele poprawnych odpowiedzi!`:r>=60?`👍 Dobrze. Warto powtórzyć kilka zagadnień.`:r>=40?`📚 Potrzebujesz więcej nauki. Spróbuj ponownie!`:`💪 Zacznij od początku i starannie czytaj pytania.`,e.innerHTML=`
    <div class="app">
      <header class="topbar">
        <div>
          <h1>
            <a href="/Statystyka-Fiszki/">← Fiszki</a>
          </h1>
          <p class="subtitle">Wyniki treningu</p>
        </div>
      </header>

      <main>
        <section class="results-container">
          <div class="results-card">
            <h2>Twój wynik</h2>
            
            <div class="score-large">
              <div class="score-number">${i}/${n.length}</div>
              <div class="score-percentage">${r}%</div>
            </div>

            <p class="result-message">${c}</p>

            <div class="results-details">
              <div class="result-item">
                <span class="result-label">Poprawne:</span>
                <span class="result-value correct-count">${i}</span>
              </div>
              <div class="result-item">
                <span class="result-label">Błędne:</span>
                <span class="result-value incorrect-count">${n.length-i}</span>
              </div>
            </div>

            <div class="button-group">
              <button id="restart-button" type="button" class="primary">
                🔄 Spróbuj ponownie
              </button>
              ${s>0?`<button id="retry-incorrect-button" type="button">
                      ↩ Powtórz błędne
                    </button>`:``}
              <button id="back-button" type="button">
                ← Wróć do fiszek
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  `,document.getElementById(`restart-button`)?.addEventListener(`click`,()=>{u(t)}),document.getElementById(`retry-incorrect-button`)?.addEventListener(`click`,()=>{u(a)}),document.getElementById(`back-button`)?.addEventListener(`click`,()=>{window.location.href=`/Statystyka-Fiszki/`})}l();