import React from 'react';
import { CopyButton } from './CopyButton';
import { Github, Zap, Shield, Sparkles, Cpu } from 'lucide-react';

interface HeroSectionProps {
  sseUrl: string;
  repoUrl: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ sseUrl, repoUrl }) => {
  return (
    <section className="pt-14 pb-12 sm:pt-20 sm:pb-16 text-center px-4 max-w-5xl mx-auto">
      {/* Version badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-850 border border-surface-700/80 text-xs font-medium text-slate-300 mb-6 shadow-inner">
        <span className="text-brand-400 font-mono font-semibold">v1.0.0</span>
        <span className="text-surface-700">•</span>
        <span>Alternativa Open Source y Gratuita a Tavily y Jina Reader</span>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
        Búsqueda Web & Extracción Limpia <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-300 to-teal-400">
          Nativa para Agentes de Inteligencia Artificial
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-8 font-normal leading-relaxed">
        Conecta tus agentes (Deep Agents, LangGraph, Claude Desktop, Cursor o cualquier cliente MCP) a la web en tiempo real. 
        Búsqueda multi-motor privada, modo lectura sin anuncios con <code className="text-brand-400 font-mono text-sm px-1.5 py-0.5 rounded bg-brand-500/10 border border-brand-500/20">Mozilla Readability</code> y{' '}
        <strong className="text-white font-medium">Token Budget Guard</strong> para proteger el contexto de tu LLM.
      </p>

      {/* Instant Endpoint Copy Pill & GitHub CTA */}
      <div className="max-w-2xl mx-auto p-2 bg-surface-900 border border-surface-800 rounded-xl shadow-2xl mb-8 flex flex-col sm:flex-row items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 w-full overflow-hidden text-left">
          <span className="text-xs font-mono font-semibold text-brand-400 uppercase tracking-wider bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20 shrink-0">
            SSE URL
          </span>
          <span className="font-mono text-xs sm:text-sm text-slate-200 truncate select-all">
            {sseUrl}
          </span>
        </div>
        <CopyButton
          textToCopy={sseUrl}
          label="Copiar Endpoint"
          copiedLabel="¡Copiado!"
          variant="primary"
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider font-bold shrink-0"
        />
      </div>

      {/* Secondary CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-850 hover:bg-surface-800 text-slate-200 hover:text-white border border-surface-700 text-xs font-semibold transition-all hover:border-slate-500 active:scale-95 shadow-sm"
        >
          <Github className="w-4 h-4 text-white" />
          <span>Ver Repositorio en GitHub</span>
        </a>
        <a
          href="#prompt"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-900 hover:bg-surface-800 text-slate-300 hover:text-white border border-surface-800 text-xs font-semibold transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>Copiar Prompt para el Agente</span>
        </a>
      </div>

      {/* Feature Badges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
        <div className="p-4 rounded-xl bg-surface-900/90 border border-surface-800/80 hover:border-surface-700 transition-colors shadow-lg">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-brand-400 flex items-center justify-center mb-3">
            <Zap className="w-4 h-4 text-brand-400" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">100% Gratuito</h3>
          <p className="text-xs text-slate-400">Sin límites de facturación, cuotas de API mensuales ni tarjeta de crédito.</p>
        </div>

        <div className="p-4 rounded-xl bg-surface-900/90 border border-surface-800/80 hover:border-surface-700 transition-colors shadow-lg">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3">
            <Shield className="w-4 h-4 text-teal-400" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">Token Guard</h3>
          <p className="text-xs text-slate-400">Truncado estricto entre 500 y 1,500 tokens para no desbordar tu modelo.</p>
        </div>

        <div className="p-4 rounded-xl bg-surface-900/90 border border-surface-800/80 hover:border-surface-700 transition-colors shadow-lg">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">Readability Limpio</h3>
          <p className="text-xs text-slate-400">Elimina el 95% del boilerplate HTML: banners, menús, ads y scripts.</p>
        </div>

        <div className="p-4 rounded-xl bg-surface-900/90 border border-surface-800/80 hover:border-surface-700 transition-colors shadow-lg">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">Protocolo MCP Nativo</h3>
          <p className="text-xs text-slate-400">Compatible con el estándar oficial de Anthropic vía SSE y JSON-RPC.</p>
        </div>
      </div>
    </section>
  );
};
