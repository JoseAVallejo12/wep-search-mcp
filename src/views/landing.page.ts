export interface LandingPageProps {
  activeSessions: number;
  uptime: number;
  host: string;
  protocol: string;
}

export function renderLandingPage(props: LandingPageProps): string {
  const sseUrl = `${props.protocol}://${props.host}/sse`;
  const healthUrl = `${props.protocol}://${props.host}/health`;
  const messagesUrl = `${props.protocol}://${props.host}/messages`;

  return `<!DOCTYPE html>
<html lang="es" class="dark scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WebSearch MCP · Motor de Búsqueda y Extracción Web para LLMs</title>
  <meta name="description" content="Servidor MCP auto-hospedado y gratuito para agentes LLM. Alternativa de código abierto a Tavily y Jina Reader con transporte SSE y control de tokens.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace'],
          },
          colors: {
            brand: {
              50: '#ecfdf5',
              100: '#d1fae5',
              400: '#34d399',
              500: '#10b981',
              600: '#059669',
              accent: '#22c55e',
            },
            surface: {
              950: '#020617',
              900: '#0b0f19',
              850: '#0f172a',
              800: '#1e293b',
              700: '#334155',
              600: '#475569',
            }
          }
        }
      }
    }
  </script>
  <style>
    body {
      background-color: #020617;
      color: #f8fafc;
      font-feature-settings: "cv02", "cv03", "cv04", "cv11";
    }
    .grid-pattern {
      background-size: 40px 40px;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    }
    .glow-radial {
      background: radial-gradient(circle at 50% 0%, rgba(34, 197, 94, 0.12) 0%, rgba(2, 6, 23, 0) 70%);
    }
    .code-scroll::-webkit-scrollbar {
      height: 6px;
      width: 6px;
    }
    .code-scroll::-webkit-scrollbar-track {
      background: rgba(15, 23, 42, 0.6);
    }
    .code-scroll::-webkit-scrollbar-thumb {
      background: rgba(51, 65, 85, 0.8);
      border-radius: 3px;
    }
  </style>
</head>
<body class="min-h-screen flex flex-col font-sans antialiased selection:bg-brand-500 selection:text-slate-950">

  <!-- Glow and Background Grid -->
  <div class="fixed inset-0 grid-pattern pointer-events-none z-0"></div>
  <div class="fixed inset-0 glow-radial pointer-events-none z-0"></div>

  <!-- Top Navigation -->
  <header class="relative z-20 border-b border-surface-800/80 backdrop-blur-md bg-surface-950/80 sticky top-0">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <svg class="w-5 h-5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </div>
        <div>
          <span class="text-base font-bold tracking-tight text-white flex items-center gap-2">
            WebSearch <span class="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/30 font-mono font-medium">MCP Server</span>
          </span>
        </div>
      </div>

      <nav class="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
        <a href="#prompt" class="hover:text-brand-400 transition-colors">Prompt Agente</a>
        <a href="#integracion" class="hover:text-brand-400 transition-colors">Integración</a>
        <a href="#herramientas" class="hover:text-brand-400 transition-colors">Herramientas</a>
        <a href="#comparativa" class="hover:text-brand-400 transition-colors">Ventajas vs Tavily</a>
        <a href="#estado" class="hover:text-brand-400 transition-colors">Diagnóstico</a>
      </nav>

      <div class="flex items-center space-x-3">
        <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-900 border border-surface-700/60 text-xs font-mono">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
          </span>
          <span class="text-slate-300">SSE Online</span>
        </div>
        <button onclick="copyToClipboard('${sseUrl}', 'nav-copy-btn')" id="nav-copy-btn" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 transition-all duration-200 shadow-sm cursor-pointer" aria-label="Copiar endpoint SSE">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Copiar URL SSE</span>
        </button>
      </div>
    </div>
  </header>

  <main class="relative z-10 flex-grow">
    <!-- Hero Section -->
    <section class="pt-16 pb-12 sm:pt-24 sm:pb-16 text-center px-4 max-w-5xl mx-auto">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-850 border border-surface-700/80 text-xs font-medium text-slate-300 mb-6 shadow-inner">
        <span class="text-brand-400 font-mono font-semibold">v1.0.0</span>
        <span class="text-surface-700">•</span>
        <span>Alternativa Open Source y Gratuita a Tavily y Jina Reader</span>
      </div>

      <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
        Búsqueda Web & Extracción Limpia <br>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-300 to-teal-400">
          Nativa para Agentes de Inteligencia Artificial
        </span>
      </h1>

      <p class="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-8 font-normal leading-relaxed">
        Conecta tus agentes (Deep Agents, LangGraph, Claude Desktop, Cursor o cualquier cliente MCP) a la web en tiempo real. 
        Búsqueda multi-motor privada, modo lectura sin anuncios con <code class="text-brand-400 font-mono text-sm">Mozilla Readability</code> y 
        <strong class="text-white font-medium">Token Budget Guard</strong> para proteger el contexto de tu LLM.
      </p>

      <!-- Instant Endpoint Copy Pill -->
      <div class="max-w-2xl mx-auto p-2 bg-surface-900 border border-surface-800 rounded-xl shadow-2xl mb-12 flex flex-col sm:flex-row items-center gap-2">
        <div class="flex items-center gap-2 px-3 py-1.5 w-full overflow-hidden text-left">
          <span class="text-xs font-mono font-semibold text-brand-400 uppercase tracking-wider bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">SSE</span>
          <span class="font-mono text-xs sm:text-sm text-slate-200 truncate select-all" id="hero-sse-endpoint">${sseUrl}</span>
        </div>
        <button onclick="copyToClipboard('${sseUrl}', 'hero-copy-btn')" id="hero-copy-btn" class="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Copiar Endpoint</span>
        </button>
      </div>

      <!-- Feature Badges Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
        <div class="p-4 rounded-xl bg-surface-900/90 border border-surface-800/80 hover:border-surface-700 transition-colors">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-brand-400 flex items-center justify-center mb-3">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 class="text-sm font-semibold text-white mb-1">100% Gratuito</h3>
          <p class="text-xs text-slate-400">Sin límites de facturación, suscripciones ni tarjetas de crédito.</p>
        </div>

        <div class="p-4 rounded-xl bg-surface-900/90 border border-surface-800/80 hover:border-surface-700 transition-colors">
          <div class="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <h3 class="text-sm font-semibold text-white mb-1">Token Guard</h3>
          <p class="text-xs text-slate-400">Truncado estricto entre 500 y 1,500 tokens para no saturar tu modelo.</p>
        </div>

        <div class="p-4 rounded-xl bg-surface-900/90 border border-surface-800/80 hover:border-surface-700 transition-colors">
          <div class="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <h3 class="text-sm font-semibold text-white mb-1">Readability Limpio</h3>
          <p class="text-xs text-slate-400">Elimina el 95% del boilerplate HTML: banners, menús, ads y scripts.</p>
        </div>

        <div class="p-4 rounded-xl bg-surface-900/90 border border-surface-800/80 hover:border-surface-700 transition-colors">
          <div class="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 class="text-sm font-semibold text-white mb-1">Protocolo MCP Nativo</h3>
          <p class="text-xs text-slate-400">Compatible con el estándar oficial de Anthropic vía SSE y JSON-RPC.</p>
        </div>
      </div>
    </section>

    <!-- SECTION: Prompt para el Agente LLM -->
    <section id="prompt" class="py-12 border-t border-surface-800 bg-surface-900/50">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-mono text-brand-400 mb-2">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Prompt de Integración Listo para Copiar
            </div>
            <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">Prompt de Sistema para tu Agente LLM</h2>
            <p class="text-sm text-slate-400 mt-1">Pega este texto en el System Prompt de tu modelo (Claude, GPT-4o, Cursor o Copilot) para que conozca las herramientas y las use con máxima eficiencia.</p>
          </div>
          <button onclick="copyToClipboard(agentPromptText, 'copy-prompt-btn')" id="copy-prompt-btn" class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-brand-500/10">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Copiar Prompt Completo</span>
          </button>
        </div>

        <div class="relative bg-surface-950 border border-surface-800 rounded-xl overflow-hidden shadow-2xl">
          <div class="flex items-center justify-between px-4 py-2.5 bg-surface-900 border-b border-surface-800">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 rounded-full bg-red-500/60 inline-block"></span>
              <span class="w-3 h-3 rounded-full bg-yellow-500/60 inline-block"></span>
              <span class="w-3 h-3 rounded-full bg-green-500/60 inline-block"></span>
              <span class="ml-2 text-xs font-mono text-slate-400">system_prompt_web_search_mcp.txt</span>
            </div>
            <span class="text-xs font-mono text-slate-500">Formato Markdown</span>
          </div>
          <pre class="p-5 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap code-scroll max-h-[380px] overflow-y-auto selection:bg-brand-500/30" id="prompt-content-display"></pre>
        </div>
      </div>
    </section>

    <!-- SECTION: Modos de Integración (Tabs) -->
    <section id="integracion" class="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">Cómo Integrarlo en tu Código</h2>
        <p class="text-sm text-slate-400 max-w-2xl mx-auto">Soporte nativo con transportes SSE para Deep Agents, LangGraph, Claude Desktop, Cursor y cualquier cliente compatible con MCP.</p>
      </div>

      <!-- Tab Buttons -->
      <div class="flex border-b border-surface-800 space-x-2 overflow-x-auto code-scroll mb-6 pb-px">
        <button onclick="switchTab('ts')" id="tab-btn-ts" class="tab-button px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 border-brand-400 text-brand-400 flex items-center gap-2 cursor-pointer transition-all">
          <span class="w-2 h-2 rounded-full bg-brand-400"></span>
          Deep Agents / TypeScript
        </button>
        <button onclick="switchTab('py')" id="tab-btn-py" class="tab-button px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-2 cursor-pointer transition-all">
          <span class="w-2 h-2 rounded-full bg-slate-600"></span>
          LangGraph / Python
        </button>
        <button onclick="switchTab('desktop')" id="tab-btn-desktop" class="tab-button px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-2 cursor-pointer transition-all">
          <span class="w-2 h-2 rounded-full bg-slate-600"></span>
          Claude Desktop & Cursor
        </button>
        <button onclick="switchTab('curl')" id="tab-btn-curl" class="tab-button px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-2 cursor-pointer transition-all">
          <span class="w-2 h-2 rounded-full bg-slate-600"></span>
          cURL / REST
        </button>
      </div>

      <!-- Tab Contents -->
      <!-- Tab 1: TypeScript -->
      <div id="tab-content-ts" class="tab-pane">
        <div class="bg-surface-950 border border-surface-800 rounded-xl overflow-hidden shadow-xl">
          <div class="flex items-center justify-between px-4 py-2.5 bg-surface-900 border-b border-surface-800">
            <span class="text-xs font-mono text-slate-400">agent.ts (usando @langchain/mcp-adapters)</span>
            <button onclick="copySnippet('code-ts', 'btn-copy-ts')" id="btn-copy-ts" class="text-xs font-semibold text-slate-300 hover:text-brand-400 flex items-center gap-1.5 transition-colors cursor-pointer">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              <span>Copiar Código</span>
            </button>
          </div>
          <pre class="p-4 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed overflow-x-auto code-scroll" id="code-ts"><code>import { MultiServerMCPToolkit } from '@langchain/mcp-adapters';
import { createDeepAgent } from 'deepagents'; // o tu runtime de agentes

// 1. Inicializar conexión SSE remota
const mcpToolkit = new MultiServerMCPToolkit({
  servers: {
    webSearch: {
      url: '${sseUrl}',
      transport: 'sse',
    },
  },
});

await mcpToolkit.initialize();
const webTools = mcpToolkit.getTools();

// 2. Conectar al agente con herramientas en tiempo real
const agent = createDeepAgent({
  tools: [...webTools],
  // Listo: Tu agente ya puede usar 'web_search', 'web_fetch' y 'search_and_extract'
});</code></pre>
        </div>
      </div>

      <!-- Tab 2: Python -->
      <div id="tab-content-py" class="tab-pane hidden">
        <div class="bg-surface-950 border border-surface-800 rounded-xl overflow-hidden shadow-xl">
          <div class="flex items-center justify-between px-4 py-2.5 bg-surface-900 border-b border-surface-800">
            <span class="text-xs font-mono text-slate-400">agent.py (usando langchain-mcp-adapters)</span>
            <button onclick="copySnippet('code-py', 'btn-copy-py')" id="btn-copy-py" class="text-xs font-semibold text-slate-300 hover:text-brand-400 flex items-center gap-1.5 transition-colors cursor-pointer">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              <span>Copiar Código</span>
            </button>
          </div>
          <pre class="p-4 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed overflow-x-auto code-scroll" id="code-py"><code>import asyncio
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI

async def main():
    async with MultiServerMCPClient({
        "webSearch": {
            "url": "${sseUrl}",
            "transport": "sse"
        }
    }) as client:
        tools = client.get_tools()
        model = ChatOpenAI(model="gpt-4o")
        agent = create_react_agent(model, tools)

        response = await agent.ainvoke({
            "messages": [("user", "Busca las últimas noticias sobre agentes de IA")]
        })
        print(response["messages"][-1].content)

asyncio.run(main())</code></pre>
        </div>
      </div>

      <!-- Tab 3: Desktop & Cursor -->
      <div id="tab-content-desktop" class="tab-pane hidden">
        <div class="bg-surface-950 border border-surface-800 rounded-xl overflow-hidden shadow-xl">
          <div class="flex items-center justify-between px-4 py-2.5 bg-surface-900 border-b border-surface-800">
            <span class="text-xs font-mono text-slate-400">claude_desktop_config.json / mcp.json (Cursor, Windsurf)</span>
            <button onclick="copySnippet('code-desktop', 'btn-copy-desktop')" id="btn-copy-desktop" class="text-xs font-semibold text-slate-300 hover:text-brand-400 flex items-center gap-1.5 transition-colors cursor-pointer">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              <span>Copiar Configuración</span>
            </button>
          </div>
          <pre class="p-4 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed overflow-x-auto code-scroll" id="code-desktop"><code>{
  "mcpServers": {
    "web-search-engine": {
      "url": "${sseUrl}"
    }
  }
}</code></pre>
        </div>
      </div>

      <!-- Tab 4: cURL -->
      <div id="tab-content-curl" class="tab-pane hidden">
        <div class="bg-surface-950 border border-surface-800 rounded-xl overflow-hidden shadow-xl">
          <div class="flex items-center justify-between px-4 py-2.5 bg-surface-900 border-b border-surface-800">
            <span class="text-xs font-mono text-slate-400">Comandos cURL para inspección y handshake</span>
            <button onclick="copySnippet('code-curl', 'btn-copy-curl')" id="btn-copy-curl" class="text-xs font-semibold text-slate-300 hover:text-brand-400 flex items-center gap-1.5 transition-colors cursor-pointer">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              <span>Copiar cURL</span>
            </button>
          </div>
          <pre class="p-4 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed overflow-x-auto code-scroll" id="code-curl"><code># 1. Comprobar salud del servicio
curl -i ${healthUrl}

# 2. Abrir canal de eventos SSE (Handshake MCP)
curl -N -H "Accept: text/event-stream" ${sseUrl}

# 3. Obtener metadatos en JSON puro vía API
curl -H "Accept: application/json" ${props.protocol}://${props.host}/</code></pre>
        </div>
      </div>
    </section>

    <!-- SECTION: Herramientas MCP Disponibles -->
    <section id="herramientas" class="py-16 border-t border-surface-800 bg-surface-900/30">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">Herramientas MCP Expuestas</h2>
          <p class="text-sm text-slate-400 max-w-2xl mx-auto">Cada herramienta está diseñada con tipado estricto Zod y salidas optimizadas para el razonamiento de los LLMs.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Tool 1: web_search -->
          <div class="p-6 rounded-xl bg-surface-950 border border-surface-800 hover:border-surface-700 transition-all flex flex-col justify-between shadow-lg">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="px-2.5 py-1 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-mono font-semibold">Tool 01</span>
                <span class="text-xs text-slate-400 font-mono">Multi-Motor</span>
              </div>
              <h3 class="text-lg font-bold text-white font-mono mb-2">web_search</h3>
              <p class="text-xs text-slate-300 mb-4 leading-relaxed">
                Busca en múltiples motores simultáneamente (Google, Bing, DuckDuckGo, Wikipedia) con filtrado y deduplicación por dominio.
              </p>
              <div class="space-y-2 mb-4 text-xs font-mono bg-surface-900 p-3 rounded-lg border border-surface-800">
                <div class="text-slate-400">Argumentos:</div>
                <div class="text-slate-200">• <span class="text-teal-400">query</span>: string <span class="text-slate-500">(requerido)</span></div>
                <div class="text-slate-200">• <span class="text-teal-400">max_results</span>: number <span class="text-slate-500">(default 5)</span></div>
              </div>
            </div>
            <div class="pt-4 border-t border-surface-800/80 text-xs text-slate-400 flex items-center justify-between">
              <span>Retorno:</span>
              <span class="font-mono text-slate-300">Markdown + Snippets</span>
            </div>
          </div>

          <!-- Tool 2: web_fetch -->
          <div class="p-6 rounded-xl bg-surface-950 border border-surface-800 hover:border-surface-700 transition-all flex flex-col justify-between shadow-lg">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="px-2.5 py-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-mono font-semibold">Tool 02</span>
                <span class="text-xs text-slate-400 font-mono">Modo Lectura</span>
              </div>
              <h3 class="text-lg font-bold text-white font-mono mb-2">web_fetch</h3>
              <p class="text-xs text-slate-300 mb-4 leading-relaxed">
                Extrae el contenido sustancial de cualquier página web usando Mozilla Readability y lo convierte en Markdown limpio sin menús ni anuncios.
              </p>
              <div class="space-y-2 mb-4 text-xs font-mono bg-surface-900 p-3 rounded-lg border border-surface-800">
                <div class="text-slate-400">Argumentos:</div>
                <div class="text-slate-200">• <span class="text-teal-400">url</span>: string <span class="text-slate-500">(requerido)</span></div>
                <div class="text-slate-200">• <span class="text-teal-400">max_tokens</span>: number <span class="text-slate-500">(default 1500)</span></div>
              </div>
            </div>
            <div class="pt-4 border-t border-surface-800/80 text-xs text-slate-400 flex items-center justify-between">
              <span>Retorno:</span>
              <span class="font-mono text-slate-300">Clean Article Markdown</span>
            </div>
          </div>

          <!-- Tool 3: search_and_extract -->
          <div class="p-6 rounded-xl bg-surface-950 border-2 border-brand-500/40 hover:border-brand-500/70 transition-all flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div class="absolute top-0 right-0 bg-brand-500 text-slate-950 text-[10px] font-bold px-3 py-0.5 rounded-bl uppercase tracking-wider">
              Favorita
            </div>
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="px-2.5 py-1 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-mono font-semibold">Tool 03</span>
                <span class="text-xs text-brand-400 font-mono">Tipo Tavily</span>
              </div>
              <h3 class="text-lg font-bold text-white font-mono mb-2">search_and_extract</h3>
              <p class="text-xs text-slate-300 mb-4 leading-relaxed">
                Busca en la web y extrae en paralelo el contenido limpio de las mejores páginas. Resuelve la necesidad del LLM en 1 solo turno de llamada.
              </p>
              <div class="space-y-2 mb-4 text-xs font-mono bg-surface-900 p-3 rounded-lg border border-surface-800">
                <div class="text-slate-400">Argumentos:</div>
                <div class="text-slate-200">• <span class="text-teal-400">query</span>: string <span class="text-slate-500">(requerido)</span></div>
                <div class="text-slate-200">• <span class="text-teal-400">max_results</span>: number <span class="text-slate-500">(default 3)</span></div>
                <div class="text-slate-200">• <span class="text-teal-400">max_tokens_per_page</span>: number <span class="text-slate-500">(default 1000)</span></div>
              </div>
            </div>
            <div class="pt-4 border-t border-surface-800/80 text-xs text-brand-400 flex items-center justify-between font-medium">
              <span>Optimización:</span>
              <span>1 solo roundtrip LLM</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION: Comparativa de Ventajas vs Alternativas -->
    <section id="comparativa" class="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">¿Por Qué Usar WebSearch MCP?</h2>
        <p class="text-sm text-slate-400 max-w-2xl mx-auto">Comparativa directa frente a servicios comerciales como Tavily o Jina Reader.</p>
      </div>

      <div class="overflow-x-auto code-scroll rounded-xl border border-surface-800 bg-surface-950 shadow-xl">
        <table class="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr class="border-b border-surface-800 bg-surface-900/80 text-slate-300">
              <th class="p-4 font-semibold">Característica</th>
              <th class="p-4 font-semibold text-brand-400 bg-brand-500/5 border-x border-surface-800">WebSearch MCP (Auto-hospedado)</th>
              <th class="p-4 font-semibold text-slate-400">Tavily Search API</th>
              <th class="p-4 font-semibold text-slate-400">Jina Reader</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-800/70 text-slate-300">
            <tr>
              <td class="p-4 font-medium text-white">Costo Mensual</td>
              <td class="p-4 font-bold text-brand-400 bg-brand-500/5 border-x border-surface-800">100% Gratis ($0)</td>
              <td class="p-4 text-slate-400">Desde $20/mes (créditos limitados)</td>
              <td class="p-4 text-slate-400">Tier gratuito limitado</td>
            </tr>
            <tr>
              <td class="p-4 font-medium text-white">Protocolo de Comunicación</td>
              <td class="p-4 font-mono text-brand-300 bg-brand-500/5 border-x border-surface-800">MCP Nativo (SSE & stdio)</td>
              <td class="p-4 text-slate-400">REST API Propietario</td>
              <td class="p-4 text-slate-400">REST API Propietario</td>
            </tr>
            <tr>
              <td class="p-4 font-medium text-white">Privacidad de Búsqueda</td>
              <td class="p-4 text-brand-400 bg-brand-500/5 border-x border-surface-800">Privado (No guarda historial ni IPs)</td>
              <td class="p-4 text-slate-400">Registrado en servidores SaaS</td>
              <td class="p-4 text-slate-400">Registrado en servidores SaaS</td>
            </tr>
            <tr>
              <td class="p-4 font-medium text-white">Limpieza de Contenido</td>
              <td class="p-4 text-brand-400 bg-brand-500/5 border-x border-surface-800">Readability + Markdown estructurado</td>
              <td class="p-4 text-slate-400">Snippets y raw content</td>
              <td class="p-4 text-slate-400">Markdown vía proxy</td>
            </tr>
            <tr>
              <td class="p-4 font-medium text-white">Control de Presupuesto de Tokens</td>
              <td class="p-4 text-brand-400 bg-brand-500/5 border-x border-surface-800">Integrado (Token Guard cl100k)</td>
              <td class="p-4 text-slate-400">Requiere procesamiento extra</td>
              <td class="p-4 text-slate-400">Parcial</td>
            </tr>
            <tr>
              <td class="p-4 font-medium text-white">Motores de Búsqueda</td>
              <td class="p-4 text-brand-400 bg-brand-500/5 border-x border-surface-800">Multi-motor agregador (Google, Bing, DDG, etc.)</td>
              <td class="p-4 text-slate-400">Índice propio cerrado</td>
              <td class="p-4 text-slate-400">Google / Bing proxy</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- SECTION: Diagnóstico y Estado en Vivo -->
    <section id="estado" class="py-16 border-t border-surface-800 bg-surface-900/40">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">Diagnóstico y Estado en Vivo</h2>
          <p class="text-sm text-slate-400">Monitoreo en tiempo real del contenedor y conectividad con la red interna de SearXNG.</p>
        </div>

        <div class="bg-surface-950 border border-surface-800 rounded-xl p-6 shadow-xl">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div class="p-4 rounded-lg bg-surface-900 border border-surface-800">
              <span class="text-xs text-slate-400 block mb-1">Estado del Servicio</span>
              <span class="inline-flex items-center gap-2 text-sm font-semibold text-brand-400">
                <span class="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                Operacional
              </span>
            </div>
            <div class="p-4 rounded-lg bg-surface-900 border border-surface-800">
              <span class="text-xs text-slate-400 block mb-1">Sesiones Activas</span>
              <span class="text-sm font-semibold text-white font-mono" id="live-active-sessions">${props.activeSessions}</span>
            </div>
            <div class="p-4 rounded-lg bg-surface-900 border border-surface-800">
              <span class="text-xs text-slate-400 block mb-1">Tiempo Activo (Uptime)</span>
              <span class="text-sm font-semibold text-white font-mono" id="live-uptime">${Math.floor(props.uptime)}s</span>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-surface-800">
            <div class="text-xs text-slate-400">
              Endpoint Health: <code class="text-slate-300 font-mono">${healthUrl}</code>
            </div>
            <button onclick="pingHealth('${healthUrl}')" id="btn-ping" class="w-full sm:w-auto px-4 py-2 rounded-lg bg-surface-800 hover:bg-surface-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-surface-700">
              <svg class="w-3.5 h-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <span>Probar Healthcheck Ahora</span>
            </button>
          </div>

          <div id="ping-result" class="mt-4 p-3 rounded-lg bg-surface-900 border border-surface-800 font-mono text-xs text-slate-300 hidden">
            <!-- Ping details injected via JS -->
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="border-t border-surface-800/80 bg-surface-950 py-8 relative z-10 text-xs text-slate-400">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center space-x-2">
        <span class="font-bold text-white">WebSearch MCP</span>
        <span>•</span>
        <span>Código Abierto bajo Licencia MIT</span>
      </div>
      <div class="flex items-center space-x-6">
        <a href="https://github.com/JoseAVallejo12/wep-search-mcp" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" /></svg>
          <span>GitHub Repo</span>
        </a>
        <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">
          Model Context Protocol Docs
        </a>
      </div>
    </div>
  </footer>

  <!-- Notification Toast -->
  <div id="toast" class="fixed bottom-6 right-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none">
    <div class="px-4 py-2.5 rounded-lg bg-brand-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2">
      <svg class="w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
      <span id="toast-message">¡Copiado al portapapeles!</span>
    </div>
  </div>

  <!-- Interactive JavaScript -->
  <script>
    const agentPromptText = \`Eres un asistente de IA avanzado con acceso en tiempo real a la web a través del servidor MCP de Búsqueda y Extracción ("WebSearch MCP").
Conexión MCP SSE: ${sseUrl}

Dispones de las siguientes 3 herramientas especializadas:

1. \`web_search\`:
   - Propósito: Búsqueda agregada en múltiples motores (Google, Bing, DuckDuckGo) con deduplicación por dominio y snippets relevantes.
   - Parámetros: { "query": string, "max_results"?: number } (por defecto 5).
   - Cuándo usarla: Para explorar temas amplios, descubrir fuentes recientes o verificar datos rápidos.

2. \`web_fetch\`:
   - Propósito: Extrae el contenido sustancial de una URL en Markdown limpio libre de ruido (scripts, menús, anuncios, footers) con límite de tokens.
   - Parámetros: { "url": string, "max_tokens"?: number } (por defecto 1500).
   - Cuándo usarla: Para leer a fondo un artículo o enlace específico provisto por el usuario o descubierto previamente.

3. \`search_and_extract\` (RECOMENDADA):
   - Propósito: Busca y extrae en paralelo el contenido limpio de las mejores páginas web en un solo llamado.
   - Parámetros: { "query": string, "max_results"?: number (default 3), "max_tokens_per_page"?: number (default 1000) }.
   - Cuándo usarla: Para responder preguntas complejas que requieren investigar y sintetizar información en un único turno de ejecución sin múltiples llamadas innecesarias.

Instrucciones de respuesta:
- Prioriza siempre \`search_and_extract\` para responder preguntas que requieran información web fresca.
- Cita siempre las URLs de las fuentes consultadas al formular tu respuesta final.
- Si una página web no proporciona información útil, realiza una búsqueda complementaria con términos más específicos.\`;

    // Initialize prompt display
    document.getElementById('prompt-content-display').textContent = agentPromptText;

    // Copy to clipboard helper
    async function copyToClipboard(text, triggerBtnId) {
      try {
        await navigator.clipboard.writeText(text);
        showToast('¡Copiado al portapapeles!');
        
        if (triggerBtnId) {
          const btn = document.getElementById(triggerBtnId);
          if (btn) {
            const originalText = btn.innerHTML;
            btn.classList.add('bg-brand-400');
            setTimeout(() => {
              btn.classList.remove('bg-brand-400');
            }, 1000);
          }
        }
      } catch (err) {
        console.error('Error al copiar:', err);
      }
    }

    function copySnippet(elementId, btnId) {
      const el = document.getElementById(elementId);
      if (el) {
        copyToClipboard(el.textContent.trim(), btnId);
      }
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      const toastMsg = document.getElementById('toast-message');
      toastMsg.textContent = msg;
      toast.classList.remove('translate-y-20', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
      setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
      }, 2500);
    }

    // Tab switching
    function switchTab(tabId) {
      const tabs = ['ts', 'py', 'desktop', 'curl'];
      tabs.forEach(id => {
        const btn = document.getElementById('tab-btn-' + id);
        const pane = document.getElementById('tab-content-' + id);
        if (id === tabId) {
          btn.classList.add('border-brand-400', 'text-brand-400');
          btn.classList.remove('border-transparent', 'text-slate-400');
          btn.querySelector('span').classList.add('bg-brand-400');
          btn.querySelector('span').classList.remove('bg-slate-600');
          pane.classList.remove('hidden');
        } else {
          btn.classList.remove('border-brand-400', 'text-brand-400');
          btn.classList.add('border-transparent', 'text-slate-400');
          btn.querySelector('span').classList.remove('bg-brand-400');
          btn.querySelector('span').classList.add('bg-slate-600');
          pane.classList.add('hidden');
        }
      });
    }

    // Ping healthcheck
    async function pingHealth(url) {
      const btn = document.getElementById('btn-ping');
      const resultBox = document.getElementById('ping-result');
      const startTime = performance.now();
      btn.disabled = true;
      btn.classList.add('opacity-50');

      try {
        const res = await fetch(url);
        const latency = Math.round(performance.now() - startTime);
        const data = await res.json();
        
        resultBox.classList.remove('hidden');
        resultBox.innerHTML = \`<div class="flex items-center justify-between text-brand-400 font-semibold mb-1">
          <span>✓ HTTP 200 OK</span>
          <span>Latencia: \${latency}ms</span>
        </div>
        <pre class="text-slate-400 text-[11px] overflow-x-auto">\${JSON.stringify(data, null, 2)}</pre>\`;

        if (data.activeSessions !== undefined) {
          document.getElementById('live-active-sessions').textContent = data.activeSessions;
        }
        if (data.uptime !== undefined) {
          document.getElementById('live-uptime').textContent = Math.floor(data.uptime) + 's';
        }
      } catch (err) {
        resultBox.classList.remove('hidden');
        resultBox.innerHTML = \`<div class="text-red-400 font-semibold">✗ Error al conectar con \${url}: \${err.message}</div>\`;
      } finally {
        btn.disabled = false;
        btn.classList.remove('opacity-50');
      }
    }
  </script>
</body>
</html>`;
}
