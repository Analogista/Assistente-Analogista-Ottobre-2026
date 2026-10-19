export interface TapEvaluationResult {
  title: string;
  typology: string;
  distonia: string;
  primaryInductor: string;
  energyDynamics: string;
  originConflict: string;
  fwdSymbol: string;
  bwdSymbols: string[];
  behavioralTraits: string;
  analogistStrategy: string;
  isStandard: boolean;
  notes?: string;
}

export interface TapReferenceCombination {
  gender: 'M' | 'F';
  fwd: string;
  bwd: string[];
  title: string;
  typology: string;
  distonia: string;
  description: string;
}

export const TAP_REFERENCE_TABLE: TapReferenceCombination[] = [
  // Maschile
  {
    gender: 'M',
    fwd: 'Cerchio',
    bwd: ['Asta'],
    title: "Conflittuale Padre dell'Essere",
    typology: 'Conflittuale Padre',
    distonia: "Distonia dell'Essere",
    description: "Gradimento Cerchio (Sé), Rifiuto Asta (Padre). GdP / Pensiero Realista. Repressione di Reattività e rancore."
  },
  {
    gender: 'M',
    fwd: 'Asta',
    bwd: ['Triangolo'],
    title: "Conflittuale Madre dell'Avere",
    typology: 'Conflittuale Madre',
    distonia: "Distonia dell'Avere",
    description: "Gradimento Asta (Padre), Rifiuto Triangolo (Madre). MdC / Pensiero Idealista. Compressione del Pathos e sensi di colpa."
  },
  {
    gender: 'M',
    fwd: 'Asta',
    bwd: ['Cerchio', 'Triangolo'],
    title: "Ego-Maschio dell'Essere Base",
    typology: 'Ego-Maschio (ex Conflittuale Madre)',
    distonia: "Distonia dell'Essere",
    description: "Gradimento Asta, Doppio Rifiuto Cerchio e Triangolo. Struttura egocentrica difensiva, mediazione triadica."
  },
  {
    gender: 'M',
    fwd: 'Asta',
    bwd: ['Cerchio'],
    title: "Ego-Femmina dell'Avere Base",
    typology: 'Ego-Femmina (ex Conflittuale Padre)',
    distonia: "Distonia dell'Avere",
    description: "Gradimento Asta, Rifiuto Cerchio. Ricerca del possesso/gratificazione emotiva con leva seduttiva."
  },
  {
    gender: 'M',
    fwd: 'Cerchio',
    bwd: ['Triangolo'],
    title: "Conflittuale Madre dell'Essere",
    typology: 'Conflittuale Madre',
    distonia: "Distonia dell'Essere",
    description: "Gradimento Cerchio, Rifiuto Triangolo. Conflitto materno vissuto sull'identità e sul piano valoriale."
  },
  {
    gender: 'M',
    fwd: 'Triangolo',
    bwd: ['Asta'],
    title: "Conflittuale Padre dell'Avere",
    typology: 'Conflittuale Padre',
    distonia: "Distonia dell'Avere",
    description: "Gradimento Triangolo, Rifiuto Asta. Conflitto paterno proiettato sul desiderio e mete da conquistare."
  },
  {
    gender: 'M',
    fwd: 'Triangolo',
    bwd: ['Asta', 'Cerchio'],
    title: "Ego-Femmina dell'Essere Base",
    typology: 'Ego-Femmina (ex Conflittuale Padre)',
    distonia: "Distonia dell'Essere",
    description: "Gradimento Triangolo, Doppio Rifiuto Asta e Cerchio. Dinamica egocentrica con polarizzazione sull'Essere."
  },
  {
    gender: 'M',
    fwd: 'Triangolo',
    bwd: ['Cerchio'],
    title: "Ego-Maschio dell'Avere Base",
    typology: 'Ego-Maschio (ex Conflittuale Madre)',
    distonia: "Distonia dell'Avere",
    description: "Gradimento Triangolo, Rifiuto Cerchio. Dinamica egocentrica con polarizzazione sull'Avere."
  },
  {
    gender: 'M',
    fwd: 'Cerchio',
    bwd: ['Asta', 'Triangolo'],
    title: "Ego Triadico dell'Essere",
    typology: 'Ego Triadico',
    distonia: "Equilibrio Triadico",
    description: "Gradimento Cerchio, Doppio Rifiuto Asta e Triangolo. Elevata centratura sull'Io con ricarica su entrambe le figure genitoriali."
  },

  // Femminile
  {
    gender: 'F',
    fwd: 'Cerchio',
    bwd: ['Triangolo'],
    title: "Conflittuale Madre dell'Essere",
    typology: 'Conflittuale Madre',
    distonia: "Distonia dell'Essere",
    description: "Gradimento Cerchio (Sé), Rifiuto Triangolo (Madre). GdP / Pensiero Realista. Difesa dell'autonomia decisionale."
  },
  {
    gender: 'F',
    fwd: 'Triangolo',
    bwd: ['Asta'],
    title: "Conflittuale Padre dell'Avere",
    typology: 'Conflittuale Padre',
    distonia: "Distonia dell'Avere",
    description: "Gradimento Triangolo (Madre), Rifiuto Asta (Padre). MdC / Pensiero Idealista. Ricerca del riconoscimento e della meta ideale."
  },
  {
    gender: 'F',
    fwd: 'Triangolo',
    bwd: ['Asta', 'Cerchio'],
    title: "Ego-Femmina dell'Essere Base",
    typology: 'Ego-Femmina (ex Conflittuale Padre)',
    distonia: "Distonia dell'Essere",
    description: "Gradimento Triangolo, Doppio Rifiuto Asta e Cerchio. Struttura egocentrica, contrasto materno e identificazione sotto stress."
  },
  {
    gender: 'F',
    fwd: 'Triangolo',
    bwd: ['Cerchio'],
    title: "Ego-Maschio dell'Avere Base",
    typology: 'Ego-Maschio (ex Conflittuale Madre)',
    distonia: "Distonia dell'Avere",
    description: "Gradimento Triangolo, Rifiuto Cerchio. Struttura egocentrica con spinta all'Avere e mediazione empatica."
  },
  {
    gender: 'F',
    fwd: 'Cerchio',
    bwd: ['Asta'],
    title: "Conflittuale Padre dell'Essere",
    typology: 'Conflittuale Padre',
    distonia: "Distonia dell'Essere",
    description: "Gradimento Cerchio, Rifiuto Asta. Conflitto paterno vissuto sull'identità e sul piano valoriale."
  },
  {
    gender: 'F',
    fwd: 'Asta',
    bwd: ['Triangolo'],
    title: "Conflittuale Madre dell'Avere",
    typology: 'Conflittuale Madre',
    distonia: "Distonia dell'Avere",
    description: "Gradimento Asta, Rifiuto Triangolo. Conflitto materno sul piano affettivo e del possesso."
  },
  {
    gender: 'F',
    fwd: 'Asta',
    bwd: ['Cerchio', 'Triangolo'],
    title: "Ego-Maschio dell'Essere Base",
    typology: 'Ego-Maschio (ex Conflittuale Madre)',
    distonia: "Distonia dell'Essere",
    description: "Gradimento Asta, Doppio Rifiuto Cerchio e Triangolo. Dinamica egocentrica protettiva sull'Essere."
  },
  {
    gender: 'F',
    fwd: 'Asta',
    bwd: ['Cerchio'],
    title: "Ego-Femmina dell'Avere Base",
    typology: 'Ego-Femmina (ex Conflittuale Padre)',
    distonia: "Distonia dell'Avere",
    description: "Gradimento Asta, Rifiuto Cerchio. Dinamica egocentrica con polarizzazione sull'Avere."
  },
  {
    gender: 'F',
    fwd: 'Cerchio',
    bwd: ['Asta', 'Triangolo'],
    title: "Ego Triadico dell'Essere",
    typology: 'Ego Triadico',
    distonia: "Equilibrio Triadico",
    description: "Gradimento Cerchio, Doppio Rifiuto Asta e Triangolo. Elevata centratura sull'Io con ricarica su entrambe le figure genitoriali."
  }
];

