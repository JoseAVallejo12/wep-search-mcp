import React, { useState } from 'react';
import { CodeBlock } from './CodeBlock';
import { Layers, FileCode2, Terminal as TerminalIcon, Settings } from 'lucide-react';

interface IntegrationTabsProps {
  sseUrl: string;
  healthUrl: string;
  baseUrl: string;
}

export const IntegrationTabs: React.FC<IntegrationTabsProps> = ({ sseUrl, healthUrl, baseUrl }) => {
  const [activeTab, setActiveTab] = useState<'ts' | 'py' | 'desktop' | 'curl'>('ts');

  const tsCode = `import { MultiServerMCPToolkit } from '@langchain/mcp-adapters';
import { createDeepAgent } from 'deepagents'; // o tu harness de agentes

// 1. Inicializar conexión MCP remota vía SSE
const mcpToolkit = new MultiServerMCPToolkit({
  servers: {
    webSearch: {
      url: '${sseUrl}',
      transport: 'sse',
    },
  },
});

// 2. Cargar las 3 herramientas (web_search, web_fetch, search_and_extract)
await mcpToolkit.initialize();
const webTools = mcpToolkit.getTools();

// 3. Inyectar herramientas en tu Agente
const agent = createDeepAgent({
  tools: [...webTools],
  // Listo: el agente invocará automáticamente la web cuando lo necesite
});`;

  const pyCode = `import asyncio
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI

async def main():
    # 1. Conectar al servidor MCP remoto vía SSE
    async with MultiServerMCPClient({
        "webSearch": {
            "url": "${sseUrl}",
            "transport": "sse"
        }
    }) as client:
        # 2. Obtener herramientas preparadas para LangGraph
        tools = client.get_tools()
        model = ChatOpenAI(model="gpt-4o", temperature=0)
        agent = create_react_agent(model, tools)

        # 3. Invocar agente con búsqueda en tiempo real
        result = await agent.ainvoke({
            "messages": [("user", "¿Cuáles son las últimas noticias sobre el Model Context Protocol?")]
        })
        print(result["messages"][-1].content)

if __name__ == "__main__":
    asyncio.run(main())`;

  const desktopConfig = `{
  "mcpServers": {
    "web-search-engine": {
      "url": "${sseUrl}"
    }
  }
}`;

  const curlCode = `# 1. Comprobar salud del servicio
curl -i ${healthUrl}

# 2. Iniciar sesión de streaming MCP vía SSE
curl -N -H "Accept: text/event-stream" ${sseUrl}

# 3. Obtener metadatos en JSON puro vía API
curl -H "Accept: application/json" ${baseUrl}/`;

  const tabs = [
    { id: 'ts', label: 'Deep Agents / TypeScript', icon: FileCode2, filename: 'agent.ts', lang: 'typescript', code: tsCode },
    { id: 'py', label: 'LangGraph / Python', icon: Layers, filename: 'agent.py', lang: 'python', code: pyCode },
    { id: 'desktop', label: 'Claude Desktop & Cursor', icon: Settings, filename: 'claude_desktop_config.json', lang: 'json', code: desktopConfig },
    { id: 'curl', label: 'cURL / Handshake', icon: TerminalIcon, filename: 'handshake.sh', lang: 'bash', code: curlCode },
  ] as const;

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <section id="integracion" className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
          Cómo Integrarlo en tu Código
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Conexión inmediata mediante el transporte SSE estándar con frameworks de TypeScript, Python, o directamente en tu editor de código.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-surface-800 space-x-1 sm:space-x-2 overflow-x-auto code-scroll mb-6 pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
                isActive
                  ? 'border-brand-400 text-brand-400 bg-brand-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-surface-900/40'
              }`}
            >
              <span className={`w-2 h-2 rounded-full transition-colors ${isActive ? 'bg-brand-400' : 'bg-slate-600'}`} />
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Code Pane */}
      <div className="transition-opacity duration-200">
        <CodeBlock
          key={currentTab.id}
          code={currentTab.code}
          language={currentTab.lang}
          filename={currentTab.filename}
        />
      </div>
    </section>
  );
};
