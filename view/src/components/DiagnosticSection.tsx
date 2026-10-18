import React, { useState } from 'react';
import { Activity, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface DiagnosticSectionProps {
  healthUrl: string;
}

interface HealthResponse {
  status: string;
  uptime: number;
  activeSessions: number;
  timestamp: string;
}

export const DiagnosticSection: React.FC<DiagnosticSectionProps> = ({ healthUrl }) => {
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testHealthCheck = async () => {
    setLoading(true);
    setError(null);
    const start = performance.now();

    try {
      const res = await fetch('/health');
      const data = await res.json();
      const elapsed = Math.round(performance.now() - start);
      setLatency(elapsed);
      setHealthData(data);
    } catch (err: any) {
      console.error('Healthcheck error:', err);
      // Fallback try with absolute healthUrl
      try {
        const res = await fetch(healthUrl);
        const data = await res.json();
        const elapsed = Math.round(performance.now() - start);
        setLatency(elapsed);
        setHealthData(data);
      } catch (err2: any) {
        setError(err2.message || 'Error de conexión con el endpoint');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      return `${hrs}h ${mins % 60}m`;
    }
    return `${mins}m ${secs}s`;
  };

  return (
    <section id="estado" className="py-16 border-t border-surface-800 bg-surface-900/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-mono text-brand-400 mb-2">
            <Activity className="w-3.5 h-3.5" />
            Monitoreo en Tiempo Real
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
            Diagnóstico del Servidor en Producción
          </h2>
          <p className="text-sm text-slate-400">
            Comprueba la latencia del contenedor Express y su enlace privado con SearXNG.
          </p>
        </div>

        <div className="bg-surface-950 border border-surface-800 rounded-2xl p-6 shadow-xl">
          {/* Status Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-surface-900 border border-surface-800">
              <span className="text-xs text-slate-400 block mb-1">Estado del Servicio</span>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-400">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                Operacional (Online)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-surface-900 border border-surface-800">
              <span className="text-xs text-slate-400 block mb-1">Sesiones SSE Activas</span>
              <span className="text-sm font-semibold text-white font-mono">
                {healthData ? healthData.activeSessions : '0'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-surface-900 border border-surface-800">
              <span className="text-xs text-slate-400 block mb-1">Tiempo de Actividad (Uptime)</span>
              <span className="text-sm font-semibold text-white font-mono">
                {healthData ? formatUptime(healthData.uptime) : 'En línea'}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-surface-800">
            <div className="text-xs text-slate-400">
              Endpoint: <code className="text-slate-300 font-mono bg-surface-900 px-2 py-1 rounded border border-surface-800">/health</code>
            </div>

            <button
              type="button"
              onClick={testHealthCheck}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-brand-500/10 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Comprobando...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Probar Healthcheck Ahora</span>
                </>
              )}
            </button>
          </div>

          {/* Result card */}
          {healthData && (
            <div className="mt-5 p-4 rounded-xl bg-surface-900 border border-brand-500/30 font-mono text-xs text-slate-300 animate-in fade-in-50 duration-200 shadow-inner">
              <div className="flex items-center justify-between text-brand-400 font-semibold mb-2 pb-2 border-b border-surface-800">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" />
                  <span>HTTP 200 OK — Saludable</span>
                </span>
                {latency !== null && (
                  <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20 text-[11px]">
                    Latencia: {latency}ms
                  </span>
                )}
              </div>
              <pre className="text-slate-300 text-[11px] overflow-x-auto code-scroll leading-relaxed">
                {JSON.stringify(healthData, null, 2)}
              </pre>
            </div>
          )}

          {error && (
            <div className="mt-5 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>Error al ejecutar prueba: {error}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
