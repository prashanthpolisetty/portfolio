/**
 * Polisetty Prashanth - Portfolio Interactive Scripts
 * Handles:
 * 1. Typing animation in hero section
 * 2. Mobile navbar toggle and smooth scrolling
 * 3. Dynamic project category filtering
 * 4. Interactive Developer Terminal CLI emulator
 * 5. Recruiter AI Assistant conversational drawer
 * 6. Resume PDF modal preview & download triggers
 * 7. Simulated contact form submission
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypingEffect();
  initMobileMenu();
  initProjectFilters();
  initTerminal();
  initAiAssistant();
  initResumeModal();
  initContactForm();
});

/* ==========================================================================
   1. Dynamic Typing Effect
   ========================================================================== */
function initTypingEffect() {
  const typingElement = document.getElementById('typingText');
  if (!typingElement) return;

  const roles = [
    'Autonomous GenAI & RAG Systems',
    'Agentic Commerce with PayPilot-AI',
    'High-Performance FastAPI Backends',
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
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const icon = menuToggle.querySelector('i');
      if (mobileMenu.classList.contains('open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      });
    });
  }
}

/* ==========================================================================
   3. Project Category Filtering
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
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
  <span class="text-cyan">ragbot</span>      : Information on Document RAG Chatbot
  <span class="text-cyan">education</span>   : View B.Tech & CITD degree details
  <span class="text-cyan">experience</span>  : View ML internship & industrial training
  <span class="text-cyan">contact</span>     : Get email, phone, GitHub, & LinkedIn
  <span class="text-cyan">resume</span>      : Open & trigger resume download
  <span class="text-cyan">clear</span>       : Clear the terminal screen
`,
    about: `
<span class="text-indigo">Polisetty Prashanth</span>
Final-year Computer Science Engineering (AI & ML) student at NGIT Hyderabad.
Passionate about taking autonomous Generative AI and agentic systems into production.
View LeetCode profile: <a href="https://leetcode.com/u/polisetty_prashanth/" target="_blank" class="text-cyan">leetcode.com/u/polisetty_prashanth</a>
`,
    skills: `
<span class="text-indigo">Generative AI & LLMs:</span> LangChain, CrewAI, Llama 3.1, Gemini API, Sentence Transformers, RAG
<span class="text-cyan">Backend & Data:</span> FastAPI, Flask, ChromaDB, PostgreSQL, MySQL, Pydantic, REST APIs
<span class="text-purple">Languages:</span> Python, Java, JavaScript, TypeScript, SQL, HTML5/CSS3
<span class="text-yellow">Tools:</span> Streamlit, Git/GitHub, Docker, VS Code, Cursor, Jupyter
`,
    projects: `
1. <span class="text-indigo font-bold">PayPilot-AI</span>: Agentic commerce platform for Razorpay Buildathon (Track 01)
2. <span class="text-cyan font-bold">Document RAG Chatbot</span>: Live interactive PDF/text RAG bot (ragbotq.streamlit.app)
3. <span class="text-purple font-bold">AI Resume Analyzer</span>: High-throughput candidate screener using Gemini & Pydantic
4. <span class="text-yellow font-bold">Meeting Minutes Generator</span>: Whisper local audio transcription + Groq/Gemini synthesis
5. <span class="text-muted font-bold">Binance Trading Bot</span>: Sub-minute algorithmic cryptocurrency execution bot
`,
    paypilot: `
<span class="text-indigo font-bold">PayPilot-AI — Razorpay AI Growth & Agentic Commerce</span>
• 18-step agentic commerce & risk decision pipeline
• Conversational product discovery & semantic RAG vector catalog search
• Strict deterministic financial caps (₹1,00,000 ceiling)
• Server-side HMAC-SHA256 signature verification & idempotent webhooks
Repo: <a href="https://github.com/prashanthpolisetty/PayPilot-AI" target="_blank" class="text-cyan">github.com/prashanthpolisetty/PayPilot-AI</a>
`,
    ragbot: `
<span class="text-cyan font-bold">Document RAG Chatbot</span>
• Evaluation accuracy >80% with all-MiniLM-L6-v2 embeddings
• Persistent ChromaDB vector storage + Llama 3.1 inference
• Live Streamlit app: <a href="https://ragbotq.streamlit.app" target="_blank" class="text-indigo">ragbotq.streamlit.app</a>
`,
    education: `
• <span class="text-indigo font-bold">B.Tech in CSE (AI & ML)</span>: Neil Gogte Institute of Technology (2024–2027) | CGPA: 8.06
• <span class="text-cyan font-bold">Diploma in Tool & Die Making</span>: CITD Hyderabad (2020–2024) | 74.15%
• <span class="text-yellow font-bold">10th Grade (Secondary)</span>: Navodaya High School, Gadwal (2020) | CGPA: 9.8
`,
    experience: `
• <span class="text-indigo font-bold">Machine Learning Intern</span> @ Unified Mentor (May 2025 – Jun 2025):
  Predictive regression models (House & Mobile pricing) and comprehensive EDA.
• <span class="text-cyan font-bold">Industrial Engineering Trainee</span> @ Tata Advanced Systems Limited (2023):
  Precision tool engineering and structural compliance.
`,
    contact: `
• Email   : <a href="mailto:polisheetyprashanth246@gmail.com" class="text-cyan">polisheetyprashanth246@gmail.com</a>
• Phone   : <a href="tel:+919121990362" class="text-cyan">+91-9121990362</a>
• GitHub  : <a href="https://github.com/prashanthpolisetty" target="_blank" class="text-cyan">github.com/prashanthpolisetty</a>
• LinkedIn: <a href="https://linkedin.com/in/polisetty-prashanth-5440b5298" target="_blank" class="text-cyan">polisetty-prashanth-5440b5298</a>
`,
    resume: `
<span class="text-green font-bold">Opening resume modal & initiating download...</span>
`
  };

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawCmd = terminalInput.value.trim();
      const cmd = rawCmd.toLowerCase();
      terminalInput.value = '';

      if (!cmd) return;

      appendTerminalLine(`<span class="prompt-symbol">visitor@prashanth:~$</span> ${rawCmd}`);

      if (cmd === 'clear') {
        terminalOutput.innerHTML = '';
        return;
      }

      if (cmd === 'resume') {
        appendTerminalLine(commandResponses.resume);
        openResumeModal();
        return;
      }

      if (commandResponses[cmd]) {
        appendTerminalLine(commandResponses[cmd]);
      } else {
        appendTerminalLine(`<span class="text-red-400">bash: command not found: ${rawCmd}. Type <span class="text-cyan font-bold">help</span> for a list of commands.</span>`);
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

/* ==========================================================================
   5. Floating Recruiter AI Assistant Widget
   ========================================================================== */
