export interface Scheda1Data {
  nome: string;
  cognome: string;
  telefono: string;
  eta: string;
  professione?: string;
  recapito?: string;
  focusObiettivo: string;
  famigliaOrigine: 'SI' | 'NO' | '';
  famigliaOrigineNote: string;
  rapportiSentimentali: 'SI' | 'NO' | '';
  rapportiSentimentaliNote: string;
  rapportiSessuali: 'SI' | 'NO' | '';
  rapportiSessualiNote: string;
  autorealizzazione: 'SI' | 'NO' | '';
  autorealizzazioneNote: string;
  disturbiEmotivita: 'SI' | 'NO' | '';
  disturbiEmotivitaQuali: string;
  causaConflitto: 'Genitori' | 'SeStesso' | 'Altri' | 'Destino' | '';
  punti?: Array<{ id: string; titolo: string; valore: string; dettaglio?: string }>;
  causaPuntiSelezionati?: string[];
  cosaNonFarestiMai?: string;
}

export interface Scheda2Data {
  braccioInduttore: 'DX' | 'SX' | '';
  segno: '+' | '-' | '';
  identificazione: 'Omo' | 'Etero' | '';
  // Planning Utopico (PT=PU)
  planningUtopico: {
    afAge: string;
    ptPuAge: string;
    fAge: string;
  };
  // Planning Reale
  planningReale: {
    puAge: string;
  };
  segnoCD: '+' | '-' | '';
  coeffDistorsioneTemporale: string;
  coeffSpaziale: string;
  // Tipologia e Natura Problema
  tipologiaProblema: 'PT ante PU DX' | 'PT post PU DX' | 'PT ante PU SX' | 'PT post PU SX' | '';
  naturaProblema: 'Allineato' | 'Alterato' | '';
}

export interface Scheda3Data {
  tipologiaNaturaRiepilogo: string;
  // Personaggi della relazione significativa
  recettoreRiflessivoEnteGiudicante: string; // PT / DK
  recettoreEmotivoEnteGiudicato: string; // AF / F
  personaggioCelebrarePrimo: string;
  // Accettazione / Perdono
  istanzaAnalogica: 'GIUSTIFICATO' | 'NON GIUSTIFICATO' | '';
  istanzaLogica: 'GIUSTIFICATO' | 'NON GIUSTIFICATO' | '';
  matriceLA: 'L:SI/NO A:NO' | 'L:NO/SI A:SI' | 'L:SI/SI A:SI' | 'L:NO/NO A:NO' | '';
  tematicaRegressiva: 'DELUSIONE' | 'FALLIMENTO' | '';
}

export interface OfficialInvestigationState {
  scheda1: Scheda1Data;
  scheda2: Scheda2Data;
  scheda3: Scheda3Data;
}

export const INITIAL_OFFICIAL_STATE: OfficialInvestigationState = {
  scheda1: {
    nome: '',
    cognome: '',
    telefono: '',
    eta: '',
    professione: '',
    recapito: '',
    focusObiettivo: '',
    famigliaOrigine: '',
    famigliaOrigineNote: '',
    rapportiSentimentali: '',
    rapportiSentimentaliNote: '',
    rapportiSessuali: '',
    rapportiSessualiNote: '',
    autorealizzazione: '',
    autorealizzazioneNote: '',
    disturbiEmotivita: '',
    disturbiEmotivitaQuali: '',
    causaConflitto: '',
    punti: [],
    causaPuntiSelezionati: [],
    cosaNonFarestiMai: ''
  },
  scheda2: {
    braccioInduttore: 'DX',
    segno: '+',
    identificazione: 'Omo',
    planningUtopico: {
      afAge: '0',
      ptPuAge: '',
      fAge: ''
    },
    planningReale: {
      puAge: ''
    },
    segnoCD: '+',
    coeffDistorsioneTemporale: '',
    coeffSpaziale: '',
    tipologiaProblema: 'PT ante PU DX',
    naturaProblema: 'Allineato'
  },
  scheda3: {
    tipologiaNaturaRiepilogo: '',
    recettoreRiflessivoEnteGiudicante: '',
    recettoreEmotivoEnteGiudicato: '',
    personaggioCelebrarePrimo: '',
    istanzaAnalogica: '',
    istanzaLogica: '',
    matriceLA: '',
    tematicaRegressiva: ''
  }
};
