import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { CopyButton } from './CopyButton';

interface PromptSectionProps {
  sseUrl: string;
}

export const PromptSection: React.FC<PromptSectionProps> = ({ sseUrl }) => {
  const [isOpen, setIsOpen] = useState(true);

  const promptText = `Eres un asistente de IA avanzado con acceso en tiempo real a la web a través del servidor MCP de Búsqueda y Extracción ("WebSearch MCP").
Conexión MCP SSE: ${sseUrl}

Dispones de las siguientes 3 herramientas especializadas:

1. \`web_search\`:
   - Propósito: Búsqueda agregada en múltiples motores (Google, Bing, DuckDuckGo, Wikipedia) con deduplicación por dominio y snippets relevantes.
   - Parámetros: { "query": string, "max_results"?: number } (por defecto 5).
   - Cuándo usarla: Para explorar temas amplios, descubrir fuentes recientes o verificar datos rápidos.

2. \`web_fetch\`:
   - Propósito: Extrae el contenido sustancial de una URL en Markdown limpio libre de ruido (scripts, menús, anuncios, footers) con límite de tokens.
   - Parámetros: { "url": string, "max_tokens"?: number } (por defecto 1500).
   - Cuándo usarla: Para leer a fondo un artículo o enlace específico provisto por el usuario o descubierto previamente.

3. \`search_and_extract\` (RECOMENDADA para respuestas completas):
   - Propósito: Busca y extrae en paralelo el contenido limpio de las mejores páginas web en un solo llamado.
   - Parámetros: { "query": string, "max_results"?: number (default 3), "max_tokens_per_page"?: number (default 1000) }.
   - Cuándo usarla: Para responder preguntas complejas que requieren investigar y sintetizar información en un único turno de ejecución sin múltiples llamadas innecesarias.

Instrucciones de respuesta:
- Prioriza siempre \`search_and_extract\` para responder preguntas que requieran información web fresca.
- Cita siempre las URLs de las fuentes consultadas al formular tu respuesta final.
- Si una página web no proporciona información útil, realiza una búsqueda complementaria con términos más específicos.`;

  return (
    <section id="prompt" className="py-12 border-t border-surface-800 bg-surface-900/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="bg-surface-950 border border-surface-800 rounded-2xl overflow-hidden shadow-2xl transition-all">
          <div className="p-5 sm:p-6 bg-surface-900/80 border-b border-surface-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                <Terminal className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-semibold text-brand-400 uppercase tracking-wider bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                    System Prompt
                  </span>
                  <span className="text-xs text-slate-400">• Listo para Copiar</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Prompt de Sistema para tu Agente LLM
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Pega este prompt en tu modelo para enseñarle a buscar y extraer información usando las herramientas MCP.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
              <CopyButton
                textToCopy={promptText}
                label="Copiar Prompt"
                copiedLabel="¡Copiado!"
                variant="primary"
                className="px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-lg"
              />
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-800 hover:bg-surface-700 text-slate-200 text-xs font-semibold border border-surface-700 transition-colors cursor-pointer"
                aria-expanded={isOpen}
              >
                <span>{isOpen ? 'Ocultar' : 'Ver Terminal'}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>

          {/* Collapsible Content */}
          {isOpen && (
            <div className="p-4 sm:p-6 bg-surface-950 animate-in fade-in-50 duration-300">
              <div className="rounded-xl border border-surface-800/90 bg-surface-900/60 overflow-hidden shadow-inner">
                {/* Terminal top bar */}
                <div className="flex items-center justify-between px-4 py-2 bg-surface-900 border-b border-surface-800 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/70 inline-block" />
                    <span className="ml-2 font-mono text-slate-400 text-[11px]">system_prompt_web_search_mcp.txt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-brand-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Optimizado para Context Window
                    </span>
                  </div>
                </div>

                {/* Terminal Body */}
                <pre className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] text-slate-200 leading-relaxed whitespace-pre-wrap code-scroll max-h-[380px] overflow-y-auto selection:bg-brand-500/30">
                  {promptText}
                </pre>
              </div>

              {/* Quick instructions pill below terminal */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Compatible con: <strong>Cursor Rules</strong>, <strong>Claude Desktop</strong>, <strong>Deep Agents</strong>, <strong>LangGraph</strong>, <strong>OpenAI Custom GPTs</strong> y <strong>Windsurf</strong>.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