function initAiAssistant() {
  const aiTrigger = document.getElementById('aiTrigger');
  const aiDrawer = document.getElementById('aiDrawer');
  const aiClose = document.getElementById('aiClose');
  const aiChatForm = document.getElementById('aiChatForm');
  const aiChatInput = document.getElementById('aiChatInput');
  const aiMessages = document.getElementById('aiMessages');
  const quickPills = document.querySelectorAll('.quick-pill');

  if (!aiTrigger || !aiDrawer) return;

  aiTrigger.addEventListener('click', () => {
    aiDrawer.classList.toggle('open');
  });

  aiClose.addEventListener('click', () => {
    aiDrawer.classList.remove('open');
  });

  // Quick action pills
  quickPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const query = pill.getAttribute('data-q');
      handleAiQuery(query);
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
    // Add User Message
    addMessage(userText, 'user');

    // Generate intelligent contextual response
    setTimeout(() => {
      const response = generateAiAnswer(userText);
      addMessage(response, 'ai');
    }, 450);
  }

  function addMessage(text, sender) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender === 'user' ? 'user-bubble' : 'ai-bubble'}`;
    bubble.innerHTML = text;
    aiMessages.appendChild(bubble);
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }

  function generateAiAnswer(input) {
    const q = input.toLowerCase();

    if (q.includes('paypilot') || q.includes('razorpay')) {
      return `⚡ <strong>PayPilot-AI</strong> is Prashanth's flagship autonomous agentic commerce platform built for the Razorpay Buildathon. It features an 18-step pipeline where an AI buyer agent handles natural language catalog exploration & RAG vector rankings, while deterministic FastAPI microservices enforce transaction caps (₹1,00,000) and human-gated Razorpay payments!`;
    }

    if (q.includes('rag') || q.includes('genai') || q.includes('llm') || q.includes('ai') || q.includes('langchain')) {
      return `🤖 Prashanth specializes in <strong>Retrieval-Augmented Generation (RAG)</strong> and autonomous agents. He uses LangChain, CrewAI, ChromaDB vector stores, HuggingFace Sentence Transformers, and Google Gemini / Llama 3.1 with strict Pydantic JSON schemas and Chain-of-Thought prompting.`;
    }

    if (q.includes('live') || q.includes('demo') || q.includes('stream')) {
      return `🌐 Yes! Prashanth's <strong>Document RAG Chatbot</strong> is publicly deployed and live right now at <a href="https://ragbotq.streamlit.app" target="_blank" style="color:#38bdf8;text-decoration:underline;">ragbotq.streamlit.app</a>. Try uploading a PDF there!`;
    }

    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('hire') || q.includes('linkedin')) {
      return `📬 You can reach Prashanth directly via:
      <br/>• <strong>Email:</strong> <a href="mailto:polisheetyprashanth246@gmail.com" style="color:#38bdf8;">polisheetyprashanth246@gmail.com</a>
      <br/>• <strong>Phone:</strong> +91-9121990362
      <br/>• <strong>LinkedIn:</strong> <a href="https://linkedin.com/in/polisetty-prashanth-5440b5298" target="_blank" style="color:#38bdf8;">Profile Link</a>`;
    }

    if (q.includes('education') || q.includes('college') || q.includes('cgpa') || q.includes('degree')) {
      return `🎓 Prashanth is pursuing his <strong>B.Tech in Computer Science (AI & ML)</strong> at Neil Gogte Institute of Technology (NGIT) with an <strong>8.06 CGPA</strong>. He also holds a 4-year <strong>Diploma in Tool & Die Making</strong> from CITD Hyderabad (74.15%).`;
    }

    if (q.includes('leetcode') || q.includes('dsa') || q.includes('algorithm')) {
      return `💻 Prashanth has solved <strong>103 problems</strong> on LeetCode (64 Easy, 37 Medium, 2 Hard), with 229 submissions in the past year! His strongest algorithmic areas include <strong>Arrays (53 solved)</strong>, <strong>Two Pointers (20)</strong>, <strong>Binary Search (19)</strong>, <strong>Hash Tables (17)</strong>, and <strong>SQL Databases (17)</strong>. View his profile at <a href="https://leetcode.com/u/polisetty_prashanth/" target="_blank" style="color:#38bdf8;">leetcode.com/u/polisetty_prashanth</a>!`;
    }

    if (q.includes('resume') || q.includes('cv')) {
      return `📄 You can download Prashanth's verified PDF resume directly using the 'Resume' button in the top navigation or in the hero section!`;
    }

    return `Thanks for asking! Prashanth is a Computer Science (AI & ML) engineer skilled in GenAI, LangChain, FastAPI, and RAG pipelines. Check out his <strong>PayPilot-AI</strong> project or test his live app at <a href="https://ragbotq.streamlit.app" target="_blank" style="color:#38bdf8;">ragbotq.streamlit.app</a>!`;
  }
}

