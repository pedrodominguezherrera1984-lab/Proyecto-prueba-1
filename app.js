/**
 * NEXO - Interactive Logic & Engine
 * Hero Canvas Simulator, Dynamic SVG Connectors, Integrations Filter,
 * Template Switcher, Terminal Tabs, Pricing Toggle, FAQ Accordion
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Hero Interactive Canvas & SVG Dynamic Connectors
     ========================================================================== */
  const canvasBoard = document.getElementById('canvasBoard');
  const btnRunWorkflow = document.getElementById('btnRunWorkflow');
  const runButtonText = document.getElementById('runButtonText');
  const btnResetWorkflow = document.getElementById('btnResetWorkflow');
  const btnInspectPayload = document.getElementById('btnInspectPayload');
  const payloadDrawer = document.getElementById('payloadDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const workflowStatusDot = document.getElementById('workflowStatusDot');
  const executionStateText = document.getElementById('executionStateText');
  const totalExecutionTime = document.getElementById('totalExecutionTime');

  let isExecuting = false;
  let executionTimeoutIds = [];

  // Helper to get element center coordinates relative to canvas
  function getPinCoordinates(pinElement) {
    if (!pinElement || !canvasBoard) return { x: 0, y: 0 };
    const pinRect = pinElement.getBoundingClientRect();
    const boardRect = canvasBoard.getBoundingClientRect();
    return {
      x: pinRect.left - boardRect.left + pinRect.width / 2 + canvasBoard.scrollLeft,
      y: pinRect.top - boardRect.top + pinRect.height / 2
    };
  }

  // Draw smooth cubic bezier curve path between two pins
  function updateCablePath(pathId, pinStartId, pinEndId, isVerticalBranch = false) {
    const path = document.getElementById(pathId);
    const pinStart = document.getElementById(pinStartId);
    const pinEnd = document.getElementById(pinEndId);

    if (!path || !pinStart || !pinEnd) return;

    const start = getPinCoordinates(pinStart);
    const end = getPinCoordinates(pinEnd);

    let d;
    if (isVerticalBranch) {
      // Curve coming from bottom of Node 3 down to Node 4B
      const dy = end.y - start.y;
      d = `M ${start.x} ${start.y} C ${start.x} ${start.y + dy * 0.5}, ${end.x - 40} ${end.y}, ${end.x} ${end.y}`;
    } else {
      const dx = Math.abs(end.x - start.x);
      const controlDist = Math.max(dx * 0.45, 40);
      d = `M ${start.x} ${start.y} C ${start.x + controlDist} ${start.y}, ${end.x - controlDist} ${end.y}, ${end.x} ${end.y}`;
    }

    path.setAttribute('d', d);
  }

  // Recompute all SVG paths
  function updateAllCables() {
    updateCablePath('path-1-2', 'pin-1-out', 'pin-2-in');
    updateCablePath('path-2-3', 'pin-2-out', 'pin-3-in');
    updateCablePath('path-3-4a', 'pin-3-out-a', 'pin-4a-in');
    updateCablePath('path-4a-5a', 'pin-4a-out', 'pin-5a-in');
    updateCablePath('path-5a-6a', 'pin-5a-out', 'pin-6a-in');
    updateCablePath('path-3-4b', 'pin-3-out-b', 'pin-4b-in', true);
  }

  // Initial draw and bind resize observer
  updateAllCables();
  window.addEventListener('resize', () => {
    requestAnimationFrame(updateAllCables);
  });
  if (canvasBoard) {
    canvasBoard.addEventListener('scroll', () => {
      requestAnimationFrame(updateAllCables);
    });
  }

  // Simulation Sequence
  function runWorkflowSimulation() {
    if (isExecuting) return;
    isExecuting = true;

    // Reset previous states first
    resetWorkflowUI(false);

    // Update Topbar status
    if (btnRunWorkflow) {
      btnRunWorkflow.classList.add('running');
      runButtonText.textContent = 'Ejecutando...';
    }
    if (workflowStatusDot) {
      workflowStatusDot.style.background = '#06B6D4';
      workflowStatusDot.style.boxShadow = '0 0 10px #06B6D4';
    }
    if (executionStateText) {
      executionStateText.textContent = 'Paso 1: Recibiendo Webhook...';
      executionStateText.className = 'stat-value text-cyan';
    }

    let startTime = Date.now();
    const timerInterval = setInterval(() => {
      if (totalExecutionTime && isExecuting) {
        totalExecutionTime.textContent = (Date.now() - startTime) + ' ms';
      }
    }, 40);

    // Step 1: Webhook Trigger (0ms)
    executionTimeoutIds.push(setTimeout(() => {
      const node1 = document.getElementById('node-1');
      const chip1 = document.getElementById('chip-1');
      const lat1 = document.getElementById('lat-1');
      const path12 = document.getElementById('path-1-2');

      if (node1) node1.classList.add('active-executing');
      if (chip1) { chip1.textContent = 'Procesando'; chip1.className = 'node-status-chip running'; }

      executionTimeoutIds.push(setTimeout(() => {
        if (node1) {
          node1.classList.remove('active-executing');
          node1.classList.add('success-executing');
        }
        if (chip1) { chip1.textContent = '200 OK'; chip1.className = 'node-status-chip success'; }
        if (lat1) { lat1.textContent = '14 ms'; lat1.classList.add('highlight'); }
        if (path12) path12.classList.add('cable-active');
        if (executionStateText) executionStateText.textContent = 'Paso 2: Razonamiento de Agente IA con RAG...';
      }, 500));
    }, 100));

    // Step 2: AI Agent Enricher (650ms)
    executionTimeoutIds.push(setTimeout(() => {
      const node2 = document.getElementById('node-2');
      const chip2 = document.getElementById('chip-2');
      const lat2 = document.getElementById('lat-2');
      const path23 = document.getElementById('path-2-3');

      if (node2) node2.classList.add('active-executing');
      if (chip2) { chip2.textContent = 'Razonando...'; chip2.className = 'node-status-chip running'; }

      executionTimeoutIds.push(setTimeout(() => {
        if (node2) {
          node2.classList.remove('active-executing');
          node2.classList.add('success-executing');
        }
        if (chip2) { chip2.textContent = 'Score: 94'; chip2.className = 'node-status-chip success'; }
        if (lat2) { lat2.textContent = '328 ms'; lat2.classList.add('highlight'); }
        if (path23) path23.classList.add('cable-active');
        if (executionStateText) executionStateText.textContent = 'Paso 3: Evaluando Regla de Enrutamiento...';
      }, 700));
    }, 650));

    // Step 3: Conditional Router (1450ms)
    executionTimeoutIds.push(setTimeout(() => {
      const node3 = document.getElementById('node-3');
      const chip3 = document.getElementById('chip-3');
      const path34a = document.getElementById('path-3-4a');

      if (node3) node3.classList.add('active-executing');
      if (chip3) { chip3.textContent = 'Evaluando...'; chip3.className = 'node-status-chip running'; }

      executionTimeoutIds.push(setTimeout(() => {
        if (node3) {
          node3.classList.remove('active-executing');
          node3.classList.add('success-executing');
        }
        if (chip3) { chip3.textContent = 'MATCH: >80'; chip3.className = 'node-status-chip success'; }
        if (path34a) path34a.classList.add('cable-active');
        if (executionStateText) executionStateText.textContent = 'Paso 4: Guardando en PostgreSQL & Notificando a Slack...';
      }, 500));
    }, 1450));

    // Step 4: Postgres Save (2050ms)
    executionTimeoutIds.push(setTimeout(() => {
      const node4a = document.getElementById('node-4a');
      const chip4a = document.getElementById('chip-4a');
      const lat4a = document.getElementById('lat-4a');
      const path4a5a = document.getElementById('path-4a-5a');

      if (node4a) node4a.classList.add('active-executing');
      if (chip4a) { chip4a.textContent = 'Guardando'; chip4a.className = 'node-status-chip running'; }

      executionTimeoutIds.push(setTimeout(() => {
        if (node4a) {
          node4a.classList.remove('active-executing');
          node4a.classList.add('success-executing');
        }
        if (chip4a) { chip4a.textContent = 'INSERT OK'; chip4a.className = 'node-status-chip success'; }
        if (lat4a) { lat4a.textContent = '22 ms'; lat4a.classList.add('highlight'); }
        if (path4a5a) path4a5a.classList.add('cable-active');
      }, 450));
    }, 2050));

    // Step 5: Slack VIP Alert (2600ms)
    executionTimeoutIds.push(setTimeout(() => {
      const node5a = document.getElementById('node-5a');
      const chip5a = document.getElementById('chip-5a');
      const lat5a = document.getElementById('lat-5a');
      const path5a6a = document.getElementById('path-5a-6a');

      if (node5a) node5a.classList.add('active-executing');
      if (chip5a) { chip5a.textContent = 'Enviando'; chip5a.className = 'node-status-chip running'; }

      executionTimeoutIds.push(setTimeout(() => {
        if (node5a) {
          node5a.classList.remove('active-executing');
          node5a.classList.add('success-executing');
        }
        if (chip5a) { chip5a.textContent = 'Notificado'; chip5a.className = 'node-status-chip success'; }
        if (lat5a) { lat5a.textContent = '54 ms'; lat5a.classList.add('highlight'); }
        if (path5a6a) path5a6a.classList.add('cable-active');
      }, 450));
    }, 2600));

    // Step 6: Cal.com VIP link (3150ms)
    executionTimeoutIds.push(setTimeout(() => {
      const node6a = document.getElementById('node-6a');
      const chip6a = document.getElementById('chip-6a');
      const lat6a = document.getElementById('lat-6a');

      if (node6a) node6a.classList.add('active-executing');
      if (chip6a) { chip6a.textContent = 'Generando'; chip6a.className = 'node-status-chip running'; }

      executionTimeoutIds.push(setTimeout(() => {
        if (node6a) {
          node6a.classList.remove('active-executing');
          node6a.classList.add('success-executing');
        }
        if (chip6a) { chip6a.textContent = 'Completado'; chip6a.className = 'node-status-chip success'; }
        if (lat6a) { lat6a.textContent = '31 ms'; lat6a.classList.add('highlight'); }

        // Final completion state
        clearInterval(timerInterval);
        isExecuting = false;
        if (btnRunWorkflow) {
          btnRunWorkflow.classList.remove('running');
          runButtonText.textContent = '✓ Simulación Exitosa (Re-ejecutar)';
        }
        if (workflowStatusDot) {
          workflowStatusDot.style.background = '#10B981';
          workflowStatusDot.style.boxShadow = '0 0 10px #10B981';
        }
        if (executionStateText) {
          executionStateText.textContent = '✓ Flujo ejecutado con éxito en 449 ms';
          executionStateText.className = 'stat-value text-emerald';
        }
        if (totalExecutionTime) {
          totalExecutionTime.textContent = '449 ms';
        }
      }, 400));
    }, 3150));
  }

  // Reset Workflow UI
  function resetWorkflowUI(clearAll = true) {
    executionTimeoutIds.forEach(id => clearTimeout(id));
    executionTimeoutIds = [];
    isExecuting = false;

    // Reset nodes
    const allNodes = document.querySelectorAll('.flow-node');
    allNodes.forEach(node => {
      node.classList.remove('active-executing', 'success-executing');
    });

    // Reset paths
    const allPaths = document.querySelectorAll('.cable-path');
    allPaths.forEach(p => p.classList.remove('cable-active'));

    // Reset status chips
    const chipConfig = {
      'chip-1': 'Esperando',
      'chip-2': 'Inactivo',
      'chip-3': 'Pendiente',
      'chip-4a': 'Inactivo',
      'chip-5a': 'Inactivo',
      'chip-6a': 'Inactivo',
      'chip-4b': 'Standby'
    };
    for (const [id, label] of Object.entries(chipConfig)) {
      const chip = document.getElementById(id);
      if (chip) {
        chip.textContent = label;
        chip.className = 'node-status-chip';
      }
    }

    // Reset latencies
    ['lat-1', 'lat-2', 'lat-4a', 'lat-5a', 'lat-6a', 'lat-4b'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = '-- ms';
        el.classList.remove('highlight');
      }
    });

    if (clearAll) {
      if (btnRunWorkflow) {
        btnRunWorkflow.classList.remove('running');
        runButtonText.textContent = 'Simular Ejecución';
      }
      if (workflowStatusDot) {
        workflowStatusDot.style.background = '#10B981';
        workflowStatusDot.style.boxShadow = '0 0 8px #10B981';
      }
      if (executionStateText) {
        executionStateText.textContent = 'En espera de ejecución';
        executionStateText.className = 'stat-value text-emerald';
      }
      if (totalExecutionTime) {
        totalExecutionTime.textContent = '0 ms';
      }
    }
  }

  // Event Listeners for Workflow Controls
  if (btnRunWorkflow) {
    btnRunWorkflow.addEventListener('click', runWorkflowSimulation);
  }
  if (btnResetWorkflow) {
    btnResetWorkflow.addEventListener('click', () => resetWorkflowUI(true));
  }

  // Payload Drawer Toggles
  if (btnInspectPayload && payloadDrawer) {
    btnInspectPayload.addEventListener('click', () => {
      payloadDrawer.classList.toggle('open');
    });
  }
  if (closeDrawerBtn && payloadDrawer) {
    closeDrawerBtn.addEventListener('click', () => {
      payloadDrawer.classList.remove('open');
    });
  }

  // Nodes click effect
  const flowNodes = document.querySelectorAll('.flow-node');
  flowNodes.forEach(node => {
    node.addEventListener('click', () => {
      const nodeName = node.querySelector('.node-name')?.textContent || 'Nodo';
      if (payloadDrawer) {
        payloadDrawer.classList.add('open');
      }
    });
  });


  /* ==========================================================================
     2. Copy Commands (Docker Quick Pill & Terminal)
     ========================================================================== */
  const copyDockerBtn = document.getElementById('copyDockerBtn');
  const dockerQuickText = document.getElementById('dockerQuickText');

  if (copyDockerBtn && dockerQuickText) {
    copyDockerBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(dockerQuickText.textContent.trim()).then(() => {
        copyDockerBtn.classList.add('copied');
        copyDockerBtn.querySelector('.copy-text').textContent = '¡Copiado!';
        setTimeout(() => {
          copyDockerBtn.classList.remove('copied');
          copyDockerBtn.querySelector('.copy-text').textContent = 'Copiar';
        }, 2200);
      });
    });
  }


  /* ==========================================================================
     3. Integrations Directory Catalog & Dynamic Filtering
     ========================================================================== */
  const integrationsData = [
    { name: 'Anthropic Claude', category: 'ai', icon: '🧠', desc: 'Conecta Claude 3.7 Sonnet con razonamiento y soporte de MCP.', badge: 'Popular' },
    { name: 'OpenAI GPT-4o', category: 'ai', icon: '🤖', desc: 'Generación de texto, Function Calling y modelos de embeddings.', badge: 'Popular' },
    { name: 'DeepSeek R1', category: 'ai', icon: '⚡', desc: 'Inferencia de razonamiento ultra económica en la nube o local.', badge: 'Nuevo' },
    { name: 'Ollama Local', category: 'ai', icon: '🦙', desc: 'Ejecuta Llama 3 y Mistral en tu propio servidor sin costo de API.', badge: 'Nuevo' },
    { name: 'Hugging Face', category: 'ai', icon: '🤗', desc: 'Acceso a más de 100,000 modelos de NLP, visión y audio.', badge: '' },
    { name: 'Pinecone Vector DB', category: 'ai', icon: '🌲', desc: 'Búsqueda semántica de alta velocidad para aplicaciones RAG.', badge: '' },

    { name: 'PostgreSQL', category: 'db', icon: '🐘', desc: 'Consultas nativas, inserts por lotes y triggers basados en CDC.', badge: 'Popular' },
    { name: 'Supabase', category: 'db', icon: '⚡', desc: 'Autenticación, Storage, Edge Functions y base de datos Postgres.', badge: 'Popular' },
    { name: 'Redis / BullMQ', category: 'db', icon: '🔺', desc: 'Gestión de colas distribuidas, caché de alta velocidad y pub/sub.', badge: '' },
    { name: 'MongoDB', category: 'db', icon: '🍃', desc: 'Almacenamiento NoSQL para documentos JSON no estructurados.', badge: '' },
    { name: 'MySQL', category: 'db', icon: '🐬', desc: 'Integración completa con bases de datos relacionales MySQL/MariaDB.', badge: '' },
    { name: 'ClickHouse', category: 'db', icon: '📊', desc: 'Análisis de datos a escala masiva y métricas en tiempo real.', badge: 'Nuevo' },

    { name: 'Docker Engine', category: 'devops', icon: '🐳', desc: 'Arranca, detiene y orquesta contenedores dinámicamente.', badge: 'Popular' },
    { name: 'GitHub Actions', category: 'devops', icon: '🐙', desc: 'Dispara webhooks en push/PR y automatiza releases.', badge: 'Popular' },
    { name: 'Kubernetes API', category: 'devops', icon: '☸️', desc: 'Monitoreo de pods, escalado dinámico y control de clúster.', badge: '' },
    { name: 'AWS S3 & Lambda', category: 'devops', icon: '☁️', desc: 'Subida de archivos, triggers de buckets y ejecución serverless.', badge: '' },
    { name: 'Cloudflare', category: 'devops', icon: '🛡️', desc: 'Gestión de DNS, purga de caché y Workers de baja latencia.', badge: '' },
    { name: 'GitLab', category: 'devops', icon: '🦊', desc: 'Pipelines CI/CD, control de repositorios e issues.', badge: '' },

    { name: 'Slack Bot API', category: 'comms', icon: '💬', desc: 'Envío de bloques interactivos, modales y alertas en canales.', badge: 'Popular' },
    { name: 'Discord Webhooks', category: 'comms', icon: '🎮', desc: 'Bots comunitarios, anuncios embed y roles automáticos.', badge: '' },
    { name: 'Resend', category: 'comms', icon: '✉️', desc: 'Envío de correos transaccionales con React Email y métricas.', badge: 'Popular' },
    { name: 'Telegram Bot', category: 'comms', icon: '✈️', desc: 'Notificaciones bidireccionales y comandos de chat interactivos.', badge: '' },
    { name: 'Twilio SMS & Voice', category: 'comms', icon: '📱', desc: 'Mensajería SMS, verificación 2FA y llamadas automatizadas.', badge: '' },

    { name: 'Stripe Payments', category: 'crm', icon: '💳', desc: 'Suscripciones, cobros, reembolsos y webhooks de eventos.', badge: 'Popular' },
    { name: 'HubSpot CRM', category: 'crm', icon: '🎯', desc: 'Sincronización de contactos, deals, tickets y pipelines.', badge: 'Popular' },
    { name: 'Notion API', category: 'crm', icon: '📝', desc: 'Crea páginas, actualiza bases de datos y gestiona wikis.', badge: '' },
    { name: 'Google Sheets', category: 'crm', icon: '📗', desc: 'Lectura y escritura en hojas de cálculo compartidas.', badge: '' }
  ];

  const integrationsGrid = document.getElementById('integrationsGrid');
  const searchInput = document.getElementById('integrationSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const catPills = document.querySelectorAll('.cat-pill');

  let activeCategory = 'all';
  let searchTerm = '';

  function renderIntegrations() {
    if (!integrationsGrid) return;

    const filtered = integrationsData.filter(item => {
      const matchCat = (activeCategory === 'all') || (item.category === activeCategory);
      const query = searchTerm.toLowerCase();
      const matchSearch = item.name.toLowerCase().includes(query) ||
                          item.desc.toLowerCase().includes(query) ||
                          item.category.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      integrationsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-dim);">
          <p style="font-size: 1.1rem; margin-bottom: 8px;">No se encontraron conectores para "${searchTerm}"</p>
          <p style="font-size: 0.85rem;">Puedes crear un nodo personalizado con nuestro SDK de TypeScript en pocos minutos.</p>
        </div>
      `;
      return;
    }

    integrationsGrid.innerHTML = filtered.map(item => `
      <div class="integration-card" data-category="${item.category}">
        <div class="int-logo-box">${item.icon}</div>
        <div class="int-info">
          <div class="int-name-row">
            <h4 class="int-name">${item.name}</h4>
            ${item.badge ? `<span class="int-badge ${item.badge === 'Popular' ? 'badge-pop' : 'badge-new'}">${item.badge}</span>` : ''}
          </div>
          <p class="int-desc">${item.desc}</p>
          <span class="int-category-tag">Categoría: ${getCategoryLabel(item.category)}</span>
        </div>
      </div>
    `).join('');
  }

  function getCategoryLabel(cat) {
    const labels = {
      'ai': 'IA & LLMs',
      'db': 'Bases de Datos',
      'devops': 'DevOps & Cloud',
      'comms': 'Comunicación',
      'crm': 'Finanzas & CRM'
    };
    return labels[cat] || cat;
  }

  // Filter pills click
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-category');
      renderIntegrations();
    });
  });

  // Search input events
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim();
      if (clearSearchBtn) {
        clearSearchBtn.style.display = searchTerm ? 'block' : 'none';
      }
      renderIntegrations();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchTerm = '';
        clearSearchBtn.style.display = 'none';
        renderIntegrations();
      }
    });
  }

  // Initial render
  renderIntegrations();


  /* ==========================================================================
     4. Templates Interactive Showcase
     ========================================================================== */
  const templatesData = {
    'rag-support': {
      category: 'Inteligencia Artificial & RAG',
      title: 'Agente de Soporte al Cliente Autónomo con Base de Conocimiento',
      desc: 'Recibe tickets de soporte vía Zendesk o correo, consulta tu base vectorial en Pinecone/Supabase con embeddings de OpenAI, y genera una respuesta precisa utilizando Claude 3.7 con validación humana en Slack antes del envío final.',
      complexity: 'Intermedio',
      setupTime: '~4 minutos',
      nodesCount: '5 nodos',
      nodes: [
        { icon: '📩', name: 'Zendesk / Webhook', type: 'Trigger' },
        { icon: '🧠', name: 'Vector DB Search', type: 'Pinecone / RAG' },
        { icon: '🤖', name: 'Claude 3.7 LLM', type: 'Generación' },
        { icon: '💬', name: 'Aprobación Humana', type: 'Slack Channel' },
        { icon: '✉️', name: 'Respuesta al Usuario', type: 'Email Send' }
      ]
    },
    'stripe-postgres': {
      category: 'Finanzas & Facturación',
      title: 'Sincronización Bidireccional Stripe + PostgreSQL + Alertas MRR',
      desc: 'Escucha eventos de pago exitoso (charge.succeeded), provisiona la licencia en tu base de datos PostgreSQL, actualiza el perfil del cliente en HubSpot y envía un resumen de nuevo MRR a tu canal privado de ventas.',
      complexity: 'Principiante',
      setupTime: '~2 minutos',
      nodesCount: '4 nodos',
      nodes: [
        { icon: '💳', name: 'Stripe Webhook', type: 'Payment Event' },
        { icon: '🐘', name: 'PostgreSQL DB', type: 'Provisioning' },
        { icon: '🎯', name: 'HubSpot CRM', type: 'Contact Update' },
        { icon: '📢', name: 'Slack #mrr-wins', type: 'Celebración' }
      ]
    },
    'devops-healing': {
      category: 'DevOps & SRE',
      title: 'Auto-remediación de Clústeres Kubernetes con Alertas Inteligentes',
      desc: 'Captura alertas de Prometheus o Datadog cuando un Pod entra en CrashLoopBackOff, ejecuta diagnóstico automatizado, reinicia el Deployment de Kubernetes de forma segura y notifica al equipo de guardia con el log del incidente.',
      complexity: 'Avanzado',
      setupTime: '~6 minutos',
      nodesCount: '5 nodos',
      nodes: [
        { icon: '🚨', name: 'Prometheus Alert', type: 'Webhook Trigger' },
        { icon: '🔍', name: 'Pod Logs Fetch', type: 'Kubernetes CLI' },
        { icon: '🤖', name: 'IA Análisis de Causa', type: 'GPT-4o Diagnostic' },
        { icon: '🔄', name: 'Restart Deployment', type: 'K8s Action' },
        { icon: '📟', name: 'PagerDuty / Discord', type: 'Incident Log' }
      ]
    },
    'lead-enrich': {
      category: 'Growth & Automatización de Ventas',
      title: 'Scraping Web, Enriquecimiento de Leads & Scoring con LLMs',
      desc: 'Al registrarse un nuevo usuario, visita automáticamente el dominio web corporativo, extrae las tecnologías utilizadas y el modelo de negocio, evalúa el fit de cliente ideal (ICP) y asigna un ejecutivo de ventas calificado.',
      complexity: 'Intermedio',
      setupTime: '~3 minutos',
      nodesCount: '4 nodos',
      nodes: [
        { icon: '🌐', name: 'Nuevo Signup Form', type: 'Webhook' },
        { icon: '🕷️', name: 'Scraper Headless', type: 'Web Scrape' },
        { icon: '🧠', name: 'Enriquecedor IA', type: 'Claude Analysis' },
        { icon: '📅', name: 'Agendar Cal.com', type: 'Direct Booking' }
      ]
    }
  };

  const templateTabs = document.querySelectorAll('.template-tab');
  const tplCategory = document.getElementById('tplCategory');
  const tplTitle = document.getElementById('tplTitle');
  const tplDesc = document.getElementById('tplDesc');
  const tplComplexity = document.getElementById('tplComplexity');
  const tplSetupTime = document.getElementById('tplSetupTime');
  const tplNodesCount = document.getElementById('tplNodesCount');
  const tplFlowDiagram = document.getElementById('tplFlowDiagram');
  const btnCopyTemplate = document.getElementById('btnCopyTemplate');
  const copyTemplateText = document.getElementById('copyTemplateText');

  let currentTemplateKey = 'rag-support';

  function updateTemplateView(key) {
    const data = templatesData[key];
    if (!data) return;
    currentTemplateKey = key;

    if (tplCategory) tplCategory.textContent = data.category;
    if (tplTitle) tplTitle.textContent = data.title;
    if (tplDesc) tplDesc.textContent = data.desc;
    if (tplComplexity) tplComplexity.textContent = data.complexity;
    if (tplSetupTime) tplSetupTime.textContent = data.setupTime;
    if (tplNodesCount) tplNodesCount.textContent = data.nodesCount;

    if (tplFlowDiagram) {
      tplFlowDiagram.innerHTML = data.nodes.map((node, index) => `
        <div class="tpl-node-box">
          <span class="tpl-node-icon">${node.icon}</span>
          <div class="tpl-node-text">
            <h5>${node.name}</h5>
            <span>${node.type}</span>
          </div>
        </div>
        ${index < data.nodes.length - 1 ? '<span class="tpl-arrow">&rarr;</span>' : ''}
      `).join('');
    }
  }

  templateTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      templateTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const key = tab.getAttribute('data-template');
      updateTemplateView(key);
    });
  });

  // Copy template JSON
  if (btnCopyTemplate) {
    btnCopyTemplate.addEventListener('click', () => {
      const jsonMock = JSON.stringify({
        schema_version: "2.4.0",
        template_id: currentTemplateKey,
        name: templatesData[currentTemplateKey].title,
        nodes: templatesData[currentTemplateKey].nodes
      }, null, 2);

      navigator.clipboard.writeText(jsonMock).then(() => {
        copyTemplateText.textContent = '¡JSON Copiado al Portapapeles!';
        btnCopyTemplate.style.background = 'linear-gradient(135deg, #10B981, #059669)';
        setTimeout(() => {
          copyTemplateText.textContent = 'Copiar JSON del Template';
          btnCopyTemplate.style.background = '';
        }, 2200);
      });
    });
  }

  // Initial load template
  updateTemplateView('rag-support');


  /* ==========================================================================
     5. Self-Hosting Terminal Tabs
     ========================================================================== */
  const terminalTabs = document.querySelectorAll('.t-tab');
  const terminalSnippetCode = document.getElementById('terminalSnippetCode');
  const terminalCopyBtn = document.getElementById('terminalCopyBtn');
  const terminalCopyText = document.getElementById('terminalCopyText');

  const terminalSnippets = {
    'docker': `# 1. Inicia NEXO con almacenamiento persistente
docker run -d \\
  --name nexo \\
  -p 5678:5678 \\
  -e ENCRYPTION_KEY="generar_clave_segura_aqui" \\
  -e WEBHOOK_URL="https://nexus.tu-dominio.com/" \\
  -v ~/.nexo_data:/data \\
  --restart unless-stopped \\
  nexo/nexo:latest

# 2. Accede a tu interfaz gráfica en: http://localhost:5678`,

    'compose': `# docker-compose.yml para producción con PostgreSQL y Redis
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: nexo
      POSTGRES_USER: nexo
      POSTGRES_PASSWORD: secretpassword
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes

  nexo:
    image: nexo/nexo:latest
    restart: always
    ports:
      - "5678:5678"
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:`,

    'helm': `# Despliegue en Kubernetes mediante Helm Chart
# 1. Añade el repositorio oficial de NEXO
helm repo add nexo https://charts.nexo.io
helm repo update

# 2. Instala el clúster con alta disponibilidad
helm install nexo-cluster nexo/nexo \\
  --set replicaCount=3 \\
  --set postgresql.enabled=true \\
  --set redis.enabled=true \\
  --set ingress.enabled=true \\
  --set ingress.hosts[0].host="nexus.empresa.com"`,

    'cli': `# Instalación mediante CLI de NEXO
npm install -g @nexo/cli

# Inicia un entorno local en modo desarrollo
nexo init mi-proyecto-automatizacion
cd mi-proyecto-automatizacion
nexo start --tunnel

# Importa tus flujos existentes de n8n
nexo import --source n8n ./workflows_antiguos.json`
  };

  terminalTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      terminalTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const type = tab.getAttribute('data-type');
      if (terminalSnippetCode && terminalSnippets[type]) {
        terminalSnippetCode.textContent = terminalSnippets[type];
      }
    });
  });

  if (terminalCopyBtn && terminalSnippetCode) {
    terminalCopyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(terminalSnippetCode.textContent.trim()).then(() => {
        terminalCopyText.textContent = '¡Copiado!';
        setTimeout(() => {
          terminalCopyText.textContent = 'Copiar';
        }, 2000);
      });
    });
  }


  /* ==========================================================================
     6. Pricing Billing Switch (Monthly / Annual)
     ========================================================================== */
  const billingToggle = document.getElementById('billingToggle');
  const monthlyLabel = document.getElementById('monthlyLabel');
  const annualLabel = document.getElementById('annualLabel');
  const proPriceAmount = document.getElementById('proPriceAmount');
  const proPricePeriod = document.getElementById('proPricePeriod');

  let isAnnual = true;

  function updatePricing() {
    if (!billingToggle) return;
    if (isAnnual) {
      billingToggle.classList.add('annual');
      if (monthlyLabel) monthlyLabel.classList.remove('active');
      if (annualLabel) annualLabel.classList.add('active');
      if (proPriceAmount) proPriceAmount.textContent = '19';
      if (proPricePeriod) proPricePeriod.textContent = '/mes (facturado anualmente)';
    } else {
      billingToggle.classList.remove('annual');
      if (monthlyLabel) monthlyLabel.classList.add('active');
      if (annualLabel) annualLabel.classList.remove('active');
      if (proPriceAmount) proPriceAmount.textContent = '24';
      if (proPricePeriod) proPricePeriod.textContent = '/mes (facturado mensualmente)';
    }
  }

  if (billingToggle) {
    billingToggle.addEventListener('click', () => {
      isAnnual = !isAnnual;
      updatePricing();
    });
  }
  if (monthlyLabel) {
    monthlyLabel.addEventListener('click', () => {
      isAnnual = false;
      updatePricing();
    });
  }
  if (annualLabel) {
    annualLabel.addEventListener('click', () => {
      isAnnual = true;
      updatePricing();
    });
  }
  updatePricing();


  /* ==========================================================================
     7. FAQ Accordion
     ========================================================================== */
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');
  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close all others
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.accordion-trigger')?.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isExpanded) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* ==========================================================================
     8. Newsletter & Mobile Menu
     ========================================================================== */
  const newsletterBtn = document.getElementById('newsletterBtn');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterFeedback = document.getElementById('newsletterFeedback');

  if (newsletterBtn && newsletterEmail && newsletterFeedback) {
    newsletterBtn.addEventListener('click', () => {
      const val = newsletterEmail.value.trim();
      if (val && val.includes('@')) {
        newsletterFeedback.textContent = '¡Gracias! Te has suscrito exitosamente al boletín de ingeniería.';
        newsletterFeedback.style.color = '#34D399';
        newsletterEmail.value = '';
        setTimeout(() => {
          newsletterFeedback.textContent = '';
        }, 5000);
      } else {
        newsletterFeedback.textContent = 'Por favor, ingresa un correo electrónico válido.';
        newsletterFeedback.style.color = '#F87171';
      }
    });
  }

  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });

    // Close menu when clicking link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  // Smooth scroll offset calculation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});
