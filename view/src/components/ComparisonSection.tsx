import React from 'react';
import { Check, ShieldCheck } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  return (
    <section id="comparativa" className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-mono text-brand-400 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          Libertad & Ahorro de Costos
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
          ¿Por Qué Usar WebSearch MCP?
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Comparativa directa frente a servicios comerciales de búsqueda y scraping para agentes de IA.
        </p>
      </div>

      <div className="overflow-x-auto code-scroll rounded-2xl border border-surface-800 bg-surface-950 shadow-2xl">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-surface-800 bg-surface-900/90 text-slate-300">
              <th className="p-4 sm:p-5 font-semibold">Característica</th>
              <th className="p-4 sm:p-5 font-semibold text-brand-400 bg-brand-500/10 border-x border-surface-800">
                WebSearch MCP (Auto-hospedado)
              </th>
              <th className="p-4 sm:p-5 font-semibold text-slate-400">Tavily Search API</th>
              <th className="p-4 sm:p-5 font-semibold text-slate-400">Jina Reader</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-800/80 text-slate-300">
            <tr>
              <td className="p-4 sm:p-5 font-medium text-white">Costo Mensual</td>
              <td className="p-4 sm:p-5 font-bold text-brand-400 bg-brand-500/5 border-x border-surface-800 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-brand-400 shrink-0" />
                <span>100% Gratis ($0)</span>
              </td>
              <td className="p-4 sm:p-5 text-slate-400">Desde $20/mes (créditos limitados)</td>
              <td className="p-4 sm:p-5 text-slate-400">Tier gratuito limitado</td>
            </tr>
            <tr>
              <td className="p-4 sm:p-5 font-medium text-white">Protocolo de Comunicación</td>
              <td className="p-4 sm:p-5 font-mono text-brand-300 bg-brand-500/5 border-x border-surface-800">
                MCP Nativo (SSE & stdio)
              </td>
              <td className="p-4 sm:p-5 text-slate-400">REST API Propietario</td>
              <td className="p-4 sm:p-5 text-slate-400">REST API Propietario</td>
            </tr>
            <tr>
              <td className="p-4 sm:p-5 font-medium text-white">Privacidad de Búsqueda</td>
              <td className="p-4 sm:p-5 text-brand-400 bg-brand-500/5 border-x border-surface-800">
                Privado (No guarda historial ni IPs)
              </td>
              <td className="p-4 sm:p-5 text-slate-400">Registrado en servidores SaaS</td>
              <td className="p-4 sm:p-5 text-slate-400">Registrado en servidores SaaS</td>
            </tr>
            <tr>
              <td className="p-4 sm:p-5 font-medium text-white">Limpieza de Contenido</td>
              <td className="p-4 sm:p-5 text-brand-400 bg-brand-500/5 border-x border-surface-800">
                Readability + Markdown estructurado
              </td>
              <td className="p-4 sm:p-5 text-slate-400">Snippets y raw content</td>
              <td className="p-4 sm:p-5 text-slate-400">Markdown vía proxy</td>
            </tr>
            <tr>
              <td className="p-4 sm:p-5 font-medium text-white">Control de Presupuesto de Tokens</td>
              <td className="p-4 sm:p-5 text-brand-400 bg-brand-500/5 border-x border-surface-800">
                Integrado (Token Guard cl100k)
              </td>
              <td className="p-4 sm:p-5 text-slate-400">Requiere procesamiento extra</td>
              <td className="p-4 sm:p-5 text-slate-400">Parcial</td>
            </tr>
            <tr>
              <td className="p-4 sm:p-5 font-medium text-white">Motores de Búsqueda</td>
              <td className="p-4 sm:p-5 text-brand-400 bg-brand-500/5 border-x border-surface-800">
                Multi-motor agregador (Google, Bing, DDG, etc.)
              </td>
              <td className="p-4 sm:p-5 text-slate-400">Índice propio cerrado</td>
              <td className="p-4 sm:p-5 text-slate-400">Google / Bing proxy</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};