/* ==========================================================================
   6. Resume Modal & Downloader
   ========================================================================== */
function initResumeModal() {
  const viewResumeBtn = document.getElementById('viewResumeBtn');
  const resumeModal = document.getElementById('resumeModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const closeModalFooterBtn = document.getElementById('closeModalFooterBtn');

  if (viewResumeBtn && resumeModal) {
    viewResumeBtn.addEventListener('click', openResumeModal);
  }

  if (closeModalBtn && resumeModal) {
    closeModalBtn.addEventListener('click', closeResumeModal);
  }

  if (closeModalFooterBtn && resumeModal) {
    closeModalFooterBtn.addEventListener('click', closeResumeModal);
  }

  // Close modal when clicking outside of dialog
  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        closeResumeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('open')) {
      closeResumeModal();
    }
  });
}

function openResumeModal() {
  const modal = document.getElementById('resumeModal');
  if (modal) modal.classList.add('open');
}

function closeResumeModal() {
  const modal = document.getElementById('resumeModal');
  if (modal) modal.classList.remove('open');
}

/* ==========================================================================
   7. Contact Form Handler
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (!contactForm || !formStatus) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    // Simulate sending email / webhook
    setTimeout(() => {
      formStatus.innerHTML = `<span style="color:#34d399;"><i class="fa-solid fa-circle-check"></i> Thank you, ${name}! Your message has been received. Prashanth will reply to <strong>${email}</strong> shortly.</span>`;
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> <span>Send Message</span>';

      setTimeout(() => {
        formStatus.innerHTML = '';
      }, 7000);
    }, 1000);
  });
}
