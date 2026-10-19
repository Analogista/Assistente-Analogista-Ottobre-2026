import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export const SequenzaIndagineUfficiale: React.FC = () => {
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
              Protocollo operativo: Il riequilibrio emozionale e metacomunicativo
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
          <div className="space-y-6">
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs">
                Fondamenti Filosofici e Inquadramento del Metodo
              </h4>
              <p className="text-[11px] text-slate-600">
                Le Discipline Analogiche Benemegliane® poggiano sulla decodifica strategica dell’interazione tra l’Istanza Logica (Io Adulto), deputata alla razionalità e al sillogismo per evitare la sofferenza, e l’Istanza Analogica (Io Bambino), mossa esclusivamente dalla ricerca del piacere e dall'appagamento dei bisogni profondi. La distonia, ovvero il conflitto tra queste due parti, nasce quando la realtà non soddisfa il bisogno tensionale originario, spingendo l'inconscio a ricercare autonomamente situazioni che rigenerino i turbamenti del passato per garantire l'energia del sistema.
              </p>
              <p className="text-[11px] text-slate-600">
                Il principio cardine è l’Analogia: a differenza del sillogismo logico (causa-effetto), l’analogia opera per ripetizione e somiglianza. L’inconscio associa stati emotivi a eventi cronologicamente distanti, inducendo l'individuo a rivivere schemi ciclici. L’equilibrio dell’individuo dipende dal rispetto di tre principi non negoziabili:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[11px] text-slate-600">
                <li><strong className="text-slate-800">Libertà:</strong> Capacità di agire secondo il proprio libero arbitrio e sistema di valori, senza condizionamenti esterni o vincoli emotivi.</li>
                <li><strong className="text-slate-800">Sogno:</strong> La spinta energetica verso mete ambite; l'oltraggio al sogno mina la capacità di conquista e il piacere della "corsa" verso l'obiettivo.</li>
                <li><strong className="text-slate-800">Coscienza:</strong> L'archivio storico dell'esperienza emotiva e giudice superiore che sovrintende alle scelte di vita.</li>
              </ul>
              <p className="text-[11px] text-slate-600">
                L’oltraggio a uno di questi pilastri genera il turbamento. L’Analogista deve applicare il protocollo con assoluto rigore tecnico per evitare di essere "plagiato" dalla logica del cliente, garantendo un intervento di precisione chirurgica sulla sfera emotiva.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs">
                Fase 01 & 02: Accoglienza, Consenso e Analisi dei 5 Punti
              </h4>
              <p className="text-[11px] text-slate-600">
                In questa fase preliminare, l’Analogista stabilisce il setting e assume il ruolo di Simbolo Gratificante. Tale posizionamento è essenziale per superare le barriere difensive dell'Io Adulto e acquisire il potenziale (carisma e ascendente) necessario per l’intervento.
              </p>
              <p className="text-[11px] text-slate-600">
                Dopo la sottoscrizione del Consenso Informato, si procede all'Intervista per la Raccolta Dati. L’operatore deve filtrare le informazioni fornite, consapevole che la parola logica è intrinsecamente "menzognera" poiché finalizzata a celare le vulnerabilità reali.
              </p>
              
              <h5 className="font-bold text-slate-800 text-[11px] mt-4 mb-2">Analisi dei 5 Punti: Logica vs. Emozione</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-y border-slate-200 text-left">
                      <th className="py-2 px-3 font-semibold text-slate-700">Punto dell'Intervista</th>
                      <th className="py-2 px-3 font-semibold text-slate-700">Interpretazione Analogica (Focus dell'Operatore)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-2 px-3 font-medium text-slate-800">Il Problema</td>
                      <td className="py-2 px-3 text-slate-600">Identificazione del segnale di bisogno non appagato dietro il disagio denunciato.</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-2 px-3 font-medium text-slate-800">L'Auto-interpretazione</td>
                      <td className="py-2 px-3 text-slate-600">Analisi del filtro della sofferenza e delle giustificazioni razionali (menzogna logica).</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-2 px-3 font-medium text-slate-800">Il Precedente Analogico</td>
                      <td className="py-2 px-3 text-slate-600">Ricerca di proiezioni di conflitti originari legati a figure significative (GP/MC).</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-2 px-3 font-medium text-slate-800">Il Vissuto di Fallimento</td>
                      <td className="py-2 px-3 text-slate-600">Mappatura del carico energetico negativo e dei sensi di colpa accumulati.</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-2 px-3 font-medium text-slate-800">La Cronologia Logica</td>
                      <td className="py-2 px-3 text-slate-600">Struttura superficiale necessaria per individuare i varchi d'accesso alla Time-Line.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-slate-600 mt-4 mb-2 font-medium">
                Durante l’intervista, porre tassativamente le seguenti 4 domande esplorative:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[11px] text-slate-600">
                <li><strong className="text-slate-800">Area Genitori:</strong> Qual è il vissuto emotivo, il senso di colpa o il rimpianto legato alla figura paterna o materna?</li>
                <li><strong className="text-slate-800">Area Altri:</strong> In che modo le relazioni significative (partner, colleghi) alimentano il disagio attuale o fungono da specchio di conflitti irrisolti?</li>
                <li><strong className="text-slate-800">Area Se Stesso:</strong> Quali giudizi o fallimenti personali ti attribuisci riguardo a come le cose sarebbero dovute andare?</li>
                <li><strong className="text-slate-800">Area Destino:</strong> Quali eventi percepiti come ineluttabili o ingiusti provocano in te rammarico o impotenza?</li>
              </ul>
              <p className="text-[11px] text-slate-600 mt-3 font-medium italic">
                Questi dati logici costituiscono la base per l'attivazione del codice di metacomunicazione, unico strumento in grado di interrogare la verità dell'inconscio.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs">
                Fase 03: Attivazione del Codice di Metacomunicazione Binario
              </h4>
              <p className="text-[11px] text-slate-600">
                L’Analogista deve bypassare la comunicazione verbale attivando un codice di risposta binario (Sì/No) tramite l'Ipnosi Metafisica. Si utilizza il corpo del soggetto come interfaccia, sfruttando la risposta muscolare involontaria.
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
