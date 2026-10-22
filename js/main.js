/**
 * OOPs Playground - Main Application Controller
 * Handles SPA navigation, Lesson module rendering, Playground Studio interactivity,
 * Terminal console simulation, and Progress dashboard synchronization.
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // STATE & ROUTING
  // -------------------------------------------------------------
  let currentLessonId = 'classes-objects';
  let currentSimTab = 'classes-objects';

  const LESSON_KEYS = ['classes-objects', 'inheritance', 'encapsulation', 'polymorphism', 'abstraction'];

  // Terminal logging buffer
  let terminalLogs = [
    'Welcome to OOPs Playground Terminal Console.',
    'Select any interactive control on the left to simulate Java execution.'
  ];

  function appendTerminalLog(msg) {
    terminalLogs.push(msg);
    // Keep last 30 logs
    if (terminalLogs.length > 30) terminalLogs.shift();
    renderTerminalLogs();
  }

  function clearTerminalLogs() {
    terminalLogs = ['[Console cleared. Ready for simulated execution.]'];
    renderTerminalLogs();
  }

  function renderTerminalLogs() {
    const termEl = document.getElementById('inspector-terminal');
    if (termEl) {
      termEl.textContent = terminalLogs.join('\n\n');
      termEl.scrollTop = termEl.scrollHeight;
    }
  }

  // -------------------------------------------------------------
  // NAVIGATION & HASH ROUTING
  // -------------------------------------------------------------
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('nav-links-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('mobile-open');
    });
  }

  function handleHashChange() {
    const hash = window.location.hash || '#home';
    const cleanHash = hash.split('?')[0];

    navLinks.forEach(link => {
      if (link.getAttribute('href') === cleanHash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    if (mobileMenu) {
      mobileMenu.classList.remove('mobile-open');
    }
  }

  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();

  // "Learn More" buttons on Homepage Cards
  document.querySelectorAll('.card-learn-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const lesson = e.currentTarget.dataset.lesson;
      if (lesson) {
        switchLesson(lesson);
        window.location.hash = '#learn';
        document.getElementById('learn')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Footer lesson links
  document.querySelectorAll('.footer-learn-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const lesson = e.currentTarget.dataset.lesson;
      if (lesson) {
        switchLesson(lesson);
        window.location.hash = '#learn';
        document.getElementById('learn')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // -------------------------------------------------------------
  // LESSONS MODULE RENDERER
  // -------------------------------------------------------------
  const lessonTabs = document.querySelectorAll('.lesson-tab-btn');
  const lessonContainer = document.getElementById('lesson-detail-container');

  lessonTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const lessonId = tab.dataset.lesson;
      switchLesson(lessonId);
    });
  });

  function switchLesson(lessonId) {
    if (!LESSONS_DATA[lessonId]) return;
    currentLessonId = lessonId;

    // Update Tab UI
    lessonTabs.forEach(t => {
      const isCurrent = t.dataset.lesson === lessonId;
      t.classList.toggle('active', isCurrent);
      t.setAttribute('aria-selected', isCurrent);
    });

    renderLessonDetail(LESSONS_DATA[lessonId]);
  }

  function renderLessonDetail(lesson) {
    if (!lessonContainer) return;

    const isDone = ProgressManager.isLessonComplete(lesson.id);
    const currIdx = LESSON_KEYS.indexOf(lesson.id);
    const prevId = currIdx > 0 ? LESSON_KEYS[currIdx - 1] : null;
    const nextId = currIdx < LESSON_KEYS.length - 1 ? LESSON_KEYS[currIdx + 1] : null;

    lessonContainer.innerHTML = `
      <!-- 1. Header -->
      <div class="lesson-header">
        <div class="lesson-header-info">
          <div class="lesson-meta-row">
            <span class="badge ${lesson.badgeClass}">${lesson.tag}</span>
            <span style="font-size: 0.85rem; color: var(--text-dim);">${lesson.difficulty} • ~${lesson.estimatedTime}</span>
          </div>
          <h2 class="lesson-title">${lesson.title}</h2>
          <div class="lesson-subtitle">${lesson.subtitle}</div>
        </div>

        <button type="button" class="lesson-status-toggle ${isDone ? 'completed' : ''}" id="btn-toggle-lesson-complete">
          <span>${isDone ? '✓ Completed' : '○ Mark as Read'}</span>
        </button>
      </div>

      <!-- 2. Real-World Analogy -->
      <div class="analogy-box">
        <div class="analogy-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <div class="analogy-content">
          <h4>Real-World Analogy</h4>
          <p>${escapeHTML(lesson.analogy)}</p>
        </div>
      </div>

      <!-- 3. Java Code & Explanation Grid -->
      <div class="code-section-grid">
        <!-- Java Code Viewer -->
        <div class="code-viewer-card">
          <div class="code-viewer-header">
            <span class="code-tab-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
              ${lesson.title.replace(/\s+/g, '')}.java
            </span>
            <button type="button" class="copy-btn" id="btn-copy-lesson-code">Copy Code</button>
          </div>
          <pre class="code-pre"><code>${escapeHTML(lesson.javaCode)}</code></pre>
          
          <!-- Terminal Expected Output -->
          <div class="terminal-output-box">
            <div class="terminal-bar">
              <span>SIMULATED JVM OUTPUT</span>
              <span>exit code 0</span>
            </div>
            <div class="terminal-content">${escapeHTML(lesson.expectedOutput)}</div>
          </div>
        </div>

        <!-- Line-by-Line Breakdown -->
        <div class="explanation-card">
          <h4>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Code Architecture Breakdown
          </h4>
          <div class="breakdown-list">
            ${lesson.codeExplanation.map(item => `
              <div class="breakdown-item">
                <code class="breakdown-code">${escapeHTML(item.line)}</code>
                <div class="breakdown-desc">${escapeHTML(item.desc)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- 4. Inline Interactive Sandbox -->
      <div class="inline-sandbox-container">
        <div class="sandbox-header">
          <h4>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Interactive Sandbox: ${lesson.title}
          </h4>
          <a href="#playground" class="btn btn-sm btn-outline" id="btn-jump-to-studio">Open in Full Studio ↗</a>
        </div>
        <div id="inline-sandbox-root">
          <!-- Sandbox rendered based on current lesson -->
        </div>
      </div>

      <!-- 5. Common Mistakes -->
      <div class="mistakes-container">
        <div class="mistakes-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Common Pitfalls & Mistakes to Avoid
        </div>
        <ul class="mistakes-list">
          ${lesson.commonMistakes.map(m => `
            <li>
              <span class="mistake-bullet">✕</span>
              <span>${escapeHTML(m)}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- 6. Quick Knowledge Check -->
      <div class="knowledge-check-card">
        <div class="knowledge-header">
          <span class="badge badge-blue">Knowledge Check</span>
          <span style="font-size: 0.8rem; color: var(--text-dim);">Instant Verification</span>
        </div>
        <div class="knowledge-question-text">${escapeHTML(lesson.knowledgeCheck.question)}</div>
        <div class="knowledge-options-grid" id="kc-options-list">
          ${lesson.knowledgeCheck.options.map((opt, idx) => `
            <button type="button" class="kc-option-btn" data-index="${idx}">
              <span class="opt-letter" style="width: 1.5rem; height: 1.5rem; font-size: 0.75rem;">${String.fromCharCode(65 + idx)}</span>
              <span>${escapeHTML(opt)}</span>
            </button>
          `).join('')}
        </div>
        <div id="kc-feedback" style="display: none;"></div>
      </div>

      <!-- 7. Lesson Navigation Footer -->
      <div class="lesson-nav-footer">
        ${prevId ? `
          <button type="button" class="btn btn-secondary" id="btn-prev-lesson" data-prev="${prevId}">
            ← Previous: ${LESSONS_DATA[prevId].title}
          </button>
        ` : '<div></div>'}

        <button type="button" class="btn btn-primary" id="btn-mark-and-next" data-next="${nextId || ''}">
          ${nextId ? `Next: ${LESSONS_DATA[nextId].title} →` : 'Take Mastery Quiz →'}
        </button>
      </div>
    `;

    // Connect lesson event listeners
    attachLessonEvents(lesson);
    renderInlineSandbox(lesson.id);
  }

  function attachLessonEvents(lesson) {
    // Copy code button
    const copyBtn = document.getElementById('btn-copy-lesson-code');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(lesson.javaCode).then(() => {
          copyBtn.textContent = 'Copied!';
          setTimeout(() => { copyBtn.textContent = 'Copy Code'; }, 2000);
        });
      });
    }

    // Toggle lesson complete button
    const toggleCompleteBtn = document.getElementById('btn-toggle-lesson-complete');
    if (toggleCompleteBtn) {
      toggleCompleteBtn.addEventListener('click', () => {
        ProgressManager.toggleLessonComplete(lesson.id);
        const isDone = ProgressManager.isLessonComplete(lesson.id);
        toggleCompleteBtn.classList.toggle('completed', isDone);
        toggleCompleteBtn.innerHTML = `<span>${isDone ? '✓ Completed' : '○ Mark as Read'}</span>`;
      });
    }

    // Knowledge check options
    const kcOptions = document.querySelectorAll('.kc-option-btn');
    const kcFeedback = document.getElementById('kc-feedback');

    kcOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedIdx = parseInt(btn.dataset.index, 10);
        const isCorrect = selectedIdx === lesson.knowledgeCheck.correctIndex;

        kcOptions.forEach((b, i) => {
          b.disabled = true;
          if (i === lesson.knowledgeCheck.correctIndex) {
            b.classList.add('correct');
          } else if (i === selectedIdx && !isCorrect) {
            b.classList.add('incorrect');
          }
        });

        if (kcFeedback) {
          kcFeedback.style.display = 'block';
          kcFeedback.className = `kc-feedback-box ${isCorrect ? 'correct' : 'incorrect'}`;
          kcFeedback.innerHTML = `
            <strong>${isCorrect ? '✓ Correct Answer!' : '✗ Not Quite.'}</strong>
            <p style="margin-top: 0.35rem;">${escapeHTML(lesson.knowledgeCheck.explanation)}</p>
          `;
        }

        ProgressManager.recordKnowledgeCheck(lesson.id, isCorrect);
      });
    });

    // Previous button
    const prevBtn = document.getElementById('btn-prev-lesson');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        switchLesson(prevBtn.dataset.prev);
        document.getElementById('learn').scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Next button
    const nextBtn = document.getElementById('btn-mark-and-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        ProgressManager.markLessonComplete(lesson.id);
        const nextId = nextBtn.dataset.next;
        if (nextId) {
          switchLesson(nextId);
          document.getElementById('learn').scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.hash = '#quiz';
        }
      });
    }

    // Jump to studio
    document.getElementById('btn-jump-to-studio')?.addEventListener('click', () => {
      switchPlaygroundTab(lesson.id);
    });
  }

  // -------------------------------------------------------------
  // INLINE LESSON SANDBOX RENDERER
  // -------------------------------------------------------------
  function renderInlineSandbox(lessonId) {
    const root = document.getElementById('inline-sandbox-root');
    if (!root) return;

    if (lessonId === 'classes-objects') {
      root.innerHTML = `
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; margin-bottom: 1rem;">
          <button type="button" class="btn btn-primary" id="inline-create-car-btn">
            Create Car ("Red", 60 km/h)
          </button>
          <button type="button" class="btn btn-secondary" id="inline-create-sports-btn">
            Create Sports Car ("Blue", 120 km/h)
          </button>
          <button type="button" class="btn btn-outline" id="inline-reset-cars-btn">Reset</button>
        </div>
        <div id="inline-cars-display" class="heap-objects-list"></div>
      `;

      function renderCars() {
        const state = Simulator.getClassesObjectsState();
        const display = document.getElementById('inline-cars-display');
        if (!display) return;

        if (state.objects.length === 0) {
          display.innerHTML = `<div style="color: var(--text-dim); font-size: 0.9rem; padding: 1rem;">No Car instances in Heap yet. Click a button above to allocate memory.</div>`;
          return;
        }

        display.innerHTML = state.objects.map(car => `
          <div class="heap-object-card">
            <div class="heap-header">
              <span class="stack-var-name">${car.varName}</span>
              <span class="heap-addr">${car.memoryAddress}</span>
            </div>
            <div class="heap-car-graphic">
              <div class="car-icon-color" style="background: ${car.colorHex};">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/></svg>
              </div>
              <div class="car-info-details">
                <strong>${car.colorName}</strong>
                <span style="color: var(--text-dim);">${car.speed} km/h</span>
              </div>
            </div>
            <button type="button" class="btn btn-sm btn-outline inline-drive-btn" data-id="${car.id}">
              ${car.varName}.drive()
            </button>
          </div>
        `).join('');

        display.querySelectorAll('.inline-drive-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const res = Simulator.driveCar(btn.dataset.id);
            if (res) alert(res.output);
          });
        });
      }

      document.getElementById('inline-create-car-btn')?.addEventListener('click', () => {
        Simulator.createCarObject('myCar', 'Crimson Red', '#EF4444', 60);
        renderCars();
      });

      document.getElementById('inline-create-sports-btn')?.addEventListener('click', () => {
        Simulator.createCarObject('sportsCar', 'Electric Blue', '#3B82F6', 120);
        renderCars();
      });

      document.getElementById('inline-reset-cars-btn')?.addEventListener('click', () => {
        Simulator.resetClassesObjects();
        renderCars();
      });

      renderCars();
    } else if (lessonId === 'inheritance') {
      root.innerHTML = `
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
          <button type="button" class="btn btn-primary" id="inline-call-car-start">myCar.start() [Inherited]</button>
          <button type="button" class="btn btn-secondary" id="inline-call-car-trunk">myCar.openTrunk() [Subclass]</button>
          <button type="button" class="btn btn-outline" id="inline-call-bike-kick">myBike.kickStand() [Subclass]</button>
        </div>
        <div id="inline-inh-output" style="margin-top: 1rem; padding: 0.85rem; background: #0A0F1D; border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 0.85rem; color: #34D399;">
          Click any method above to trace inheritance resolution.
        </div>
      `;

      function runMethod(cls, m) {
        const res = Simulator.callInheritanceMethod(cls, m);
        const outEl = document.getElementById('inline-inh-output');
        if (res && outEl) {
          outEl.innerHTML = `<strong>Output:</strong> ${escapeHTML(res.output)}<br><span style="color: #94A3B8; font-size: 0.775rem;">${escapeHTML(res.lookupTrace)}</span>`;
        }
      }

      document.getElementById('inline-call-car-start')?.addEventListener('click', () => runMethod('Car', 'start()'));
      document.getElementById('inline-call-car-trunk')?.addEventListener('click', () => runMethod('Car', 'openTrunk()'));
      document.getElementById('inline-call-bike-kick')?.addEventListener('click', () => runMethod('Bike', 'kickStand()'));
    } else if (lessonId === 'encapsulation') {
      root.innerHTML = `
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
          <button type="button" class="btn btn-primary" id="inline-deposit-btn">Deposit +$100</button>
          <button type="button" class="btn btn-secondary" id="inline-withdraw-btn">Withdraw -$40</button>
          <button type="button" class="btn btn-danger-soft" id="inline-illegal-btn">Try: account.balance = -999</button>
        </div>
        <div id="inline-enc-output" style="margin-top: 1rem; padding: 0.85rem; background: #0A0F1D; border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 0.85rem; color: #34D399;">
          Current Encapsulated Balance: $${Simulator.getEncapsulationData().balance.toFixed(2)}
        </div>
      `;

      function refreshEnc(msg) {
        const outEl = document.getElementById('inline-enc-output');
        if (outEl) {
          outEl.innerHTML = `<strong>Verified Balance:</strong> $${Simulator.getEncapsulationData().balance.toFixed(2)}<br><span style="color: #94A3B8; font-size: 0.775rem;">${escapeHTML(msg)}</span>`;
        }
      }

      document.getElementById('inline-deposit-btn')?.addEventListener('click', () => {
        const res = Simulator.depositFunds(100);
        refreshEnc(res.message);
      });

      document.getElementById('inline-withdraw-btn')?.addEventListener('click', () => {
        const res = Simulator.withdrawFunds(40);
        refreshEnc(res.success ? res.message : res.error);
      });

      document.getElementById('inline-illegal-btn')?.addEventListener('click', () => {
        const res = Simulator.attemptDirectVariableAccess(-999);
        const outEl = document.getElementById('inline-enc-output');
        if (outEl) {
          outEl.innerHTML = `<span style="color: #F87171;">${escapeHTML(res.error)}</span>`;
        }
      });
    } else if (lessonId === 'polymorphism') {
      root.innerHTML = `
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
          <button type="button" class="btn btn-primary" id="inline-poly-dog">Animal a = new Dog(); a.makeSound()</button>
          <button type="button" class="btn btn-secondary" id="inline-poly-cat">Animal a = new Cat(); a.makeSound()</button>
        </div>
        <div id="inline-poly-output" style="margin-top: 1rem; padding: 0.85rem; background: #0A0F1D; border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 0.85rem; color: #34D399;">
          Click a polymorphic assignment to test dynamic runtime dispatch.
        </div>
      `;

      function runPoly(type) {
        Simulator.selectPolymorphismObject(type);
        const res = Simulator.callMakeSound();
        const outEl = document.getElementById('inline-poly-output');
        if (res && outEl) {
          outEl.innerHTML = `<strong>Result:</strong> ${escapeHTML(res.output)}<br><span style="color: #FBBF24; font-size: 0.775rem;">${escapeHTML(res.vtableLookup)}</span>`;
        }
      }

      document.getElementById('inline-poly-dog')?.addEventListener('click', () => runPoly('Dog'));
      document.getElementById('inline-poly-cat')?.addEventListener('click', () => runPoly('Cat'));
    } else if (lessonId === 'abstraction') {
      root.innerHTML = `
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
          <button type="button" class="btn btn-primary" id="inline-abs-calc">Shape s = new Circle(radius=5); s.area()</button>
          <button type="button" class="btn btn-danger-soft" id="inline-abs-illegal">Try: Shape s = new Shape()</button>
        </div>
        <div id="inline-abs-output" style="margin-top: 1rem; padding: 0.85rem; background: #0A0F1D; border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 0.85rem; color: #34D399;">
          Click to test abstract class contract enforcement.
        </div>
      `;

      document.getElementById('inline-abs-calc')?.addEventListener('click', () => {
        const res = Simulator.calculateCircleArea(5.0);
        const outEl = document.getElementById('inline-abs-output');
        if (outEl) {
          outEl.innerHTML = `<strong>Output:</strong> ${escapeHTML(res.output)}<br><span style="color: #94A3B8; font-size: 0.775rem;">${escapeHTML(res.explanation)}</span>`;
        }
      });

      document.getElementById('inline-abs-illegal')?.addEventListener('click', () => {
        const res = Simulator.attemptInstantiateAbstractClass();
        const outEl = document.getElementById('inline-abs-output');
        if (outEl) {
          outEl.innerHTML = `<span style="color: #F87171;">${escapeHTML(res.error)}</span>`;
        }
      });
    }
  }

  // -------------------------------------------------------------
  // PLAYGROUND STUDIO CONTROLLER
  // -------------------------------------------------------------
  const studioTabs = document.querySelectorAll('.studio-tab-btn');
  const canvasEl = document.getElementById('simulator-canvas');
  const inspectorCodeEl = document.getElementById('inspector-code');
  const resetBtn = document.getElementById('studio-reset-btn');
  const clearConsoleBtn = document.getElementById('studio-clear-console-btn');

  studioTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const simKey = tab.dataset.sim;
      switchPlaygroundTab(simKey);
    });
  });

  resetBtn?.addEventListener('click', () => {
    handlePlaygroundReset();
  });

  clearConsoleBtn?.addEventListener('click', () => {
    clearTerminalLogs();
  });

  function switchPlaygroundTab(simKey) {
    currentSimTab = simKey;

    studioTabs.forEach(t => {
      t.classList.toggle('active', t.dataset.sim === simKey);
    });

    renderPlaygroundCanvas(simKey);
  }

  function handlePlaygroundReset() {
    if (currentSimTab === 'classes-objects') {
      const res = Simulator.resetClassesObjects();
      appendTerminalLog(res.log);
    } else if (currentSimTab === 'encapsulation') {
      const res = Simulator.resetEncapsulation();
      appendTerminalLog(`[Encapsulation Reset] Account balance restored to $${res.currentBalance.toFixed(2)}.`);
    } else if (currentSimTab === 'inheritance') {
      Simulator.selectInheritanceClass('Car');
      appendTerminalLog('[Inheritance Reset] Defaulted to Car subclass.');
    } else if (currentSimTab === 'polymorphism') {
      Simulator.selectPolymorphismObject('Dog');
      appendTerminalLog('[Polymorphism Reset] Set runtime object to Dog.');
    } else if (currentSimTab === 'abstraction') {
      Simulator.calculateCircleArea(5.0);
      appendTerminalLog('[Abstraction Reset] Circle radius reset to 5.0.');
    }

    renderPlaygroundCanvas(currentSimTab);
  }

  function renderPlaygroundCanvas(simKey) {
    if (!canvasEl) return;

    if (simKey === 'classes-objects') {
      renderClassesObjectsCanvas();
    } else if (simKey === 'inheritance') {
      renderInheritanceCanvas();
    } else if (simKey === 'encapsulation') {
      renderEncapsulationCanvas();
    } else if (simKey === 'polymorphism') {
      renderPolymorphismCanvas();
    } else if (simKey === 'abstraction') {
      renderAbstractionCanvas();
    }
  }

  // 1. Classes & Objects Studio
  function renderClassesObjectsCanvas() {
    const state = Simulator.getClassesObjectsState();

    if (inspectorCodeEl) {
      inspectorCodeEl.textContent = `// Classes & Objects JVM Memory Demonstration
class Car {
    String color;
    int speed;

    void drive() {
        System.out.println("Car is moving at " + speed + " km/h with color " + color);
    }
}

public class Main {
    public static void main(String[] args) {
${state.objects.map(c => `        Car ${c.varName} = new Car(); // Heap @${c.memoryAddress}
        ${c.varName}.color = "${c.colorName}";
        ${c.varName}.speed = ${c.speed};
        ${c.varName}.drive();`).join('\n\n') || `        // Click "Allocate New Car Instance" to instantiate an object in Heap memory.`}
    }
}`;
    }

    canvasEl.innerHTML = `
      <div class="memory-model-container">
        <!-- Instance Creator Controls -->
        <div class="memory-creator-form">
          <div class="form-group-inline">
            <label for="car-var-name">Variable:</label>
            <input type="text" id="car-var-name" class="form-control-sm" value="myCar${state.objects.length + 1}" style="width: 100px;">
          </div>
          <div class="form-group-inline">
            <label for="car-color-select">Color:</label>
            <select id="car-color-select" class="form-control-sm color-picker-select">
              ${Simulator.CAR_COLORS.map(c => `<option value="${c.name}|${c.hex}">${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group-inline">
            <label for="car-speed-input">Speed (km/h):</label>
            <input type="number" id="car-speed-input" class="form-control-sm" value="60" min="10" max="220" style="width: 75px;">
          </div>
          <button type="button" class="btn btn-sm btn-primary" id="btn-create-car-instance">
            + Allocate in Heap
          </button>
        </div>

        <!-- Dual Column Memory Representation -->
        <div class="memory-columns-grid">
          <!-- Column 1: Call Stack -->
          <div class="memory-column">
            <div class="memory-column-title">
              <span>Call Stack (References)</span>
              <span class="badge badge-blue">Stack Frame</span>
            </div>
            ${state.objects.length === 0 ? `
              <div style="font-size: 0.8rem; color: var(--text-dim); text-align: center; padding: 1.5rem;">
                No active object reference variables.
              </div>
            ` : state.objects.map(c => `
              <div class="stack-reference-card">
                <div>
                  <span class="stack-var-name">${c.varName}</span>
                  <div style="font-size: 0.725rem; color: var(--text-dim);">type: Car (ref)</div>
                </div>
                <span class="stack-pointer-badge">➔ ${c.memoryAddress}</span>
              </div>
            `).join('')}
          </div>

          <!-- Column 2: JVM Heap Memory -->
          <div class="memory-column">
            <div class="memory-column-title">
              <span>JVM Heap Memory</span>
              <span class="badge badge-emerald">${state.objects.length}/4 Allocated</span>
            </div>
            <div class="heap-objects-list">
              ${state.objects.length === 0 ? `
                <div style="font-size: 0.8rem; color: var(--text-dim); text-align: center; grid-column: 1 / -1; padding: 1.5rem;">
                  Heap memory region empty. Allocate an object above.
                </div>
              ` : state.objects.map(c => `
                <div class="heap-object-card">
                  <div class="heap-header">
                    <span>Instance: <strong>Car</strong></span>
                    <span class="heap-addr">${c.memoryAddress}</span>
                  </div>
                  <div class="heap-car-graphic">
                    <div class="car-icon-color" style="background: ${c.colorHex};">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/></svg>
                    </div>
                    <div class="car-info-details">
                      <strong>${c.colorName}</strong>
                      <span style="color: var(--text-dim);">${c.speed} km/h</span>
                    </div>
                  </div>
                  <button type="button" class="btn btn-sm btn-primary car-drive-action-btn drive-car-btn" data-id="${c.id}">
                    Execute ${c.varName}.drive()
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-create-car-instance')?.addEventListener('click', () => {
      const varName = document.getElementById('car-var-name')?.value.trim();
      const colorVal = document.getElementById('car-color-select')?.value.split('|');
      const speed = document.getElementById('car-speed-input')?.value;

      const res = Simulator.createCarObject(varName, colorVal[0], colorVal[1], speed);
      if (res.success) {
        appendTerminalLog(res.log);
        renderClassesObjectsCanvas();
      } else {
        alert(res.message);
      }
    });

    document.querySelectorAll('.drive-car-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = Simulator.driveCar(btn.dataset.id);
        if (res) {
          appendTerminalLog(`[JVM Method Call] ${res.output}`);
        }
      });
    });
  }

  // 2. Inheritance Studio
  function renderInheritanceCanvas() {
    const data = Simulator.getInheritanceData();
    const sel = data.selectedClass;

    if (inspectorCodeEl) {
      inspectorCodeEl.textContent = `// Inheritance Hierarchy & Single Class Extension
class Vehicle {
    String brand = "Standard Vehicle";
    void start() {
        System.out.println("Vehicle started: Engine ignition active.");
    }
}

class Car extends Vehicle {
    int passengerDoors = 4;
    void openTrunk() {
        System.out.println("Trunk opened: Cargo area accessible.");
    }
}

class Bike extends Vehicle {
    void kickStand() {
        System.out.println("Kickstand folded: Ready to ride.");
    }
}

public class Main {
    public static void main(String[] args) {
        // Selected Class: ${sel}
        ${sel} obj = new ${sel}();
        // Method calls resolve through superclass pointers if not overridden!
    }
}`;
    }

    canvasEl.innerHTML = `
      <div class="inheritance-diagram-wrapper">
        <!-- Superclass: Vehicle -->
        <div class="uml-class-box ${sel === 'Vehicle' ? 'active' : ''}" id="uml-vehicle">
          <div class="uml-class-header">
            <span>«Superclass» Vehicle</span>
            <span class="badge badge-blue">Base</span>
          </div>
          <div class="uml-class-content">
            <div class="uml-field-row">+ String brand = "Standard Vehicle"</div>
            <div class="uml-methods-list">
              <div class="uml-method-pill">
                <span>+ void start()</span>
                <button type="button" class="btn btn-sm btn-outline call-uml-method-btn" data-cls="Vehicle" data-m="start()">Call</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Inheritance Connector -->
        <div class="uml-tree-connector">
          <svg width="24" height="32" viewBox="0 0 24 32" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="32" x2="12" y2="10"/>
            <polygon points="12,0 7,10 17,10" fill="currentColor"/>
          </svg>
          <span>extends (IS-A)</span>
        </div>

        <!-- Subclasses Row -->
        <div class="uml-subclasses-row">
          <!-- Car Subclass -->
          <div class="uml-class-box ${sel === 'Car' ? 'active' : ''}" id="uml-car">
            <div class="uml-class-header">
              <span>«Subclass» Car</span>
              <span class="badge badge-emerald">Extends</span>
            </div>
            <div class="uml-class-content">
              <div class="uml-field-row">+ int passengerDoors = 4</div>
              <div class="uml-methods-list">
                <div class="uml-method-pill" style="opacity: 0.85; border-left: 2px solid var(--primary);">
                  <span>+ void start() [Inherited]</span>
                  <button type="button" class="btn btn-sm btn-outline call-uml-method-btn" data-cls="Car" data-m="start()">Call</button>
                </div>
                <div class="uml-method-pill">
                  <span>+ void openTrunk()</span>
                  <button type="button" class="btn btn-sm btn-outline call-uml-method-btn" data-cls="Car" data-m="openTrunk()">Call</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Bike Subclass -->
          <div class="uml-class-box ${sel === 'Bike' ? 'active' : ''}" id="uml-bike">
            <div class="uml-class-header">
              <span>«Subclass» Bike</span>
              <span class="badge badge-violet">Extends</span>
            </div>
            <div class="uml-class-content">
              <div class="uml-field-row">+ boolean hasKickstand = true</div>
              <div class="uml-methods-list">
                <div class="uml-method-pill" style="opacity: 0.85; border-left: 2px solid var(--primary);">
                  <span>+ void start() [Inherited]</span>
                  <button type="button" class="btn btn-sm btn-outline call-uml-method-btn" data-cls="Bike" data-m="start()">Call</button>
                </div>
                <div class="uml-method-pill">
                  <span>+ void kickStand()</span>
                  <button type="button" class="btn btn-sm btn-outline call-uml-method-btn" data-cls="Bike" data-m="kickStand()">Call</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action explanation banner -->
        <div class="inheritance-actions-panel">
          <h4 style="font-size: 0.95rem; color: var(--text-main);">Java Inheritance Rule: Single Class Extension</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">
            A Java class can directly inherit from exactly <strong>one</strong> parent class. Notice that calling <code>car.start()</code> resolves to <code>Vehicle.start()</code> via runtime superclass pointer traversal!
          </p>
        </div>
      </div>
    `;

    document.querySelectorAll('.call-uml-method-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cls = btn.dataset.cls;
        const m = btn.dataset.m;
        Simulator.selectInheritanceClass(cls);
        const res = Simulator.callInheritanceMethod(cls, m);
        if (res) {
          appendTerminalLog(`[JVM Method Invocation] ${cls}.${m} -> "${res.output}"\n${res.lookupTrace}`);
          renderInheritanceCanvas();
        }
      });
    });
  }

  // 3. Encapsulation Studio
  function renderEncapsulationCanvas() {
    const data = Simulator.getEncapsulationData();

    if (inspectorCodeEl) {
      inspectorCodeEl.textContent = `// Encapsulation: Defensive State Shielding
public class BankAccount {
    // 1. Private internal field - Cannot be accessed directly outside
    private double balance = ${data.balance.toFixed(2)};

    // 2. Public Deposit Mutator with strict validation
    public void deposit(double amount) {
        if (amount > 0 && amount <= 50000) {
            balance += amount;
        } else {
            System.out.println("Validation Error: Invalid deposit amount.");
        }
    }

    // 3. Public Withdrawal Mutator
    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }

    // 4. Public Getter Accessor
    public double getBalance() {
        return balance;
    }
}`;
    }

    canvasEl.innerHTML = `
      <div class="encapsulation-vault-wrapper">
        <!-- Secure Vault Box -->
        <div class="vault-container-card">
          <span class="vault-shield-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Shielded Private State Barrier
          </span>

          <div class="vault-inner-safe">
            <div style="font-size: 0.8rem; font-family: var(--font-mono); color: #C4B5FD;">
              private double balance;
            </div>
            <div class="vault-balance-display">$${data.balance.toFixed(2)}</div>
            <div style="font-size: 0.75rem; color: var(--text-dim);">
              Account ID: ${data.accountNumber}
            </div>
          </div>

          <!-- Public Access Gates -->
          <div class="vault-access-gates-grid">
            <!-- Deposit Gate -->
            <div class="vault-gate-box">
              <h5>public void deposit(double amount)</h5>
              <div class="vault-input-group">
                <input type="number" id="input-deposit" class="form-control-sm" placeholder="Amount (e.g. 150)" style="flex: 1;">
                <button type="button" class="btn btn-sm btn-primary" id="btn-submit-deposit">Deposit</button>
              </div>
            </div>

            <!-- Withdraw Gate -->
            <div class="vault-gate-box">
              <h5>public boolean withdraw(double amount)</h5>
              <div class="vault-input-group">
                <input type="number" id="input-withdraw" class="form-control-sm" placeholder="Amount (e.g. 50)" style="flex: 1;">
                <button type="button" class="btn btn-sm btn-secondary" id="btn-submit-withdraw">Withdraw</button>
              </div>
            </div>
          </div>

          <!-- Illegal Direct Access Button -->
          <button type="button" class="btn btn-danger-soft vault-illegal-access-btn" id="btn-illegal-direct-access">
            Simulate Direct Field Mutation: account.balance = -9999;
          </button>

          <div id="encapsulation-alert-area" style="width: 100%;"></div>
        </div>
      </div>
    `;

    const alertArea = document.getElementById('encapsulation-alert-area');

    document.getElementById('btn-submit-deposit')?.addEventListener('click', () => {
      const val = document.getElementById('input-deposit')?.value;
      const res = Simulator.depositFunds(val);
      if (res.success) {
        appendTerminalLog(`[Encapsulation Mutator] ${res.message}\nNew balance: $${res.currentBalance.toFixed(2)}`);
        renderEncapsulationCanvas();
      } else {
        appendTerminalLog(`[Validation Rejection] ${res.error}`);
        if (alertArea) {
          alertArea.innerHTML = `<div class="alert-message-box alert-danger">${escapeHTML(res.error)}</div>`;
        }
      }
    });

    document.getElementById('btn-submit-withdraw')?.addEventListener('click', () => {
      const val = document.getElementById('input-withdraw')?.value;
      const res = Simulator.withdrawFunds(val);
      if (res.success) {
        appendTerminalLog(`[Encapsulation Mutator] ${res.message}\nNew balance: $${res.currentBalance.toFixed(2)}`);
        renderEncapsulationCanvas();
      } else {
        appendTerminalLog(`[Validation Rejection] ${res.error}`);
        if (alertArea) {
          alertArea.innerHTML = `<div class="alert-message-box alert-danger">${escapeHTML(res.error)}</div>`;
        }
      }
    });

    document.getElementById('btn-illegal-direct-access')?.addEventListener('click', () => {
      const res = Simulator.attemptDirectVariableAccess(-9999);
      appendTerminalLog(`[JVM Compiler Error Triggered]\n${res.error}`);
      if (alertArea) {
        alertArea.innerHTML = `<div class="alert-message-box alert-danger"><pre style="margin:0; font-family:var(--font-mono); font-size:0.8rem; white-space:pre-wrap;">${escapeHTML(res.error)}</pre></div>`;
      }
    });
  }

  // 4. Polymorphism Studio
  function renderPolymorphismCanvas() {
    const data = Simulator.getPolymorphismData();
    const sel = data.selectedRuntimeObject;
    const obj = data.objects[sel];

    if (inspectorCodeEl) {
      inspectorCodeEl.textContent = `// Polymorphism: Dynamic Method Dispatch & Method Overriding
class Animal {
    void makeSound() {
        System.out.println("Animal sound: Generic acoustic signal.");
    }
}

class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("Woof! Dog barks enthusiastically.");
    }
}

class Cat extends Animal {
    @Override
    void makeSound() {
        System.out.println("Meow! Cat purrs and vocalizes.");
    }
}

public class Main {
    public static void main(String[] args) {
        // Compile-time Reference type: Animal
        // Runtime Heap Object type: ${sel}
        Animal myPet = new ${sel}();

        // Dynamic Method Dispatch: JVM looks up ${sel}'s vtable at runtime!
        myPet.makeSound();
    }
}`;
    }

    canvasEl.innerHTML = `
      <div class="polymorphism-dispatch-wrapper">
        <div class="vtable-inspector-box">
          <h4 style="font-size: 1.05rem; color: var(--text-main); display: flex; align-items: center; gap: 0.5rem;">
            <span>Dynamic Dispatch: Select Runtime Object on Heap</span>
          </h4>

          <div class="dispatch-object-selector">
            <div class="dispatch-option-card ${sel === 'Dog' ? 'active' : ''}" data-type="Dog">
              <span style="font-size: 1.5rem;">🐕</span>
              <strong style="color: var(--text-main);">Dog</strong>
              <span class="badge badge-amber">@Override</span>
            </div>

            <div class="dispatch-option-card ${sel === 'Cat' ? 'active' : ''}" data-type="Cat">
              <span style="font-size: 1.5rem;">🐈</span>
              <strong style="color: var(--text-main);">Cat</strong>
              <span class="badge badge-violet">@Override</span>
            </div>

            <div class="dispatch-option-card ${sel === 'Animal' ? 'active' : ''}" data-type="Animal">
              <span style="font-size: 1.5rem;">🐾</span>
              <strong style="color: var(--text-main);">Animal</strong>
              <span class="badge badge-blue">Base Class</span>
            </div>
          </div>

          <!-- Dynamic Trace Visual -->
          <div class="dispatch-trace-graphic">
            <div class="trace-node">
              <span style="color: #94A3B8; font-size: 0.75rem;">Compile-Time Reference</span>
              <strong style="color: #93C5FD;">Animal myPet</strong>
            </div>

            <span class="trace-arrow">➔</span>

            <div class="trace-node">
              <span style="color: #94A3B8; font-size: 0.75rem;">JVM vtable Resolver</span>
              <span style="color: #FBBF24; font-family: var(--font-mono);">invokevirtual</span>
            </div>

            <span class="trace-arrow">➔</span>

            <div class="trace-node">
              <span style="color: #94A3B8; font-size: 0.75rem;">Heap Object Target</span>
              <strong style="color: #34D399;">${sel} (${obj.memoryAddress})</strong>
            </div>
          </div>

          <button type="button" class="btn btn-primary" id="btn-call-makesound" style="width: 100%;">
            Execute: myPet.makeSound()
          </button>
        </div>
      </div>
    `;

    document.querySelectorAll('.dispatch-option-card').forEach(card => {
      card.addEventListener('click', () => {
        const type = card.dataset.type;
        Simulator.selectPolymorphismObject(type);
        renderPolymorphismCanvas();
      });
    });

    document.getElementById('btn-call-makesound')?.addEventListener('click', () => {
      const res = Simulator.callMakeSound();
      if (res) {
        appendTerminalLog(`[Dynamic Dispatch] myPet.makeSound() executed:\n"${res.output}"\n${res.vtableLookup}\n${res.explanation}`);
      }
    });
  }

  // 5. Abstraction Studio
  function renderAbstractionCanvas() {
    const data = Simulator.getAbstractionData();
    const radius = data.radius;

    if (inspectorCodeEl) {
      inspectorCodeEl.textContent = `// Abstraction: Contract Specification vs Concrete Implementation
abstract class Shape {
    // Abstract method: MUST be implemented by any concrete subclass
    abstract void area();

    void displayInfo() {
        System.out.println("Geometric Shape Calculation:");
    }
}

class Circle extends Shape {
    private double radius = ${radius.toFixed(1)};

    @Override
    void area() {
        double result = Math.PI * radius * radius;
        System.out.println("Area of circle: " + result);
    }
}

public class AbstractionDemo {
    public static void main(String[] args) {
        Shape s = new Circle();
        s.area();
    }
}`;
    }

    const circleSvgRadius = Math.min(80, Math.max(15, radius * 3.5));

    canvasEl.innerHTML = `
      <div class="abstraction-demo-wrapper">
        <div class="abstraction-contract-grid">
          <!-- Abstract Class Spec -->
          <div class="abstract-spec-card">
            <span class="badge badge-rose">Abstract Contract</span>
            <h4 style="font-family: var(--font-mono); font-size: 0.9rem; color: #FDA4AF;">abstract class Shape</h4>
            <div style="font-family: var(--font-mono); font-size: 0.775rem; color: var(--text-dim);">
              abstract void area();
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">
              Incomplete specification. Mandates child class implementation.
            </p>
          </div>

          <!-- Concrete Class Spec -->
          <div class="concrete-spec-card">
            <span class="badge badge-emerald">Concrete Subclass</span>
            <h4 style="font-family: var(--font-mono); font-size: 0.9rem; color: #86EFAC;">class Circle extends Shape</h4>
            <div style="font-family: var(--font-mono); font-size: 0.775rem; color: var(--text-dim);">
              @Override void area() { π * r² }
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">
              Satisfies abstract contract with geometric radius formula.
            </p>
          </div>
        </div>

        <!-- Interactive Circle SVG Canvas -->
        <div class="circle-canvas-preview">
          <svg width="220" height="200" viewBox="0 0 220 200">
            <circle cx="110" cy="100" r="${circleSvgRadius}" fill="rgba(59, 130, 246, 0.25)" stroke="#60A5FA" stroke-width="2.5" stroke-dasharray="4 2"/>
            <circle cx="110" cy="100" r="4" fill="#60A5FA"/>
            <line x1="110" y1="100" x2="${110 + circleSvgRadius}" y2="100" stroke="#FBBF24" stroke-width="2"/>
            <text x="${110 + circleSvgRadius / 2}" y="95" fill="#FBBF24" font-size="11" font-family="monospace" text-anchor="middle">r = ${radius.toFixed(1)}</text>
          </svg>
        </div>

        <!-- Controls -->
        <div class="radius-slider-control">
          <label for="circle-radius-slider" style="font-size: 0.85rem; font-weight: 600;">Radius (cm):</label>
          <input type="range" id="circle-radius-slider" min="1" max="25" step="0.5" value="${radius}">
          <span id="radius-slider-val" style="font-family: var(--font-mono); color: #FBBF24; min-width: 45px;">${radius.toFixed(1)} cm</span>
        </div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button type="button" class="btn btn-primary" id="btn-calc-area" style="flex: 1;">
            Execute: Shape s = new Circle(); s.area();
          </button>
          <button type="button" class="btn btn-danger-soft" id="btn-illegal-abstract-instantiation">
            Try: Shape s = new Shape();
          </button>
        </div>
      </div>
    `;

    const slider = document.getElementById('circle-radius-slider');
    slider?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      const valEl = document.getElementById('radius-slider-val');
      if (valEl) valEl.textContent = `${val.toFixed(1)} cm`;
      Simulator.calculateCircleArea(val);
      renderAbstractionCanvas();
    });

    document.getElementById('btn-calc-area')?.addEventListener('click', () => {
      const r = parseFloat(slider?.value || 5.0);
      const res = Simulator.calculateCircleArea(r);
      appendTerminalLog(`[Abstract Contract Call] s.area():\n"${res.output}"\n${res.explanation}`);
    });

    document.getElementById('btn-illegal-abstract-instantiation')?.addEventListener('click', () => {
      const res = Simulator.attemptInstantiateAbstractClass();
      appendTerminalLog(`[JVM Compiler Error Triggered]\n${res.error}`);
    });
  }

  // -------------------------------------------------------------
  // PROGRESS DASHBOARD SYNC
  // -------------------------------------------------------------
  function updateProgressDashboard(stats) {
    // Circle progress ring
    const circle = document.getElementById('progress-svg-circle');
    const pctDisplay = document.getElementById('progress-percentage-display');
    const heading = document.getElementById('progress-status-heading');
    const summary = document.getElementById('progress-summary-text');

    const circumference = 2 * Math.PI * 58; // ~364.4
    const offset = circumference - (stats.completionPercentage / 100) * circumference;

    if (circle) circle.style.strokeDashoffset = offset;
    if (pctDisplay) pctDisplay.textContent = `${stats.completionPercentage}%`;

    if (heading && summary) {
      if (stats.completionPercentage === 100) {
        heading.textContent = 'OOP Grandmaster';
        summary.textContent = 'All 5 modules mastered and verified! Excellent job.';
      } else if (stats.completionPercentage >= 60) {
        heading.textContent = 'Proficient Developer';
        summary.textContent = `${stats.completedCount} of ${stats.totalLessons} modules completed. Almost there!`;
      } else if (stats.completionPercentage > 0) {
        heading.textContent = 'Active Learner';
        summary.textContent = `${stats.completedCount} of ${stats.totalLessons} modules completed. Keep going!`;
      } else {
        heading.textContent = 'Beginner Explorer';
        summary.textContent = 'Complete lessons and test memory models to master Java OOP fundamentals.';
      }
    }

    // Checkmark badges in Lesson Tab Nav
    LESSON_KEYS.forEach(id => {
      const checkEl = document.getElementById(`check-${id}`);
      const isDone = stats.completedLessons[id];
      if (checkEl) {
        checkEl.textContent = isDone ? '✓' : '○';
        checkEl.classList.toggle('done', isDone);
      }

      // Progress checklist item
      const statusSpan = document.getElementById(`p-status-${id}`);
      if (statusSpan) {
        statusSpan.textContent = isDone ? '✓ Completed' : 'Pending';
        statusSpan.className = `metric-status-check ${isDone ? 'status-completed' : 'status-pending'}`;
      }
    });

    // Quiz record label
    const quizRecordLabel = document.getElementById('quiz-record-label');
    if (quizRecordLabel) {
      if (stats.latestQuizScore) {
        quizRecordLabel.textContent = `Latest: ${stats.latestQuizScore.score}/${stats.latestQuizScore.total} (${stats.latestQuizScore.percentage}%) • Attempts: ${stats.quizAttempts}`;
      } else {
        quizRecordLabel.textContent = 'No quiz attempts yet. Test your knowledge anytime!';
      }
    }
  }

  // Subscribe dashboard to progress updates
  ProgressManager.subscribe(updateProgressDashboard);

  document.getElementById('btn-reset-all-progress')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all saved lesson progress and quiz scores?')) {
      ProgressManager.resetAll();
    }
  });

  // -------------------------------------------------------------
  // INITIALIZATION
  // -------------------------------------------------------------
  // Render initial lesson
  switchLesson('classes-objects');

  // Render initial playground tab
  switchPlaygroundTab('classes-objects');

  // Initialize Quiz
  QuizEngine.startQuiz(false);

  // Connect Quiz listeners
  document.getElementById('quiz-submit-btn')?.addEventListener('click', () => {
    QuizEngine.submitAnswer();
  });

  document.getElementById('quiz-next-btn')?.addEventListener('click', () => {
    QuizEngine.nextQuestion();
  });

  // Utility HTML escaper
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
});
