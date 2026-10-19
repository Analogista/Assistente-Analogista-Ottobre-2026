import React from 'react';

interface TimeLineGraphProps {
  age: number;
  PU: number;
  PT: number;
  AF: number;
  F: number;
  eventAge?: number;
}

export const TimeLineGraph: React.FC<TimeLineGraphProps> = ({ age, PU, PT, AF, F, eventAge }) => {
  const maxAge = Math.max(age || 1, 10);

  const getPercent = (val: number) => {
    return Math.min(Math.max((val / maxAge) * 100, 0), 100);
  };

  const markers = [
    { label: '0', sublabel: 'Inizio', val: 0, color: 'border-slate-400 text-slate-600' },
    { label: `${AF.toFixed(1)}a`, sublabel: 'AF: Antefatto', val: AF, color: 'border-amber-500 text-amber-700' },
    { label: `${PU.toFixed(1)}a`, sublabel: 'PU: Punto Utopico', val: PU, color: 'border-blue-500 text-blue-700' },
    { label: `${PT.toFixed(1)}a`, sublabel: 'PT: Punto Topico', val: PT, color: 'border-purple-500 text-purple-700' },
    { label: `${F.toFixed(1)}a`, sublabel: 'F: Fatto', val: F, color: 'border-emerald-500 text-emerald-700' },
    ...(eventAge && eventAge > 0 ? [{ label: `${eventAge}a`, sublabel: 'Evento Causa', val: eventAge, color: 'border-rose-500 text-rose-700' }] : []),
    { label: `${age}a`, sublabel: 'Età Attuale', val: age, color: 'border-slate-900 text-slate-900' },
  ];

  return (
    <div className="w-full bg-white p-4 md:p-8 rounded-2xl border border-slate-200 shadow-sm my-6">
      <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 text-center">
        Grafico Asse Temporale e Punti Chiave
      </h3>

      {/* Contenitore adattato per smartphone senza necessità di scroll nascosto */}
      <div className="relative w-full h-44 my-4 flex items-center px-4 md:px-8">
        {/* Linea orizzontale di base */}
        <div className="absolute left-6 right-6 md:left-10 md:right-10 h-2 bg-slate-200 rounded-full shadow-inner z-0"></div>

        {/* Marcatori verticali e etichette alternate */}
        {markers.map((m, idx) => {
          const pct = getPercent(m.val);
          const isAbove = idx % 2 === 0; // Alternanza: pari sopra, dispari sotto

          return (
            <div 
              key={idx}
              className="absolute top-0 bottom-0 transform -translate-x-1/2 flex flex-col items-center cursor-pointer group z-10"
              style={{ 
                left: `calc(1.5rem + (${pct} / 100) * (100% - 3rem))` 
              }}
            >
              {/* Etichetta SOPRA (se isAbove è true) */}
              <div className={`absolute top-1 transform -translate-y-1/2 text-center whitespace-nowrap ${isAbove ? 'block' : 'hidden'}`}>
                <div className="bg-white border px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-lg shadow-sm flex flex-col items-center">
                  <span className="text-[9px] md:text-[11px] font-black tracking-tight text-slate-900">{m.label}</span>
                  <span className="text-[7px] md:text-[9px] font-mono uppercase tracking-tighter text-slate-500">{m.sublabel}</span>
                </div>
              </div>

              {/* Linea verticale passante per l'asse */}
              <div className="absolute top-0 bottom-0 w-0.5 bg-upda-petrolio/70 flex items-center justify-center">
                <div className={`w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full bg-white border-2 shadow-sm z-20 ${m.color.split(' ')[0]}`} />
              </div>

              {/* Etichetta SOTTO (se isAbove è false) */}
              <div className={`absolute bottom-1 transform translate-y-1/2 text-center whitespace-nowrap ${!isAbove ? 'block' : 'hidden'}`}>
                <div className="bg-white border px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-lg shadow-sm flex flex-col items-center">
                  <span className="text-[9px] md:text-[11px] font-black tracking-tight text-slate-900">{m.label}</span>
                  <span className="text-[7px] md:text-[9px] font-mono uppercase tracking-tighter text-slate-500">{m.sublabel}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
