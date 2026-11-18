(function () {
  'use strict';

  const projects = [
    {
      slug: 'paypilot-ai',
      title: 'PayPilot-AI: Agentic Commerce Platform',
      category: 'Agentic commerce',
      summary: 'An AI-native merchant commerce platform that lets an AI buyer discover catalog products and build a cart while deterministic services retain control of prices, policy checks, approval, and payment execution.',
      repoUrl: 'https://github.com/prashanthpolisetty/PayPilot-AI',
      liveUrl: '',
      technologies: ['Python 3.11', 'FastAPI', 'React 18', 'Vite', 'PostgreSQL', 'SQLite', 'SQLAlchemy', 'Gemini', 'Groq', 'Razorpay', 'Docker'],
      sections: [
        {
          heading: 'Conversational discovery',
          paragraphs: ['The buyer agent extracts a shopper’s intent and constraints, searches the merchant catalog with semantic retrieval, and can propose a relevant add-on. The README describes this as an 18-step agentic commerce pipeline.'],
          items: ['Natural-language intent extraction', 'Catalog search with TF-IDF cosine similarity and SQL filtering', 'Contextual product recommendations and upsells']
        },
        {
          heading: 'Deterministic transaction controls',
          paragraphs: ['AI suggestions do not authorize money movement. Backend services calculate prices, check stock and policy limits, and require explicit approval for the current cart before creating a Razorpay test order.'],
          items: ['Transaction and daily-spend limits', 'Quantity and inventory checks', 'Human approval bound to the current cart version']
        },
        {
          heading: 'Payment security and operations',
          paragraphs: ['The backend verifies Razorpay payment signatures, handles webhooks idempotently, and records an audit trail. The repository also describes merchant policy controls and a telemetry dashboard.'],
          items: ['Server-side HMAC-SHA256 signature verification', 'Idempotent webhook processing', 'React merchant and commerce interfaces']
        }
      ],
      workflow: ['Understand the buyer request', 'Retrieve and rank catalog products', 'Build a cart and apply backend policy checks', 'Request explicit human approval', 'Create and verify a Razorpay test payment'],
      images: [
        {
          src: '/assets/projects/paypilot-hero.png',
          alt: 'Graphic from the PayPilot-AI frontend repository assets',
          caption: 'Frontend graphic included in the PayPilot-AI repository.'
        }
      ]
    },
    {
      slug: 'document-rag-chatbot',
      title: 'Document RAG Chatbot',
      category: 'Generative AI & RAG',
      summary: 'A Streamlit document Q&A application that retrieves passages from uploaded files and uses the retrieved context to answer questions with source citations.',
      repoUrl: 'https://github.com/prashanthpolisetty/RAG-bot',
      liveUrl: 'https://ragbotq.streamlit.app/',
      technologies: ['Python', 'Streamlit', 'LangChain', 'Sentence Transformers', 'all-MiniLM-L6-v2', 'ChromaDB', 'Gemini API', 'PyPDF2', 'python-docx'],
      sections: [
        {
          heading: 'Document ingestion and indexing',
          paragraphs: ['The repository supports PDF, DOCX, and text inputs. Format-specific parsers extract the text, then LangChain splits it into overlapping chunks for indexing.'],
          items: ['700-character chunks with 100-character overlap', 'Local all-MiniLM-L6-v2 embedding generation', 'Persistent ChromaDB vector storage']
        },
        {
          heading: 'Grounded question answering',
          paragraphs: ['A question is embedded and matched against the stored chunks. The top five relevant passages are placed in the prompt sent to Gemini, which is instructed to answer from that context and cite its sources.'],
          items: ['Similarity retrieval from the local vector store', 'Context-grounded Gemini answers', 'The README describes refusing questions that cannot be answered from the uploaded documents']
        },
        {
          heading: 'Local-first indexing',
          paragraphs: ['Embedding generation runs locally on the CPU, keeping indexing independent of a cloud embedding API. The Gemini API is used for question answering.']
        }
      ],
      workflow: ['Upload a PDF, DOCX, or text file', 'Extract and split document text', 'Create local embeddings and persist them in ChromaDB', 'Retrieve the most relevant chunks for a question', 'Generate a context-grounded answer with citations'],
      images: []
    },
    {
      slug: 'hybrid-llm-hallucination-detection-mitigation',
      title: 'Hybrid LLM Hallucination Detection & Mitigation',
      category: 'Trustworthy AI',
      summary: 'An end-to-end system that detects, explains and mitigates factual hallucinations in LLM answers using dual-signal verification. It combines self-consistency across stochastic generations with authoritative web retrieval and DeBERTa-v3 natural language inference.',
      repoUrl: '',
      liveUrl: '',
      technologies: ['Python', 'FastAPI', 'React 18', 'Vite', 'spaCy', 'DeBERTa-v3 NLI', 'XGBoost', 'Sentence Transformers', 'Gemini API', 'SQLite'],
      sections: [
        {
          heading: 'Dual-signal claim verification',
          paragraphs: ['The system combines internal uncertainty, measured through self-consistency across multiple stochastic generations, with external evidence grounding from authoritative web retrieval and DeBERTa-v3 NLI.']
        },
        {
          heading: 'Claim-level risk scoring',
          paragraphs: ['An XGBoost classifier turns a 9-feature vector into a hallucination risk score for each claim. On HaluEval QA and TruthfulQA claim-evidence records, using leakage-safe grouped splits, the project reports 0.9744 accuracy, 0.9697 F1, and 0.9953 AUROC. The Logistic Regression baseline scored 0.9206 F1.']
        },
        {
          heading: 'Evidence-grounded mitigation',
          paragraphs: ['When a claim is high-risk, the contradicted claim is highlighted and the same LLM is re-prompted with verified evidence to produce a corrected answer. A FastAPI backend streams pipeline progress with Server-Sent Events and records audits in SQLite; a React 18 + Vite dashboard shows each stage.']
        }
      ],
      workflow: ['Generate multiple stochastic answers for self-consistency signals', 'Retrieve authoritative evidence for answer claims', 'Verify claim-evidence pairs with DeBERTa-v3 NLI', 'Score the 9-feature vector with XGBoost', 'Highlight high-risk claims and re-prompt with verified evidence'],
      images: []
    },
    {
      slug: 'ai-resume-analyzer',
      title: 'AI Resume Screener & Analyzer',
      category: 'Generative AI & NLP',
      summary: 'A backend-focused resume analysis project that extracts resume content and evaluates it against a job description, returning ATS-style scores and improvement feedback.',
      repoUrl: 'https://github.com/prashanthpolisetty/AI-Resume-Analyzer',
      liveUrl: '',
      technologies: ['Python', 'LangChain', 'Google Gemini API', 'Pydantic', 'PDF and DOCX parsing'],
      sections: [
        {
          heading: 'Resume evaluation',
          paragraphs: ['The repository documentation describes job-description matching, relevant-experience evaluation, skill-gap detection, grammar checks, keyword density, and tailored suggestions. It also describes a general resume health-check mode when no job description is supplied.']
        },
        {
          heading: 'Structured reports',
          paragraphs: ['The backend combines the analysis into a final ATS-style score and returns structured results, including category scores, grammar findings, skill gaps, and recommendations. The report can be saved for a resume.']
        },
        {
          heading: 'Repository scope',
          paragraphs: ['The README describes a React frontend as planned work; the linked repository currently presents the Python backend and its analysis features.']
        }
      ],
      workflow: ['Upload a PDF or DOCX resume', 'Extract resume text', 'Run the analysis chains for job match and resume quality', 'Combine category results into a structured report', 'Return improvement suggestions and optional saved outputs'],
      images: []
    },
    {
      slug: 'meeting-minutes-generator',
      title: 'Meeting Minutes Generator',
      category: 'AI meeting assistant',
      summary: 'An AI meeting assistant that transcribes audio locally, creates structured minutes with cloud LLMs, and emails the results to meeting participants.',
      repoUrl: 'https://github.com/prashanthpolisetty/Meeting-minutes-Generator',
      liveUrl: 'https://meeting-minutes-frontend.onrender.com/',
      technologies: ['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'FastAPI', 'Python', 'MongoDB', 'OpenAI Whisper', 'Groq', 'Google Gemini', 'SMTP'],
      sections: [
        {
          heading: 'Audio-to-minutes pipeline',
          paragraphs: ['Users upload meeting audio through the dashboard. The backend prepares the audio and runs OpenAI Whisper locally, then sends the transcript to cloud LLMs to produce structured meeting information.'],
          items: ['Meeting summary and agenda', 'Key decisions', 'Action items with tasks, owners, and deadlines']
        },
        {
          heading: 'Model comparison and delivery',
          paragraphs: ['The repository describes generating candidate minutes with multiple LLMs and using a judge model to select a result. Completed minutes are stored with meeting metadata in MongoDB and can be sent to participants in a formatted email.']
        },
        {
          heading: 'Dashboard and history',
          paragraphs: ['The React dashboard supports audio uploads, processing status, meeting history, and views of generated summaries and decisions.']
        }
      ],
      workflow: ['Upload a meeting recording', 'Normalize and transcribe audio locally with Whisper', 'Generate structured minutes with cloud LLMs', 'Compare candidate outputs and select a result', 'Store meeting records and email the minutes'],
      images: [
        {
          src: '/assets/projects/meeting-dashboard.png',
          alt: 'Meeting Minutes Generator dashboard screenshot from the repository',
          caption: 'Workspace dashboard screenshot included in the repository.'
        },
        {
          src: '/assets/projects/meeting-ai-comparison.png',
          alt: 'Meeting Minutes Generator AI comparison screen from the repository',
          caption: 'AI comparison view documented in the repository README.'
        },
        {
          src: '/assets/projects/meeting-workspace-summary.png',
          alt: 'Meeting Minutes Generator executive summary screen from the repository',
          caption: 'Generated executive summary view documented in the repository README.'
        }
      ]
    },
    {
      slug: 'binance-trading-bot',
      title: 'Binance Futures Testnet Trading Bot',
      category: 'Trading tools',
      summary: 'A Python command-line tool that submits market and limit orders to the Binance Futures USDT-M Testnet.',
      repoUrl: 'https://github.com/prashanthpolisetty/binance-trading-bot',
      liveUrl: '',
      technologies: ['Python', 'Binance Futures Testnet API'],
      sections: [
        {
          heading: 'Command-line order entry',
          paragraphs: ['The CLI accepts a trading symbol, side, order type, quantity, and—when placing a limit order—a price. The README documents examples for market and limit orders.']
        },
        {
          heading: 'Validation and logging',
          paragraphs: ['The repository describes input validation, error handling, and request/response logging. API credentials are configured for the Binance Futures Testnet through environment variables.']
        },
        {
          heading: 'Testnet-only workflow',
          paragraphs: ['The documented setup and examples target the Binance Futures Testnet. The README notes that credentials should be for the testnet environment.']
        }
      ],
      workflow: ['Configure Futures Testnet API credentials', 'Provide symbol, side, type, and quantity to the CLI', 'Provide a price for limit orders', 'Validate inputs and submit the testnet order', 'Record request and response details in the application log'],
      images: []
    }
  ];

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));

  const renderSection = (section) => `
    <section class="project-detail-block">
      <h2>${escapeHtml(section.heading)}</h2>
      ${(section.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
      ${(section.items || []).length ? `<ul>${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}
    </section>
  `;

  const renderGallery = (images) => images.length ? `
    <section class="project-gallery" aria-labelledby="project-gallery-title">
      <div class="detail-section-heading">
        <span class="section-subtitle">From the repository</span>
        <h2 id="project-gallery-title">Project images</h2>
      </div>
      <div class="project-gallery-grid">
        ${images.map((image) => `
          <figure class="project-gallery-item">
            <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy" decoding="async">
            <figcaption>${escapeHtml(image.caption)}</figcaption>
          </figure>
        `).join('')}
      </div>
    </section>
  ` : '';

  const renderLinks = (project) => {
    const links = [];
    if (project.repoUrl) {
      links.push(`<a class="btn btn-primary" href="${escapeHtml(project.repoUrl)}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github" aria-hidden="true"></i> View source repository</a>`);
    }
    if (project.liveUrl) {
      links.push(`<a class="btn btn-outline" href="${escapeHtml(project.liveUrl)}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> Open live app</a>`);
    }
    return links.length ? `<div class="project-detail-actions">${links.join('')}</div>` : '';
  };

  window.PORTFOLIO_PROJECTS = projects;
  window.renderProjectDetail = function renderProjectDetail(slug) {
    const main = document.querySelector('main');
    if (!main) return;

    document.body.classList.add('project-detail-page');
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) skipLink.href = '#project-detail';

    const project = projects.find((item) => item.slug === slug);
    if (!project) {
      document.title = 'Project not found | Polisetty Prashanth';
      main.innerHTML = `
        <section class="project-detail-section" id="project-detail">
          <div class="container project-not-found">
            <h1>Project not found</h1>
            <p>This project page is not available.</p>
            <a class="btn btn-primary" href="/#projects">Back to all projects</a>
          </div>
        </section>
      `;
      return;
    }

    document.title = `${project.title} | Polisetty Prashanth`;
    const description = project.summary.slice(0, 155);
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const openGraphTitle = document.querySelector('meta[property="og:title"]');
    const openGraphDescription = document.querySelector('meta[property="og:description"]');
    const openGraphUrl = document.querySelector('meta[property="og:url"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (descriptionMeta) descriptionMeta.content = description;
    if (openGraphTitle) openGraphTitle.content = project.title;
    if (openGraphDescription) openGraphDescription.content = description;
    if (openGraphUrl) openGraphUrl.content = new URL(`/${project.slug}`, window.location.origin).href;
    if (twitterTitle) twitterTitle.content = project.title;
    if (twitterDescription) twitterDescription.content = description;

    main.id = 'main-content';
    main.innerHTML = `
      <section class="project-detail-section" id="project-detail" aria-labelledby="project-detail-title">
        <div class="container">
          <a class="project-back-link" href="/#projects"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> All projects</a>
          <header class="project-detail-header">
            <span class="project-detail-category">${escapeHtml(project.category)}</span>
            <h1 id="project-detail-title">${escapeHtml(project.title)}</h1>
            <p class="project-detail-lead">${escapeHtml(project.summary)}</p>
            ${renderLinks(project)}
          </header>

          <div class="project-detail-layout">
            <div class="project-detail-content">
              ${project.sections.map(renderSection).join('')}
              <section class="project-detail-block project-workflow">
                <h2>How the project works</h2>
                <ol>${project.workflow.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol>
              </section>
            </div>
            <aside class="project-detail-sidebar" aria-label="Project technologies">
              <h2>Technology stack</h2>
              <ul class="project-detail-tech">
                ${project.technologies.map((technology) => `<li>${escapeHtml(technology)}</li>`).join('')}
              </ul>
            </aside>
          </div>
          ${renderGallery(project.images)}
        </div>
      </section>
    `;
  };
})();
