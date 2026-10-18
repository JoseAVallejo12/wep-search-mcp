import React from 'react';
import { Search, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

export const ToolsSection: React.FC = () => {
  return (
    <section id="herramientas" className="py-16 border-t border-surface-800 bg-surface-900/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
            Herramientas MCP Registradas
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Cada herramienta implementa esquemas estrictos validados con Zod y produce contenido estructurado en Markdown libre de ruido.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tool 1: web_search */}
          <div className="p-6 rounded-2xl bg-surface-950 border border-surface-800 hover:border-surface-750 transition-all flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-mono font-semibold">
                  Tool 01
                </span>
                <span className="text-xs text-slate-400 font-mono">Multi-Motor</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-5 h-5 text-brand-400" />
                <h3 className="text-lg font-bold text-white font-mono">web_search</h3>
              </div>
              <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                Busca en múltiples motores simultáneamente (Google, Bing, DuckDuckGo, Wikipedia) con filtrado y deduplicación por dominio.
              </p>
              <div className="space-y-2 mb-5 text-xs font-mono bg-surface-900/90 p-3.5 rounded-xl border border-surface-800">
                <div className="text-slate-400 font-sans text-[11px] font-semibold">Parámetros Zod:</div>
                <div className="text-slate-200">
                  • <span className="text-teal-400">query</span>: string <span className="text-slate-500">(requerido)</span>
                </div>
                <div className="text-slate-200">
                  • <span className="text-teal-400">max_results</span>: number <span className="text-slate-500">(default 5)</span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-surface-800/80 text-xs text-slate-400 flex items-center justify-between font-mono">
              <span>Retorno:</span>
              <span className="text-slate-200">Markdown + Snippets</span>
            </div>
          </div>

          {/* Tool 2: web_fetch */}
          <div className="p-6 rounded-2xl bg-surface-950 border border-surface-800 hover:border-surface-750 transition-all flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-mono font-semibold">
                  Tool 02
                </span>
                <span className="text-xs text-slate-400 font-mono">Modo Lectura</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-teal-400" />
                <h3 className="text-lg font-bold text-white font-mono">web_fetch</h3>
              </div>
              <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                Extrae el contenido sustancial de cualquier página web usando Mozilla Readability y lo convierte en Markdown limpio sin menús ni anuncios.
              </p>
              <div className="space-y-2 mb-5 text-xs font-mono bg-surface-900/90 p-3.5 rounded-xl border border-surface-800">
                <div className="text-slate-400 font-sans text-[11px] font-semibold">Parámetros Zod:</div>
                <div className="text-slate-200">
                  • <span className="text-teal-400">url</span>: string <span className="text-slate-500">(requerido)</span>
                </div>
                <div className="text-slate-200">
                  • <span className="text-teal-400">max_tokens</span>: number <span className="text-slate-500">(default 1500)</span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-surface-800/80 text-xs text-slate-400 flex items-center justify-between font-mono">
              <span>Retorno:</span>
              <span className="text-slate-200">Clean Article Markdown</span>
            </div>
          </div>

          {/* Tool 3: search_and_extract */}
          <div className="p-6 rounded-2xl bg-surface-950 border-2 border-brand-500/40 hover:border-brand-500/70 transition-all flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-brand-500 text-slate-950 text-[10px] font-bold px-3.5 py-0.5 rounded-bl uppercase tracking-wider">
              Recomendada
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-mono font-semibold">
                  Tool 03
                </span>
                <span className="text-xs text-brand-400 font-mono">Tipo Tavily</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-brand-400" />
                <h3 className="text-lg font-bold text-white font-mono">search_and_extract</h3>
              </div>
              <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                Busca en la web y extrae en paralelo el contenido limpio de las mejores páginas. Resuelve la necesidad del LLM en 1 solo turno de llamada.
              </p>
              <div className="space-y-2 mb-5 text-xs font-mono bg-surface-900/90 p-3.5 rounded-xl border border-surface-800">
                <div className="text-slate-400 font-sans text-[11px] font-semibold">Parámetros Zod:</div>
                <div className="text-slate-200">
                  • <span className="text-teal-400">query</span>: string <span className="text-slate-500">(requerido)</span>
                </div>
                <div className="text-slate-200">
                  • <span className="text-teal-400">max_results</span>: number <span className="text-slate-500">(default 3)</span>
                </div>
                <div className="text-slate-200">
                  • <span className="text-teal-400">max_tokens_per_page</span>: number <span className="text-slate-500">(default 1000)</span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-surface-800/80 text-xs text-brand-400 flex items-center justify-between font-medium">
              <span>Optimización:</span>
              <span className="flex items-center gap-1 font-semibold">
                1 Roundtrip LLM <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
