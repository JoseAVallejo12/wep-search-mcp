import React from 'react';
import { CopyButton } from './CopyButton';
import { Github, Globe } from 'lucide-react';

interface NavbarProps {
  sseUrl: string;
  repoUrl: string;
}

export const Navbar: React.FC<NavbarProps> = ({ sseUrl, repoUrl }) => {
  return (
    <header className="relative z-30 border-b border-surface-800/80 backdrop-blur-md bg-surface-950/80 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Globe className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              WebSearch{' '}
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/30 font-mono font-medium">
                MCP Server
              </span>
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-slate-300">
          <a href="#prompt" className="hover:text-brand-400 transition-colors">
            Prompt Agente
          </a>
          <a href="#integracion" className="hover:text-brand-400 transition-colors">
            Integración
          </a>
          <a href="#herramientas" className="hover:text-brand-400 transition-colors">
            Herramientas
          </a>
          <a href="#comparativa" className="hover:text-brand-400 transition-colors">
            Ventajas vs Tavily
          </a>
          <a href="#estado" className="hover:text-brand-400 transition-colors">
            Diagnóstico
          </a>
        </nav>

        {/* Actions: GitHub Repo + Copy SSE */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* GitHub Repo Button */}
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface-850 hover:bg-surface-800 text-slate-200 hover:text-white border border-surface-700 transition-all cursor-pointer shadow-sm hover:border-slate-500 active:scale-95"
            aria-label="Ver repositorio en GitHub"
          >
            <Github className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          {/* SSE Status pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-900 border border-surface-700/60 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
            </span>
            <span className="text-slate-300">SSE Online</span>
          </div>

          {/* Copy SSE Button */}
          <CopyButton
            textToCopy={sseUrl}
            label="Copiar SSE"
            copiedLabel="¡Copiado!"
            variant="primary"
            className="px-3.5 py-1.5 text-xs font-bold rounded-lg"
          />
        </div>
      </div>
    </header>
  );
};
