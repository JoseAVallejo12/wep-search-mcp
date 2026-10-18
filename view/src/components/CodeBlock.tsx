import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import { CopyButton } from './CopyButton';

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  maxHeight?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  filename,
  maxHeight = 'max-h-[460px]',
}) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  return (
    <div className="bg-surface-950 border border-surface-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-900 border-b border-surface-800">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70 inline-block" />
          </div>
          {filename && (
            <span className="text-xs font-mono text-slate-300 font-medium">
              {filename}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-surface-800 text-slate-400 border border-surface-700">
            {language}
          </span>
          <CopyButton textToCopy={code.trim()} label="Copiar" copiedLabel="¡Copiado!" variant="secondary" className="px-2.5 py-1 text-xs" />
        </div>
      </div>

      {/* Code content */}
      <pre className={`p-4 font-mono text-xs sm:text-sm overflow-x-auto code-scroll leading-relaxed ${maxHeight}`}>
        <code ref={codeRef} className={`language-${language}`}>
          {code.trim()}
        </code>
      </pre>
    </div>
  );
};
