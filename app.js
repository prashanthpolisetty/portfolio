/**
 * Polisetty Prashanth - Portfolio Interactive Scripts
 * Handles:
 * 1. Typing animation in hero section        (overridden by motion.js)
 * 2. Mobile navbar toggle and smooth scrolling
 * 3. Dynamic project category filtering        (overridden by motion.js)
 * 4. Interactive Developer Terminal CLI emulator
 * 5. Predefined portfolio assistant
 * 6. Contact form
 *
 * Changes in this version:
 *  - Assistant: word-boundary matching (the old `includes('ai')` matched
 *    "email" and "available", so those questions got the GenAI answer).
 *  - Contact form no longer fakes a success message (see CONTACT_ENDPOINT).
 *  - Status messages use textContent instead of innerHTML.
 */

document.addEventListener('DOMContentLoaded', () => {
  const projectSlug = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (projectSlug && window.renderProjectDetail) {
    window.renderProjectDetail(projectSlug);
  }

  initTypingEffect();
  initMobileMenu();
  initProjectFilters();
  initProjectCarousel();
  initProjectCardNavigation();
  initTerminal();
  initAiAssistant();
  initContactForm();
});

function initProjectCarousel() {
  const carousel = document.querySelector('.projects-carousel');
  const track = carousel?.querySelector('.projects-grid');
  const cards = Array.from(track?.querySelectorAll('.project-card[data-project-slug]') || []);
  const previousButton = document.getElementById('projectCarouselPrevious');
  const nextButton = document.getElementById('projectCarouselNext');
  const status = document.getElementById('projectCarouselStatus');

  if (!carousel || !track || !cards.length || !previousButton || !nextButton || !status) return;

  cards.forEach((card) => {
    const item = document.createElement('div');
    item.className = 'project-carousel-item';
    const face = document.createElement('div');
    face.className = 'project-carousel-face';
    track.insertBefore(item, card);
    item.appendChild(face);
    face.appendChild(card);
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visibleCards = [];
  let rotation = 0;
  let pointerInside = carousel.matches(':hover');
  let focusInside = carousel.contains(document.activeElement);
  let dragging = false;
  let movedDuringDrag = false;
  let dragPointerId = null;
  let dragStartX = 0;
  let dragStartRotation = 0;
  let suppressClick = false;
  let animationFrame = 0;
  let lastFrameTime = 0;
  let currentIndex = -1;

  function updatePositions() {
    const count = visibleCards.length;
    track.classList.toggle('is-single', count === 1);
    if (!count) {
      track.style.setProperty('--carousel-rotation', '0deg');
      status.textContent = '00 / 00';
      previousButton.disabled = true;
      nextButton.disabled = true;
      carousel.querySelector('.project-carousel-controls').hidden = true;
      currentIndex = -1;
      return;
    }

    const step = 360 / count;
    const cardWidth = visibleCards[0].offsetWidth || 260;
    const radiusScale = window.innerWidth <= 600 ? 0.85 : 1.1;
    const radius = count === 1 ? 0 : Math.max(cardWidth * radiusScale, cardWidth / (2 * Math.tan(Math.PI / count)));
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    const frontIndex = Math.round(((360 - normalizedRotation) % 360) / step) % count;
    const frontChanged = currentIndex !== frontIndex;
    track.style.setProperty('--carousel-radius', `${radius}px`);
    track.style.setProperty('--carousel-rotation', `${rotation}deg`);

    visibleCards.forEach((card, index) => {
      const item = card.closest('.project-carousel-item');
      const title = card.dataset.projectTitle || card.querySelector('.project-title')?.textContent || 'Project';
      const cardAngle = rotation + index * step;
      const radians = cardAngle * Math.PI / 180;
      const depth = Math.cos(radians);
      item.style.setProperty('--carousel-angle', `${index * step}deg`);
      item.style.setProperty('--carousel-facing', `${-cardAngle}deg`);
      item.style.setProperty('--frame-opacity', String(0.4 + 0.6 * ((depth + 1) / 2)));
      item.style.zIndex = String(Math.round((depth + 1) * 50));
      item.classList.toggle('is-current', index === frontIndex);
      if (frontChanged) {
        card.setAttribute('aria-current', String(index === frontIndex));
        card.setAttribute('aria-label', `${title}. Project ${index + 1} of ${count}. Press Enter to open details.`);
      }
    });

    if (frontChanged) {
      status.textContent = `${String(frontIndex + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
      currentIndex = frontIndex;
    }
    previousButton.disabled = count < 2;
    nextButton.disabled = count < 2;
    carousel.querySelector('.project-carousel-controls').hidden = count < 2;
  }

  function canAutoRotate() {
    return visibleCards.length > 1
      && !reducedMotion.matches
      && !pointerInside
      && !focusInside
      && !dragging;
  }

  function animate(timestamp) {
    if (!canAutoRotate()) {
      animationFrame = 0;
      lastFrameTime = 0;
      return;
    }

    if (lastFrameTime) {
      const elapsedSeconds = Math.min((timestamp - lastFrameTime) / 1000, 0.05);
      rotation = (rotation + elapsedSeconds * 12) % 360;
      updatePositions();
    }
    lastFrameTime = timestamp;
    animationFrame = window.requestAnimationFrame(animate);
  }

  function syncAnimation() {
    if (canAutoRotate()) {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(animate);
      return;
    }
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    lastFrameTime = 0;
  }

  function refreshCarousel() {
    const previousSlug = visibleCards[currentIndex]?.dataset.projectSlug;
    visibleCards = cards.filter((card) => window.getComputedStyle(card).display !== 'none');

    cards.forEach((card) => {
      card.closest('.project-carousel-item').style.display = visibleCards.includes(card) ? '' : 'none';
      card.setAttribute('aria-current', 'false');
    });

    const retainedIndex = visibleCards.findIndex((card) => card.dataset.projectSlug === previousSlug);
    const targetIndex = retainedIndex >= 0 ? retainedIndex : 0;
    rotation = visibleCards.length > 1 ? -targetIndex * (360 / visibleCards.length) : 0;
    currentIndex = -1;
    updatePositions();
    syncAnimation();
  }

  function moveBy(offset) {
    if (visibleCards.length < 2) return;
    rotation -= offset * (360 / visibleCards.length);
    updatePositions();
    syncAnimation();
  }

  previousButton.addEventListener('click', () => moveBy(-1));
  nextButton.addEventListener('click', () => moveBy(1));

  carousel.addEventListener('pointerenter', () => {
    pointerInside = true;
    syncAnimation();
  });
  carousel.addEventListener('pointerleave', () => {
    pointerInside = false;
    syncAnimation();
  });
  carousel.addEventListener('focusin', () => {
    focusInside = true;
    syncAnimation();
  });
  carousel.addEventListener('focusout', () => {
    window.setTimeout(() => {
      focusInside = carousel.contains(document.activeElement);
      syncAnimation();
    }, 0);
  });

  carousel.addEventListener('pointerdown', (event) => {
    if (event.target instanceof Element && event.target.closest('button, a')) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    dragging = true;
    movedDuringDrag = false;
    dragPointerId = event.pointerId;
    dragStartX = event.clientX;
    dragStartRotation = rotation;
    carousel.classList.add('is-dragging');
    syncAnimation();
  });

  window.addEventListener('pointermove', (event) => {
    if (!dragging || event.pointerId !== dragPointerId) return;
    const distance = event.clientX - dragStartX;
    if (Math.abs(distance) > 6) movedDuringDrag = true;
    if (!movedDuringDrag) return;
    if (!carousel.hasPointerCapture(event.pointerId)) carousel.setPointerCapture(event.pointerId);
    rotation = dragStartRotation + distance * 0.45;
    updatePositions();
  });

  const endDrag = (event) => {
    if (!dragging || event.pointerId !== dragPointerId) return;
    if (carousel.hasPointerCapture(event.pointerId)) carousel.releasePointerCapture(event.pointerId);
    dragging = false;
    dragPointerId = null;
    carousel.classList.remove('is-dragging');
    if (movedDuringDrag) {
      suppressClick = true;
      window.setTimeout(() => { suppressClick = false; }, 0);
    }
    syncAnimation();
  };
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  carousel.addEventListener('click', (event) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    suppressClick = false;
  }, true);

  if (typeof reducedMotion.addEventListener === 'function') {
    reducedMotion.addEventListener('change', () => {
      syncAnimation();
    });
  }

  window.addEventListener('resize', refreshCarousel, { passive: true });
  window.updateProjectCarousel = refreshCarousel;
  refreshCarousel();
}

function initProjectCardNavigation() {
  const cards = document.querySelectorAll('.project-card[data-project-slug]');

  cards.forEach((card) => {
    const openDetails = () => {
      const slug = card.dataset.projectSlug;
      if (!slug) return;
      window.location.assign(`/${slug}`);
    };

    card.addEventListener('click', openDetails);

    card.addEventListener('keydown', (event) => {
      if (event.target !== card || (event.key !== 'Enter' && event.key !== ' ')) return;
      event.preventDefault();
      openDetails();
    });
  });
}

/* ==========================================================================
   1. Dynamic Typing Effect (motion.js replaces this with a jitter-free version)
   ========================================================================== */
function initTypingEffect() {
  const typingElement = document.getElementById('typingText');
  if (!typingElement) return;

  const roles = [
    'Autonomous GenAI & RAG Systems',
    'Agentic Commerce with PayPilot-AI',
    'FastAPI & Python Backends',
    'Scalable Machine Learning Pipelines'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 70;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 1800; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   2. Mobile Navbar & Active Links
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuToggle && mobileMenu) {
    const setOpen = (open) => {
      mobileMenu.classList.toggle('open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      const icon = menuToggle.querySelector('i');
      icon.classList.toggle('fa-xmark', open);
      icon.classList.toggle('fa-bars', !open);
    };

    menuToggle.addEventListener('click', () => {
      setOpen(!mobileMenu.classList.contains('open'));
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => setOpen(false));
    });
  }
}

/* ==========================================================================
   3. Project Category Filtering (motion.js replaces this with an animated one)
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.setAttribute('aria-pressed', String(btn.classList.contains('active')));
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(/\s+/);
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
      window.updateProjectCarousel?.();
    });
  });
}

/* ==========================================================================
   4. Interactive Developer Terminal CLI
   ========================================================================== */
function initTerminal() {
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const clearBtn = document.getElementById('clearTerminalBtn');

  if (!terminalInput || !terminalOutput) return;

  const commandResponses = {
    help: `
Available commands:
  <span class="text-cyan">about</span>       : Overview of Prashanth's background
  <span class="text-cyan">skills</span>      : List primary AI, backend & language skills
  <span class="text-cyan">projects</span>    : View list of flagship projects & repositories
  <span class="text-cyan">paypilot</span>    : Deep-dive into PayPilot-AI (Razorpay Buildathon)
  <span class="text-cyan">hallucination</span>: Details on the hybrid LLM hallucination detection system
  <span class="text-cyan">ragbot</span>      : Information on Document RAG Chatbot
  <span class="text-cyan">meeting</span>     : Information on Meeting Minutes Generator
  <span class="text-cyan">education</span>   : View B.Tech & CITD degree details
  <span class="text-cyan">experience</span>  : View AI/ML internships & industrial training
  <span class="text-cyan">contact</span>     : Get email, phone, GitHub, & LinkedIn
  <span class="text-cyan">clear</span>       : Clear the terminal screen
`,
    about: `
<span class="text-indigo">Polisetty Prashanth</span>
Computer Science Engineering (AI & ML) student at NGIT Hyderabad.
Passionate about taking autonomous Generative AI and agentic systems into production.
View LeetCode profile: <a href="https://leetcode.com/u/polisetty_prashanth/" target="_blank" rel="noopener noreferrer" class="text-cyan">leetcode.com/u/polisetty_prashanth</a>
`,
    skills: `
<span class="text-indigo">Generative AI & LLMs:</span> LangChain, CrewAI, Gemini API, Groq, Llama 3.1 (configured in Meeting Minutes Generator), Sentence Transformers, RAG, NLI Verification (DeBERTa-v3), Hallucination Detection
<span class="text-cyan">Backend & Data:</span> FastAPI, Flask, ChromaDB, PostgreSQL, MySQL, SQLite, Pydantic, REST APIs
<span class="text-purple">Languages:</span> Python, Java, JavaScript, TypeScript, SQL, HTML5/CSS3
<span class="text-yellow">Tools:</span> Streamlit, Git/GitHub, Docker, XGBoost, spaCy, VS Code, Cursor, Jupyter
`,
    projects: `
1. <span class="text-indigo font-bold">PayPilot-AI</span>: Agentic commerce platform for Razorpay Buildathon (Track 01)
2. <span class="text-cyan font-bold">Document RAG Chatbot</span>: Live interactive PDF/text RAG bot (<a href="https://ragbotq.streamlit.app" target="_blank" rel="noopener noreferrer" class="text-indigo">ragbotq.streamlit.app</a>)
3. <span class="text-purple font-bold">Hybrid LLM Hallucination Detection & Mitigation</span>: Dual-signal verification with DeBERTa-v3 NLI and an XGBoost risk classifier
4. <span class="text-purple font-bold">AI Resume Analyzer</span>: AI resume screener built with LangChain and the Gemini API that produces ATS-style scores and skill-gap feedback as schema-validated JSON (Pydantic)
5. <span class="text-yellow font-bold">Meeting Minutes Generator</span>: Live deployed app (<a href="https://meeting-minutes-frontend.onrender.com" target="_blank" rel="noopener noreferrer" class="text-indigo">meeting-minutes-frontend.onrender.com</a>)
6. <span class="text-muted font-bold">Binance Trading Bot</span>: Sub-minute algorithmic cryptocurrency execution bot
`,
    paypilot: `
<span class="text-indigo font-bold">PayPilot-AI — Razorpay AI Growth & Agentic Commerce</span>
• 18-step agentic commerce & risk decision pipeline
• Conversational product discovery & semantic RAG vector catalog search
• Strict deterministic financial caps (₹1,00,000 ceiling)
• Server-side HMAC-SHA256 signature verification & idempotent webhooks
Repo: <a href="https://github.com/prashanthpolisetty/PayPilot-AI" target="_blank" rel="noopener noreferrer" class="text-cyan">github.com/prashanthpolisetty/PayPilot-AI</a>
`,
    hallucination: `
<span class="text-indigo font-bold">Hybrid LLM Hallucination Detection & Mitigation</span>
• Combines self-consistency across stochastic generations with authoritative web retrieval and DeBERTa-v3 NLI for claim-level risk scoring.
• XGBoost uses a 9-feature vector; reached 0.9744 accuracy, 0.9697 F1 and 0.9953 AUROC on HaluEval QA and TruthfulQA claim-evidence records using leakage-safe grouped splits. Logistic Regression baseline: 0.9206 F1.
• For high-risk claims, highlights the contradicted claim and re-prompts the same LLM with verified evidence to produce a corrected answer.
• FastAPI, real-time Server-Sent Events, SQLite audit logging, and a React 18 + Vite dashboard.
• Tech: Python, FastAPI, React 18, spaCy, DeBERTa-v3 NLI, XGBoost, Sentence Transformers, Gemini API, SQLite.
`,
    ragbot: `
<span class="text-cyan font-bold">Document RAG Chatbot</span>
• Gemini API question answering with a local Ollama fallback
• Uses all-MiniLM-L6-v2 embeddings and a persistent ChromaDB vector store for retrieval.
• Tags indexed text chunks with source and chunk metadata.
• Live Streamlit app: <a href="https://ragbotq.streamlit.app" target="_blank" rel="noopener noreferrer" class="text-indigo">ragbotq.streamlit.app</a>
`,
    meeting: `
<span class="text-yellow font-bold">Meeting Minutes Generator</span>
• Autonomous AI meeting assistant with local Whisper transcription
• Structured synthesis of summaries, key decisions & action items via Groq & Gemini
• Automated participant email dispatch workflow
• Live Deployed App: <a href="https://meeting-minutes-frontend.onrender.com" target="_blank" rel="noopener noreferrer" class="text-indigo">meeting-minutes-frontend.onrender.com</a>
Repo: <a href="https://github.com/prashanthpolisetty/Meeting-minutes-Generator" target="_blank" rel="noopener noreferrer" class="text-cyan">github.com/prashanthpolisetty/Meeting-minutes-Generator</a>
`,
    education: `
• <span class="text-indigo font-bold">B.Tech in CSE (AI & ML)</span>: Neil Gogte Institute of Technology (2024–2027) | CGPA: 8.31
• <span class="text-cyan font-bold">Diploma in Tool & Die Making</span>: CITD Hyderabad (2020–2024) | 74.15%
• <span class="text-yellow font-bold">10th Grade (Secondary)</span>: Navodaya High School, Gadwal (2020) | CGPA: 9.8
`,
    experience: `
• <span class="text-indigo font-bold">AI/ML Intern</span> @ VRITTIFY AI (Jul 2026 – Oct 2026):
  Contributed to product development, research, and operations support.
• <span class="text-indigo font-bold">Machine Learning Intern</span> @ Unified Mentor (May 2025 – Jun 2025):
  Built end-to-end regression pipelines in Python and Scikit-Learn for House Price Prediction and Mobile Phone Price Estimation.
  Performed exploratory data analysis (EDA): missing-value handling, correlation heatmaps, feature engineering and data scaling.
• <span class="text-cyan font-bold">Industrial Engineering Trainee</span> @ Tata Advanced Systems Limited (2023):
  Precision tool engineering and structural compliance.
`,
    contact: `
• Email   : <a href="mailto:polisheetyprashanth246@gmail.com" class="text-cyan">polisheetyprashanth246@gmail.com</a>
• Phone   : <a href="tel:+919121990362" class="text-cyan">+91-9121990362</a>
• GitHub  : <a href="https://github.com/prashanthpolisetty" target="_blank" rel="noopener noreferrer" class="text-cyan">github.com/prashanthpolisetty</a>
• LinkedIn: <a href="https://linkedin.com/in/polisetty-prashanth-5440b5298" target="_blank" rel="noopener noreferrer" class="text-cyan">polisetty-prashanth-5440b5298</a>
`,
  };

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawCmd = terminalInput.value.trim();
      const cmd = rawCmd.toLowerCase();
      terminalInput.value = '';

      if (!cmd) return;

      appendTerminalLine(`<span class="prompt-symbol">visitor@prashanth:~$</span> ${escapeHtml(rawCmd)}`);

      if (cmd === 'clear') {
        terminalOutput.innerHTML = '';
        return;
      }

      if (Object.prototype.hasOwnProperty.call(commandResponses, cmd)) {
        appendTerminalLine(commandResponses[cmd]);
      } else {
        appendTerminalLine(`<span class="text-red-400">bash: command not found: ${escapeHtml(rawCmd)}. Type <span class="text-cyan font-bold">help</span> for a list of commands.</span>`);
      }

      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
  });

  // Clickable shortcut pills in terminal
  document.querySelectorAll('.cmd-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const cmd = pill.textContent.trim();
      terminalInput.value = cmd;
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      terminalInput.dispatchEvent(event);
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      terminalOutput.innerHTML = '';
    });
  }

  function appendTerminalLine(html) {
    const div = document.createElement('div');
    div.className = 'terminal-line';
    div.innerHTML = html;
    terminalOutput.appendChild(div);
  }
}

// Visitor-typed text must never be inserted as HTML.
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

/* ==========================================================================
   5. Predefined Portfolio Assistant
   ========================================================================== */
function initAiAssistant() {
  const aiTrigger = document.getElementById('aiTrigger');
  const aiDrawer = document.getElementById('aiDrawer');
  const aiClose = document.getElementById('aiClose');
  const aiChatForm = document.getElementById('aiChatForm');
  const aiChatInput = document.getElementById('aiChatInput');
  const aiMessages = document.getElementById('aiMessages');
  const quickPills = document.querySelectorAll('.quick-pill');
  const submitButton = aiChatForm ? aiChatForm.querySelector('button[type="submit"]') : null;

  if (!aiTrigger || !aiDrawer || !aiClose || !aiChatForm || !aiChatInput || !aiMessages || !submitButton) return;

  function setDrawerOpen(open) {
    aiDrawer.classList.toggle('open', open);
    aiDrawer.setAttribute('aria-hidden', String(!open));
    aiDrawer.inert = !open;
    aiTrigger.setAttribute('aria-expanded', String(open));
    if (open && aiChatInput) {
      setTimeout(() => aiChatInput.focus(), 50);
    }
  }

  aiTrigger.setAttribute('aria-expanded', 'false');
  aiTrigger.addEventListener('click', () => {
    setDrawerOpen(!aiDrawer.classList.contains('open'));
  });

  aiClose.addEventListener('click', () => {
    setDrawerOpen(false);
    aiTrigger.focus();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && aiDrawer.classList.contains('open')) {
      setDrawerOpen(false);
      aiTrigger.focus();
    }
  });

  // Quick action pills
  quickPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const query = pill.getAttribute('data-q');
      if (query) handleAiQuery(query);
    });
  });

  aiChatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = aiChatInput.value.trim();
    if (!query) return;
    aiChatInput.value = '';
    handleAiQuery(query);
  });

  function handleAiQuery(userText) {
    addMessage(userText, 'user');
    addMessage(getPredefinedAnswer(userText), 'ai');
    aiChatInput.focus();
  }

  function getPredefinedAnswer(question) {
    const query = question.toLowerCase().replace(/[^a-z0-9+#.]+/g, ' ').trim();
    const matches = (...terms) => terms.some((term) => query.includes(term));

    if (matches('contact', 'email', 'reach', 'linkedin', 'github', 'location', 'where is')) {
      return 'You can contact Prashanth at polisheetyprashanth246@gmail.com, connect on LinkedIn at linkedin.com/in/polisetty-prashanth-5440b5298, or find his projects at github.com/prashanthpolisetty. He is based in Hyderabad, Telangana, India. His hybrid LLM hallucination detection and mitigation project uses Python, FastAPI, React 18, spaCy, DeBERTa-v3 NLI, XGBoost, Sentence Transformers, Gemini API, and SQLite.';
    }
    if (matches('paypilot', 'pay pilot')) {
      return 'PayPilot-AI is an agentic commerce platform built for the Razorpay Buildathon. Its 18-step pipeline uses semantic product search, contextual upsells, deterministic transaction caps, server-side Razorpay signature validation, and human approval before payment. It is built with FastAPI, React, PostgreSQL, Razorpay API, Docker, and Gemini/Groq. The source code is on GitHub: github.com/prashanthpolisetty/PayPilot-AI.';
    }
    if (matches('hallucination detection', 'hallucination mitigation', 'hallucination')) {
      return 'The Hybrid LLM Hallucination Detection & Mitigation system detects, explains, and mitigates factual hallucinations with dual-signal verification: self-consistency across stochastic generations and authoritative web retrieval verified with DeBERTa-v3 NLI. An XGBoost classifier turns a 9-feature vector into a claim-level risk score. It reached 0.9744 accuracy, 0.9697 F1, and 0.9953 AUROC on HaluEval QA and TruthfulQA claim-evidence records using leakage-safe grouped splits; a Logistic Regression baseline scored 0.9206 F1. For high-risk claims, the contradicted claim is highlighted and the same LLM is re-prompted with verified evidence to produce a corrected answer. The system uses FastAPI with real-time Server-Sent Events and SQLite audit logging, plus a React 18 + Vite dashboard. Tech: Python, FastAPI, React 18, spaCy, DeBERTa-v3 NLI, XGBoost, Sentence Transformers, Gemini API, and SQLite.';
    }
    if (matches('rag chatbot', 'document rag', 'rag bot', 'retrieval augmented')) {
      return 'The Document RAG Chatbot lets users upload PDF or text documents and ask questions about their content. It uses LangChain, the Gemini API for question answering with a local Ollama fallback, all-MiniLM-L6-v2 embeddings, persistent ChromaDB storage, and Streamlit. Indexed text chunks are tagged with source and chunk metadata. Try it at ragbotq.streamlit.app or view github.com/prashanthpolisetty/RAG-bot.';
    }
    if (matches('resume analyzer', 'resume screener', 'resume project')) {
      return 'The AI resume screener is built with LangChain and the Gemini API and produces ATS-style scores and skill-gap feedback as schema-validated JSON (Pydantic). It uses few-shot and Chain-of-Thought prompts with Pydantic-validated JSON output. Source: github.com/prashanthpolisetty/AI-Resume-Analyzer.';
    }
    if (matches('meeting minutes', 'minutes generator', 'meeting assistant')) {
      return 'The Meeting Minutes Generator transcribes recordings locally with OpenAI Whisper, then uses cloud language models to create summaries, decisions, and action items and email participants. Its stack includes TypeScript, Python, Whisper, Groq, and Gemini. Live app: meeting-minutes-frontend.onrender.com.';
    }
    if (matches('binance', 'trading bot', 'crypto bot')) {
      return 'The Binance Trading Bot scans cryptocurrency markets, calculates indicators, identifies buy/sell signals, and dispatches trading triggers. The portfolio lists Python, the Binance API, and financial algorithms as its main technologies. Source: github.com/prashanthpolisetty/binance-trading-bot.';
    }
    if (matches('project', 'projects', 'built', 'portfolio work')) {
      return 'Featured projects are PayPilot-AI (agentic commerce), the Document RAG Chatbot, the Hybrid LLM Hallucination Detection & Mitigation system (Python, FastAPI, React 18, spaCy, DeBERTa-v3 NLI, XGBoost, Sentence Transformers, Gemini API, SQLite), an AI Resume Screener & Analyzer, a Meeting Minutes Generator, and a Binance Trading Bot. The RAG chatbot and Meeting Minutes Generator have live demos. Ask about any project by name for details.';
    }
    if (matches('intern', 'experience', 'work history', 'career', 'vr ittify', 'vrittify', 'unified mentor', 'tata advanced')) {
      return 'Prashanth’s experience includes an AI/ML internship at VRITTIFY AI (July–October 2026), contributing to product development, research, and operations support; a Machine Learning internship at Unified Mentor (May–June 2025), where he built house-price and mobile-phone price regression pipelines and performed exploratory data analysis; and industrial engineering training at Tata Advanced Systems in 2023.';
    }
    if (matches('education', 'degree', 'college', 'university', 'study', 'school', 'cgpa', 'diploma')) {
      return 'Prashanth is pursuing a B.Tech in Computer Science Engineering (AI & ML) at Neil Gogte Institute of Technology in Hyderabad (2024–2027; CGPA 8.31/10). He completed a Diploma in Tool & Die Making at CITD Hyderabad (2020–2024; 74.15%) and secondary school at Navodaya High School, Gadwal (CGPA 9.8/10, completed 2020).';
    }
    if (matches('genai', 'generative ai', 'llm', 'rag skill', 'langchain', 'crewai', 'gemini', 'llama', 'vector search', 'prompt engineering', 'nli verification', 'deberta-v3')) {
      return 'Generative AI and LLM skills listed on the portfolio: LangChain, CrewAI, RAG architecture, Gemini API, Groq, Llama 3.1 (configured in the Meeting Minutes Generator), Sentence Transformers, vector search, prompt engineering (CoT/Few-Shot), NLI Verification (DeBERTa-v3), and Hallucination Detection.';
    }
    if (matches('backend', 'database', 'fastapi', 'flask', 'chromadb', 'postgres', 'mysql', 'sqlite', 'pydantic', 'razorpay api', 'rest api')) {
      return 'Backend and database skills listed on the portfolio: FastAPI, Flask, ChromaDB, PostgreSQL, MySQL, SQLite, Pydantic, RESTful APIs, and Razorpay API integration. SQLite is used for audit logging in the hybrid LLM hallucination detection and mitigation system.';
    }
    if (matches('language', 'programming', 'python', 'java', 'javascript', 'typescript', 'sql', 'html', 'css', 'data structure', 'algorithm')) {
      return 'Languages and core CS skills listed on the portfolio: Python, Java, JavaScript (ES6+), TypeScript, SQL, HTML5/CSS3, and data structures and algorithms.';
    }
    if (matches('tool', 'devops', 'docker', 'streamlit', 'scikit', 'sklearn', 'pandas', 'numpy', 'xgboost', 'spacy', 'jupyter', 'vscode', 'vs code', 'github')) {
      return 'Tools, data, and DevOps skills listed on the portfolio: Git/GitHub, Streamlit, Docker, Scikit-Learn, Pandas, NumPy, XGBoost, spaCy, VS Code, Cursor, and Jupyter Notebooks. XGBoost and spaCy are used in the hybrid LLM hallucination detection and mitigation system.';
    }
    if (matches('skill', 'tech stack', 'technologies', 'technology', 'what can he')) {
      return 'Prashanth’s skills span Generative AI and LLMs (LangChain, CrewAI, RAG, Gemini, NLI Verification (DeBERTa-v3), Hallucination Detection), backend and databases (FastAPI, Flask, PostgreSQL, ChromaDB, SQLite), programming (Python, Java, JavaScript, TypeScript, SQL), and tools (Docker, Streamlit, Scikit-Learn, Pandas/NumPy, XGBoost, spaCy). The hybrid LLM hallucination detection and mitigation system uses these newer tools.';
    }
    if (matches('about', 'who is', 'who s', 'profile', 'background', 'introduce')) {
      return 'Prashanth is a final-year Computer Science (AI & ML) student building RAG applications, agentic workflows and Python backends with FastAPI and LangChain. He has deployed a live RAG chatbot and a meeting-minutes app, built PayPilot-AI for the Razorpay Buildathon, and built a hybrid LLM hallucination detection and mitigation system using self-consistency, DeBERTa-v3 NLI, and XGBoost. He studies at NGIT in Hyderabad.';
    }
    if (matches('live', 'demo', 'deployed', 'try it', 'open app')) {
      return 'Live project demos listed on the portfolio:\n• Document RAG Chatbot: https://ragbotq.streamlit.app/\n• Meeting Minutes Generator: https://meeting-minutes-frontend.onrender.com/\nPayPilot-AI is listed with its GitHub source but no live demo link.';
    }

    return 'I can answer predefined questions about Prashanth’s projects, skills, experience, education, background, or contact details. Try asking about a project by name, or use one of the suggested questions.';
  }

  function addMessage(text, sender) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender === 'user' ? 'user-bubble' : 'ai-bubble'}`;
    bubble.dataset.role = sender;
    bubble.textContent = text;
    aiMessages.appendChild(bubble);
    aiMessages.scrollTop = aiMessages.scrollHeight;
    return bubble;
  }
}

/* ==========================================================================
   6. Contact Form Handler (Direct Delivery to Gmail via Web3Forms)
   ========================================================================== */
const WEB3FORMS_ACCESS_KEY = '95f54db0-e840-4bf4-8001-5cc45ee30019';

function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (!contactForm || !formStatus || !submitBtn) return;

  let statusTimeout;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearTimeout(statusTimeout);

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : 'Portfolio Contact Inquiry';
    const message = messageInput ? messageInput.value.trim() : '';

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending...</span>';
    formStatus.replaceChildren();
    formStatus.className = 'form-status';

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      name: name,
      email: email,
      subject: subject ? `[Portfolio] ${subject}` : `[Portfolio Message from ${name}]`,
      message: message,
      from_name: name || 'Portfolio Visitor'
    };

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormStatus(`Thank you, ${name || 'there'}! Your message has been sent directly to Prashanth's inbox.`, 'ok', 'fa-circle-check');
        contactForm.reset();
      } else {
        const errorMessage = typeof result.message === 'string' && result.message.trim()
          ? result.message
          : 'Submission failed. Please email polisheetyprashanth246@gmail.com directly.';
        setFormStatus(errorMessage, 'err', 'fa-triangle-exclamation');
      }
    } catch (error) {
      setFormStatus('Network error. Please email polisheetyprashanth246@gmail.com directly.', 'err', 'fa-triangle-exclamation');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> <span>Send Message</span>';

      statusTimeout = setTimeout(() => {
        formStatus.replaceChildren();
        formStatus.className = 'form-status';
        statusTimeout = undefined;
      }, 9000);
    }
  });

  function setFormStatus(message, type, iconName) {
    const icon = document.createElement('i');
    icon.className = `fa-solid ${iconName}`;
    icon.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.textContent = ` ${message}`;

    formStatus.className = `form-status ${type}`;
    formStatus.replaceChildren(icon, text);
  }
}
