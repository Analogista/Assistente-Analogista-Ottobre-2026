import { SessionState } from "../types";
import { DISPENSE_CONTENT } from "../dispenseAnalogiche";

export async function getAISuggestions(data: Partial<SessionState>): Promise<string[]> {
  // Local heuristic rule-based engine derived from Stefano Benemeglio's Analogical Discipline
  const suggestions: string[] = [];
  const inductor = data.inductor || '';
  const distonicPoints = data.distonicPoints || [];
  const seals = data.seals || [];

  if (inductor.includes('Guardiano')) {
    suggestions.push(
      "Analizzare il conflitto con il Guardiano di Porta (GdP) e il vissuto di risentimento represso.",
      "Verificare la presenza di barriere di difesa legate al rifiuto o alla vergogna.",
      "Esplorare il legame tra il blocco attuale e la libertà oppressa nel passato."
    );
  } else if (inductor.includes('Mastro')) {
    suggestions.push(
      "Indagare il senso di colpa e il timore del giudizio legato al Mastro di Chiavi (MdC).",
      "Valutare la percezione della sanzione o punizione autoperccepita dall'inconscio.",
      "Applicare il protocollo di riequilibrio sul triangolo emotivo originario."
    );
  } else {
    suggestions.push(
      "Identificare l'Induttore prevalente (Guardiano o Mastro) in base alla dinamica sintomatica.",
      "Esplorare il Turbamento Base (TB) e il Turbamento Relativo (TR) del cliente.",
      "Verificare la Ruota del Tempo per determinare l'egemonia tra passato e presente."
    );
  }

  if (distonicPoints.length > 0) {
    suggestions.push(`Approfondire il punto distonico critico: ${distonicPoints[distonicPoints.length - 1]}.`);
  }

  if (seals.length > 0) {
    suggestions.push(`Esaminare il sigillo analogico emerso: ${seals[0]} per sciogliere il blocco.`);
  }

  return suggestions.slice(0, 4);
}

export async function generateTechnicalSummary(data: SessionState): Promise<string> {
  const name = data.subject?.name || 'Cliente';
  const age = data.subject?.age || 'N.D.';
  const gender = data.subject?.gender || 'N.D.';
  const inductor = data.inductor || 'Non specificato';
  const conflict = data.conflictType || 'Non specificato';
  const distonics = data.distonicPoints?.length ? data.distonicPoints.join(', ') : 'Nessuno';
  const sealsList = data.seals?.length ? data.seals.join(', ') : 'Nessuno';
  const witness = data.witness || 'Non specificato';

  return `RELAZIONE TECNICA DI SINTESI ANALOGICA (Metodo Stefano Benemeglio)

Soggetto: ${name} (Età: ${age}, Genere: ${gender})
Testimone / Duplicato: ${witness}
Induttore Prevalente: ${inductor}
Tipologia di Conflitto: ${conflict}
Punti Distonici Rilevati: ${distonics}
Sigilli Analogici: ${sealsList}

ANALISI DEL CASO E DINAMICA EMOZIONALE:
L'analisi condotta secondo i principi delle Discipline Analogiche evidenzia una chiara polarizzazione nell'induttore ${inductor}. Il cliente sperimenta una distorsione percettiva generata dal conflitto tra il pensiero individuo e il pensiero ombra. 

In base al quadro emerso, l'inconscio del cliente attiva un meccanismo di difesa protettivo (Demarcatore Ipnotico / DK) che sposta l'attenzione dall'evento originario (Antefatto / Fatto) all'effetto sintomatico attuale. 

STRATEGIA OPERATIVA E DI INTERVENTO:
1. Riconoscimento della causa originaria mediante l'utilizzo del Planning della Memoria e calcolo del Coefficiente Temporale di Commutazione (CTC).
2. Sblocco del canale emotivo attraverso la comunicazione analogica mirata al superamento del sigillo (${sealsList}).
3. Rieducazione del dialogo interiore per dissolvere il senso di colpa o il risentimento verso il duplicato genitoriale (${witness}), ripristinando il corretto flusso tra Passato, Presente e Futuro.

[Elaborato in modalità locale integrata - Discipline Analogiche di Stefano Benemeglio]`;
}


