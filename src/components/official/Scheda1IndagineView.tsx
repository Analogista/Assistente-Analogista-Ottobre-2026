import React from 'react';
import { Scheda1Data } from '../../types/officialTypes';
import { User, Phone, Calendar, Target, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface Props {
  data: Scheda1Data;
  onChange: (updated: Partial<Scheda1Data>) => void;
  onNext?: () => void;
}

export const Scheda1IndagineView: React.FC<Props> = ({ data, onChange, onNext }) => {
  return (
    <div className="bg-white border border-slate-300 rounded-2xl shadow-sm overflow-hidden print:border-none print:shadow-none">
      {/* Header Ufficiale UPDA */}
      <div className="bg-slate-900 text-white p-6 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-upda-ciano/20 border border-upda-ciano/40 flex items-center justify-center font-serif font-black text-upda-ciano text-xl tracking-tighter">
            SB
          </div>
          <div>
            <div className="text-[10px] font-mono tracking-[0.2em] text-upda-ciano uppercase font-bold">
              UPDA • UNIVERSITÀ POPOLARE DELLE DISCIPLINE ANALOGICHE
            </div>
            <h2 className="text-lg md:text-xl font-black uppercase tracking-tight text-white mt-0.5">
              Scheda Riequilibrio Emozionale
            </h2>
            <p className="text-[10px] text-slate-400 font-mono">Dedicato a Stefano Benemeglio</p>
          </div>
        </div>
        <div className="px-4 py-2 rounded-lg bg-upda-ciano/15 border border-upda-ciano/30 text-right">
          <span className="text-[9px] font-mono uppercase tracking-widest text-slate-300 block">Identificativo Scheda</span>
          <span className="text-xs font-mono font-black text-upda-ciano">SCHEDA 01 • INDAGINE</span>
        </div>
      </div>

      {/* Barra Fase */}
      <div className="bg-slate-800 text-slate-100 px-6 py-2.5 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <span className="text-xs font-mono font-black uppercase tracking-[0.15em] text-amber-300">
            FASE DI INDAGINE
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 uppercase">Raccolta Dati & Analisi Conflitti</span>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Riepilogo Dati Cliente (Salvato in Home) */}
        <div className="p-5 bg-upda-ciano/5 rounded-xl border border-upda-ciano/30 space-y-3">
          <div className="flex items-center justify-between border-b border-upda-ciano/20 pb-2">
            <span className="text-xs font-mono font-bold uppercase text-upda-petrolio flex items-center gap-2">
              <User size={14} /> Dati Cliente & Focus Sincronizzati
            </span>
            <span className="text-[10px] font-mono bg-upda-ciano/20 text-slate-900 px-2.5 py-0.5 rounded-full font-bold">
              Età: {data.eta || 'N.D.'} anni
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Nome e Cognome</span>
              <strong className="text-slate-900 text-sm font-sans">{data.nome || 'Non specificato'} {data.cognome || ''}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Telefono</span>
              <span className="text-slate-900">{data.telefono || 'Non specificato'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Età Rilevata</span>
              <span className="text-slate-900 font-bold">{data.eta || '0'} anni</span>
            </div>
          </div>
          {data.focusObiettivo && (
            <div className="pt-2 border-t border-upda-ciano/10">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Focus / Obiettivo da Risolvere</span>
              <p className="text-xs text-slate-800 font-sans mt-0.5 leading-relaxed">{data.focusObiettivo}</p>
            </div>
          )}
        </div>

        {/* ANALISI 5 PUNTI (primo incontro) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-slate-900">
              ANALISI 5 PUNTI <span className="text-slate-500 font-normal">(primo incontro)</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Valutazione SÌ / NO</span>
          </div>

          <div className="space-y-3">
            {/* Punto 1 */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-mono text-[10px] font-bold flex items-center justify-center">1</span>
                  <span className="text-xs font-bold text-slate-800">Famiglia d'origine</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ famigliaOrigine: data.famigliaOrigine === 'SI' ? '' : 'SI' })}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                    data.famigliaOrigine === 'SI'
                      ? 'bg-upda-petrolio text-white border-upda-petrolio shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  SÌ
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ famigliaOrigine: data.famigliaOrigine === 'NO' ? '' : 'NO' })}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                    data.famigliaOrigine === 'NO'
                      ? 'bg-slate-700 text-white border-slate-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  NO
                </button>
              </div>
            </div>

            {/* Punto 2 */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-mono text-[10px] font-bold flex items-center justify-center">2</span>
                  <span className="text-xs font-bold text-slate-800">Rapporti sentimentali / affettivi</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ rapportiSentimentali: data.rapportiSentimentali === 'SI' ? '' : 'SI' })}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                    data.rapportiSentimentali === 'SI'
                      ? 'bg-upda-petrolio text-white border-upda-petrolio shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  SÌ
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ rapportiSentimentali: data.rapportiSentimentali === 'NO' ? '' : 'NO' })}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                    data.rapportiSentimentali === 'NO'
                      ? 'bg-slate-700 text-white border-slate-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  NO
                </button>
              </div>
            </div>

            {/* Punto 3 */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-mono text-[10px] font-bold flex items-center justify-center">3</span>
                  <span className="text-xs font-bold text-slate-800">Rapporti Sessuali / Passionali</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ rapportiSessuali: data.rapportiSessuali === 'SI' ? '' : 'SI' })}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                    data.rapportiSessuali === 'SI'
                      ? 'bg-upda-petrolio text-white border-upda-petrolio shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  SÌ
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ rapportiSessuali: data.rapportiSessuali === 'NO' ? '' : 'NO' })}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                    data.rapportiSessuali === 'NO'
                      ? 'bg-slate-700 text-white border-slate-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  NO
                </button>
              </div>
            </div>

            {/* Punto 4 */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-mono text-[10px] font-bold flex items-center justify-center">4</span>
                  <span className="text-xs font-bold text-slate-800">Autorealizzazione</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ autorealizzazione: data.autorealizzazione === 'SI' ? '' : 'SI' })}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                    data.autorealizzazione === 'SI'
                      ? 'bg-upda-petrolio text-white border-upda-petrolio shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  SÌ
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ autorealizzazione: data.autorealizzazione === 'NO' ? '' : 'NO' })}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                    data.autorealizzazione === 'NO'
                      ? 'bg-slate-700 text-white border-slate-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  NO
                </button>
              </div>
            </div>

            {/* Punto 5 */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-mono text-[10px] font-bold flex items-center justify-center">5</span>
                    <span className="text-xs font-bold text-slate-800">Disturbi emotività - comportamento</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onChange({ disturbiEmotivita: data.disturbiEmotivita === 'SI' ? '' : 'SI' })}
                    className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                      data.disturbiEmotivita === 'SI'
                        ? 'bg-upda-petrolio text-white border-upda-petrolio shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    SÌ
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ disturbiEmotivita: data.disturbiEmotivita === 'NO' ? '' : 'NO' })}
                    className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                      data.disturbiEmotivita === 'NO'
                        ? 'bg-slate-700 text-white border-slate-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>

              {data.disturbiEmotivita === 'SI' && (
                <div className="pt-2 border-t border-slate-200">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold block mb-1">
                    Se SÌ, quali?
                  </label>
                  <input
                    type="text"
                    value={data.disturbiEmotivitaQuali}
                    onChange={(e) => onChange({ disturbiEmotivitaQuali: e.target.value })}
                    placeholder="Specificare disturbi dell'emotività o del comportamento..."
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-upda-petrolio focus:ring-1 focus:ring-upda-petrolio"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CAUSA DEL CONFLITTO [PAROLA CHIAVE] */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-2">
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-slate-900">
              CAUSA DEL CONFLITTO [PAROLA CHIAVE]
            </h3>
            <span className="text-[11px] font-mono text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Barrare il conflitto denunciato
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Genitori */}
            <div
              onClick={() => onChange({ causaConflitto: data.causaConflitto === 'Genitori' ? '' : 'Genitori' })}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                data.causaConflitto === 'Genitori'
                  ? 'bg-upda-ciano/10 border-upda-petrolio shadow-xs ring-1 ring-upda-petrolio'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {data.causaConflitto === 'Genitori' ? (
                    <CheckCircle2 size={16} className="text-upda-petrolio" />
                  ) : (
                    <Circle size={16} className="text-slate-400" />
                  )}
                  <span className="text-xs font-black uppercase text-slate-900">Genitori</span>
                </div>
                <p className="text-[11px] font-mono text-slate-600 pl-6">
                  [Impedimento / Libertà]
                </p>
              </div>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                data.causaConflitto === 'Genitori' ? 'bg-upda-petrolio text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {data.causaConflitto === 'Genitori' ? 'SELEZIONATO' : 'OPZIONE'}
              </span>
            </div>

            {/* Sé Stesso */}
            <div
              onClick={() => onChange({ causaConflitto: data.causaConflitto === 'SeStesso' ? '' : 'SeStesso' })}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                data.causaConflitto === 'SeStesso'
                  ? 'bg-upda-ciano/10 border-upda-petrolio shadow-xs ring-1 ring-upda-petrolio'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {data.causaConflitto === 'SeStesso' ? (
                    <CheckCircle2 size={16} className="text-upda-petrolio" />
                  ) : (
                    <Circle size={16} className="text-slate-400" />
                  )}
                  <span className="text-xs font-black uppercase text-slate-900">Sé Stesso</span>
                </div>
                <p className="text-[11px] font-mono text-slate-600 pl-6">
                  [Incapacità / Rammarichi]
                </p>
              </div>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                data.causaConflitto === 'SeStesso' ? 'bg-upda-petrolio text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {data.causaConflitto === 'SeStesso' ? 'SELEZIONATO' : 'OPZIONE'}
              </span>
            </div>

            {/* Altri */}
            <div
              onClick={() => onChange({ causaConflitto: data.causaConflitto === 'Altri' ? '' : 'Altri' })}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                data.causaConflitto === 'Altri'
                  ? 'bg-upda-ciano/10 border-upda-petrolio shadow-xs ring-1 ring-upda-petrolio'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {data.causaConflitto === 'Altri' ? (
                    <CheckCircle2 size={16} className="text-upda-petrolio" />
                  ) : (
                    <Circle size={16} className="text-slate-400" />
                  )}
                  <span className="text-xs font-black uppercase text-slate-900">Altri</span>
                </div>
                <p className="text-[11px] font-mono text-slate-600 pl-6">
                  [Impedimento / Sogno]
                </p>
              </div>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                data.causaConflitto === 'Altri' ? 'bg-upda-petrolio text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {data.causaConflitto === 'Altri' ? 'SELEZIONATO' : 'OPZIONE'}
              </span>
            </div>

            {/* Destino */}
            <div
              onClick={() => onChange({ causaConflitto: data.causaConflitto === 'Destino' ? '' : 'Destino' })}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                data.causaConflitto === 'Destino'
                  ? 'bg-upda-ciano/10 border-upda-petrolio shadow-xs ring-1 ring-upda-petrolio'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {data.causaConflitto === 'Destino' ? (
                    <CheckCircle2 size={16} className="text-upda-petrolio" />
                  ) : (
                    <Circle size={16} className="text-slate-400" />
                  )}
                  <span className="text-xs font-black uppercase text-slate-900">Destino</span>
                </div>
                <p className="text-[11px] font-mono text-slate-600 pl-6">
                  [Sventura / Disgrazia]
                </p>
              </div>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                data.causaConflitto === 'Destino' ? 'bg-upda-petrolio text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {data.causaConflitto === 'Destino' ? 'SELEZIONATO' : 'OPZIONE'}
              </span>
            </div>
          </div>
        </div>

        {/* Azione Successiva */}
        {onNext && (
          <div className="pt-6 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={onNext}
              className="px-6 py-3 bg-upda-petrolio hover:bg-upda-petrolio/90 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
            >
              <span>Procedi a Scheda 02 (Planning)</span>
              <span>&rarr;</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
