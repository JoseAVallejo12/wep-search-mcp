import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  copiedLabel?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  className?: string;
  onCopied?: () => void;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = 'Copiar',
  copiedLabel = '¡Copiado!',
  variant = 'secondary',
  className = '',
  onCopied,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      if (onCopied) onCopied();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const baseStyles = 'inline-flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer font-medium focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-surface-950';

  const variants = {
    primary: copied
      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
      : 'bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold shadow-md shadow-brand-500/10 active:scale-95',
    secondary: copied
      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
      : 'bg-surface-800 hover:bg-surface-700 text-slate-200 hover:text-white border border-surface-700 active:scale-95',
    ghost: copied
      ? 'text-emerald-400 font-semibold'
      : 'text-slate-400 hover:text-brand-400',
    icon: copied
      ? 'p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
      : 'p-2 rounded-lg bg-surface-850 hover:bg-surface-800 text-slate-400 hover:text-slate-200 border border-surface-750',
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`${baseStyles} ${variants[variant]} ${className} ${copied ? 'scale-[1.02]' : ''}`}
      aria-label={copied ? copiedLabel : label}
      title={copied ? copiedLabel : label}
    >
      {copied ? (
        <Check className="w-4 h-4 text-emerald-400 animate-in zoom-in-50 duration-200" />
      ) : (
        <Copy className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
      )}
      {variant !== 'icon' && (
        <span className="text-xs transition-colors duration-200">
          {copied ? copiedLabel : label}
        </span>
      )}
    </button>
  );
};
