/**
 * OOPs Playground - Interactive Quiz Engine
 * Manages 15-question OOP assessment with real-time feedback, detailed explanations,
 * progress tracking, score calculation, review mode, and persistence.
 */

const QuizEngine = (() => {
  let questions = [];
  let currentIndex = 0;
  let userAnswers = {}; // { [questionId]: { selectedIndex: number, isCorrect: boolean } }
  let isCurrentSubmitted = false;
  let isFinished = false;
  let isReviewMode = false;
  let reviewFilterOnlyMistakes = false;

  function init() {
    // Load fresh copy of questions from data.js
    questions = (typeof QUIZ_QUESTIONS !== 'undefined') ? [...QUIZ_QUESTIONS] : [];
    currentIndex = 0;
    userAnswers = {};
    isCurrentSubmitted = false;
    isFinished = false;
    isReviewMode = false;
    reviewFilterOnlyMistakes = false;
  }

  function startQuiz(shuffle = false) {
    init();
    if (shuffle) {
      questions.sort(() => Math.random() - 0.5);
    }
    renderCurrentQuestion();
    updateProgressBar();
  }

  function getCurrentQuestion() {
    return questions[currentIndex] || null;
  }

  function getAnswerFor(questionId) {
    return userAnswers[questionId] || null;
  }

  function selectOption(optionIndex) {
    const q = getCurrentQuestion();
    if (!q || isCurrentSubmitted || isFinished) return;

    userAnswers[q.id] = {
      selectedIndex: optionIndex,
      isCorrect: optionIndex === q.correctIndex
    };

    // Render selection highlight
    updateOptionSelectionUI(optionIndex);
  }

  function submitAnswer() {
    const q = getCurrentQuestion();
    if (!q || isCurrentSubmitted) return;

    const answer = userAnswers[q.id];
    if (!answer || answer.selectedIndex === undefined) {
      alert('Please select an option before submitting.');
      return;
    }

    isCurrentSubmitted = true;
    renderFeedbackUI(q, answer);

    // Update submit/next buttons
    const submitBtn = document.getElementById('quiz-submit-btn');
    const nextBtn = document.getElementById('quiz-next-btn');
    if (submitBtn) submitBtn.style.display = 'none';
    if (nextBtn) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.focus();
    }
  }

  function nextQuestion() {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      isCurrentSubmitted = !!userAnswers[questions[currentIndex]?.id];
      renderCurrentQuestion();
      updateProgressBar();
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    isFinished = true;
    const summary = calculateScore();

    // Persist score
    if (typeof ProgressManager !== 'undefined') {
      ProgressManager.recordQuizScore(summary.correct, summary.total);
    }

    renderQuizResults(summary);
  }

  function calculateScore() {
    let correct = 0;
    const details = [];

    questions.forEach((q, idx) => {
      const ans = userAnswers[q.id];
      const isCorrect = ans ? ans.isCorrect : false;
      if (isCorrect) correct++;

      details.push({
        index: idx + 1,
        question: q,
        selected: ans ? ans.selectedIndex : null,
        isCorrect
      });
    });

    const total = questions.length;
    const incorrect = total - correct;
    const percentage = Math.round((correct / total) * 100);

    let performanceMessage = '';
    let performanceBadge = '';

    if (percentage >= 90) {
      performanceMessage = 'Outstanding Performance! You demonstrate thorough mastery of core Java OOP concepts and architectural principles.';
      performanceBadge = 'Mastery Level: Advanced';
    } else if (percentage >= 75) {
      performanceMessage = 'Excellent Work! Strong foundational understanding with a few nuanced edge cases to review.';
      performanceBadge = 'Mastery Level: Proficient';
    } else if (percentage >= 50) {
      performanceMessage = 'Solid Foundation! You understand the main principles; testing the playground memory visualizers will solidify edge cases.';
      performanceBadge = 'Mastery Level: Intermediate';
    } else {
      performanceMessage = 'Keep Learning! Object-oriented abstractions take time. Review the lesson diagrams and walk through the simulators again.';
      performanceBadge = 'Mastery Level: Novice';
    }

    return {
      correct,
      incorrect,
      total,
      percentage,
      performanceMessage,
      performanceBadge,
      details
    };
  }

  function enterReviewMode(onlyMistakes = false) {
    isReviewMode = true;
    reviewFilterOnlyMistakes = onlyMistakes;
    renderReviewModeUI();
  }

  function restartQuiz() {
    startQuiz(false);
    const container = document.getElementById('quiz-active-card');
    const resultsContainer = document.getElementById('quiz-results-card');
    const reviewContainer = document.getElementById('quiz-review-card');

    if (container) container.style.display = 'block';
    if (resultsContainer) resultsContainer.style.display = 'none';
    if (reviewContainer) reviewContainer.style.display = 'none';
  }

  // -------------------------------------------------------------
  // UI RENDERERS
  // -------------------------------------------------------------

  function renderCurrentQuestion() {
    const q = getCurrentQuestion();
    if (!q) return;

    const catBadge = document.getElementById('quiz-cat-badge');
    const counterBadge = document.getElementById('quiz-counter-badge');
    const questionText = document.getElementById('quiz-question-text');
    const optionsContainer = document.getElementById('quiz-options-container');
    const feedbackContainer = document.getElementById('quiz-feedback-container');
    const submitBtn = document.getElementById('quiz-submit-btn');
    const nextBtn = document.getElementById('quiz-next-btn');

    if (catBadge) catBadge.textContent = q.category;
    if (counterBadge) counterBadge.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
    if (questionText) questionText.textContent = q.question;

    // Reset feedback
    if (feedbackContainer) {
      feedbackContainer.style.display = 'none';
      feedbackContainer.innerHTML = '';
    }

    // Existing answer for this question?
    const existing = userAnswers[q.id];
    isCurrentSubmitted = !!existing && existing.selectedIndex !== undefined;

    // Build options
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      q.options.forEach((optText, idx) => {
        const optionBtn = document.createElement('button');
        optionBtn.type = 'button';
        optionBtn.className = 'quiz-option-btn';
        optionBtn.id = `quiz-opt-${idx}`;
        optionBtn.dataset.index = idx;

        const isSelected = existing && existing.selectedIndex === idx;
        if (isSelected) optionBtn.classList.add('selected');

        optionBtn.innerHTML = `
          <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
          <span class="opt-text">${escapeHTML(optText)}</span>
        `;

        optionBtn.addEventListener('click', () => {
          if (!isCurrentSubmitted) {
            selectOption(idx);
          }
        });

        optionsContainer.appendChild(optionBtn);
      });
    }

    // Button states
    if (submitBtn) {
      submitBtn.style.display = isCurrentSubmitted ? 'none' : 'inline-flex';
      submitBtn.disabled = !existing || existing.selectedIndex === undefined;
    }
    if (nextBtn) {
      nextBtn.style.display = isCurrentSubmitted ? 'inline-flex' : 'none';
      nextBtn.textContent = (currentIndex === questions.length - 1) ? 'View Final Results →' : 'Next Question →';
    }

    if (isCurrentSubmitted && existing) {
      renderFeedbackUI(q, existing);
    }
  }

  function updateOptionSelectionUI(selectedIndex) {
    const q = getCurrentQuestion();
    if (!q) return;

    q.options.forEach((_, idx) => {
      const btn = document.getElementById(`quiz-opt-${idx}`);
      if (btn) {
        if (idx === selectedIndex) {
          btn.classList.add('selected');
        } else {
          btn.classList.remove('selected');
        }
      }
    });

    const submitBtn = document.getElementById('quiz-submit-btn');
    if (submitBtn) submitBtn.disabled = false;
  }

  function renderFeedbackUI(q, answer) {
    const feedbackContainer = document.getElementById('quiz-feedback-container');
    const optionsContainer = document.getElementById('quiz-options-container');

    // Highlight correct & incorrect options
    q.options.forEach((_, idx) => {
      const btn = document.getElementById(`quiz-opt-${idx}`);
      if (!btn) return;

      btn.classList.remove('selected');
      if (idx === q.correctIndex) {
        btn.classList.add('correct');
      } else if (idx === answer.selectedIndex && !answer.isCorrect) {
        btn.classList.add('incorrect');
      }
      btn.disabled = true;
    });

    if (feedbackContainer) {
      feedbackContainer.style.display = 'block';
      feedbackContainer.className = `quiz-feedback-box ${answer.isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`;
      feedbackContainer.innerHTML = `
        <div class="feedback-header">
          <span class="feedback-icon">${answer.isCorrect ? '✓' : '✗'}</span>
          <strong>${answer.isCorrect ? 'Correct!' : 'Incorrect'}</strong>
        </div>
        <div class="feedback-rationale">
          <p><strong>Explanation:</strong> ${escapeHTML(q.explanation)}</p>
        </div>
      `;
    }
  }

  function updateProgressBar() {
    const fill = document.getElementById('quiz-progress-fill');
    const label = document.getElementById('quiz-progress-label');
    const pct = Math.round(((currentIndex + 1) / questions.length) * 100);

    if (fill) fill.style.width = `${pct}%`;
    if (label) label.textContent = `${pct}% completed`;
  }

  function renderQuizResults(summary) {
    const activeCard = document.getElementById('quiz-active-card');
    const resultsCard = document.getElementById('quiz-results-card');
    const reviewCard = document.getElementById('quiz-review-card');

    if (activeCard) activeCard.style.display = 'none';
    if (reviewCard) reviewCard.style.display = 'none';
    if (!resultsCard) return;

    resultsCard.style.display = 'block';

    resultsCard.innerHTML = `
      <div class="results-wrapper">
        <div class="results-badge">${summary.performanceBadge}</div>
        <h2 class="results-title">Quiz Completed!</h2>
        
        <div class="score-circle-wrapper">
          <div class="score-number">${summary.score ? summary.score : summary.correct}/${summary.total}</div>
          <div class="score-percentage">${summary.percentage}%</div>
        </div>

        <p class="results-message">${summary.performanceMessage}</p>

        <div class="stats-pills-row">
          <div class="stat-pill pill-success">
            <span class="pill-label">Correct</span>
            <span class="pill-val">${summary.correct}</span>
          </div>
          <div class="stat-pill pill-danger">
            <span class="pill-label">Incorrect</span>
            <span class="pill-val">${summary.incorrect}</span>
          </div>
          <div class="stat-pill pill-info">
            <span class="pill-label">Total Questions</span>
            <span class="pill-val">${summary.total}</span>
          </div>
        </div>

        <div class="results-actions">
          <button type="button" class="btn btn-primary" id="btn-restart-quiz">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
            Restart Quiz
          </button>
          <button type="button" class="btn btn-secondary" id="btn-review-all">
            Review All Questions
          </button>
          ${summary.incorrect > 0 ? `
            <button type="button" class="btn btn-danger-soft" id="btn-review-mistakes">
              Review Mistakes (${summary.incorrect})
            </button>
          ` : ''}
        </div>
      </div>
    `;

    document.getElementById('btn-restart-quiz')?.addEventListener('click', restartQuiz);
    document.getElementById('btn-review-all')?.addEventListener('click', () => enterReviewMode(false));
    document.getElementById('btn-review-mistakes')?.addEventListener('click', () => enterReviewMode(true));
  }

  function renderReviewModeUI() {
    const activeCard = document.getElementById('quiz-active-card');
    const resultsCard = document.getElementById('quiz-results-card');
    const reviewCard = document.getElementById('quiz-review-card');

    if (activeCard) activeCard.style.display = 'none';
    if (resultsCard) resultsCard.style.display = 'none';
    if (!reviewCard) return;

    reviewCard.style.display = 'block';

    const summary = calculateScore();
    let displayQuestions = summary.details;
    if (reviewFilterOnlyMistakes) {
      displayQuestions = displayQuestions.filter(d => !d.isCorrect);
    }

    reviewCard.innerHTML = `
      <div class="review-header-bar">
        <div>
          <h3>Question Review ${reviewFilterOnlyMistakes ? '(Mistakes Only)' : '(All Questions)'}</h3>
          <p class="text-muted">Showing ${displayQuestions.length} questions</p>
        </div>
        <div class="review-header-btns">
          <button type="button" class="btn btn-sm btn-secondary" id="btn-back-to-results">← Back to Score</button>
          <button type="button" class="btn btn-sm btn-primary" id="btn-review-restart">Restart Quiz</button>
        </div>
      </div>

      <div class="review-list">
        ${displayQuestions.map(item => {
          const q = item.question;
          const userIdx = item.selected;
          const isCorrect = item.isCorrect;

          return `
            <div class="review-item-card ${isCorrect ? 'item-correct' : 'item-incorrect'}">
              <div class="review-item-top">
                <span class="badge ${isCorrect ? 'badge-emerald' : 'badge-rose'}">
                  ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
                <span class="text-muted">Question ${item.index} • ${escapeHTML(q.category)}</span>
              </div>
              <h4 class="review-q-title">${escapeHTML(q.question)}</h4>
              <div class="review-options-list">
                ${q.options.map((opt, oIdx) => {
                  let optClass = 'review-opt';
                  if (oIdx === q.correctIndex) optClass += ' opt-is-correct';
                  if (oIdx === userIdx && !isCorrect) optClass += ' opt-user-wrong';
                  if (oIdx === userIdx && isCorrect) optClass += ' opt-user-correct';

                  return `
                    <div class="${optClass}">
                      <span class="opt-indicator">
                        ${oIdx === q.correctIndex ? '✓ Correct Answer' : (oIdx === userIdx ? '✗ Your Selection' : '')}
                      </span>
                      <span>${String.fromCharCode(65 + oIdx)}. ${escapeHTML(opt)}</span>
                    </div>
                  `;
                }).join('')}
              </div>
              <div class="review-explanation">
                <strong>Explanation:</strong> ${escapeHTML(q.explanation)}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    document.getElementById('btn-back-to-results')?.addEventListener('click', () => {
      reviewCard.style.display = 'none';
      if (resultsCard) resultsCard.style.display = 'block';
    });
    document.getElementById('btn-review-restart')?.addEventListener('click', restartQuiz);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  return {
    init,
    startQuiz,
    getCurrentQuestion,
    getAnswerFor,
    selectOption,
    submitAnswer,
    nextQuestion,
    restartQuiz,
    enterReviewMode,
    calculateScore
  };
})();
