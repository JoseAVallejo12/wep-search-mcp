import React, { useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PromptSection } from './components/PromptSection';
import { IntegrationTabs } from './components/IntegrationTabs';
import { ToolsSection } from './components/ToolsSection';
import { ComparisonSection } from './components/ComparisonSection';
import { DiagnosticSection } from './components/DiagnosticSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const { baseUrl, sseUrl, healthUrl, repoUrl } = useMemo(() => {
    const origin =
      typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost:5173')
        ? window.location.origin
        : 'https://mcp-search-engine-production.up.railway.app';

    return {
      baseUrl: origin,
      sseUrl: `${origin}/sse`,
      healthUrl: `${origin}/health`,
      repoUrl: 'https://github.com/JoseAVallejo12/wep-search-mcp',
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased bg-surface-950 text-slate-100 selection:bg-brand-500 selection:text-slate-950 relative">
      {/* Background patterns */}
      <div className="fixed inset-0 grid-pattern pointer-events-none z-0" />
      <div className="fixed inset-0 glow-radial pointer-events-none z-0" />

      {/* Header navigation */}
      <Navbar sseUrl={sseUrl} repoUrl={repoUrl} />

      {/* Main Content */}
      <main className="relative z-10 flex-grow">
        <HeroSection sseUrl={sseUrl} repoUrl={repoUrl} />
        <PromptSection sseUrl={sseUrl} />
        <IntegrationTabs sseUrl={sseUrl} healthUrl={healthUrl} baseUrl={baseUrl} />
        <ToolsSection />
        <ComparisonSection />
        <DiagnosticSection healthUrl={healthUrl} />
      </main>

      {/* Footer */}
      <Footer repoUrl={repoUrl} />
    </div>
  );
};

export default App;
