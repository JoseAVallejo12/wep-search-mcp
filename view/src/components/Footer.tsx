import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

interface FooterProps {
  repoUrl: string;
}

export const Footer: React.FC<FooterProps> = ({ repoUrl }) => {
  return (
    <footer className="border-t border-surface-800/80 bg-surface-950 py-10 relative z-20 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
          <span className="font-bold text-white text-sm">WebSearch MCP</span>
          <span className="hidden sm:inline">•</span>
          <span>Motor de Búsqueda Web y Extracción para Agentes de IA</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-slate-400">Código Abierto bajo Licencia MIT</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5 font-medium"
          >
            <Github className="w-4 h-4 text-white" />
            <span>GitHub Repository</span>
          </a>

          <a
            href="https://modelcontextprotocol.io"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>Model Context Protocol</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};
