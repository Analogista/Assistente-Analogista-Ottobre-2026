import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export const SequenzaIndagine: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-upda-ciano/10 flex items-center justify-center text-upda-petrolio">
            <BookOpen size={16} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900">
              SEQUENZA INDAGINE ANALOGISTA
            </h3>
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
              Protocollo operativo e cronologico della prima sessione
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-upda-petrolio">
          <span>{isOpen ? 'Chiudi' : 'Apri Guida'}</span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 md:p-8 space-y-6 text-slate-700 text-xs leading-relaxed border-t border-slate-100 bg-slate-50/50">
          <p className="italic font-medium text-slate-600">
            Ecco la sequenza esatta e in ordine cronologico dei passaggi e delle domande d'indagine che l'Analogista deve porre al cliente durante la prima sessione per strutturare la diagnosi emotiva:
          </p>

          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs">
                1. Il Modello Interattivo Logico (Primi 15 minuti)
              </h4>
              <p className="text-[11px] text-slate-600">
                Il colloquio inizia in modalità verbale (mente logica) per definire l'orientamento iniziale e mappare le aree della vita del soggetto:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[11px]">
                <li><strong className="text-slate-800">Definizione del Focus:</strong> Si accoglie il cliente e si individua il problema o sintomo specifico da lui denunciato.</li>
                <li><strong className="text-slate-800">Indagine preliminare sui 5 Punti Distonici:</strong> Si affrontano in modo discorsivo le aree di vita del soggetto per individuare dove risiede il carico tensionale: Famiglia d'origine, Famiglia acquisita, Rapporti affettivi e sessuali, Autorealizzazione (lavoro/hobby), Disturbi dell'emotività/comportamento (ansia, angoscia, paura, panico).</li>
                <li><strong className="text-slate-800">La Domanda Verbale:</strong> Si chiede direttamente alla logica del soggetto: <em>"Chi ritieni sia stata, nella vita, la causa dei tuoi piccoli o grandi problemi tra: Mamma, Papà, Te stesso/a, Tutti e due i genitori, Nessuno dei due, o Gli altri?"</em>. (Questa risposta servirà all'operatore per verificare l'allineamento con la successiva risposta istintiva dell'inconscio).</li>
                <li><strong className="text-slate-800">La Domanda Magica (Benemeglio):</strong> Si pone l'interrogativo chiave: <em>"Cos'è che non faresti mai per risolvere il tuo problema?"</em> per fare emergere il timore della sanzione o il rancore/sentimento compresso. <span className="block mt-1 font-semibold text-upda-petrolio italic">Nota: Non è "ciò che faresti" ma ciò che non faresti e più che fare quella cosa, preferiresti tenerti il problema stesso.</span></li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs">
                2. Sensibilizzazione e Induzione (Modello Interattivo Analogico)
              </h4>
              <p className="text-[11px] text-slate-600">
                Si chiede al soggetto di posizionarsi in posizione ortostatica (in piedi), con gli occhi chiusi e gambe leggermente divaricate per iniziare il dialogo non verbale:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[11px]">
                <li><strong className="text-slate-800">Sensibilizzazione Metafisica (Mano Dx/Sx):</strong> Si fa compiere un movimento rotatorio energico con una mano alla volta per rintracciare il Braccio Induttore. L'oscillazione in avanti rivelerà il braccio induttore e la tipologia di pensiero del soggetto (Braccio Destro = Pensiero Realista / Crisi d'identità; Braccio Sinistro = Pensiero Idealista / Crisi esistenziale).</li>
                <li><strong className="text-slate-800">Test del Nome e Calibrazione (Codice di Metacomunicazione - C.M.):</strong> Si interroga l'inconscio ponendo la domanda sul nome di battesimo vero per verificare l'oscillazione in avanti (SÌ) e su un nome inventato falso per verificare l'oscillazione all'indietro (NO).</li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs">
                3. Test Analogico della Personalità (T.A.P.)
              </h4>
              <p className="text-[11px] text-slate-600">
                Sempre in posizione ortostatica, si mostrano visivamente o gestualmente i tre simboli archetipici:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[11px]">
                <li>Si avvicinano singolarmente al viso del soggetto i simboli Asta, Cerchio e Triangolo osservandone la reazione fisica.</li>
                <li>L'oscillazione all'indietro rivelerà l'Alimentatore del soggetto, definendo matematicamente la sua tipologia caratteriale (Conflittuale Padre, Conflittuale Madre, Ego Maschio o Ego Femmina) e i relativi coefficienti energetici di Pathos, Reattività e Coefficiente Distonico.</li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs">
                4. Indagine sulla Time-Line e calcolo dell'Età del Trauma
              </h4>
              <p className="text-[11px] text-slate-600">
                Una volta stabilito il canale di metacomunicazione del SÌ e del NO, si interroga l'inconscio sulla storia emozionale:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[11px]">
                <li>Si indaga la decade e l'anno esatto in cui sono avvenuti l'Antefatto (l'evento causa originario) e il Fatto (la conclamazione o conseguenza del problema).</li>
                <li>I dati ricavati dal test visivo dei coefficienti spaziali vengono inseriti nell'Equazione Spazio/Tempo per calcolare matematicamente l'età esatta dei traumi subiti.</li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs">
                5. Identificazione del Testimone e del Negoziato
              </h4>
              <ul className="list-disc pl-5 space-y-1.5 text-[11px]">
                <li><strong className="text-slate-800">Ricerca del Testimone:</strong> Si interroga l'inconscio per sapere chi era presente al momento del trauma (il Testimone, ovvero la persona da cui si è subito il torto).</li>
                <li><strong className="text-slate-800">Giustificazione del Torto:</strong> Si verifica se la logica e l'inconscio hanno giustificato o meno il torto ricevuto, preparando l'allievo o il cliente alla successiva fase di Celebrazione e decompressione ipno-regressiva per depotenziare il sigillo emotivo.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
