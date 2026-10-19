export interface SubjectData {
  name: string;
  telefono: string;
  age: number;
  gender: 'M' | 'F' | '';
  focus: string;
}

export interface TimelineData {
  denouncedAge: number;
  eventType: 'AF' | 'F' | '';
}

export interface SessionState {
  subject: SubjectData;
  inductor: 'Guardiano di Porta-Grillo Parlante' | 'Mastro di Chiavi-Lucignolo' | '';
  conflictType: 'i GENITORI' | 'ALTRI' | 'SE\' STESSO/A' | '';
  distonicPoints: string[];
  seals: string[];
  timeline: TimelineData;
  witness: string;
  alfiere: string;
  celebrationTarget: 'AF' | 'F' | 'PT' | 'Alfiere' | 'PU' | '';
  decompressionLevel: number;
  eventSubjects: Record<string, string>;
  isJustified: boolean | null;
}

export const INITIAL_STATE: SessionState = {
  subject: { name: '', telefono: '', age: 0, gender: '', focus: '' },
  inductor: '',
  conflictType: '',
  distonicPoints: [],
  seals: [],
  timeline: { denouncedAge: 0, eventType: '' },
  witness: '',
  alfiere: '',
  celebrationTarget: '',
  decompressionLevel: 0,
  eventSubjects: {},
  isJustified: null
};
