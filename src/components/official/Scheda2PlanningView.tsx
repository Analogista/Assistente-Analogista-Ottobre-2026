import React, { useEffect, useMemo } from 'react';
import { Scheda2Data } from '../../types/officialTypes';
import { Clock, Activity, Compass, ArrowRight, ArrowLeft, RotateCcw, Info, CheckCircle2 } from 'lucide-react';

interface Props {
  data: Scheda2Data;
  subjectAge?: string | number;
  onChange: (updated: Partial<Scheda2Data>) => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export const Scheda2PlanningView: React.FC<Props> = ({ data, subjectAge, onChange, onPrev, onNext }) => {
  const currentAge = Number(subjectAge) || (Number(data.planningUtopico.ptPuAge) ? Number(data.planningUtopico.ptPuAge) * 2 : 50);

  // Calcolo PT Utopico (la metà degli anni del soggetto) e formule collegate
  const utopicoCalculated = useMemo(() => {
    const age = currentAge > 0 ? currentAge : 50;
    const ptPu = age / 2; // PT Punto Utopico = metà degli anni
    const cds = age / 4;  // CDS = Età / 4 = PU / 2
    const af = age / 4;   // AF = PT - CDS = Età / 4
    const f = (3 * age) / 4; // F = PT + CDS = 3 * Età / 4

    return {
      age,
      ptPu,
      cds,
      af,
      f,
      ecA: `0 - ${af.toFixed(1)}a`,
      ecB: `${af.toFixed(1)}a - ${ptPu.toFixed(1)}a`,
      ecC: `${ptPu.toFixed(1)}a - ${f.toFixed(1)}a`,
      ecD: `${f.toFixed(1)}a - ${age.toFixed(1)}a`,
    };
  }, [currentAge]);

  // Se i campi del planning utopico sono vuoti, inizializzali con le formule esatte
  useEffect(() => {
    if (!data.planningUtopico.ptPuAge && utopicoCalculated.ptPu > 0) {
      onChange({
        planningUtopico: {
          afAge: utopicoCalculated.af.toFixed(1),
          ptPuAge: utopicoCalculated.ptPu.toFixed(1),
          fAge: utopicoCalculated.f.toFixed(1),
        },
        coeffSpaziale: utopicoCalculated.cds.toFixed(1),
      });
    }
  }, [currentAge, utopicoCalculated]);

  const handleApplyUtopicoFormulas = () => {
    onChange({
      planningUtopico: {
        afAge: utopicoCalculated.af.toFixed(1),
        ptPuAge: utopicoCalculated.ptPu.toFixed(1),
        fAge: utopicoCalculated.f.toFixed(1),
      },
      coeffSpaziale: utopicoCalculated.cds.toFixed(1),
    });
  };

  // Verifica se è stato inserito un numero per il Planning Reale
  const puRealeInput = data.planningReale.puAge?.trim() || '';
  const parsedPuReale = parseFloat(puRealeInput);
  const hasValidPuReale = !isNaN(parsedPuReale) && parsedPuReale > 0 && puRealeInput !== '';

  // Calcoli Planning Reale (SOLO se è stato inserito un numero)
  const realeCalculated = useMemo(() => {
    if (!hasValidPuReale) return null;

    const age = utopicoCalculated.age;
    const puReale = parsedPuReale;
    const ptUtopico = utopicoCalculated.ptPu;
    const cds = utopicoCalculated.cds;

    // Timeline reale
    const afReale = Math.max(0, puReale - cds);
    const fReale = puReale + cds;

    // Distorsione Temporale (CDT): differenza tra PU Reale e PT Utopico (Età/2)
    const cdtDelta = puReale - ptUtopico;
    const cdtAbs = Math.abs(cdtDelta);
    const segnoCD = cdtDelta >= 0 ? '+' : '-';

    // Status Benessere Energetico
    const valoreBenessere = cds * 0.30;
    let statoBenessere = '';
    if (Math.abs(cdtAbs - valoreBenessere) < 0.2) {
      statoBenessere = 'Zona di Comfort (Equilibrio Energetico)';
    } else if (cdtAbs < valoreBenessere) {
      statoBenessere = 'Ristagno Energetico (Apatia o Tedio)';
    } else {
      statoBenessere = 'Zona di No Comfort (Tensione, Sofferenza o Dolore)';
    }

    // Calcolo automatico suggerimento tipologia problema
    const braccio = data.braccioInduttore || 'DX';
    let tipologiaSuggerita: 'PT ante PU DX' | 'PT post PU DX' | 'PT ante PU SX' | 'PT post PU SX' = 'PT ante PU DX';
    
    // PT ante PU significa PT < PU (quindi PU Reale > PT Utopico)
    // PT post PU significa PT > PU (quindi PU Reale < PT Utopico)
    if (puReale >= ptUtopico) {
      // PT ante PU
      tipologiaSuggerita = braccio === 'DX' ? 'PT ante PU DX' : 'PT ante PU SX';
    } else {
      // PT post PU
      tipologiaSuggerita = braccio === 'DX' ? 'PT post PU DX' : 'PT post PU SX';
    }

    return {
      puReale,
      ptUtopico,
      cds,
      afReale,
      fReale,
      cdtDelta,
      cdtAbs,
      segnoCD: segnoCD as '+' | '-',
      statoBenessere,
      tipologiaSuggerita,
      ecA: `0 - ${afReale.toFixed(1)}a`,
      ecB: `${afReale.toFixed(1)}a - ${puReale.toFixed(1)}a`,
      ecC: `${puReale.toFixed(1)}a - ${fReale.toFixed(1)}a`,
      ecD: `${fReale.toFixed(1)}a - ${age.toFixed(1)}a`,
    };
  }, [hasValidPuReale, parsedPuReale, utopicoCalculated, data.braccioInduttore]);

  // Se l'utente digita il PU Reale, sincronizza automaticamente i coefficienti
  const handlePuRealeChange = (val: string) => {
    const num = parseFloat(val.trim());
    if (!isNaN(num) && num > 0 && val.trim() !== '') {
      const ptUtopico = utopicoCalculated.ptPu;
      const cdtDelta = num - ptUtopico;
      const cdtAbs = Math.abs(cdtDelta);
      const segno = cdtDelta >= 0 ? '+' : '-';
      const braccio = data.braccioInduttore || 'DX';
      const tipologia = num >= ptUtopico
        ? (braccio === 'DX' ? 'PT ante PU DX' : 'PT ante PU SX')
        : (braccio === 'DX' ? 'PT post PU DX' : 'PT post PU SX');

      onChange({
        planningReale: { puAge: val },
        segnoCD: segno,
        coeffDistorsioneTemporale: `${segno}${cdtAbs.toFixed(1)}`,
        coeffSpaziale: utopicoCalculated.cds.toFixed(1),
        tipologiaProblema: tipologia,
      });
    } else {
      onChange({
        planningReale: { puAge: val },
        coeffDistorsioneTemporale: '',
      });
    }
  };

  const getPercent = (val: number, max: number) => {
    if (max <= 0) return 50;
    return Math.min(Math.max((val / max) * 100, 2), 98);
  };

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
          <span className="text-xs font-mono font-black text-upda-ciano">SCHEDA 02 • PLANNING</span>
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
        <span className="text-[10px] font-mono text-slate-400 uppercase">
          Biometria, Planning Utopico & Reale, Timeline e Tipologia
        </span>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Parametri Biometrici & Induttore */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
          {/* Braccio Induttore */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold block">
              Braccio Induttore
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  const newBraccio = 'DX';
                  onChange({
                    braccioInduttore: newBraccio,
                    ...(realeCalculated ? {
                      tipologiaProblema: (realeCalculated.puReale >= realeCalculated.ptUtopico) ? 'PT ante PU DX' : 'PT post PU DX'
                    } : {})
                  });
                }}
                className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all border ${
                  data.braccioInduttore === 'DX'
                    ? 'bg-upda-petrolio text-white border-upda-petrolio shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                DX (Destro)
              </button>
              <button
                type="button"
                onClick={() => {
                  const newBraccio = 'SX';
                  onChange({
                    braccioInduttore: newBraccio,
                    ...(realeCalculated ? {
                      tipologiaProblema: (realeCalculated.puReale >= realeCalculated.ptUtopico) ? 'PT ante PU SX' : 'PT post PU SX'
                    } : {})
                  });
                }}
                className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all border ${
                  data.braccioInduttore === 'SX'
                    ? 'bg-upda-petrolio text-white border-upda-petrolio shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                SX (Sinistro)
              </button>
            </div>
          </div>

          {/* Segno */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold block">
              Segno Analogico
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChange({ segno: '+' })}
                className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all border ${
                  data.segno === '+'
                    ? 'bg-upda-petrolio text-white border-upda-petrolio shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                + (Positivo)
              </button>
              <button
                type="button"
                onClick={() => onChange({ segno: '-' })}
                className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all border ${
                  data.segno === '-'
                    ? 'bg-upda-petrolio text-white border-upda-petrolio shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                - (Negativo)
              </button>
            </div>
          </div>

          {/* Identificazione (SOLO OMO ED ETERO) */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold block">
              Identificazione
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChange({ identificazione: 'Omo' })}
                className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all border ${
                  data.identificazione === 'Omo'
                    ? 'bg-upda-petrolio text-white border-upda-petrolio shadow-xs ring-1 ring-upda-petrolio'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                OMO
              </button>
              <button
                type="button"
                onClick={() => onChange({ identificazione: 'Etero' })}
                className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all border ${
                  data.identificazione === 'Etero'
                    ? 'bg-upda-petrolio text-white border-upda-petrolio shadow-xs ring-1 ring-upda-petrolio'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                ETERO
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PLANNING UTOPICO (PT = PU = Età / 2) */}
        {/* ========================================================================= */}
        <div className="space-y-4 p-5 bg-slate-50/70 rounded-xl border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-upda-petrolio" />
              <div>
                <h3 className="text-xs font-mono font-black uppercase tracking-widest text-slate-900">
                  PLANNING UTOPICO <span className="text-upda-petrolio font-bold">(PT = PU = Età / 2)</span>
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">
                  Calcolo matematico automatico: PT = PU è la metà esatta degli anni ({utopicoCalculated.age} anni)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleApplyUtopicoFormulas}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RotateCcw size={12} className="text-slate-500" />
              <span>Ricalcola Formule Utopiche</span>
            </button>
          </div>

          {/* Riepilogo Formule Utopiche */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">PT = PU (Metà Anni)</span>
              <strong className="text-sm font-black text-upda-petrolio">{utopicoCalculated.ptPu.toFixed(1)}a</strong>
              <span className="text-[8px] font-mono text-slate-400 block mt-0.5">{utopicoCalculated.age} / 2</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">CDS (Costante / Spazio)</span>
              <strong className="text-sm font-black text-slate-900">{utopicoCalculated.cds.toFixed(1)}a</strong>
              <span className="text-[8px] font-mono text-slate-400 block mt-0.5">{utopicoCalculated.age} / 4</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">AF Utopico (PT - CDS)</span>
              <strong className="text-sm font-black text-amber-700">{utopicoCalculated.af.toFixed(1)}a</strong>
              <span className="text-[8px] font-mono text-slate-400 block mt-0.5">{utopicoCalculated.ptPu.toFixed(1)} - {utopicoCalculated.cds.toFixed(1)}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">F Utopico (PT + CDS)</span>
              <strong className="text-sm font-black text-emerald-700">{utopicoCalculated.f.toFixed(1)}a</strong>
              <span className="text-[8px] font-mono text-slate-400 block mt-0.5">{utopicoCalculated.ptPu.toFixed(1)} + {utopicoCalculated.cds.toFixed(1)}</span>
            </div>
          </div>

          {/* Asse Temporale Grafico Utopico */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex justify-between text-[11px] font-mono font-bold text-slate-500">
              <span>Nascita (0a)</span>
              <span className="text-upda-petrolio font-black uppercase tracking-wider">Asse Time-Line Utopica (PT = PU)</span>
              <span>Età Attuale ({utopicoCalculated.age}a)</span>
            </div>

            {/* Linea grafica con marker proporzionati */}
            <div className="relative py-8 px-4">
              <div className="h-2.5 bg-slate-200 rounded-full w-full relative shadow-inner">
                {/* Marker 0 */}
                <div className="absolute left-[0%] top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-slate-400 border-2 border-white shadow-xs"></div>
                  <span className="text-[8px] font-mono text-slate-400 mt-1">0a</span>
                </div>

                {/* Marker AF Utopico */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10"
                  style={{ left: `${getPercent(utopicoCalculated.af, utopicoCalculated.age)}%` }}
                >
                  <span className="text-[9px] font-mono font-black text-amber-700 mb-1">AF</span>
                  <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-sm ring-2 ring-amber-200"></div>
                  <span className="text-[9px] font-mono font-bold text-amber-800 mt-1">
                    {utopicoCalculated.af.toFixed(1)}a
                  </span>
                </div>

                {/* Marker PT = PU Utopico (Centro esatto) */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-20"
                  style={{ left: `${getPercent(utopicoCalculated.ptPu, utopicoCalculated.age)}%` }}
                >
                  <span className="text-[10px] font-mono font-black text-upda-petrolio mb-1">PT = PU</span>
                  <div className="w-6 h-6 rounded-full bg-upda-petrolio border-2 border-white shadow-md ring-4 ring-upda-ciano/40 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-upda-ciano"></span>
                  </div>
                  <span className="text-[10px] font-mono font-black text-upda-petrolio mt-1">
                    {utopicoCalculated.ptPu.toFixed(1)}a
                  </span>
                </div>

                {/* Marker F Utopico */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10"
                  style={{ left: `${getPercent(utopicoCalculated.f, utopicoCalculated.age)}%` }}
                >
                  <span className="text-[9px] font-mono font-black text-emerald-700 mb-1">F</span>
                  <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm ring-2 ring-emerald-200"></div>
                  <span className="text-[9px] font-mono font-bold text-emerald-800 mt-1">
                    {utopicoCalculated.f.toFixed(1)}a
                  </span>
                </div>

                {/* Marker Età Attuale */}
                <div className="absolute left-[100%] top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-white shadow-xs"></div>
                  <span className="text-[8px] font-mono font-bold text-slate-800 mt-1">{utopicoCalculated.age}a</span>
                </div>
              </div>
            </div>

            {/* Input Età Eventi Utopici e Valori EC */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                  Età AF (Antefatto)
                </label>
                <input
                  type="text"
                  value={data.planningUtopico.afAge || utopicoCalculated.af.toFixed(1)}
                  onChange={(e) => onChange({
                    planningUtopico: { ...data.planningUtopico, afAge: e.target.value }
                  })}
                  placeholder="Es. 12.5"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                  Età PT = PU (Punto Utopico)
                </label>
                <input
                  type="text"
                  value={data.planningUtopico.ptPuAge || utopicoCalculated.ptPu.toFixed(1)}
                  onChange={(e) => onChange({
                    planningUtopico: { ...data.planningUtopico, ptPuAge: e.target.value }
                  })}
                  placeholder="Es. 25"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                  Età F (Fatto)
                </label>
                <input
                  type="text"
                  value={data.planningUtopico.fAge || utopicoCalculated.f.toFixed(1)}
                  onChange={(e) => onChange({
                    planningUtopico: { ...data.planningUtopico, fAge: e.target.value }
                  })}
                  placeholder="Es. 37.5"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PLANNING REALE (Calcolato SOLO se viene inserito un numero) */}
        {/* ========================================================================= */}
        <div className="space-y-4 p-5 bg-slate-50/70 rounded-xl border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-upda-petrolio" />
              <div>
                <h3 className="text-xs font-mono font-black uppercase tracking-widest text-slate-900">
                  PLANNING REALE
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">
                  Il calcolo della Time-Line reale si attiva solo quando viene inserito il numero dell'età del Punto Utente (PU)
                </p>
              </div>
            </div>
            {hasValidPuReale && (
              <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                <CheckCircle2 size={12} />
                Time-Line Reale Calcolata
              </span>
            )}
          </div>

          {/* Campo Input Età PU Reale */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="max-w-md space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-700 font-bold block flex items-center justify-between">
                <span>Età PU Reale (Punto Utente / Denuncia Reale)</span>
                <span className="text-[9px] text-slate-400 font-normal">Inserisci un valore numerico</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.5"
                  value={data.planningReale.puAge}
                  onChange={(e) => handlePuRealeChange(e.target.value)}
                  placeholder="Es. 28 (Inserisci numero per calcolare)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-upda-petrolio focus:ring-1 focus:ring-upda-petrolio"
                />
                {data.planningReale.puAge && (
                  <button
                    type="button"
                    onClick={() => handlePuRealeChange('')}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-mono font-bold"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* SE NON È STATO INSERITO UN NUMERO: STATO DI ATTESA */}
            {!hasValidPuReale ? (
              <div className="p-5 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex items-center gap-3 text-slate-600">
                <Info size={20} className="text-slate-400 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-xs font-mono font-bold text-slate-800">
                    In attesa dell'inserimento dell'Età PU Reale
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Inserendo l'età del Punto Utente Reale sopra, verranno calcolati automaticamente la Time-Line Reale, il Coefficiente di Distorsione Temporale (CDT), il Segno e la Tipologia del Problema.
                  </p>
                </div>
              </div>
            ) : (
              /* SE È STATO INSERITO UN NUMERO: VISUALIZZAZIONE CALCOLATA */
              realeCalculated && (
                <div className="space-y-5 pt-2 border-t border-slate-100">
                  {/* Indicatori Calcolati Reali */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">PU Reale Inserito</span>
                      <strong className="text-sm font-black text-rose-700">{realeCalculated.puReale.toFixed(1)}a</strong>
                      <span className="text-[8px] font-mono text-slate-400 block mt-0.5">Punto di Denuncia</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">CDT (Distorsione Temporale)</span>
                      <strong className="text-sm font-black text-slate-900">{realeCalculated.segnoCD}{realeCalculated.cdtAbs.toFixed(1)}a</strong>
                      <span className="text-[8px] font-mono text-slate-400 block mt-0.5">|{realeCalculated.puReale.toFixed(1)} - {realeCalculated.ptUtopico.toFixed(1)}|</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">AF Reale (PU - CDS)</span>
                      <strong className="text-sm font-black text-amber-700">{realeCalculated.afReale.toFixed(1)}a</strong>
                      <span className="text-[8px] font-mono text-slate-400 block mt-0.5">{realeCalculated.puReale.toFixed(1)} - {realeCalculated.cds.toFixed(1)}</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">F Reale (PU + CDS)</span>
                      <strong className="text-sm font-black text-emerald-700">{realeCalculated.fReale.toFixed(1)}a</strong>
                      <span className="text-[8px] font-mono text-slate-400 block mt-0.5">{realeCalculated.puReale.toFixed(1)} + {realeCalculated.cds.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Asse Temporale Reale Grafico */}
                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between text-[11px] font-mono font-bold text-slate-500">
                      <span>0a</span>
                      <span className="text-slate-900 font-black uppercase tracking-wider">Asse Time-Line Reale</span>
                      <span>Età Attuale ({utopicoCalculated.age}a)</span>
                    </div>

                    <div className="relative py-8 px-4">
                      <div className="h-2.5 bg-slate-200 rounded-full w-full relative shadow-inner">
                        {/* Marker 0 */}
                        <div className="absolute left-[0%] top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-slate-400 border-2 border-white shadow-xs"></div>
                          <span className="text-[8px] font-mono text-slate-400 mt-1">0a</span>
                        </div>

                        {/* Riferimento PT Utopico (Linea guida tratteggiata) */}
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10 opacity-60"
                          style={{ left: `${getPercent(realeCalculated.ptUtopico, utopicoCalculated.age)}%` }}
                        >
                          <span className="text-[8px] font-mono text-slate-500 mb-1">PT Utopico</span>
                          <div className="w-3.5 h-3.5 rounded-full bg-slate-300 border border-slate-500"></div>
                          <span className="text-[8px] font-mono text-slate-500 mt-1">{realeCalculated.ptUtopico.toFixed(1)}a</span>
                        </div>

                        {/* Marker AF Reale */}
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10"
                          style={{ left: `${getPercent(realeCalculated.afReale, utopicoCalculated.age)}%` }}
                        >
                          <span className="text-[9px] font-mono font-black text-amber-700 mb-1">AF Reale</span>
                          <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-sm ring-2 ring-amber-200"></div>
                          <span className="text-[9px] font-mono font-bold text-amber-800 mt-1">
                            {realeCalculated.afReale.toFixed(1)}a
                          </span>
                        </div>

                        {/* Marker PU Reale */}
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-20"
                          style={{ left: `${getPercent(realeCalculated.puReale, utopicoCalculated.age)}%` }}
                        >
                          <span className="text-[10px] font-mono font-black text-rose-600 mb-1">PU Reale</span>
                          <div className="w-6 h-6 rounded-full bg-rose-600 border-2 border-white shadow-md ring-4 ring-rose-200 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                          </div>
                          <span className="text-[10px] font-mono font-black text-rose-700 mt-1">
                            {realeCalculated.puReale.toFixed(1)}a
                          </span>
                        </div>

                        {/* Marker F Reale */}
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10"
                          style={{ left: `${getPercent(realeCalculated.fReale, utopicoCalculated.age)}%` }}
                        >
                          <span className="text-[9px] font-mono font-black text-emerald-700 mb-1">F Reale</span>
                          <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm ring-2 ring-emerald-200"></div>
                          <span className="text-[9px] font-mono font-bold text-emerald-800 mt-1">
                            {realeCalculated.fReale.toFixed(1)}a
                          </span>
                        </div>

                        {/* Marker Età Attuale */}
                        <div className="absolute left-[100%] top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
                          <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-white shadow-xs"></div>
                          <span className="text-[8px] font-mono font-bold text-slate-800 mt-1">{utopicoCalculated.age}a</span>
                        </div>
                      </div>
                    </div>

                    {/* Stato Benessere Energetico */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Stato Energetico Rilevato</span>
                        <span className="text-xs font-bold text-slate-900">{realeCalculated.statoBenessere}</span>
                      </div>
                      <span className="text-[10px] font-mono bg-white px-2.5 py-1 rounded border border-slate-200 text-slate-700 font-bold">
                        CDT = {realeCalculated.segnoCD}{realeCalculated.cdtAbs.toFixed(1)}a
                      </span>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TIPOLOGIA E NATURA PROBLEMA */}
        {/* ========================================================================= */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Compass size={18} className="text-upda-petrolio" />
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-slate-900">
              TIPOLOGIA E NATURA DEL PROBLEMA
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colonna 1: Tipologia (PT/PU e Braccio) */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-700 font-bold block">
                  Tipologia del Problema
                </label>
                {realeCalculated && (
                  <span className="text-[9px] font-mono text-upda-petrolio bg-upda-ciano/10 px-2 py-0.5 rounded font-bold">
                    Suggerito: {realeCalculated.tipologiaSuggerita}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {[
                  { id: 'PT ante PU DX', label: 'PT ante PU DX', sub: 'Ordinario', note: 'PT < PU (Passato comprime futuro) • Braccio DX' },
                  { id: 'PT post PU DX', label: 'PT post PU DX', sub: 'Aberrante', note: 'PT > PU (Futuro ostacolato da passato) • Braccio DX' },
                  { id: 'PT ante PU SX', label: 'PT ante PU SX', sub: 'Aberrante', note: 'PT < PU (Passato comprime futuro) • Braccio SX' },
                  { id: 'PT post PU SX', label: 'PT post PU SX', sub: 'Ordinario', note: 'PT > PU (Futuro ostacolato da passato) • Braccio SX' },
                ].map((item) => {
                  const isSelected = data.tipologiaProblema === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => onChange({ tipologiaProblema: item.id as any })}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col gap-1 ${
                        isSelected
                          ? 'bg-upda-ciano/15 border-upda-petrolio font-bold text-upda-petrolio shadow-xs ring-1 ring-upda-petrolio'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-upda-petrolio bg-upda-petrolio' : 'border-slate-400 bg-white'
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                          </span>
                          <span className="text-xs font-mono font-bold">{item.label}</span>
                        </div>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                          isSelected ? 'bg-upda-petrolio text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          ({item.sub})
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 pl-6">{item.note}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Colonna 2: Natura (Allineato / Alterato) */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-700 font-bold block">
                Natura del Problema
              </label>

              <div className="space-y-2">
                {[
                  {
                    id: 'Allineato',
                    label: 'Analisi conflitti = Timeline',
                    sub: 'Allineato',
                    desc: 'La denuncia del conflitto coincide esattamente con la configurazione della Time-Line.'
                  },
                  {
                    id: 'Alterato',
                    label: 'Analisi conflitti ≠ Timeline',
                    sub: 'Alterato',
                    desc: 'Presenza di discrepanza o distorsione tra la denuncia logica e la matrice della Time-Line.'
                  }
                ].map((item) => {
                  const isSelected = data.naturaProblema === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => onChange({ naturaProblema: item.id as any })}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all space-y-1.5 ${
                        isSelected
                          ? 'bg-upda-ciano/15 border-upda-petrolio text-upda-petrolio shadow-xs ring-1 ring-upda-petrolio'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-upda-petrolio bg-upda-petrolio' : 'border-slate-400 bg-white'
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                          </span>
                          <span className="text-xs font-mono font-bold">{item.label}</span>
                        </div>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                          isSelected ? 'bg-upda-petrolio text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          ({item.sub})
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 pl-6 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Pulsanti Navigazione */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
          {onPrev ? (
            <button
              type="button"
              onClick={onPrev}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <ArrowLeft size={14} />
              <span>Scheda 01 (Indagine)</span>
            </button>
          ) : <div></div>}

          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="px-6 py-3 bg-upda-petrolio hover:bg-upda-petrolio/90 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
            >
              <span>Procedi a Scheda 03 (Celebrazione)</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
