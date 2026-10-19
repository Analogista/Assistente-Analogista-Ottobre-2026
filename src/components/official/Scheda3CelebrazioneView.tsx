import React from 'react';
import { Scheda3Data } from '../../types/officialTypes';
import { Sparkles, Users, ArrowLeftRight, ArrowUpDown, CheckCircle2, Circle, ArrowLeft, Check } from 'lucide-react';

interface Props {
  data: Scheda3Data;
  tipologiaNaturaFromScheda2?: string;
  onChange: (updated: Partial<Scheda3Data>) => void;
  onPrev?: () => void;
  onComplete?: () => void;
}

export const Scheda3CelebrazioneView: React.FC<Props> = ({
  data,
  tipologiaNaturaFromScheda2,
  onChange,
  onPrev,
  onComplete
}) => {
  const currentTipologiaNatura = data.tipologiaNaturaRiepilogo || tipologiaNaturaFromScheda2 || '';

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
        <div className="px-4 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-right">
          <span className="text-[9px] font-mono uppercase tracking-widest text-slate-300 block">Identificativo Scheda</span>
          <span className="text-xs font-mono font-black text-emerald-400">SCHEDA 03 • CELEBRAZIONE</span>
        </div>
      </div>

      {/* Barra Fase */}
      <div className="bg-slate-800 text-slate-100 px-6 py-2.5 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-mono font-black uppercase tracking-[0.15em] text-emerald-300">
            FASE CELEBRATIVA
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 uppercase">Relazione Significativa, Perdono & Tematica</span>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Tipologia e Natura del Problema */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold block">
            Tipologia e Natura del Problema
          </label>
          <input
            type="text"
            value={currentTipologiaNatura}
            onChange={(e) => onChange({ tipologiaNaturaRiepilogo: e.target.value })}
            placeholder="Es. PT ante PU DX (Ordinario) • Allineato"
            className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-upda-petrolio focus:ring-1 focus:ring-upda-petrolio"
          />
        </div>

        {/* PERSONAGGI DELLA RELAZIONE SIGNIFICATIVA */}
        <div className="space-y-5 p-5 bg-slate-50/70 rounded-xl border border-slate-200">
          <div className="border-b border-slate-200 pb-3 space-y-1">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-upda-petrolio" />
              <h3 className="text-xs font-mono font-black uppercase tracking-widest text-slate-900">
                PERSONAGGI DELLA RELAZIONE SIGNIFICATIVA
              </h3>
            </div>
            <p className="text-[11px] text-slate-600 italic leading-relaxed">
              Individuare la relazione significativa da celebrare e i personaggi corrispondenti al Recettore Emotivo-Ente Giudicato (AF/F) e al Recettore Riflessivo-Ente Giudicante (PT/DK) coinvolti.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {/* Recettore Riflessivo / Ente Giudicante (Top) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono uppercase tracking-widest text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                  PT / DK (Superiore)
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Ente Giudicante</span>
              </div>
              <label className="text-xs font-bold text-slate-900 block">
                Recettore Riflessivo / Ente Giudicante
              </label>
              <p className="text-[10px] text-slate-500 italic">
                Figura o istanza che emette il giudizio, la norma o la pretesa:
              </p>
              <input
                type="text"
                value={data.recettoreRiflessivoEnteGiudicante}
                onChange={(e) => onChange({ recettoreRiflessivoEnteGiudicante: e.target.value })}
                placeholder="Es. Padre / Madre / Se Stesso / Partner..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-upda-petrolio"
              />
            </div>

            {/* Vertical Double Arrow Connector */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-0.5 h-8 bg-upda-petrolio/60"></div>
              <div className="bg-upda-petrolio text-white p-3 rounded-full shadow-md my-1">
                <ArrowUpDown size={22} />
              </div>
              <span className="text-[10px] font-mono text-upda-petrolio font-black uppercase tracking-widest my-1">
                Dinamica Relazionale Verticale
              </span>
              <div className="w-0.5 h-8 bg-upda-petrolio/60"></div>
            </div>

            {/* Recettore Emotivo / Ente Giudicato (Bottom) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  AF / F (Inferiore)
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Ente Giudicato</span>
              </div>
              <label className="text-xs font-bold text-slate-900 block">
                Recettore Emotivo / Ente Giudicato
              </label>
              <p className="text-[10px] text-slate-500 italic">
                Figura o istanza che subisce il giudizio, la colpa o il turbamento:
              </p>
              <input
                type="text"
                value={data.recettoreEmotivoEnteGiudicato}
                onChange={(e) => onChange({ recettoreEmotivoEnteGiudicato: e.target.value })}
                placeholder="Es. Io Bambino / Madre / Padre / Altro..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-upda-petrolio"
              />
            </div>
          </div>

          {/* Personaggio da celebrare per primo */}
          <div className="space-y-1.5 pt-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-700 font-bold block">
              Personaggio da celebrare per primo:
            </label>
            <input
              type="text"
              value={data.personaggioCelebrarePrimo}
              onChange={(e) => onChange({ personaggioCelebrarePrimo: e.target.value })}
              placeholder="Indicare il primo personaggio da portare a decompressione/celebrazione..."
              className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-upda-petrolio focus:ring-1 focus:ring-upda-petrolio"
            />
          </div>
        </div>

        {/* ACCETTAZIONE / PERDONO */}
        <div className="space-y-5 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-slate-900">
              ACCETTAZIONE / PERDONO
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Verifica Istanze Logica & Analogica</span>
          </div>

          {/* Griglia Istanze A e L */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Istanza Analogica (A) */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-900">
                  Istanza Analogica (A)
                </span>
                <span className="text-[10px] font-mono text-upda-petrolio font-bold">Inconscio / Emozione</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ istanzaAnalogica: 'GIUSTIFICATO' })}
                  className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all border ${
                    data.istanzaAnalogica === 'GIUSTIFICATO'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  GIUSTIFICATO
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ istanzaAnalogica: 'NON GIUSTIFICATO' })}
                  className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all border ${
                    data.istanzaAnalogica === 'NON GIUSTIFICATO'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  NON GIUSTIFICATO
                </button>
              </div>
            </div>

            {/* Istanza Logica (L) */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-900">
                  Istanza Logica (L)
                </span>
                <span className="text-[10px] font-mono text-slate-600 font-bold">Razionalità / Giudizio</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ istanzaLogica: 'GIUSTIFICATO' })}
                  className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all border ${
                    data.istanzaLogica === 'GIUSTIFICATO'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  GIUSTIFICATO
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ istanzaLogica: 'NON GIUSTIFICATO' })}
                  className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all border ${
                    data.istanzaLogica === 'NON GIUSTIFICATO'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  NON GIUSTIFICATO
                </button>
              </div>
            </div>
          </div>

          {/* Matrice Combinatoria L / A */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-700 font-bold block">
              Matrice Combinatoria L / A
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {[
                { id: 'L:SI/NO A:NO', l: 'SI / NO', a: 'NO', tematica: 'DELUSIONE' },
                { id: 'L:NO/SI A:SI', l: 'NO / SI', a: 'SI', tematica: 'DELUSIONE' },
                { id: 'L:SI/SI A:SI', l: 'SI / SI', a: 'SI', tematica: 'FALLIMENTO' },
                { id: 'L:NO/NO A:NO', l: 'NO / NO', a: 'NO', tematica: 'FALLIMENTO' },
              ].map((item) => {
                const isSelected = data.matriceLA === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => onChange({
                      matriceLA: item.id as any,
                      tematicaRegressiva: item.tematica as any
                    })}
                    className={`p-3 rounded-lg border cursor-pointer transition-all space-y-1.5 ${
                      isSelected
                        ? 'bg-upda-petrolio text-white border-upda-petrolio shadow-xs ring-1 ring-upda-petrolio'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span>L: {item.l}</span>
                      <span className={isSelected ? 'text-upda-ciano' : 'text-slate-500'}>A: {item.a}</span>
                    </div>
                    <div className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded text-center font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.tematica}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* TEMATICA REGRESSIVA */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Sparkles size={16} className="text-upda-petrolio" />
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-slate-900">
              TEMATICA REGRESSIVA
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Delusione */}
            <div
              onClick={() => onChange({ tematicaRegressiva: 'DELUSIONE' })}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                data.tematicaRegressiva === 'DELUSIONE'
                  ? 'bg-upda-ciano/15 border-upda-petrolio shadow-xs ring-1 ring-upda-petrolio'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {data.tematicaRegressiva === 'DELUSIONE' ? (
                    <CheckCircle2 size={16} className="text-upda-petrolio" />
                  ) : (
                    <Circle size={16} className="text-slate-400" />
                  )}
                  <span className="text-xs font-black uppercase text-slate-900">DELUSIONE</span>
                </div>
                <p className="text-[11px] font-mono text-slate-600 pl-6">
                  Associata a configurazioni L: SI/NO o NO/SI
                </p>
              </div>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                data.tematicaRegressiva === 'DELUSIONE' ? 'bg-upda-petrolio text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {data.tematicaRegressiva === 'DELUSIONE' ? 'ATTIVA' : 'OPZIONE'}
              </span>
            </div>

            {/* Fallimento */}
            <div
              onClick={() => onChange({ tematicaRegressiva: 'FALLIMENTO' })}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                data.tematicaRegressiva === 'FALLIMENTO'
                  ? 'bg-upda-ciano/15 border-upda-petrolio shadow-xs ring-1 ring-upda-petrolio'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {data.tematicaRegressiva === 'FALLIMENTO' ? (
                    <CheckCircle2 size={16} className="text-upda-petrolio" />
                  ) : (
                    <Circle size={16} className="text-slate-400" />
                  )}
                  <span className="text-xs font-black uppercase text-slate-900">FALLIMENTO</span>
                </div>
                <p className="text-[11px] font-mono text-slate-600 pl-6">
                  Associata a configurazioni L: SI/SI o NO/NO
                </p>
              </div>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                data.tematicaRegressiva === 'FALLIMENTO' ? 'bg-upda-petrolio text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {data.tematicaRegressiva === 'FALLIMENTO' ? 'ATTIVA' : 'OPZIONE'}
              </span>
            </div>
          </div>
        </div>

        {/* Pulsanti Navigazione & Completamento */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
          {onPrev ? (
            <button
              type="button"
              onClick={onPrev}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <ArrowLeft size={14} />
              <span>Scheda 02 (Planning)</span>
            </button>
          ) : <div></div>}

          {onComplete && (
            <button
              type="button"
              onClick={onComplete}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
            >
              <Check size={14} />
              <span>Concludi & Genera Report Completo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