export function evaluateTap(
  gender: 'M' | 'F' | string,
  fwd: string,
  rawBwd: string[]
): TapEvaluationResult {
  const bwd = [...rawBwd].sort();
  const genderKey: 'M' | 'F' = gender === 'F' ? 'F' : 'M';

  // Controllo congruenza: se lo stesso simbolo compare sia avanti che indietro
  if (bwd.includes(fwd)) {
    return {
      title: "Incongruenza nei Simboli Selezionati",
      typology: "Non Valutabile",
      distonia: "N/D",
      primaryInductor: "N/D",
      energyDynamics: "Conflitto di Segnale",
      originConflict: "Lo stesso simbolo non può esprimere contemporaneamente oscillazione in avanti (gradimento) e indietro (rifiuto).",
      fwdSymbol: fwd,
      bwdSymbols: bwd,
      behavioralTraits: "Ripetere il test per calibrare correttamente la risposta muscolare involontaria.",
      analogistStrategy: "Verificare la calibrazione del codice binario di metacomunicazione (SÌ/NO) prima di riproporre i simboli.",
      isStandard: false,
      notes: "Attenzione: il simbolo selezionato in avanti risulta selezionato anche all'indietro."
    };
  }

  // --- MASCHILE ---
  if (genderKey === 'M') {
    // 1. Conflittuale Padre dell'Essere
    if (fwd === 'Cerchio' && bwd.length === 1 && bwd[0] === 'Asta') {
      return {
        title: "Conflittuale Padre dell'Essere (Soggetto Maschile)",
        typology: "Conflittuale Padre",
        distonia: "Distonia dell'Essere (Io Sono)",
        primaryInductor: "Guardiano di Porta (Pensiero Realista)",
        energyDynamics: "Compressione della Reattività (Rabbia e Risentimento represso)",
        originConflict: "Conflitto originario con la figura paterna (giudicata inadeguata, rigida o assente).",
        fwdSymbol: "Cerchio (Sé)",
        bwdSymbols: ["Asta (Padre / Autorità)"],
        behavioralTraits: "Predilige le regole, il dovere e la dignità. Teme la sanzione ingiusta e diffida delle figure di autorità maschili. Tende ad auto-giustificare se stesso e ad incolpare l'esterno.",
        analogistStrategy: "Applicare penalizzazioni senza fornire giustificazioni logiche per agganciare la carica energetica reattiva. Evitare l'eccessiva protezione materna che risulterebbe inefficace.",
        isStandard: true
      };
    }

    // 2. Conflittuale Madre dell'Avere
    if (fwd === 'Asta' && bwd.length === 1 && bwd[0] === 'Triangolo') {
      return {
        title: "Conflittuale Madre dell'Avere (Soggetto Maschile)",
        typology: "Conflittuale Madre",
        distonia: "Distonia dell'Avere (Io Ho)",
        primaryInductor: "Mastro di Chiavi (Pensiero Idealista)",
        energyDynamics: "Compressione del Pathos (Sofferenza, Sensi di Colpa e Abbandono)",
        originConflict: "Conflitto originario con la figura materna (iperprotettiva, invasiva o sfuggente).",
        fwdSymbol: "Asta (Padre)",
        bwdSymbols: ["Triangolo (Madre / Piacere)"],
        behavioralTraits: "Predilige il piacere e il coinvolgimento, ma teme di sbagliare e di deludere. Tende a giustificare l'altro e ad auto-colpevolizzarsi (Sindrome di Dante e Beatrice).",
        analogistStrategy: "Penalizzare fornendo una motivazione logica strutturata per stimolare il sentimento e creare un profondo legame analogico; guidare il soggetto a de-idealizzare l'oggetto del desiderio.",
        isStandard: true
      };
    }

    // 3. Ego-Maschio dell'Essere Base (ex Conflittuale Madre)
    if (fwd === 'Asta' && bwd.length === 2 && bwd.includes('Cerchio') && bwd.includes('Triangolo')) {
      return {
        title: "Ego-Maschio dell'Essere Base (Soggetto Maschile, ex Conflittuale Madre)",
        typology: "Ego-Maschio",
        distonia: "Distonia dell'Essere (Io Sono)",
        primaryInductor: "Struttura Egocentrica (Matrice Guardiano di Porta)",
        energyDynamics: "Gestione strategica della Reattività mediata dal filtro dell'Ego",
        originConflict: "Evoluzione adolescenziale da Conflittuale Madre. Conflitto con il padre per sostituirlo e contrasto con la madre, con cui sotto stress si identifica.",
        fwdSymbol: "Asta (Padre)",
        bwdSymbols: ["Cerchio (Sé)", "Triangolo (Madre)"],
        behavioralTraits: "Costruisce una barriera protettiva egocentrica. Diffida del maschio evitando lo scontro diretto; predilige la persuasione, il controllo strategico e le alleanze triadiche.",
        analogistStrategy: "Trattare con rispetto per il suo ruolo di guida, non forzare la sottomissione, utilizzare stimoli di riconoscimento del merito e della competenza.",
        isStandard: true
      };
    }

    // 4. Ego-Femmina dell'Avere Base (ex Conflittuale Padre)
    if (fwd === 'Asta' && bwd.length === 1 && bwd[0] === 'Cerchio') {
      return {
        title: "Ego-Femmina dell'Avere Base (Soggetto Maschile, ex Conflittuale Padre)",
        typology: "Ego-Femmina",
        distonia: "Distonia dell'Avere (Io Ho)",
        primaryInductor: "Struttura Egocentrica (Matrice Mastro di Chiavi)",
        energyDynamics: "Compressione del Desiderio di possesso e gratificazione emotiva",
        originConflict: "Evoluzione adolescenziale da Conflittuale Padre. Conflitto con la madre per sostituirla e contrasto col padre, di cui sotto stress assume i tratti.",
        fwdSymbol: "Asta (Padre)",
        bwdSymbols: ["Cerchio (Sé)"],
        behavioralTraits: "Usa la seduzione e la fascinazione come strumenti primari di relazione. Evita la competizione frontale cercando un possesso emotivo e rassicurante.",
        analogistStrategy: "Soddisfare il bisogno di gratificazione emotiva mantenendo una posizione di guida solida ma accogliente.",
        isStandard: true
      };
    }

    // 5. Conflittuale Madre dell'Essere (Maschile)
    if (fwd === 'Cerchio' && bwd.length === 1 && bwd[0] === 'Triangolo') {
      return {
        title: "Conflittuale Madre dell'Essere (Soggetto Maschile)",
        typology: "Conflittuale Madre",
        distonia: "Distonia dell'Essere (Io Sono)",
        primaryInductor: "Guardiano di Porta (Variante Materna)",
        energyDynamics: "Reattività legata a vincoli di autonomia dall'archetipo materno",
        originConflict: "Conflitto materno vissuto primariamente sul piano dei principi e dell'identità personale.",
        fwdSymbol: "Cerchio (Sé)",
        bwdSymbols: ["Triangolo (Madre)"],
        behavioralTraits: "Cerca la propria affermazione identitaria difendendosi dalle intrusioni o dai condizionamenti della matrice materna.",
        analogistStrategy: "Lavorare sui vincoli di libertà e autonomia decisionale rispetto alle aspettative familiari.",
        isStandard: true
      };
    }

    // 6. Conflittuale Padre dell'Avere (Maschile)
    if (fwd === 'Triangolo' && bwd.length === 1 && bwd[0] === 'Asta') {
      return {
        title: "Conflittuale Padre dell'Avere (Soggetto Maschile)",
        typology: "Conflittuale Padre",
        distonia: "Distonia dell'Avere (Io Ho)",
        primaryInductor: "Mastro di Chiavi (Variante Paterna)",
        energyDynamics: "Pathos e ansia da prestazione nella conquista della meta",
        originConflict: "Conflitto paterno proiettato sul successo, sul possesso materiale e sull'approvazione esterna.",
        fwdSymbol: "Triangolo (Madre / Piacere)",
        bwdSymbols: ["Asta (Padre)"],
        behavioralTraits: "Tende a vivere mete e desideri come traguardi irraggiungibili per timore di non essere all'altezza dell'ideale paterno.",
        analogistStrategy: "Depotenziare il timore del fallimento e la sanzione del confronto.",
        isStandard: true
      };
    }

    // 7. Ego-Femmina dell'Essere Base (Maschile)
    if (fwd === 'Triangolo' && bwd.length === 2 && bwd.includes('Cerchio') && bwd.includes('Asta')) {
      return {
        title: "Ego-Femmina dell'Essere Base (Soggetto Maschile, ex Conflittuale Padre)",
        typology: "Ego-Femmina",
        distonia: "Distonia dell'Essere (Io Sono)",
        primaryInductor: "Struttura Egocentrica (Matrice Essere)",
        energyDynamics: "Equilibrio tra seduzione e difesa identitaria",
        originConflict: "Evoluzione da Conflittuale Padre su asse dell'Essere.",
        fwdSymbol: "Triangolo (Madre / Piacere)",
        bwdSymbols: ["Asta (Padre)", "Cerchio (Sé)"],
        behavioralTraits: "Utilizza l'approccio relazionale accogliente mantenendo una forte salvaguardia della propria sfera privata.",
        analogistStrategy: "Coinvolgere con stimoli estetici ed etici, confermando il suo valore distintivo.",
        isStandard: true
      };
    }

    // 8. Ego-Maschio dell'Avere Base (Maschile)
    if (fwd === 'Triangolo' && bwd.length === 1 && bwd[0] === 'Cerchio') {
      return {
        title: "Ego-Maschio dell'Avere Base (Soggetto Maschile, ex Conflittuale Madre)",
        typology: "Ego-Maschio",
        distonia: "Distonia dell'Avere (Io Ho)",
        primaryInductor: "Struttura Egocentrica (Matrice Avere)",
        energyDynamics: "Desiderio di possesso e affermazione protettiva",
        originConflict: "Evoluzione da Conflittuale Madre su asse dell'Avere.",
        fwdSymbol: "Triangolo (Madre / Piacere)",
        bwdSymbols: ["Cerchio (Sé)"],
        behavioralTraits: "Focalizzato sul raggiungimento di obiettivi concreti attraverso la negoziazione e la ricerca di consenso.",
        analogistStrategy: "Offrire chiarezza negli accordi e valorizzare i risultati conseguiti.",
        isStandard: true
      };
    }

    // 9. Ego Triadico Bilanciato (Maschile)
    if (fwd === 'Cerchio' && bwd.length === 2 && bwd.includes('Asta') && bwd.includes('Triangolo')) {
      return {
        title: "Ego Triadico dell'Essere (Soggetto Maschile)",
        typology: "Ego Triadico",
        distonia: "Equilibrio Triadico Dinamico",
        primaryInductor: "Polo Egocentrico di Sintesi",
        energyDynamics: "Doppia leva energetica reattiva ed empatica",
        originConflict: "Forte centratura sull'Io con ricarica emotiva su entrambe le matrici genitoriali.",
        fwdSymbol: "Cerchio (Sé)",
        bwdSymbols: ["Asta (Padre)", "Triangolo (Madre)"],
        behavioralTraits: "Capacità di alternare ruoli direttivi e ruoli accoglienti a seconda del contesto.",
        analogistStrategy: "Interlocuzione ad alto potenziale carismatico, stimolando la coerenza tra visione interiore e azione.",
        isStandard: true
      };
    }
  }

  // --- FEMMINILE ---
  if (genderKey === 'F') {
    // 1. Conflittuale Madre dell'Essere
    if (fwd === 'Cerchio' && bwd.length === 1 && bwd[0] === 'Triangolo') {
      return {
        title: "Conflittuale Madre dell'Essere (Soggetto Femminile)",
        typology: "Conflittuale Madre",
        distonia: "Distonia dell'Essere (Io Sono)",
        primaryInductor: "Guardiano di Porta (Pensiero Realista)",
        energyDynamics: "Compressione della Reattività e rivendicazione di autonomia",
        originConflict: "Conflitto originario con la figura materna (giudicata prevaricante, giudicante o svalutante).",
        fwdSymbol: "Cerchio (Sé)",
        bwdSymbols: ["Triangolo (Madre / Femminile)"],
        behavioralTraits: "Difende tenacemente la propria indipendenza e libertà di scelta. Diffida delle figure femminili dominanti. Tende a non tollerare imposizioni o paragoni svalutanti.",
        analogistStrategy: "Penalizzare senza giustificazioni preventive per attivare la reattività positiva; evitare atteggiamenti di tutela o superiorità che verrebbero percepiti come materni e rifiutati.",
        isStandard: true
      };
    }

    // 2. Conflittuale Padre dell'Avere
    if (fwd === 'Triangolo' && bwd.length === 1 && bwd[0] === 'Asta') {
      return {
        title: "Conflittuale Padre dell'Avere (Soggetto Femminile)",
        typology: "Conflittuale Padre",
        distonia: "Distonia dell'Avere (Io Ho)",
        primaryInductor: "Mastro di Chiavi (Pensiero Idealista)",
        energyDynamics: "Compressione del Pathos, paura dell'abbandono e ricerca di approvazione",
        originConflict: "Conflitto originario con la figura paterna (distante, idealizzata o poco gratificante).",
        fwdSymbol: "Triangolo (Madre / Accoglienza)",
        bwdSymbols: ["Asta (Padre / Maschile)"],
        behavioralTraits: "Tende a idealizzare il partner o la meta affettiva, assumendo un atteggiamento di dedizione ma temendo il rifiuto (Sindrome di Dante e Beatrice al femminile).",
        analogistStrategy: "Penalizzare motivando logicamente l'intervento; lavorare sull'autostima affettiva e sulla liberazione dai vincoli di dipendenza dal giudizio maschile.",
        isStandard: true
      };
    }

    // 3. Ego-Femmina dell'Essere Base (ex Conflittuale Padre)
    if (fwd === 'Triangolo' && bwd.length === 2 && bwd.includes('Cerchio') && bwd.includes('Asta')) {
      return {
        title: "Ego-Femmina dell'Essere Base (Soggetto Femminile, ex Conflittuale Padre)",
        typology: "Ego-Femmina",
        distonia: "Distonia dell'Essere (Io Sono)",
        primaryInductor: "Struttura Egocentrica (Matrice Guardiano di Porta)",
        energyDynamics: "Gestione strategica della Reattività e leadership personale",
        originConflict: "Evoluzione adolescenziale da Conflittuale Padre. Conflitto con la madre per prenderne il posto e contrasto col padre, di cui sotto stress adotta i comportamenti.",
        fwdSymbol: "Triangolo (Madre)",
        bwdSymbols: ["Cerchio (Sé)", "Asta (Padre)"],
        behavioralTraits: "Costruisce una forte barriera di protezione egocentrica. Diffida delle donne evitando lo scontro frontale e prediligendo la seduzione e la diplomazia strategica.",
        analogistStrategy: "Riconoscere e valorizzare la sua intelligenza relazionale ed eleganza operativa senza tentativi di controllo diretto.",
        isStandard: true
      };
    }

    // 4. Ego-Maschio dell'Avere Base (ex Conflittuale Madre)
    if (fwd === 'Triangolo' && bwd.length === 1 && bwd[0] === 'Cerchio') {
      return {
        title: "Ego-Maschio dell'Avere Base (Soggetto Femminile, ex Conflittuale Madre)",
        typology: "Ego-Maschio",
        distonia: "Distonia dell'Avere (Io Ho)",
        primaryInductor: "Struttura Egocentrica (Matrice Mastro di Chiavi)",
        energyDynamics: "Compressione del Pathos canalizzata nella determinazione e conquista",
        originConflict: "Evoluzione adolescenziale da Conflittuale Madre. Conflitto con il padre per sostituirlo e contrasto con la madre, di cui sotto stress assume la componente protettiva.",
        fwdSymbol: "Triangolo (Madre)",
        bwdSymbols: ["Cerchio (Sé)"],
        behavioralTraits: "Carattere dinamico, orientato all'azione e alla concretezza. Evita lo scontro diretto con il maschio prediligendo l'intesa e la collaborazione pragmatica.",
        analogistStrategy: "Interloquire con concretezza, valorizzando gli obiettivi e stabilendo un clima di reciproca stima professionale.",
        isStandard: true
      };
    }

    // 5. Conflittuale Padre dell'Essere (Femminile)
    if (fwd === 'Cerchio' && bwd.length === 1 && bwd[0] === 'Asta') {
      return {
        title: "Conflittuale Padre dell'Essere (Soggetto Femminile)",
        typology: "Conflittuale Padre",
        distonia: "Distonia dell'Essere (Io Sono)",
        primaryInductor: "Guardiano di Porta (Variante Paterna)",
        energyDynamics: "Reattività legata a principi di rigore ed etica personale",
        originConflict: "Conflitto paterno vissuto sull'affermazione del proprio valore e dell'integrità morale.",
        fwdSymbol: "Cerchio (Sé)",
        bwdSymbols: ["Asta (Padre)"],
        behavioralTraits: "Forte senso di giustizia, refrattaria alle ipocrisie e all'autoritarismo fine a se stesso.",
        analogistStrategy: "Mantenere coerenza assoluta tra parole e azioni per guadagnare fiducia profonda.",
        isStandard: true
      };
    }

    // 6. Conflittuale Madre dell'Avere (Femminile)
    if (fwd === 'Asta' && bwd.length === 1 && bwd[0] === 'Triangolo') {
      return {
        title: "Conflittuale Madre dell'Avere (Soggetto Femminile)",
        typology: "Conflittuale Madre",
        distonia: "Distonia dell'Avere (Io Ho)",
        primaryInductor: "Mastro di Chiavi (Variante Materna)",
        energyDynamics: "Pathos legato al senso di colpa e al bisogno di accudimento",
        originConflict: "Conflitto materno incentrato sul bisogno di calore emotivo non corrisposto.",
        fwdSymbol: "Asta (Padre / Razionalità)",
        bwdSymbols: ["Triangolo (Madre)"],
        behavioralTraits: "Tende a compensare la carenza affettiva originaria attraverso la ricerca di relazioni rassicuranti.",
        analogistStrategy: "Supportare l'emancipazione dai sensi di colpa inconsci legati al diritto alla felicità.",
        isStandard: true
      };
    }

    // 7. Ego-Maschio dell'Essere Base (Femminile)
    if (fwd === 'Asta' && bwd.length === 2 && bwd.includes('Cerchio') && bwd.includes('Triangolo')) {
      return {
        title: "Ego-Maschio dell'Essere Base (Soggetto Femminile, ex Conflittuale Madre)",
        typology: "Ego-Maschio",
        distonia: "Distonia dell'Essere (Io Sono)",
        primaryInductor: "Struttura Egocentrica (Matrice Essere)",
        energyDynamics: "Leadership e protezione strategica dell'identità",
        originConflict: "Evoluzione egocentrica da matrice materna dell'Essere.",
        fwdSymbol: "Asta (Padre)",
        bwdSymbols: ["Cerchio (Sé)", "Triangolo (Madre)"],
        behavioralTraits: "Forte determinazione e capacità di orientamento decisionale indipendente.",
        analogistStrategy: "Favorire l'espressione della sua visione strategica riconoscendone l'autonomia.",
        isStandard: true
      };
    }

    // 8. Ego-Femmina dell'Avere Base (Femminile)
    if (fwd === 'Asta' && bwd.length === 1 && bwd[0] === 'Cerchio') {
      return {
        title: "Ego-Femmina dell'Avere Base (Soggetto Femminile, ex Conflittuale Padre)",
        typology: "Ego-Femmina",
        distonia: "Distonia dell'Avere (Io Ho)",
        primaryInductor: "Struttura Egocentrica (Matrice Avere)",
        energyDynamics: "Desiderio di gratificazione e possesso affettivo",
        originConflict: "Evoluzione egocentrica da matrice paterna dell'Avere.",
        fwdSymbol: "Asta (Padre)",
        bwdSymbols: ["Cerchio (Sé)"],
        behavioralTraits: "Spiccata sensibilità e orientamento al coinvolgimento empatico.",
        analogistStrategy: "Garantire un clima di trasparenza e reciprocità emozionale.",
        isStandard: true
      };
    }

    // 9. Ego Triadico Bilanciato (Femminile)
    if (fwd === 'Cerchio' && bwd.length === 2 && bwd.includes('Asta') && bwd.includes('Triangolo')) {
      return {
        title: "Ego Triadico dell'Essere (Soggetto Femminile)",
        typology: "Ego Triadico",
        distonia: "Equilibrio Triadico Dinamico",
        primaryInductor: "Polo Egocentrico di Sintesi",
        energyDynamics: "Doppia leva energetica integrata",
        originConflict: "Equilibrio dinamico tra istanze affettive ed etiche.",
        fwdSymbol: "Cerchio (Sé)",
        bwdSymbols: ["Asta (Padre)", "Triangolo (Madre)"],
        behavioralTraits: "Spiccata versatilità relazionale e lucidità intuitiva.",
        analogistStrategy: "Interlocuzione ad alto livello di risonanza analogica e metacomunicativa.",
        isStandard: true
      };
    }
  }

  // --- Combinazione Atipica / Dinamica Personalizzata ---
  return {
    title: `Configurazione Analogica Dinamica (${fwd} / ${bwd.join(' + ')})`,
    typology: "Tipologia Personalizzata / Transizionale",
    distonia: fwd === 'Cerchio' ? "Distonia dell'Essere (Prevalenza)" : (fwd === 'Triangolo' ? "Distonia dell'Avere (Prevalenza)" : "Distonia Mista"),
    primaryInductor: fwd === 'Cerchio' || bwd.includes('Asta') ? "Guardiano di Porta (Orientamento Realista)" : "Mastro di Chiavi (Orientamento Idealista)",
    energyDynamics: `Attrazione verso l'archetipo ${fwd} e tensione energetica stimolata da ${bwd.join(' e ')}`,
    originConflict: `Interazione complessa con il polo ${bwd.join(', ')}, indicativa di una fase di transizione o adattamento emotivo.`,
    fwdSymbol: fwd,
    bwdSymbols: bwd,
    behavioralTraits: "La combinazione riflette una risposta non standardizzata, tipica di soggetti con doppia polarizzazione o in fase di sblocco emozionale.",
    analogistStrategy: "Procedere con la verifica del codice binario di metacomunicazione (SÌ/NO) e approfondire la Time-Line per identificare l'evento cardine originario.",
    isStandard: false,
    notes: "Combinazione non catalogata tra i 4 archetipi base primari ma perfettamente interpretabile sul piano energetico-simbolico."
  };
}
