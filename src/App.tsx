import React, { useState, useMemo, useEffect } from 'react';


import { 
  User, 
  Activity, 
  Zap, 
  FileText, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  BookOpen, 
  Clock,
  ShieldAlert,
  Users,
  CheckSquare,
  Square,
  Info,
  Printer,
  X,
  Volume2,
  VolumeX,
  LogIn,
  LogOut,
  Save,
  Trash2,
  History,
  CheckCircle,
  CheckCircle2,
  Check,
  MessageSquare,
  Shield,
  Home,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { KNOWLEDGE_BASE } from './knowledgeBase';
import { SessionState, INITIAL_STATE } from './types';
import { FeedbackForm } from './components/FeedbackForm';
import { AdminFeedbackView } from './components/AdminFeedbackView';
import { TimeLineGraph } from './components/TimeLineGraph';
import { SequenzaIndagine } from './components/SequenzaIndagine';
import { SequenzaIndagineUfficiale } from './components/SequenzaIndagineUfficiale';
import { Scheda1IndagineView } from './components/official/Scheda1IndagineView';
import { Scheda2PlanningView } from './components/official/Scheda2PlanningView';
import { Scheda3CelebrazioneView } from './components/official/Scheda3CelebrazioneView';
import { OfficialInvestigationState, INITIAL_OFFICIAL_STATE } from './types/officialTypes';
import { evaluateTap, TAP_REFERENCE_TABLE, TapEvaluationResult } from './services/tapService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getAISuggestions, generateTechnicalSummary } from './services/geminiService';
import { Sparkles, Loader2 } from 'lucide-react';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  handleFirestoreError,
  OperationType,
  User as FirebaseUser,
  isFirebaseValid
} from './firebase';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const WITNESS_OPTIONS = [
  "Padre", "Madre", "Fratello", "Sorella", "Nonno", "Nonna", "Zio", "Zia", 
  "Cugino", "Cugina", "Amico", "Amica", "Insegnante", "Partner", "Ignoto"
];

export default function App() {
  const [state, setState] = useState<SessionState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState(1);
  const [investigationMode, setInvestigationMode] = useState<'none' | 'officiale' | 'completa'>('none');
  const [problemDefinition, setProblemDefinition] = useState({
    tipologia: 'Ordinario',
    natura: 'Allineata',
    sintomoManifesto: '',
    contestoEmotivo: '',
    obiettivo: '',
    domandaMagica: '',
    note: ''
  });
  const [blockAnalysisState, setBlockAnalysisState] = useState({
    quattroPunti: [] as string[],
    quattroPuntiComments: {} as Record<string, string>,
    analisiBlocchi: [] as string[],
    analisiBlocchiComments: {} as Record<string, string>,
    analisiCause: [] as string[],
    analisiCauseComments: {} as Record<string, string>
  });
  const [officialState, setOfficialState] = useState<OfficialInvestigationState>(INITIAL_OFFICIAL_STATE);

  const updateOfficialScheda1 = (updated: Partial<typeof officialState.scheda1>) => {
    setOfficialState(prev => {
      const newScheda1 = { ...prev.scheda1, ...updated };
      setState(s => ({
        ...s,
        subject: {
          ...s.subject,
          name: newScheda1.nome ? `${newScheda1.nome} ${newScheda1.cognome}`.trim() : s.subject.name,
          age: Number(newScheda1.eta) || s.subject.age,
          focus: newScheda1.focusObiettivo || s.subject.focus
        }
      }));
      return { ...prev, scheda1: newScheda1 };
    });
  };

  const updateOfficialScheda2 = (updated: Partial<typeof officialState.scheda2>) => {
    setOfficialState(prev => ({
      ...prev,
      scheda2: { ...prev.scheda2, ...updated }
    }));
  };

  const updateOfficialScheda3 = (updated: Partial<typeof officialState.scheda3>) => {
    setOfficialState(prev => ({
      ...prev,
      scheda3: { ...prev.scheda3, ...updated }
    }));
  };

  const [tapForward, setTapForward] = useState<string>('');
  const [tapBackward, setTapBackward] = useState<string[]>([]);
  const [tapResult, setTapResult] = useState<string | null>(null);
  const [tapEvaluation, setTapEvaluation] = useState<TapEvaluationResult | null>(null);

  const calculateTap = (customGender?: 'M' | 'F', customFwd?: string, customBwd?: string[]) => {
    const genderToUse = customGender || state.subject.gender || 'M';
    const fwdToUse = customFwd || tapForward;
    const bwdToUse = customBwd || tapBackward;

    if (!fwdToUse || bwdToUse.length === 0) {
      setTapResult(null);
      setTapEvaluation(null);
      return;
    }

    const evaluation = evaluateTap(genderToUse, fwdToUse, bwdToUse);
    setTapResult(evaluation.title);
    setTapEvaluation(evaluation);
  };
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeSeal, setActiveSeal] = useState<string | null>(null);
  const [showTapGuide, setShowTapGuide] = useState(false);
  const [tapGuideGenderTab, setTapGuideGenderTab] = useState<'M' | 'F'>('M');
  
  // Auth & Firebase State
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [savedReports, setSavedReports] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [lastErrorMessage, setLastErrorMessage] = useState<string | null>(null);
  const [showServerWakeupNotice, setShowServerWakeupNotice] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('dismiss_wakeup_banner') !== 'true';
    } catch {
      return true;
    }
  });

  const localFallbackUser = {
    uid: 'local_user_analogista',
    email: 'analogistabrindisi@gmail.com',
    displayName: 'Analogista Brindisi',
    photoURL: null,
    emailVerified: true,
    isAnonymous: false,
    tenantId: null,
    providerInfo: []
  } as any;

  useEffect(() => {
    if (!isFirebaseValid || localStorage.getItem('analogista_logged_in') === 'true') {
      setIsAuthLoading(false);
      if (localStorage.getItem('analogista_logged_in') === 'true') {
        setUser(localFallbackUser);
      }
      try {
        const local = localStorage.getItem('analogista_local_reports');
        if (local) {
          setSavedReports(JSON.parse(local));
        }
      } catch (e) {
        console.error("Error loading local reports:", e);
      }
      if (!isFirebaseValid) return;
    }

    let unsubscribeReports: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
      
      // Clear previous listener
      if (unsubscribeReports) {
        unsubscribeReports();
        unsubscribeReports = null;
      }

      if (currentUser) {
        // Sync user profile
        const userRef = doc(db, 'users', currentUser.uid);
        
        getDoc(userRef).then(docSnap => {
          if (!docSnap.exists()) {
            // First time: create with createdAt
            setDoc(userRef, {
              displayName: currentUser.displayName,
              email: currentUser.email,
              photoURL: currentUser.photoURL,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            }).catch(error => {
              console.error("User profile create error:", error);
            });
          } else {
            // Successive times: update with merge, omitting createdAt
            setDoc(userRef, {
              displayName: currentUser.displayName,
              email: currentUser.email,
              photoURL: currentUser.photoURL,
              updatedAt: serverTimestamp()
            }, { merge: true }).catch(error => {
              console.error("User profile update error:", error);
            });
          }
        }).catch(err => {
          // If getDoc fails (e.g. permission error, though rules should allow get for owner)
          console.error("User profile fetch error:", err);
        });

        // Listen for reports
        const reportsQuery = query(
          collection(db, `users/${currentUser.uid}/reports`),
          where('ownerId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        
        unsubscribeReports = onSnapshot(reportsQuery, (snapshot) => {
          const reports = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setSavedReports(reports);
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, `users/${currentUser.uid}/reports`);
        });
      } else {
        setSavedReports([]);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeReports) unsubscribeReports();
    };
  }, []);

  const handleLogin = async () => {
    if (!isFirebaseValid) {
      setUser(localFallbackUser);
      localStorage.setItem('analogista_logged_in', 'true');
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.warn("Firebase popup login failed, falling back to local session:", error);
      setUser(localFallbackUser);
      localStorage.setItem('analogista_logged_in', 'true');
    }
  };

  const handleLogout = async () => {
    if (!isFirebaseValid || user?.uid === 'local_user_analogista') {
      localStorage.removeItem('analogista_logged_in');
      setUser(null);
      setAiSummary('');
      setAiSuggestions([]);
      setState(INITIAL_STATE);
      return;
    }
    try {
      await signOut(auth);
      setAiSummary('');
      setAiSuggestions([]);
      setState(INITIAL_STATE);
    } catch (error) {
      console.error("Logout Error:", error);
      localStorage.removeItem('analogista_logged_in');
      setUser(null);
    }
  };

  const saveCurrentReport = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    setLastErrorMessage(null);

    if (!isFirebaseValid) {
      try {
        const newReport = {
          id: 'local_' + Date.now(),
          subjectName: state.subject.name || 'ANONIMO',
          subjectAge: state.subject.age,
          subjectGender: state.subject.gender,
          inductor: state.inductor,
          conflictType: state.conflictType,
          distonicPoints: state.distonicPoints,
          seals: state.seals,
          witness: state.witness,
          isJustified: state.isJustified,
          decompressionLevel: state.decompressionLevel,
          timelineResults: timelineResults || null,
          tapForward: tapForward || '',
          tapBackward: tapBackward || [],
          tapResult: tapResult || null,
          problemDefinition: problemDefinition || {},
          blockAnalysisState: blockAnalysisState || {},
          officialState: officialState || null,
          investigationMode,
          aiSummary: aiSummary || '',
          createdAt: new Date().toISOString()
        };
        const updated = [newReport, ...savedReports];
        setSavedReports(updated);
        localStorage.setItem('analogista_local_reports', JSON.stringify(updated, (() => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value) || key === 'sourceEvent' || key === '_reactName' || key === '_targetInst' || key === 'nativeEvent') {
        return undefined;
      }
      seen.add(value);
    }
    return value;
  };
})()));
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(null), 3000);
      } catch (err: any) {
        setSaveStatus('error');
        setLastErrorMessage(err.message || 'Errore salvataggio locale');
      } finally {
        setIsSaving(false);
      }
      return;
    }

    if (!user) {
      setIsSaving(false);
      return;
    }

    const path = `users/${user.uid}/reports`;
    try {
      await addDoc(collection(db, path), {
        ownerId: user.uid,
        subjectName: state.subject.name || 'ANONIMO',
        subjectAge: state.subject.age,
        subjectGender: state.subject.gender,
        inductor: state.inductor,
        conflictType: state.conflictType,
        distonicPoints: state.distonicPoints,
        seals: state.seals,
        witness: state.witness,
        isJustified: state.isJustified,
        decompressionLevel: state.decompressionLevel,
        timelineResults: timelineResults || null,
        tapForward: tapForward || '',
        tapBackward: tapBackward || [],
        tapResult: tapResult || null,
        problemDefinition: problemDefinition || {},
        blockAnalysisState: blockAnalysisState || {},
        officialState: officialState || null,
        investigationMode,
        aiSummary: aiSummary || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error: any) {
      console.error("Save error:", error);
      setSaveStatus('error');
      
      let msg = "Errore durante il salvataggio.";
      if (error.message?.includes("insufficient permissions")) {
        msg = "Permessi insufficienti. Verifica se la tua email è verificata su Google.";
      } else if (error.message) {
        msg = error.message;
      }
      setLastErrorMessage(msg);
      
      try {
        handleFirestoreError(error, OperationType.CREATE, path);
      } catch (e) {
        // Silently catch
      }
    } finally {
      setIsSaving(false);
    }
  };

  const deleteReport = async (reportId: string) => {
    if (!isFirebaseValid) {
      if (!confirm("Sei sicuro di voler eliminare questo report?")) return;
      const updated = savedReports.filter(r => r.id !== reportId);
      setSavedReports(updated);
      localStorage.setItem('analogista_local_reports', JSON.stringify(updated, (() => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value) || key === 'sourceEvent' || key === '_reactName' || key === '_targetInst' || key === 'nativeEvent') {
        return undefined;
      }
      seen.add(value);
    }
    return value;
  };
})()));
      return;
    }

    if (!user) return;
    if (!confirm("Sei sicuro di voler eliminare questo report?")) return;
    const path = `users/${user.uid}/reports/${reportId}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const loadReport = (report: any) => {
    setState({
      subject: {
        name: report.subjectName,
        age: report.subjectAge,
        gender: report.subjectGender,
        focus: report.focus || ''
      },
      inductor: report.inductor,
      conflictType: report.conflictType,
      distonicPoints: report.distonicPoints,
      seals: report.seals,
      witness: report.witness,
      isJustified: report.isJustified,
      decompressionLevel: report.decompressionLevel,
      timeline: {
        denouncedAge: report.timelineResults?.af || 0,
        eventType: report.timelineResults?.af ? 'AF' : 'F'
      },
      eventSubjects: report.eventSubjects || {},
      celebrationTarget: report.celebrationTarget || null
    });
    setTapForward(report.tapForward || '');
    setTapBackward(report.tapBackward || []);
    setTapResult(report.tapResult || null);
    if (report.tapForward && report.tapBackward && report.tapBackward.length > 0) {
      const restoredGender = report.subject?.gender || state.subject.gender || 'M';
      const evalRes = evaluateTap(restoredGender, report.tapForward, report.tapBackward);
      setTapEvaluation(evalRes);
    } else {
      setTapEvaluation(null);
    }
    if (report.problemDefinition) setProblemDefinition(report.problemDefinition);
    if (report.blockAnalysisState) setBlockAnalysisState(report.blockAnalysisState);
    if (report.officialState) setOfficialState(report.officialState);
    if (report.investigationMode) setInvestigationMode(report.investigationMode);
    setAiSummary(report.aiSummary || '');
    setActiveTab(6); // Switch to report tab
  };

  const fetchAiSuggestions = async () => {
    setIsAiLoading(true);
    try {
      const suggestions = await getAISuggestions(state);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error("AI Suggestions error:", error);
      alert("Errore durante il caricamento dei suggerimenti AI.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const fetchAiSummary = async () => {
    setIsAiLoading(true);
    try {
      const summary = await generateTechnicalSummary(state);
      setAiSummary(summary);
    } catch (error) {
      console.error("AI Summary error:", error);
      // Removed alert, we display the error in the text box
    } finally {
      setIsAiLoading(false);
    }
  };

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const updateSubject = (updates: Partial<typeof state.subject>) => {
    setState(prev => ({ ...prev, subject: { ...prev.subject, ...updates } }));
  };

  const [clientSaved, setClientSaved] = useState(false);

  const handleSaveClient = () => {
    const nameParts = (state.subject.name || '').trim().split(' ');
    const nome = nameParts[0] || '';
    const cognome = nameParts.slice(1).join(' ') || '';
    setOfficialState(prev => ({
      ...prev,
      scheda1: {
        ...prev.scheda1,
        nome,
        cognome,
        telefono: state.subject.telefono || '',
        eta: state.subject.age ? String(state.subject.age) : '',
        focusObiettivo: state.subject.focus || ''
      }
    }));
    setClientSaved(true);
    setTimeout(() => setClientSaved(false), 4000);
  };

  useEffect(() => {
    if (state.subject.name || state.subject.age || state.subject.focus) {
      const nameParts = (state.subject.name || '').trim().split(' ');
      const nome = nameParts[0] || '';
      const cognome = nameParts.slice(1).join(' ') || '';
      setOfficialState(prev => ({
        ...prev,
        scheda1: {
          ...prev.scheda1,
          nome: prev.scheda1.nome || nome,
          cognome: prev.scheda1.cognome || cognome,
          eta: prev.scheda1.eta || (state.subject.age ? String(state.subject.age) : ''),
          focusObiettivo: prev.scheda1.focusObiettivo || state.subject.focus || ''
        }
      }));
    }
  }, [state.subject.name, state.subject.age, state.subject.focus]);

  const updateTimeline = (updates: Partial<typeof state.timeline>) => {
    setState(prev => ({ ...prev, timeline: { ...prev.timeline, ...updates } }));
  };

  useEffect(() => {
    if (state.subject.age > 0 && state.timeline.denouncedAge > 0) {
      const isAntefatto = state.timeline.denouncedAge < (state.subject.age / 2);
      const newType = isAntefatto ? 'AF' : 'F';
      
      if (state.timeline.eventType !== newType) {
        updateTimeline({ eventType: newType });
      }
    }
  }, [state.subject.age, state.timeline.denouncedAge]);

  const toggleSeal = (seal: string) => {
    setState(prev => ({
      ...prev,
      seals: prev.seals.includes(seal) 
        ? prev.seals.filter(s => s !== seal) 
        : [...prev.seals, seal]
    }));
  };

  const toggleDistonicPoint = (point: string) => {
    setState(prev => ({
      ...prev,
      distonicPoints: prev.distonicPoints.includes(point)
        ? prev.distonicPoints.filter(p => p !== point)
        : [...prev.distonicPoints, point]
    }));
  };

  // Timeline Calculations
  const timelineResults = useMemo(() => {
    const { age } = state.subject;
    const { denouncedAge, eventType } = state.timeline;
    
    if (age <= 0 || denouncedAge <= 0 || !eventType) return null;

    const pu = age / 2; // Punto Utopico
    const cds = age / 4; // Coefficiente Distorsione Spaziale
    
    let pt = 0;
    let af = 0;
    let f = 0;

    if (eventType === 'F') {
      pt = denouncedAge - cds;
      af = pt - cds;
      f = denouncedAge;
    } else {
      pt = denouncedAge + cds;
      f = pt + cds;
      af = denouncedAge;
    }

    const cdt = Math.abs(pt - pu); // Finestra Energetica (Coefficiente Distorsione Temporale)
    const valoreBenessere = cds * 0.30;
    
    let benessereStatus = "";
    if (Math.abs(cdt - valoreBenessere) < 0.1) {
      benessereStatus = "Zona di Comfort (Equilibrio)";
    } else if (cdt < valoreBenessere) {
      benessereStatus = "Ristagno Energetico (Tedio o Apatia)";
    } else {
      benessereStatus = "Zona di No Comfort (Sofferenza o Dolore)";
    }

    const isPtAntePu = pt < pu;
    const timelineType = isPtAntePu 
      ? "i GENITORI (PT < PU): Il passato comprime il futuro" 
      : "ALTRI (PT > PU): Il futuro è ostacolato dal passato";
    
    const interpretation = `${timelineType} — ${benessereStatus}`;

    // Validation Logic
    const validationErrors: string[] = [];
    
    // Inductor vs Timeline
    if (state.inductor === 'Guardiano di Porta-Grillo Parlante' && !isPtAntePu) {
      validationErrors.push("Incongruenza: Guardiano di Porta selezionato, ma la Time Line indica Sogno (PT > PU).");
    }
    if (state.inductor === 'Mastro di Chiavi-Lucignolo' && isPtAntePu) {
      validationErrors.push("Incongruenza: Mastro di Chiavi selezionato, ma la Time Line indica Libertà (PT < PU).");
    }

    // Conflict Type vs Timeline
    if (state.conflictType === 'i GENITORI' && !isPtAntePu) {
      validationErrors.push("Incongruenza: Problema con i GENITORI selezionato, ma la Time Line indica Sogno (PT > PU).");
    }
    if (state.conflictType === 'ALTRI' && isPtAntePu) {
      validationErrors.push("Incongruenza: Problema con ALTRI selezionato, ma la Time Line indica Libertà (PT < PU).");
    }

    // Inductor vs Conflict Type
    if (state.inductor === 'Guardiano di Porta-Grillo Parlante' && state.conflictType === 'ALTRI') {
      validationErrors.push("Incongruenza: Il Guardiano di Porta è tipicamente associato a Conflitti con i GENITORI.");
    }
    if (state.inductor === 'Mastro di Chiavi-Lucignolo' && state.conflictType === 'i GENITORI') {
      validationErrors.push("Incongruenza: Il Mastro di Chiavi è tipicamente associato a Conflitti con ALTRI.");
    }
    
    return { pu, cds, pt, af, f, cdt, valoreBenessere, interpretation, validationErrors };
  }, [state.subject.age, state.timeline, state.inductor, state.conflictType]);

  const renderSubjectModule = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="tech-label block notranslate" translate="no" style={{ color: '#000205' }}>NOME E COGNOME</label>
          <input 
            type="text" 
            value={state.subject.name}
            onChange={(e) => updateSubject({ name: e.target.value })}
            className="tech-input"
            placeholder="Nome e cognome del cliente..."
          />
        </div>
        <div className="space-y-2">
          <label className="tech-label block notranslate" translate="no" style={{ color: '#000205' }}>TELEFONO</label>
          <input 
            type="tel" 
            value={state.subject.telefono}
            onChange={(e) => updateSubject({ telefono: e.target.value })}
            className="tech-input"
            placeholder="Recapito telefonico..."
          />
        </div>
        <div className="space-y-2">
          <label className="tech-label block notranslate" translate="no" style={{ color: '#000204' }}>ETÀ</label>
          <input 
            type="number" 
            value={state.subject.age || ''}
            onChange={(e) => updateSubject({ age: parseInt(e.target.value) || 0 })}
            className="tech-input font-mono"
            placeholder="Es. 38"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div className="space-y-2">
          <label className="tech-label block notranslate" translate="no">SESSO (M / F)</label>
          <div className="flex gap-2">
            {['M', 'F'].map(g => (
              <button
                key={g}
                type="button"
                onClick={() => updateSubject({ gender: g as any })}
                className={cn(
                  "flex-1 py-3 rounded-lg border font-mono font-bold transition-all",
                  state.subject.gender === g 
                    ? "bg-upda-ciano/10 text-upda-ciano border-upda-ciano/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900"
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveClient}
            className="w-full bg-upda-petrolio hover:bg-upda-petrolio/90 text-white font-mono font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Check size={16} />
            <span>Salva Dati Cliente</span>
          </button>
        </div>
      </div>

      {clientSaved && (
        <div className="p-4 bg-upda-ciano/15 border border-upda-ciano/40 rounded-xl text-xs font-mono font-bold text-upda-petrolio flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-upda-petrolio" />
          <span>Dati cliente salvati e sincronizzati con successo! Età ({state.subject.age} anni) registrata per i calcoli.</span>
        </div>
      )}
      
      <div className="space-y-2">
        <label className="tech-label block text-center notranslate" translate="no">PROBLEMA DA RISOLVERE (FOCUS)</label>
        <textarea 
          value={state.subject.focus}
          onChange={(e) => updateSubject({ focus: e.target.value })}
          className="tech-input min-h-[80px] py-3"
          placeholder="Descrivere l'obiettivo della sessione o il focus del cliente..."
        />
      </div>
      
      <div className="p-6 bg-upda-ciano/5 border border-upda-ciano/10 rounded-xl">
        <div className="flex items-center gap-3 text-upda-petrolio mb-2">
          <Info size={16} />
          <span className="text-[10px] font-mono uppercase tracking-widest notranslate" translate="no">Suggerimento: La Domanda Magica (Benemeglio)</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed italic">
          Si pone l'interrogativo chiave: "Cos'è che non faresti mai per risolvere il tuo problema?" per fare emergere il timore della sanzione o il rancore/sentimento compresso. <strong className="notranslate" translate="no">Nota: Non è "ciò che faresti" ma ciò che non faresti e più che fare quella cosa, preferiresti tenerti il problema stesso.</strong>
        </p>
      </div>

      {investigationMode === 'none' && (
        <div className="mt-12 pt-10 border-t border-slate-200 space-y-8 animate-in fade-in duration-300">
          <div className="text-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">Seleziona Tipo di Indagine Analogica</h3>
            <p className="text-xs text-slate-500 font-mono mt-1">Scegli il protocollo operativo per procedere con la sessione</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Indagine Ufficiale Card */}
            <div className="bg-white border-2 border-upda-ciano/40 hover:border-upda-ciano p-6 md:p-8 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between transition-all group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-3 py-1 bg-upda-ciano/10 text-upda-petrolio font-bold rounded-full">Protocollo Schede Operative</span>
                  <Activity className="text-upda-ciano group-hover:scale-110 transition-transform" size={20} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight">INDAGINE UFFICIALE</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Percorso ufficiale strutturato in 3 schede operative: Scheda 01 (Indagine 5 Punti & Conflitti), Scheda 02 (Planning & Tipologia), Scheda 03 (Celebrazione & Relazione Significativa).
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {['Scheda 01 • Indagine', 'Scheda 02 • Planning', 'Scheda 03 • Celebrazione'].map((t, idx) => (
                    <span key={idx} className="text-[9px] font-mono bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 font-bold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  setInvestigationMode('officiale');
                  setActiveTab(1);
                }}
                className="w-full py-3.5 bg-upda-ciano text-slate-900 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-upda-ciano/90 transition-all shadow-sm flex items-center justify-center gap-2 mt-4"
              >
                Avvia Indagine Ufficiale
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Indagine Completa Card */}
            <div className="bg-white border-2 border-slate-200 hover:border-upda-petrolio p-6 md:p-8 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between transition-all group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-3 py-1 bg-slate-100 text-slate-700 font-bold rounded-full">Protocollo Esteso</span>
                  <Zap className="text-upda-petrolio group-hover:scale-110 transition-transform" size={20} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight">INDAGINE COMPLETA</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Include tutti i test avanzati, Punti Distonici, TAP Test, Time Line e la guida metodologica completa.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {['1. Induttore', '2. Punti Distonici', '3. T.A.P.', '4. Time Line'].map((t, idx) => (
                    <span key={idx} className="text-[9px] font-mono bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-slate-600">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  setInvestigationMode('completa');
                  setActiveTab(2);
                }}
                className="w-full py-3.5 bg-upda-petrolio text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-upda-petrolio/90 transition-all shadow-sm flex items-center justify-center gap-2 mt-4"
              >
                Avvia Indagine Completa
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderProblemDefinitionModule = () => (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">
            Definizione della Tipologia e Natura del Problema
          </h3>
          <p className="text-[11px] text-slate-500 font-mono mt-1 leading-relaxed">
            Con tutte le informazioni raccolte, l'Analogista classifica il problema su due assi distinti. Attraverso quesiti mirati, si indaga la situazione emotiva del soggetto nei diversi ambiti di vita.
          </p>
        </div>

        {/* Two Slots: Tipologia and Natura */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Slot 1: Tipologia */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold block">
              1. Tipologia
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Ordinario', 'Aberrante'].map(item => (
                <button
                  key={item}
                  onClick={() => setProblemDefinition(prev => ({ ...prev, tipologia: item }))}
                  className={cn(
                    "py-3 px-4 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all text-center",
                    problemDefinition.tipologia === item
                      ? "bg-upda-petrolio text-white border-upda-petrolio shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Slot 2: Natura */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold block">
              2. Natura
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Allineata', 'Alterata'].map(item => (
                <button
                  key={item}
                  onClick={() => setProblemDefinition(prev => ({ ...prev, natura: item }))}
                  className={cn(
                    "py-3 px-4 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all text-center",
                    problemDefinition.natura === item
                      ? "bg-upda-petrolio text-white border-upda-petrolio shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="space-y-2">
            <label className="tech-label block">Sintomo o Problema Manifesto</label>
            <textarea
              value={problemDefinition.sintomoManifesto}
              onChange={(e) => setProblemDefinition(prev => ({ ...prev, sintomoManifesto: e.target.value }))}
              className="tech-input min-h-[90px] py-3"
              placeholder="Descrivere il sintomo o la problematica principale riferita dal soggetto..."
            />
          </div>

          <div className="space-y-2">
            <label className="tech-label block">Contesto Emotivo e Relazionale</label>
            <textarea
              value={problemDefinition.contestoEmotivo}
              onChange={(e) => setProblemDefinition(prev => ({ ...prev, contestoEmotivo: e.target.value }))}
              className="tech-input min-h-[80px] py-3"
              placeholder="In quale contesto si manifesta il disagio? Quali relazioni sono coinvolte..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="tech-label block">Obiettivo dell'Intervento</label>
              <input
                type="text"
                value={problemDefinition.obiettivo}
                onChange={(e) => setProblemDefinition(prev => ({ ...prev, obiettivo: e.target.value }))}
                className="tech-input"
                placeholder="Cosa desidera ottenere il cliente..."
              />
            </div>
            <div className="space-y-2">
              <label className="tech-label block">Risposta alla Domanda Magica</label>
              <input
                type="text"
                value={problemDefinition.domandaMagica}
                onChange={(e) => setProblemDefinition(prev => ({ ...prev, domandaMagica: e.target.value }))}
                className="tech-input"
                placeholder="Cosa non faresti mai per risolvere il problema..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="tech-label block">Note e Osservazioni Analogiche</label>
            <textarea
              value={problemDefinition.note}
              onChange={(e) => setProblemDefinition(prev => ({ ...prev, note: e.target.value }))}
              className="tech-input min-h-[80px] py-3"
              placeholder="Annotazioni cliniche, micro-comportamenti o risposte non verbali..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderBlockAnalysisModule = () => {
    const list4Punti = [
      "Conflitto genitori",
      "Conflitto con altri",
      "Conflitto con te stesso",
      "Conflitto con il destino"
    ];

    const listBlocchi = [
      "Salute e benessere",
      "Sentimentali-affettivi",
      "Edonistici-sessuali",
      "Autorealizzazione personale, professionale, economica"
    ];

    const listCause = [
      "Sfiducia in se stessi",
      "Demotivazione",
      "Determinazione",
      "Azione inefficace",
      "Energia carente"
    ];

    const toggleItem = (category: 'quattroPunti' | 'analisiBlocchi' | 'analisiCause', item: string) => {
      setBlockAnalysisState(prev => {
        const current = prev[category];
        const exists = current.includes(item);
        return {
          ...prev,
          [category]: exists ? current.filter(i => i !== item) : [...current, item]
        };
      });
    };

    const updateComment = (category: 'quattroPuntiComments' | 'analisiBlocchiComments' | 'analisiCauseComments', item: string, val: string) => {
      setBlockAnalysisState(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [item]: val
        }
      }));
    };

    return (
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">
              Intervista e Analisi
            </h3>
            <p className="text-[11px] text-slate-500 font-mono mt-1 leading-relaxed">
              Attraverso quesiti mirati, si indaga la situazione emotiva del soggetto nei diversi ambiti di vita.
            </p>
          </div>

          <div className="space-y-8">
            {/* Blocco 1: Analisi dei 4 Punti */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-mono">
                  3. Analisi dei 4 Punti
                </h4>
                <span className="text-[10px] font-mono text-slate-400">Seleziona e commenta</span>
              </div>
              <div className="space-y-3">
                {list4Punti.map((point, idx) => {
                  const isSelected = blockAnalysisState.quattroPunti.includes(point);
                  return (
                    <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl space-y-3">
                      <div 
                        onClick={() => toggleItem('quattroPunti', point)}
                        className="flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold border transition-all",
                            isSelected 
                              ? "bg-upda-petrolio text-white border-upda-petrolio shadow-sm"
                              : "bg-slate-100 text-slate-600 border-slate-200 group-hover:border-slate-300"
                          )}>
                            {idx + 1}
                          </span>
                          <span className={cn(
                            "text-xs font-bold uppercase transition-colors",
                            isSelected ? "text-upda-petrolio font-extrabold" : "text-slate-800"
                          )}>
                            {point}
                          </span>
                        </div>
                        <span className={cn(
                          "text-[10px] font-mono uppercase px-2.5 py-1 rounded-md border transition-all",
                          isSelected ? "bg-upda-ciano/10 text-upda-petrolio border-upda-ciano/30 font-bold" : "bg-slate-50 text-slate-400 border-slate-200"
                        )}>
                          {isSelected ? 'Selezionato' : 'Seleziona'}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="pt-2 animate-in fade-in duration-200">
                          <input
                            type="text"
                            value={blockAnalysisState.quattroPuntiComments[point] || ''}
                            onChange={(e) => updateComment('quattroPuntiComments', point, e.target.value)}
                            className="tech-input text-xs py-2"
                            placeholder="Inserisci commento o annotazione per questo punto..."
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Blocco 2: Analisi dei Blocchi (solo per problema ordinario) */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-mono">
                  4. Analisi dei Blocchi (solo per problema ordinario)
                </h4>
                <span className="text-[10px] font-mono text-slate-400">Seleziona e commenta</span>
              </div>
              <div className="space-y-3">
                {listBlocchi.map((point, idx) => {
                  const isSelected = blockAnalysisState.analisiBlocchi.includes(point);
                  return (
                    <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl space-y-3">
                      <div 
                        onClick={() => toggleItem('analisiBlocchi', point)}
                        className="flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold border transition-all",
                            isSelected 
                              ? "bg-upda-petrolio text-white border-upda-petrolio shadow-sm"
                              : "bg-slate-100 text-slate-600 border-slate-200 group-hover:border-slate-300"
                          )}>
                            {idx + 1}
                          </span>
                          <span className={cn(
                            "text-xs font-bold uppercase transition-colors",
                            isSelected ? "text-upda-petrolio font-extrabold" : "text-slate-800"
                          )}>
                            {point}
                          </span>
                        </div>
                        <span className={cn(
                          "text-[10px] font-mono uppercase px-2.5 py-1 rounded-md border transition-all",
                          isSelected ? "bg-upda-ciano/10 text-upda-petrolio border-upda-ciano/30 font-bold" : "bg-slate-50 text-slate-400 border-slate-200"
                        )}>
                          {isSelected ? 'Selezionato' : 'Seleziona'}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="pt-2 animate-in fade-in duration-200">
                          <input
                            type="text"
                            value={blockAnalysisState.analisiBlocchiComments[point] || ''}
                            onChange={(e) => updateComment('analisiBlocchiComments', point, e.target.value)}
                            className="tech-input text-xs py-2"
                            placeholder="Inserisci commento o annotazione per questo blocco..."
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Blocco 3: Analisi delle Cause */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-mono">
                  5. Analisi delle Cause
                </h4>
                <span className="text-[10px] font-mono text-slate-400">Seleziona e commenta</span>
              </div>
              <div className="space-y-3">
                {listCause.map((point, idx) => {
                  const isSelected = blockAnalysisState.analisiCause.includes(point);
                  return (
                    <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl space-y-3">
                      <div 
                        onClick={() => toggleItem('analisiCause', point)}
                        className="flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold border transition-all",
                            isSelected 
                              ? "bg-upda-petrolio text-white border-upda-petrolio shadow-sm"
                              : "bg-slate-100 text-slate-600 border-slate-200 group-hover:border-slate-300"
                          )}>
                            {idx + 1}
                          </span>
                          <span className={cn(
                            "text-xs font-bold uppercase transition-colors",
                            isSelected ? "text-upda-petrolio font-extrabold" : "text-slate-800"
                          )}>
                            {point}
                          </span>
                        </div>
                        <span className={cn(
                          "text-[10px] font-mono uppercase px-2.5 py-1 rounded-md border transition-all",
                          isSelected ? "bg-upda-ciano/10 text-upda-petrolio border-upda-ciano/30 font-bold" : "bg-slate-50 text-slate-400 border-slate-200"
                        )}>
                          {isSelected ? 'Selezionato' : 'Seleziona'}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="pt-2 animate-in fade-in duration-200">
                          <input
                            type="text"
                            value={blockAnalysisState.analisiCauseComments[point] || ''}
                            onChange={(e) => updateComment('analisiCauseComments', point, e.target.value)}
                            className="tech-input text-xs py-2"
                            placeholder="Inserisci commento o annotazione per questa causa..."
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInductorModule = () => (
    <div className="space-y-10">
      <h3 className="text-[10px] md:text-[11px] font-sans font-bold uppercase tracking-[0.1em] text-white bg-upda-ciano py-4 px-6 mx-auto rounded-xl shadow-lg border-2 border-white/20 text-center leading-relaxed max-w-3xl">
        Selezionare sotto il risultato emerso dal Test "Induzione Metafisica" (Movimento braccio/mano dx/sx).
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: 'Mastro di Chiavi-Lucignolo', label: 'Induttore Sinistro' },
          { key: 'Guardiano di Porta-Grillo Parlante', label: 'Induttore Destro' }
        ].map(({ key, label }) => {
          const info = (KNOWLEDGE_BASE.induttori as any)[key];
          return (
            <button
              key={key}
              onClick={() => setState(prev => ({ ...prev, inductor: key as any }))}
              className={cn(
                "p-6 rounded-xl border text-left transition-all relative overflow-hidden group",
                state.inductor === key 
                  ? "bg-upda-ciano/10 border-upda-ciano/40 text-upda-petrolio shadow-[0_0_20px_rgba(52,168,180,0.05)] scale-[1.02]" 
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900"
              )}
            >
              <div className={cn(
                "text-[9px] font-mono uppercase mb-1 opacity-100 tracking-widest notranslate",
                key === 'Mastro di Chiavi-Lucignolo' ? "text-slate-500" : "text-slate-400"
              )} translate="no">{info.fase}</div>
              <div className={cn(
                "text-lg font-bold mb-2 tracking-tight notranslate",
                key === 'Mastro di Chiavi-Lucignolo' ? "text-slate-900" : "text-slate-800"
              )} translate="no">{label}</div>
              <div className={cn(
                "text-[12px] font-mono font-bold italic notranslate",
                key === 'Mastro di Chiavi-Lucignolo' ? "text-slate-600" : "text-slate-500"
              )} translate="no">{info.archetipo}</div>
              {state.inductor === key && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-upda-ciano/10 rounded-full blur-2xl -mr-8 -mt-8" />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {state.inductor && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/80 border border-slate-200 rounded-2xl p-8 backdrop-blur-sm"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h4 className="text-upda-petrolio text-[12px] md:text-[10px] font-mono uppercase tracking-[0.3em] mb-6">Analisi Tecnica</h4>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <span className="tech-label">Caratteristiche Dominanti</span>
                      <p className="text-base md:text-sm leading-relaxed text-slate-700">{(KNOWLEDGE_BASE.induttori as any)[state.inductor].caratteristiche}</p>
                    </div>
                    <div className="space-y-2">
                      <span className="tech-label">Dinamica Energetica</span>
                      <p className="text-base md:text-sm leading-relaxed text-slate-600">{(KNOWLEDGE_BASE.induttori as any)[state.inductor].dinamica}</p>
                    </div>
                    
                    <div className="space-y-4 pt-6 border-t border-slate-100">
                      <div className="bg-upda-ciano/10/50 p-4 rounded-xl border border-upda-ciano/10">
                        <div className="flex items-center gap-2 text-upda-petrolio mb-2">
                          <Zap size={14} />
                          <span className="text-[10px] font-mono uppercase tracking-widest">Dinamica del Pensiero</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed italic">
                          {state.inductor === 'Mastro di Chiavi-Lucignolo' 
                            ? "Sentimento Represso (Pathos): Tipico del Pensiero Idealista. L'individuo teme di sbagliare, giustifica l'altro e incolpa se stesso. L'energia 'implode' nel dolore per proteggere l'altro."
                            : "Risentimento Represso (Reattività): Tipico del Pensiero Realista. L'individuo teme la sanzione ingiusta, diffida degli altri e giustifica se stesso. L'energia 'bolle' nel rancore per difendere la propria dignità."
                          }
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-8 pt-8 border-t border-slate-200">
                      {[
                        { label: 'Braccio', value: (KNOWLEDGE_BASE.induttori as any)[state.inductor].braccio },
                        { label: 'Forza Dominante', value: (KNOWLEDGE_BASE.induttori as any)[state.inductor].forzaDominante },
                        { label: 'Avatar', value: (KNOWLEDGE_BASE.induttori as any)[state.inductor].avatar },
                        { label: 'Sindrome', value: (KNOWLEDGE_BASE.induttori as any)[state.inductor].sindrome },
                        { label: 'Pensiero', value: (KNOWLEDGE_BASE.induttori as any)[state.inductor].pensiero },
                        { label: 'Crisi', value: (KNOWLEDGE_BASE.induttori as any)[state.inductor].crisi },
                        { label: 'Stress', value: (KNOWLEDGE_BASE.induttori as any)[state.inductor].stress },
                        { label: 'Distonia', value: (KNOWLEDGE_BASE.induttori as any)[state.inductor].distonia },
                        { label: 'Testimone', value: (KNOWLEDGE_BASE.induttori as any)[state.inductor].testimone },
                        { label: 'Sintomi', value: (KNOWLEDGE_BASE.induttori as any)[state.inductor].sintomi },
                      ].map((item, idx) => item.value && (
                        <div key={idx} className="flex flex-col gap-1">
                          <span className="text-[11px] md:text-[9px] text-slate-600 uppercase font-mono tracking-wider notranslate" translate="no">{item.label}</span>
                          <span className="text-[13px] md:text-[11px] font-bold text-slate-900 notranslate" translate="no">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-upda-petrolio text-[10px] font-mono uppercase tracking-[0.2em]">Protocollo Operativo</h4>
                  <button 
                    onClick={fetchAiSuggestions}
                    disabled={isAiLoading}
                    className="flex items-center gap-2 text-[10px] bg-upda-ciano/10 text-upda-petrolio px-3 py-1.5 rounded-full hover:bg-upda-ciano/20 transition-all disabled:opacity-50 border border-upda-ciano/20"
                  >
                    {isAiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    AI Logic
                  </button>
                </div>
                <ul className="space-y-4">
                  {(KNOWLEDGE_BASE.induttori as any)[state.inductor].suggerimenti.map((s: string, i: number) => (
                    <li key={i} className="text-[11px] flex gap-4 items-start text-slate-500">
                      <span className="text-upda-ciano font-mono text-[10px] mt-0.5">0{i+1}</span>
                      <span className="leading-relaxed">{s}</span>
                    </li>
                  ))}
                  {aiSuggestions.map((s, i) => (
                    <motion.li 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={`ai-${i}`} 
                      className="text-[11px] flex gap-4 items-start text-upda-petrolio/70 italic bg-upda-ciano/5 p-3 rounded-lg border border-upda-ciano/10"
                    >
                      <Sparkles size={14} className="text-upda-ciano shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{s}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderTapModule = () => {
    const currentGender = (state.subject.gender || 'M') as 'M' | 'F';

    const handleSelectForward = (sym: string) => {
      setTapForward(sym);
      // Auto-recalculate if backward is already selected
      if (tapBackward.length > 0) {
        calculateTap(currentGender, sym, tapBackward);
      }
    };

    const handleToggleBackward = (sym: string) => {
      let updated: string[];
      if (tapBackward.includes(sym)) {
        updated = tapBackward.filter(x => x !== sym);
      } else {
        updated = [...tapBackward, sym];
      }
      setTapBackward(updated);
      if (tapForward && updated.length > 0) {
        calculateTap(currentGender, tapForward, updated);
      } else if (updated.length === 0) {
        setTapResult(null);
        setTapEvaluation(null);
      }
    };

    const handleGenderChange = (newGender: 'M' | 'F') => {
      setState(prev => ({
        ...prev,
        subject: { ...prev.subject, gender: newGender }
      }));
      if (tapForward && tapBackward.length > 0) {
        calculateTap(newGender, tapForward, tapBackward);
      }
    };

    const loadCombination = (item: typeof TAP_REFERENCE_TABLE[0]) => {
      handleGenderChange(item.gender);
      setTapForward(item.fwd);
      setTapBackward(item.bwd);
      calculateTap(item.gender, item.fwd, item.bwd);
    };

    return (
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
          {/* Header */}
          <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                <Activity size={18} className="text-upda-petrolio" />
                T.A.P. — Test Analogico Personalità
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-1">
                Decodifica delle oscillazioni corporee involontarie e identificazione dell'archetipo simbolico (Asta, Cerchio, Triangolo)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowTapGuide(!showTapGuide)}
                className={cn(
                  "text-[10px] font-mono uppercase px-3 py-1.5 rounded-lg border transition-all font-bold flex items-center gap-1.5",
                  showTapGuide 
                    ? "bg-upda-petrolio text-white border-upda-petrolio" 
                    : "border-slate-200 text-slate-600 hover:bg-slate-100"
                )}
              >
                <BookOpen size={13} />
                <span>{showTapGuide ? 'Nascondi Matrice' : 'Matrice Combinazioni'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTapForward('');
                  setTapBackward([]);
                  setTapResult(null);
                  setTapEvaluation(null);
                }}
                className="text-[10px] font-mono uppercase px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors font-bold"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Matrice Completa Combinazioni (Collapsible) */}
          <AnimatePresence>
            {showTapGuide && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden border border-slate-200 bg-slate-50/80 rounded-xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Matrice Combinazioni Ufficiali T.A.P. (Metodo Stefano Benemeglio)
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Seleziona o carica una combinazione standard per visualizzarne la dinamica nel test
                    </p>
                  </div>
                  <div className="flex gap-1 bg-slate-200 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setTapGuideGenderTab('M')}
                      className={cn(
                        "text-[10px] font-mono uppercase px-3 py-1 rounded-md font-bold transition-all",
                        tapGuideGenderTab === 'M' ? "bg-white text-upda-petrolio shadow-xs" : "text-slate-600 hover:text-slate-900"
                      )}
                    >
                      Maschile (M)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTapGuideGenderTab('F')}
                      className={cn(
                        "text-[10px] font-mono uppercase px-3 py-1 rounded-md font-bold transition-all",
                        tapGuideGenderTab === 'F' ? "bg-white text-upda-petrolio shadow-xs" : "text-slate-600 hover:text-slate-900"
                      )}
                    >
                      Femminile (F)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                  {TAP_REFERENCE_TABLE.filter(item => item.gender === tapGuideGenderTab).map((item, idx) => (
                    <div 
                      key={idx}
                      className="bg-white p-3.5 rounded-lg border border-slate-200 hover:border-upda-ciano transition-all flex flex-col justify-between space-y-2 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-900">{item.title}</span>
                          <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                            {item.distonia}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 mb-1.5">
                          <span>Avanti: <strong className="text-upda-petrolio font-bold">{item.fwd}</strong></span>
                          <span>•</span>
                          <span>Indietro: <strong className="text-rose-700 font-bold">{item.bwd.join(' + ')}</strong></span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">
                          {item.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => loadCombination(item)}
                        className="text-[10px] uppercase font-mono font-bold text-upda-petrolio hover:text-upda-ciano transition-colors pt-2 border-t border-slate-100 flex items-center justify-end gap-1 w-full text-right"
                      >
                        Carica nel Test →
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            {/* Genere del Soggetto */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono uppercase text-slate-700 font-bold block">
                  Genere del Soggetto per la Valutazione T.A.P.
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Le dinamiche distoniche e gli archetipi genitoriali variano in funzione del genere
                </span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleGenderChange('M')}
                  className={cn(
                    "flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-mono uppercase font-bold transition-all border",
                    currentGender === 'M'
                      ? "bg-upda-petrolio text-white border-upda-petrolio shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  )}
                >
                  Maschile (M)
                </button>
                <button
                  type="button"
                  onClick={() => handleGenderChange('F')}
                  className={cn(
                    "flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-mono uppercase font-bold transition-all border",
                    currentGender === 'F'
                      ? "bg-upda-petrolio text-white border-upda-petrolio shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  )}
                >
                  Femminile (F)
                </button>
              </div>
            </div>

            {/* BLOCCO 1: OSCILLAZIONE IN AVANTI (Gradimento) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="tech-label block text-xs font-mono uppercase text-slate-800 font-bold">
                  Blocco 1: Oscillazione in Avanti (Gradimento / Attrazione Inconscia)
                </label>
                <span className="text-[10px] font-mono text-slate-500">Seleziona 1 simbolo</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'Asta', symbol: '|', label: 'Asta', desc: 'Archetipo Paterno / Razionalità' },
                  { id: 'Cerchio', symbol: 'O', label: 'Cerchio', desc: 'Archetipo Egocentrico / Sé' },
                  { id: 'Triangolo', symbol: 'Δ', label: 'Triangolo', desc: 'Archetipo Materno / Emozione' }
                ].map(sym => {
                  const isSelected = tapForward === sym.id;
                  return (
                    <button
                      key={sym.id}
                      type="button"
                      onClick={() => handleSelectForward(sym.id)}
                      className={cn(
                        "p-4 rounded-xl border transition-all text-left flex flex-col justify-between space-y-2 relative overflow-hidden group",
                        isSelected
                          ? "bg-upda-ciano/15 text-slate-900 border-upda-ciano shadow-sm ring-1 ring-upda-ciano"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xl font-bold font-mono text-upda-petrolio">{sym.symbol}</span>
                        {isSelected && (
                          <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-upda-ciano text-slate-900 font-bold">
                            Gradito
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">{sym.label}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{sym.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BLOCCO 2: OSCILLAZIONE IN INDIETRO (Alimentatore / Rifiuto) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="tech-label block text-xs font-mono uppercase text-slate-800 font-bold">
                  Blocco 2: Oscillazione in Indietro (Alimentatore di Tensione / Rifiuto)
                </label>
                <span className="text-[10px] font-mono text-slate-500">Seleziona 1 o 2 simboli</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'Asta', symbol: '|', label: 'Asta', desc: 'Rifiuto / Tensione Paterna' },
                  { id: 'Cerchio', symbol: 'O', label: 'Cerchio', desc: 'Rifiuto / Tensione Egocentrica' },
                  { id: 'Triangolo', symbol: 'Δ', label: 'Triangolo', desc: 'Rifiuto / Tensione Materna' }
                ].map(sym => {
                  const isSelected = tapBackward.includes(sym.id);
                  const isSameAsForward = tapForward === sym.id;
                  return (
                    <button
                      key={sym.id}
                      type="button"
                      onClick={() => handleToggleBackward(sym.id)}
                      className={cn(
                        "p-4 rounded-xl border transition-all text-left flex flex-col justify-between space-y-2 relative overflow-hidden group",
                        isSelected
                          ? "bg-rose-50 text-slate-900 border-rose-300 shadow-sm ring-1 ring-rose-300"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                        isSameAsForward && !isSelected && "opacity-75"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xl font-bold font-mono text-rose-800">{sym.symbol}</span>
                        {isSelected ? (
                          <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold">
                            Rifiuto / Tensione
                          </span>
                        ) : isSameAsForward ? (
                          <span className="text-[8px] uppercase font-mono px-1.5 py-0.5 rounded text-amber-700 bg-amber-50">
                            Attivo in Avanti
                          </span>
                        ) : null}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">{sym.label}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{sym.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pulsante di Calcolo */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => calculateTap(currentGender)}
                disabled={!tapForward || tapBackward.length === 0}
                className="w-full py-3.5 bg-upda-ciano hover:bg-upda-ciano/90 disabled:opacity-40 text-slate-900 font-bold uppercase tracking-widest text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Zap size={16} />
                <span>Calcola / Aggiorna Tipologia T.A.P.</span>
              </button>
            </div>

            {/* Area Risultato Dettagliata */}
            {tapEvaluation && (
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 border border-slate-200 bg-slate-50/90 rounded-2xl p-6 md:p-7 space-y-6 shadow-xs"
              >
                {/* Header Risultato */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                      Tipologia Analogica di Personalità
                    </span>
                    <h4 className="text-base md:text-lg font-bold text-upda-petrolio tracking-tight">
                      {tapEvaluation.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-upda-ciano/20 text-upda-petrolio border border-upda-ciano/30">
                      {tapEvaluation.distonia}
                    </span>
                  </div>
                </div>

                {/* 4 Blocchi Riepilogativi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[9px] uppercase font-mono text-slate-400 block mb-1">Asse Distonico</span>
                    <p className="text-xs font-bold text-slate-900">{tapEvaluation.distonia}</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[9px] uppercase font-mono text-slate-400 block mb-1">Induttore Principale</span>
                    <p className="text-xs font-bold text-slate-900">{tapEvaluation.primaryInductor}</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[9px] uppercase font-mono text-slate-400 block mb-1">Gradimento (Avanti)</span>
                    <p className="text-xs font-bold text-upda-petrolio">{tapEvaluation.fwdSymbol}</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[9px] uppercase font-mono text-slate-400 block mb-1">Alimentatore (Indietro)</span>
                    <p className="text-xs font-bold text-rose-700">{tapEvaluation.bwdSymbols.join(', ')}</p>
                  </div>
                </div>

                {/* Dettagli e Quadro Operativo */}
                <div className="space-y-4 pt-1">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 shadow-xs">
                    <h5 className="text-[11px] font-bold uppercase font-mono text-slate-700">
                      Origine del Conflitto & Dinamica Energetica
                    </h5>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {tapEvaluation.originConflict}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono italic">
                      Dinamica: {tapEvaluation.energyDynamics}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 shadow-xs">
                    <h5 className="text-[11px] font-bold uppercase font-mono text-slate-700">
                      Quadro Comportamentale ed Emotivo
                    </h5>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {tapEvaluation.behavioralTraits}
                    </p>
                  </div>

                  <div className="bg-upda-ciano/10 p-4 rounded-xl border border-upda-ciano/30 space-y-1.5">
                    <h5 className="text-[11px] font-bold uppercase font-mono text-upda-petrolio flex items-center gap-1.5">
                      <Shield size={14} className="text-upda-petrolio" />
                      Guida Strategica per l'Analogista (Interazione & Canale di Accesso)
                    </h5>
                    <p className="text-xs text-slate-800 leading-relaxed font-medium">
                      {tapEvaluation.analogistStrategy}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDistonicModule = () => {
    const distonicOptions = [
      'Rapporti con Famiglia d\'Origine',
      'Rapporti Sentimentali e Affettivi',
      'Rapporti Sessuali Passionali',
      'Autorealizzazione, Hobby e Lavoro',
      'Disturbi dell\'emotività e del comportamento'
    ];

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {distonicOptions.map(area => (
            <button
              key={area}
              onClick={() => toggleDistonicPoint(area)}
              className={cn(
                "py-5 px-6 rounded-xl border text-[10px] font-bold uppercase tracking-[0.15em] transition-all text-left flex justify-between items-center group",
                state.distonicPoints.includes(area) 
                  ? "bg-upda-ciano/10 text-upda-petrolio border-upda-ciano/40 shadow-[0_0_20px_rgba(52,168,180,0.05)]" 
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900"
              )}
            >
              <span className="max-w-[80%] notranslate" translate="no">{area}</span>
              <div className={cn(
                "w-5 h-5 rounded border flex items-center justify-center transition-all",
                state.distonicPoints.includes(area) ? "bg-upda-ciano border-upda-ciano text-slate-900" : "border-slate-700 group-hover:border-slate-500"
              )}>
                {state.distonicPoints.includes(area) && <CheckSquare size={12} />}
              </div>
            </button>
          ))}
        </div>

        {state.distonicPoints.length > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-upda-petroliomber-500/5 border border-amber-500/20 p-4 rounded-xl flex items-start gap-4"
          >
            <Info className="text-amber-500 shrink-0 mt-0.5" size={16} />
            <p className="text-[11px] text-amber-200/70 font-medium italic leading-relaxed">
              Protocollo: Interrogare l'istanza inconscia per identificare l'area di massima priorità (1 SOLO punto distonico).
            </p>
          </motion.div>
        )}

        <div className="flex justify-center py-6">
          <h2 className="text-xl md:text-2xl font-bold text-upda-ciano whitespace-nowrap tracking-tight text-center">
            Sigilli Complessi e Vincoli
          </h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <ShieldAlert className="text-slate-500" size={16} />
            </div>
            <div>
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-slate-900">Sigilli</h3>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-1">Mappatura dei blocchi energetici</p>
            </div>
          </div>
          
          <div className="space-y-12">
            {['Sogno', 'Libertà', 'Coscienza'].map(category => (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldAlert 
                    size={14} 
                    className={
                      category === 'Coscienza' ? "text-[#ca1024]" : 
                      (category === 'Sogno' ? "text-[#15e638]" : "text-[#0c45d2]")
                    } 
                  />
                  <h4 
                    className="text-[9px] font-mono font-bold uppercase tracking-widest notranslate" 
                    style={{ color: category === 'Sogno' ? '#15e638' : category === 'Libertà' ? '#0c45d2' : '#ca1024' }}
                    translate="no"
                  >
                    Sigilli {category === 'Libertà' ? 'della' : 'del'} {category}
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(KNOWLEDGE_BASE.sigilli)
                    .filter(([_, info]) => (info as any).area.includes(category))
                    .map(([name, info]: [string, any]) => (
                      <button
                        key={name}
                        onClick={() => {
                          toggleSeal(name);
                          setActiveSeal(name);
                        }}
                        className={cn(
                          "flex items-start gap-5 p-5 rounded-xl border transition-all text-left relative overflow-hidden group",
                          state.seals.includes(name) 
                            ? "bg-upda-ciano/5 border-upda-ciano/30 shadow-sm" 
                            : "bg-white border-slate-200 hover:border-slate-300"
                        )}
                      >
                        <div className={cn(
                          "mt-1 transition-colors",
                          state.seals.includes(name) ? "text-upda-ciano" : "text-slate-400 group-hover:text-slate-500"
                        )}>
                          {state.seals.includes(name) ? <CheckSquare size={18} /> : <Square size={18} />}
                        </div>
                        <div className="relative z-10">
                          <div className={cn("text-[11px] font-bold uppercase tracking-wider mb-2 notranslate", state.seals.includes(name) ? "text-slate-900" : "text-slate-700")} translate="no">{name}</div>
                          <p className="text-[10px] text-slate-600 leading-relaxed font-serif italic">{info.desc}</p>
                          {state.seals.includes(name) && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-3 pt-3 border-t border-upda-ciano/10 text-[12px] md:text-[10px] text-upda-petrolio font-bold italic flex items-center gap-2"
                            >
                              <Clock size={14} className="md:w-[12px] md:h-[12px]" />
                              {info.tipo.includes('Libertà') 
                                ? `Fascia d'età specifica: ${info.tipo.split('(')[1].split(')')[0]}`
                                : info.tipo.includes('Coscienza')
                                ? "Problema Aberrante: Colpa attribuita a se stessi."
                                : `Indagare finestra temporale: ${Math.floor(state.subject.age * 0.2)} - ${Math.floor(state.subject.age * 0.6)} anni.`}
                            </motion.div>
                          )}
                        </div>
                        {state.seals.includes(name) && (
                          <div className="absolute top-0 right-0 w-12 h-12 bg-upda-ciano/5 rounded-full blur-xl -mr-6 -mt-6" />
                        )}
                      </button>
                    ))}
                </div>
                {category === 'Libertà' ? (
                  <p className="text-[10px] text-slate-500 italic mt-4 border-l-2 border-upda-ciano/20 pl-4">
                    Questi vincoli alimentano la Sindrome di Romeo e Giulietta, rendendo il soggetto apatico (blocco della volontà).
                  </p>
                ) : category === 'Sogno' ? (
                  <p className="text-[10px] text-slate-500 italic mt-4 border-l-2 border-upda-ciano/20 pl-4">
                    Questi vincoli alimentano la Sindrome di Dante e Beatrice, rendendo il soggetto demotivato (blocco della motivazione).
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-500 italic mt-4 border-l-2 border-upda-ciano/20 pl-4">
                    A differenza di Libertà e Sogno, questi appartengono al problema di coscienza (aberrante), dove l'individuo attribuisce a se stesso la colpa.
                  </p>
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeSeal && (
              <motion.div
                key={activeSeal}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 bg-upda-ciano/5 border border-upda-ciano/10 p-6 rounded-xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-upda-petrolio">
                    <BookOpen size={18} className="md:w-[16px] md:h-[16px]" />
                    <span className="text-[12px] md:text-[10px] font-mono uppercase tracking-widest notranslate" translate="no">Dettaglio Sigillo: {activeSeal}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-upda-ciano/10 text-upda-petrolio text-[11px] md:text-[9px] font-bold uppercase tracking-tighter notranslate" translate="no">
                    {(KNOWLEDGE_BASE.sigilli as any)[activeSeal].tipo}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm md:text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {(KNOWLEDGE_BASE.sigilli as any)[activeSeal].dettaglio}
                  </p>
                  <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
                    <div className="text-[11px] md:text-[9px] text-slate-500 uppercase font-mono tracking-widest">
                      Area di Pertinenza: <span className="text-slate-900 notranslate" translate="no">{(KNOWLEDGE_BASE.sigilli as any)[activeSeal].area}</span>
                    </div>
                    <p className="text-[12px] md:text-[10px] text-slate-500 italic leading-relaxed">
                      {(KNOWLEDGE_BASE.sigilli as any)[activeSeal].area.includes('Libertà')
                        ? "Questi vincoli nascono tipicamente dal rapporto con il genitore dello stesso sesso (Area della Libertà)."
                        : "Questi vincoli nascono tipicamente nell'infanzia durante il rapporto con il genitore del sesso opposto (Area del Sogno)."}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const renderTimelineModule = () => (
    <div className="space-y-10">
      <div className="bg-upda-ciano/10/50 border border-upda-ciano/20 p-6 rounded-2xl">
        <p className="text-xs md:text-sm text-upda-petrolio font-medium leading-relaxed text-center italic">
          Chiedere all'inconscio del cliente: "Quando accadde quell'evento che, se non si fosse verificato, oggi non presenteresti questo malessere relativo al conflitto? (individuare l'età)"
        </p>
      </div>

      {/* Grafico esteso dell'asse temporale fuori dal box limitato */}
      {state.subject.age > 0 && timelineResults && (
        <TimeLineGraph 
          age={state.subject.age} 
          PU={timelineResults.pu} 
          PT={timelineResults.pt} 
          AF={timelineResults.af}
          F={timelineResults.f}
          eventAge={state.timeline.denouncedAge} 
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="tech-label" style={{ color: '#000104' }}>Età Evento Denunciato</label>
            <input 
              type="number" 
              value={state.timeline.denouncedAge || ''}
              onChange={(e) => updateTimeline({ denouncedAge: parseInt(e.target.value) || 0 })}
              className="tech-input"
              placeholder="Es: 25"
            />
          </div>
          <div className="space-y-3">
            <label className="tech-label" style={{ color: '#020406' }}>Classificazione Evento (Automatica)</label>
            <div className="flex gap-3">
              {[
                { id: 'AF', label: 'Antefatto (AF)', desc: 'Età < 50%' },
                { id: 'F', label: 'Fatto (F)', desc: 'Età ≥ 50%' }
              ].map(type => (
                <div
                  key={type.id}
                  className={cn(
                    "flex-1 p-4 rounded-xl border transition-all text-left",
                    state.timeline.eventType === type.id 
                      ? "bg-[#00c21a] border-[#00c21a] text-white shadow-sm" 
                      : "bg-[#eeeff2] border-slate-200 text-slate-400"
                  )}
                >
                  <div className="text-[11px] font-bold uppercase tracking-widest mb-1 notranslate" style={{ color: state.timeline.eventType === type.id ? '#FFFFFF' : '#64748b' }} translate="no">{type.label}</div>
                  <div className="text-[9px] opacity-80 uppercase font-mono notranslate" style={{ color: state.timeline.eventType === type.id ? '#FFFFFF' : '#94a3b8' }} translate="no">{type.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-upda-ciano/5 rounded-full blur-3xl -mr-16 -mt-16" />
          
          {state.subject.age <= 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Info size={24} className="text-slate-400" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400">Dati Insufficienti</p>
              <p className="text-[11px] mt-3 text-slate-500 max-w-[200px] leading-relaxed">Inserire l'età cronologica del soggetto nel modulo dedicato.</p>
            </div>
          ) : timelineResults ? (
            <div className="space-y-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Punto Utopico', code: 'PU', value: timelineResults.pu },
                    { label: 'Punto Topico', code: 'PT', value: timelineResults.pt },
                    { label: 'Distorsione Spaziale', code: 'CDS', value: timelineResults.cds },
                    { label: 'Antefatto', code: 'AF', value: timelineResults.af },
                    { label: 'Fatto', code: 'F', value: timelineResults.f },
                    { label: 'Soglia Benessere', code: '30%', value: timelineResults.valoreBenessere },
                  ].map(item => (
                    <div key={item.code} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider notranslate" translate="no">{item.label}</span>
                        <span className="text-[10px] text-upda-ciano font-bold font-mono notranslate" translate="no">{item.code}</span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 tracking-tight">{item.value.toFixed(1)}</div>
                    </div>
                  ))}
                </div>
              
              <div className="pt-8 border-t border-slate-800/60">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <div className="text-[9px] text-slate-600 uppercase font-mono tracking-widest mb-1 notranslate" translate="no">Finestra Energetica (CDT)</div>
                    <div className="text-3xl font-bold text-upda-petrolio tracking-tighter">{timelineResults.cdt.toFixed(1)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-slate-600 uppercase font-mono tracking-widest mb-1 notranslate" translate="no">Benessere</div>
                    <div className="text-sm font-bold text-slate-400 font-mono">{timelineResults.valoreBenessere.toFixed(1)}</div>
                  </div>
                </div>
                <div className="bg-upda-ciano/5 border border-upda-ciano/10 p-4 rounded-xl">
                  <div className="text-[9px] text-upda-ciano/60 uppercase font-mono tracking-widest mb-2 notranslate" translate="no">Interpretazione Diagnostica</div>
                  <div className="text-xs font-bold text-upda-petrolio italic leading-relaxed notranslate" translate="no">
                    {timelineResults.interpretation}
                  </div>
                </div>

                {timelineResults.validationErrors.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl space-y-2"
                  >
                    <div className="flex items-center gap-2 text-rose-400 mb-1">
                      <ShieldAlert size={14} />
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Avviso Incongruenza</span>
                    </div>
                    {timelineResults.validationErrors.map((err, i) => (
                      <p key={i} className="text-[10px] text-rose-400/90 font-medium leading-relaxed notranslate" translate="no">
                        • {err}
                      </p>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <Clock size={32} className="text-slate-800 mb-4" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-600">In attesa di parametri...</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-8 rounded-2xl space-y-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
            <Users className="text-slate-500" size={16} />
          </div>
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-slate-900">Dinamica del Testimone</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-3">
            <label className="tech-label" style={{ color: '#010204' }}>Da chi ha subito il torto</label>
            <select 
              value={state.witness}
              onChange={(e) => setState(prev => ({ ...prev, witness: e.target.value }))}
              className="tech-input appearance-none"
            >
              <option value="">Seleziona figura...</option>
              <option value="Padre" className="notranslate" translate="no">Padre</option>
              <option value="Madre" className="notranslate" translate="no">Madre</option>
              <option value="Fratello" className="notranslate" translate="no">Fratello</option>
              <option value="Sorella" className="notranslate" translate="no">Sorella</option>
              <option value="Nonno" className="notranslate" translate="no">Nonno</option>
              <option value="Nonna" className="notranslate" translate="no">Nonna</option>
              <option value="Zio">Zio</option>
              <option value="Zia">Zia</option>
              <option value="Cugino">Cugino</option>
              <option value="Cugina">Cugina</option>
              <option value="Amico">Amico</option>
              <option value="Amica">Amica</option>
              <option value="Insegnante">Insegnante</option>
              <option value="Partner">Partner</option>
              <option value="Ignoto">Ignoto</option>
            </select>
          </div>
          <div className="space-y-4">
            <label className="tech-label" style={{ color: '#000305' }}>Reazione al Torto</label>
            <div className="flex gap-3">
              {[
                { val: true, label: 'Giustificato', color: 'emerald', hex: '#000203' },
                { val: false, label: 'Non Giustificato', color: 'rose', hex: '#000204' }
              ].map(r => (
                <button
                  key={r.label}
                  onClick={() => setState(prev => ({ ...prev, isJustified: r.val }))}
                  className={cn(
                    "flex-1 py-3 rounded-xl border font-bold text-[10px] uppercase tracking-widest transition-all",
                    state.isJustified === r.val 
                      ? (r.color === 'emerald' ? "bg-upda-ciano/10 text-upda-petrolio border-upda-ciano/40" : "bg-rose-500/10 text-rose-700 border-rose-500/40")
                      : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-700"
                  )}
                  style={{ color: state.isJustified === r.val ? undefined : r.hex }}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <AnimatePresence mode="wait">
                {state.isJustified !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-4 rounded-xl border text-[11px] font-medium italic leading-relaxed",
                      state.isJustified 
                        ? "bg-upda-ciano/5 border-upda-ciano/10 text-upda-ciano/80" 
                        : "bg-rose-500/5 border-rose-500/10 text-rose-400/80"
                    )}
                  >
                    {state.isJustified 
                      ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-1.5 py-0.5 rounded bg-upda-ciano/10 text-upda-petrolio text-[9px] font-bold uppercase tracking-tighter">Dissociazione</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider">Dinamica del Pathos</span>
                          </div>
                          <p><span className="text-upda-petrolio font-bold">Meccanismo:</span> La ragione accetta una motivazione per l'offesa, perdonando "con la mente".</p>
                          <p><span className="text-upda-petrolio font-bold">Energia:</span> Compressione del <span className="text-upda-ciano">Pathos</span> (sofferenza inespressa).</p>
                          <p><span className="text-upda-petrolio font-bold">Attribuzione:</span> <span className="text-upda-ciano">Auto-attributivo</span>. Colpevolizza se stesso e sviluppa Vincoli Sindromici (es. paura dell'abbandono).</p>
                          <div className="pt-2 border-t border-upda-ciano/10 mt-2 text-[10px] opacity-70 italic">
                            In sintesi: giustificare "alimenta" la sofferenza.
                          </div>
                        </div>
                      ) 
                      : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[9px] font-bold uppercase tracking-tighter">Scissione</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider">Dinamica della Reattività</span>
                          </div>
                          <p><span className="text-rose-400/60 font-bold">Meccanismo:</span> La ragione rifiuta l'offesa e reagisce contro di essa, non perdonando.</p>
                          <p><span className="text-rose-400/60 font-bold">Energia:</span> Compressione della <span className="text-rose-300">Reattività</span> (rabbia e rancore repressi).</p>
                          <p><span className="text-rose-400/60 font-bold">Attribuzione:</span> <span className="text-rose-300">Etero-attributivo</span>. Riversa la colpa all'esterno e sviluppa Vincoli Anatemici (es. disistima).</p>
                          <div className="pt-2 border-t border-rose-500/10 mt-2 text-[10px] opacity-70 italic">
                            In sintesi: non giustificare "alimenta" la rabbia.
                          </div>
                        </div>
                      )}
                  </motion.div>
                )}
              </AnimatePresence>
              {state.isJustified !== null && (
                <div className="mt-4 p-3 border border-slate-800/40 rounded-lg bg-slate-900/30">
                  <p className="text-[9px] text-slate-500 uppercase font-mono leading-relaxed">
                    <span className="text-slate-400 font-bold">Nota:</span> Nelle situazioni patologiche (sintomatiche), si possono verificare dinamiche di allineamento tra Logica e Inconscio.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-8 rounded-2xl space-y-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
            <Zap className="text-upda-ciano" size={16} />
          </div>
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-slate-900">Indagine Eventi Cardine</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              id: 'AF', 
              label: 'Antefatto', 
              code: 'AF', 
              age: timelineResults?.af,
              desc: "Origine del disagio o 'difetto'. Genesi del bisogno frustrato.",
              colors: {
                active: "bg-upda-ciano/10 border-upda-ciano/40 text-upda-ciano",
                btn: "bg-upda-ciano",
                text: "text-upda-ciano"
              }
            },
            { 
              id: 'PT', 
              label: 'Punto Topico', 
              code: 'PT', 
              age: timelineResults?.pt,
              desc: "Centro della vita del problema. Vincolo massimo al libero arbitrio.",
              colors: {
                active: "bg-upda-petroliomber-500/10 border-amber-500/40 text-amber-400",
                btn: "bg-upda-petroliomber-500",
                text: "text-amber-400"
              }
            },
            { 
              id: 'PU', 
              label: 'Punto Utopico', 
              code: 'PU', 
              age: timelineResults?.pu,
              desc: "Punto di origine ideale. Rappresenta lo stato di purezza pre-trauma.",
              colors: {
                active: "bg-indigo-500/10 border-indigo-500/40 text-indigo-400",
                btn: "bg-indigo-500",
                text: "text-indigo-400"
              }
            },
            { 
              id: 'F', 
              label: 'Fatto', 
              code: 'F', 
              age: timelineResults?.f,
              desc: "Riattivazione della sofferenza dell'antefatto. Conclamazione del problema.",
              colors: {
                active: "bg-upda-petroliolue-500/10 border-blue-500/40 text-blue-400",
                btn: "bg-upda-petroliolue-500",
                text: "text-blue-400"
              }
            },
            { 
              id: 'Alfiere', 
              label: "L'Alfiere", 
              code: 'AL', 
              age: timelineResults?.pt,
              desc: "Testimone legato al Punto Topico. Strumento di sanzione nel presente.",
              colors: {
                active: "bg-rose-500/10 border-rose-500/40 text-rose-400",
                btn: "bg-rose-500",
                text: "text-rose-400"
              }
            },
          ].map(event => (
            <div 
              key={event.id}
              className={cn(
                "relative p-5 rounded-2xl border transition-all group",
                state.celebrationTarget === event.id 
                  ? `${event.colors.active} shadow-sm` 
                  : "bg-slate-50 border-slate-200 hover:border-slate-300"
              )}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn("text-[10px] font-bold uppercase tracking-widest", state.celebrationTarget === event.id ? (event.id === 'AF' ? 'text-upda-petrolio' : event.id === 'PT' ? 'text-amber-700' : event.id === 'PU' ? 'text-indigo-700' : event.id === 'F' ? 'text-blue-700' : 'text-rose-700') : "text-slate-400")}>
                      {event.label}
                    </span>
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-500">{event.code}</span>
                  </div>
                  <div className="text-xl font-bold text-slate-900 font-mono">
                    {event.age ? event.age.toFixed(1) : '--'} <span className="text-[10px] font-normal text-slate-400 ml-1">anni</span>
                  </div>
                </div>
                <button
                  onClick={() => setState(prev => ({ ...prev, celebrationTarget: prev.celebrationTarget === event.id ? '' : event.id as any }))}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[8px] font-bold uppercase tracking-tighter transition-all",
                    state.celebrationTarget === event.id
                      ? `${event.colors.btn} text-slate-900`
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  )}
                >
                  {state.celebrationTarget === event.id ? 'In Celebrazione' : 'Celebra'}
                </button>
              </div>
              
              <p className="text-[10px] text-slate-900 leading-relaxed font-mono italic mb-4">
                {event.desc}
              </p>

              <div className="space-y-2">
                <label className="text-[8px] uppercase font-mono text-slate-600 tracking-widest">
                  {event.id === 'PU' ? 'Seleziona Alfiere' : 'Soggetto da celebrare'}
                </label>
                <select 
                  value={state.eventSubjects[event.id] || ''}
                  onChange={(e) => setState(prev => ({ 
                    ...prev, 
                    eventSubjects: { ...prev.eventSubjects, [event.id]: e.target.value } 
                  }))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] text-slate-700 focus:outline-none focus:border-upda-ciano/50 transition-colors appearance-none"
                >
                  <option value="">Seleziona...</option>
                  {WITNESS_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        {state.celebrationTarget && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl space-y-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <BookOpen size={16} className="text-upda-ciano" />
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-900">Metodologia Analogica</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { 
                    t: 'AF: La Scintilla', 
                    d: "Evento della prima metà della vita. Un 'file danneggiato' che l'inconscio tiene vivo." 
                  },
                  { 
                    t: "F: L'Eco", 
                    d: "Evento recente che risveglia il dolore antico. Lo 'zombie' che esce dalla tomba." 
                  },
                  { 
                    t: 'PT: Il Centro', 
                    d: "Metà strada tra AF e F. Il momento in cui Libertà o Sogno sono stati calpestati." 
                  }
                ].map((item, i) => (
                  <div key={i} className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[9px] font-bold text-upda-petrolio uppercase tracking-tighter">{item.t}</div>
                    <p className="text-[10px] text-slate-600 leading-relaxed italic">{item.d}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-upda-ciano/5 border-l-2 border-upda-ciano/30 rounded-r-xl">
                <p className="text-[10px] text-slate-600 leading-relaxed">
                  L'inconscio "sabota" perché ha fame di energia emotiva. Attraverso un negoziato ("do ut des"), l'Analogista aiuta a rivivere questi momenti per scaricare la tensione.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-upda-ciano/5 border border-upda-ciano/20 p-6 rounded-2xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-upda-petrolio">
                    <Zap size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Decompressione</span>
                  </div>
                  <span className="text-xl font-mono font-bold text-upda-petrolio">{state.decompressionLevel}%</span>
                </div>
                
                <p className="text-[10px] text-slate-600 leading-relaxed italic">
                  Obiettivo: ridurre il peso emotivo del <span className="text-upda-petrolio font-bold">70%</span> per togliere potere al problema.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${state.decompressionLevel}%` }}
                      className="h-full bg-upda-petrolio shadow-[0_0_10px_rgba(28,59,69,0.5)]"
                    />
                  </div>
                  <div className="flex justify-between gap-1">
                    {[0, 25, 50, 70, 100].map(p => (
                      <button
                        key={p}
                        onClick={() => setState(prev => ({ ...prev, decompressionLevel: p }))}
                        className={cn(
                          "flex-1 py-1 rounded text-[8px] font-bold transition-all",
                          state.decompressionLevel === p 
                            ? "bg-upda-ciano text-white shadow-sm" 
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        )}
                      >
                        {p}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-upda-ciano/10">
                <p className="text-[9px] text-upda-ciano/60 font-bold uppercase tracking-widest text-center">
                  {state.decompressionLevel >= 70 ? "Soglia di Libertà Raggiunta" : "In Fase di Scarico"}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );

  const renderReportModule = () => (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 border-b border-slate-200 p-6 flex justify-between items-center backdrop-blur-md">
          <div className="flex gap-3 w-full justify-center md:justify-end">
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-6 py-2 bg-upda-ciano/10 text-upda-petrolio border border-upda-ciano/20 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-upda-ciano/20 transition-all font-mono"
            >
              <Printer size={16} />
              Stampa o Salva in PDF
            </button>
            {user && (
              <button 
                onClick={saveCurrentReport}
                disabled={isSaving}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all shadow-md disabled:opacity-50",
                  saveStatus === 'success' ? "bg-upda-ciano text-white" :
                  saveStatus === 'error' ? "bg-rose-500 text-white" :
                  "bg-upda-ciano text-white hover:bg-upda-petrolio"
                )}
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : 
                 saveStatus === 'success' ? <CheckCircle size={16} /> :
                 saveStatus === 'error' ? <ShieldAlert size={16} /> :
                 <Save size={16} />}
                {isSaving ? 'Salvataggio...' : 
                 saveStatus === 'success' ? 'Salvato!' :
                 saveStatus === 'error' ? 'Errore!' :
                 'Salva in Archivio'}
              </button>
            )}
            {lastErrorMessage && (
              <div className="col-span-full mt-2 text-[10px] text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20 text-center">
                {lastErrorMessage}
              </div>
            )}
          </div>
        </div>
        
        <div id="report-content" className="p-12 space-y-12 text-slate-700 bg-white print:bg-white print:text-black">
          {investigationMode === 'officiale' && (
            <div className="space-y-10 border-b border-slate-200 pb-12 print-section">
              <div className="bg-upda-petrolio text-white p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-upda-ciano block mb-1">UPDA • DISCIPLINE ANALOGICHE BENEMEGLIANE</span>
                  <h3 className="text-xl font-bold uppercase tracking-tight">Report Ufficiale di Sessione Analogica</h3>
                  <p className="text-xs text-slate-300 font-mono mt-1">Percorso Schede Operative</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Soggetto</span>
                  <span className="text-lg font-bold text-white uppercase">{officialState.scheda1.nome || state.subject.name || 'ANONIMO'} {officialState.scheda1.cognome || ''}</span>
                </div>
              </div>

              {/* SCHEDA 1 - 0523 */}
              <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-upda-petrolio flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-upda-ciano" />
                    Scheda 01 • Indagine
                  </h4>
                  <span className="text-[10px] font-mono uppercase bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-600 font-bold">5 Punti & Causa Conflitto</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div><span className="text-[9px] font-mono text-slate-500 uppercase block">Nome & Cognome</span><strong className="text-slate-900">{officialState.scheda1.nome} {officialState.scheda1.cognome || '-'}</strong></div>
                  <div><span className="text-[9px] font-mono text-slate-500 uppercase block">Età</span><strong className="text-slate-900">{officialState.scheda1.eta || state.subject.age} anni</strong></div>
                  <div><span className="text-[9px] font-mono text-slate-500 uppercase block">Professione</span><strong className="text-slate-900">{officialState.scheda1.professione || '-'}</strong></div>
                  <div><span className="text-[9px] font-mono text-slate-500 uppercase block">Recapito</span><strong className="text-slate-900">{officialState.scheda1.recapito || '-'}</strong></div>
                </div>

                {officialState.scheda1.focusObiettivo && (
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block mb-1">Focus / Obiettivo Dichiarato</span>
                    <p className="text-xs font-bold text-slate-900">{officialState.scheda1.focusObiettivo}</p>
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-mono text-slate-700 uppercase font-bold block mb-2">Esito Analisi dei 5 Punti:</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {officialState.scheda1.punti.map((p, idx) => (
                      <div key={p.id} className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">Punto {idx + 1}</span>
                          <span className={cn(
                            "text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase",
                            p.valore === 'SI' ? "bg-emerald-100 text-emerald-800" :
                            p.valore === 'NO' ? "bg-rose-100 text-rose-800" : "bg-slate-100 text-slate-600"
                          )}>
                            {p.valore || 'NON VALUTATO'}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 mb-1">{p.titolo}</p>
                        {p.dettaglio && <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-100">{p.dettaglio}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                {officialState.scheda1.causaConflitto && (
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Causa del Conflitto Identificata</span>
                    <p className="text-xs font-bold text-slate-900">{officialState.scheda1.causaConflitto}</p>
                    {officialState.scheda1.causaPuntiSelezionati.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {officialState.scheda1.causaPuntiSelezionati.map(pt => (
                          <span key={pt} className="text-[9px] font-mono bg-upda-ciano/10 text-upda-petrolio px-2 py-0.5 rounded font-bold">{pt}</span>
                        ))}
                      </div>
                    )}
                    {officialState.scheda1.cosaNonFarestiMai && (
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[9px] font-mono text-slate-500 uppercase block">Cosa non faresti mai per risolvere il problema:</span>
                        <p className="text-xs italic text-slate-700 font-serif">"{officialState.scheda1.cosaNonFarestiMai}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SCHEDA 2 - 0524 */}
              <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-upda-petrolio flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-upda-ciano" />
                    Scheda 02 • Planning
                  </h4>
                  <span className="text-[10px] font-mono uppercase bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-600 font-bold">Biometria, Planning & Tipologia</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Braccio Induttore</span>
                    <strong className="text-slate-900">{officialState.scheda2.braccioInduttore || 'DX'}</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Segno Analogico</span>
                    <strong className="text-slate-900">{officialState.scheda2.segno || '+'}</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Identificazione</span>
                    <strong className="text-slate-900 uppercase">{officialState.scheda2.identificazione || 'OMO'}</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Tipologia & Natura</span>
                    <strong className="text-upda-petrolio">{officialState.scheda2.tipologiaProblema || '-'} • {officialState.scheda2.naturaProblema || '-'}</strong>
                  </div>
                </div>

                {/* Calcolo PT Utopico (metà anni) e Planning Reale (se numerico) */}
                {(() => {
                  const ageNum = Number(officialState.scheda1.eta) || Number(state.subject.age) || 50;
                  const ptPuUtopico = ageNum / 2;
                  const cdsUtopico = ageNum / 4;
                  const afUtopico = ageNum / 4;
                  const fUtopico = (3 * ageNum) / 4;

                  const puRealeInput = officialState.scheda2.planningReale.puAge?.trim() || '';
                  const puRealeNum = parseFloat(puRealeInput);
                  const hasPuReale = !isNaN(puRealeNum) && puRealeNum > 0 && puRealeInput !== '';

                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Planning Utopico */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <div>
                              <span className="text-[10px] font-mono uppercase font-bold text-slate-800 block">Planning Utopico (PT = PU)</span>
                              <span className="text-[9px] font-mono text-slate-400">PT = PU = Età / 2 = {ptPuUtopico.toFixed(1)}a</span>
                            </div>
                            <span className="text-[10px] font-mono bg-upda-ciano/10 text-upda-petrolio px-2 py-0.5 rounded font-bold">Età: {ageNum}a</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="bg-slate-50 p-2 rounded">
                              <span className="text-[8px] font-mono text-slate-400 block uppercase">AF (PT - CDS)</span>
                              <strong className="text-amber-700">{officialState.scheda2.planningUtopico.afAge || afUtopico.toFixed(1)}a</strong>
                            </div>
                            <div className="bg-slate-50 p-2 rounded">
                              <span className="text-[8px] font-mono text-slate-400 block uppercase">PT = PU (Metà Anni)</span>
                              <strong className="text-upda-petrolio">{officialState.scheda2.planningUtopico.ptPuAge || ptPuUtopico.toFixed(1)}a</strong>
                            </div>
                            <div className="bg-slate-50 p-2 rounded">
                              <span className="text-[8px] font-mono text-slate-400 block uppercase">F (PT + CDS)</span>
                              <strong className="text-emerald-700">{officialState.scheda2.planningUtopico.fAge || fUtopico.toFixed(1)}a</strong>
                            </div>
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 pt-1">
                            <span>CDS (Coefficiente Distorsione Spaziale): </span>
                            <strong className="text-slate-800">{cdsUtopico.toFixed(1)}a</strong>
                          </div>
                        </div>

                        {/* Planning Reale (Visualizzato/Calcolato SOLO se inserito numero) */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <div>
                              <span className="text-[10px] font-mono uppercase font-bold text-slate-800 block">Planning Reale (PU)</span>
                              <span className="text-[9px] font-mono text-slate-400">Punto Utente / Denuncia Reale</span>
                            </div>
                            {hasPuReale ? (
                              <span className="text-[10px] font-mono bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded font-bold">
                                PU: {puRealeNum.toFixed(1)}a
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                                Non Inserito
                              </span>
                            )}
                          </div>

                          {hasPuReale ? (
                            <>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="bg-slate-50 p-2 rounded">
                                  <span className="text-[8px] font-mono text-slate-400 block uppercase">AF Reale</span>
                                  <strong className="text-amber-700">{Math.max(0, puRealeNum - cdsUtopico).toFixed(1)}a</strong>
                                </div>
                                <div className="bg-slate-50 p-2 rounded">
                                  <span className="text-[8px] font-mono text-slate-400 block uppercase">PU Reale</span>
                                  <strong className="text-rose-700">{puRealeNum.toFixed(1)}a</strong>
                                </div>
                                <div className="bg-slate-50 p-2 rounded">
                                  <span className="text-[8px] font-mono text-slate-400 block uppercase">F Reale</span>
                                  <strong className="text-emerald-700">{(puRealeNum + cdsUtopico).toFixed(1)}a</strong>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                                <div>
                                  <span className="text-slate-500">CDT: </span>
                                  <strong className="text-slate-800">
                                    {(puRealeNum - ptPuUtopico) >= 0 ? '+' : ''}{(puRealeNum - ptPuUtopico).toFixed(1)}a
                                  </strong>
                                </div>
                                <div>
                                  <span className="text-slate-500">Segno CD: </span>
                                  <strong className="text-slate-800">{(puRealeNum - ptPuUtopico) >= 0 ? '+' : '-'}</strong>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="py-4 text-center text-xs font-mono text-slate-400 italic">
                              Nessun numero inserito per il Planning Reale.
                            </div>
                          )}
                        </div>
                      </div>

                      {hasPuReale && (
                        <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200">
                          <div>
                            <span className="text-[9px] font-mono text-slate-500 uppercase block">Coeff. Distorsione Temporale (CDT)</span>
                            <strong className="text-sm font-bold text-slate-900">
                              {(puRealeNum - ptPuUtopico) >= 0 ? '+' : ''}{(puRealeNum - ptPuUtopico).toFixed(1)}a
                            </strong>
                          </div>
                          <div>
                            <span className="text-[9px] font-mono text-slate-500 uppercase block">Coeff. Distorsione Spaziale (CDS)</span>
                            <strong className="text-sm font-bold text-slate-900">{cdsUtopico.toFixed(1)}a</strong>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* SCHEDA 3 - 0525 */}
              <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-upda-petrolio flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-upda-ciano" />
                    Scheda 03 • Celebrazione & Relazione
                  </h4>
                  <span className="text-[10px] font-mono uppercase bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-600 font-bold">Relazione Significativa & Perdono</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Relazione Significativa: Ente Giudicante</span>
                    <strong className="text-sm font-bold text-slate-900 block">{officialState.scheda3.recettoreRiflessivoEnteGiudicante || '-'}</strong>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Relazione Significativa: Ente Giudicato</span>
                    <strong className="text-sm font-bold text-slate-900 block">{officialState.scheda3.recettoreEmotivoEnteGiudicato || '-'}</strong>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Personaggio da Celebrare (Carico Energetico)</span>
                  <strong className="text-base text-upda-petrolio block">{officialState.scheda3.personaggioCelebrarePrimo || '-'}</strong>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block mb-2">Accettazione / Perdono (Istanze)</span>
                    <div className="space-y-1.5 text-xs">
                      <div><span className="text-slate-500">Istanza Analogica:</span> <strong className="text-slate-900">{officialState.scheda3.istanzaAnalogica || '-'}</strong></div>
                      <div><span className="text-slate-500">Istanza Logica:</span> <strong className="text-slate-900">{officialState.scheda3.istanzaLogica || '-'}</strong></div>
                      <div><span className="text-slate-500">Matrice L/A:</span> <strong className="text-slate-900">{officialState.scheda3.matriceLA || '-'}</strong></div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block mb-2">Tematica Regressiva</span>
                    <div className="space-y-1.5 text-xs">
                      <div><span className="text-slate-500">Tematica:</span> <strong className="text-slate-900">{officialState.scheda3.tematicaRegressiva || '-'}</strong></div>
                      <div><span className="text-slate-500">Tipologia/Natura:</span> <strong className="text-slate-900">{officialState.scheda3.tipologiaNaturaRiepilogo || officialState.scheda2.tipologiaProblema || '-'}</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 border-b border-slate-200 pb-12 print-section">
            <div className="space-y-4">
              <h4 className="text-[11px] md:text-[9px] font-mono uppercase text-slate-500 tracking-[0.2em]">Dati Soggetto</h4>
              <div className="space-y-1">
                <p className="text-xl font-bold text-slate-900 tracking-tight">{state.subject.name || 'ANONIMO'}</p>
                <p className="text-sm md:text-xs text-slate-500 uppercase font-mono">Età: {state.subject.age} | Sesso: {state.subject.gender}</p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[11px] md:text-[9px] font-mono uppercase text-slate-500 tracking-[0.2em]">Configurazione Analogica</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4 text-[13px] md:text-[11px]">
                <div>
                  <span className="text-slate-500 block uppercase text-[11px] md:text-[9px] mb-1 notranslate" translate="no">Induttore</span>
                  <span className="font-bold text-upda-ciano uppercase text-sm md:text-[11px] notranslate" translate="no">{(KNOWLEDGE_BASE.induttori as any)[state.inductor]?.titolo || 'N/D'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[11px] md:text-[9px] mb-1">Sindrome</span>
                  <span className="font-bold text-slate-900 text-sm md:text-[11px]">{(KNOWLEDGE_BASE.induttori as any)[state.inductor]?.sindrome || 'N/D'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 print-section">
            <div className="space-y-6">
              <h4 className="text-[11px] md:text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500">Diagnosi Distonica</h4>
              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <span className="text-[11px] md:text-[9px] uppercase font-mono block mb-2 text-slate-500">Aree di Distonia</span>
                  <p className="text-sm md:text-xs font-bold text-slate-900 leading-relaxed">{state.distonicPoints.join(' • ') || 'Nessuna area selezionata'}</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <span className="text-[11px] md:text-[9px] uppercase font-mono block mb-3 text-slate-500">Sigilli Energetici</span>
                  <div className="space-y-3">
                    {state.seals.length > 0 ? state.seals.map(s => (
                      <div key={s} className="text-[12px] md:text-[10px] border-l-2 border-upda-ciano/30 pl-3">
                        <span className="font-bold text-upda-petrolio uppercase block mb-1">{s}</span>
                        <span className="text-slate-600 italic font-serif leading-relaxed">{(KNOWLEDGE_BASE.sigilli as any)[s]?.desc}</span>
                      </div>
                    )) : <p className="text-sm md:text-xs text-slate-500 italic">Nessun sigillo rilevato</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[11px] md:text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500">Analisi Temporale</h4>
              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <span className="text-[11px] md:text-[9px] uppercase font-mono block mb-3 text-slate-500 notranslate" translate="no">Time Line Dynamics</span>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { l: 'AF', v: timelineResults?.af },
                      { l: 'PU', v: timelineResults?.pu },
                      { l: 'PT', v: timelineResults?.pt },
                      { l: 'F', v: timelineResults?.f },
                    ].map(item => (
                      <div key={item.l} className="text-center">
                        <div className="text-[10px] md:text-[8px] text-slate-500 font-mono mb-1">{item.l}</div>
                        <div className="text-sm md:text-xs font-bold text-slate-900">{item.v?.toFixed(1) || '--'}</div>
                      </div>
                    ))}
                  </div>
                  {timelineResults && (
                    <div className="pt-3 border-t border-slate-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] md:text-[9px] text-slate-500 uppercase font-mono notranslate" translate="no">CDT</span>
                        <span className="text-sm md:text-xs font-bold text-upda-petrolio">{timelineResults.cdt.toFixed(1)}</span>
                      </div>
                      <p className="text-[12px] md:text-[10px] text-upda-petrolio font-bold italic notranslate" translate="no">{timelineResults.interpretation}</p>
                    </div>
                  )}
                </div>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <span className="text-[11px] md:text-[9px] uppercase font-mono block mb-2 text-slate-500">Test Analogico Personalità (TAP)</span>
                  <div className="space-y-2 text-xs">
                    <div><strong className="text-slate-600">Oscillazione in Avanti:</strong> <span className="font-bold text-slate-900">{tapForward || 'N/D'}</span></div>
                    <div><strong className="text-slate-600">Oscillazione in Indietro:</strong> <span className="font-bold text-slate-900">{tapBackward.length > 0 ? tapBackward.join(', ') : 'N/D'}</span></div>
                    {tapResult && (
                      <div className="pt-2 border-t border-slate-200 mt-2">
                        <span className="text-[9px] uppercase font-mono text-slate-400 block mb-1">Tipologia Risultato T.A.P.</span>
                        <span className="font-bold text-upda-petrolio text-sm block">{tapResult}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <span className="text-[11px] md:text-[9px] uppercase font-mono block mb-2 text-slate-500">Testimone & Reazione</span>
                  <p className="text-sm md:text-xs font-bold text-slate-900">
                    {state.witness || 'N/D'} — <span className={state.isJustified ? "text-upda-petrolio" : "text-rose-700"}>{state.isJustified ? 'Dissociazione' : 'Scissione'}</span>
                  </p>
                </div>
                {Object.keys(state.eventSubjects).length > 0 && (
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <span className="text-[9px] text-slate-500 uppercase font-mono block mb-3">Soggetti Eventi Cardine</span>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(state.eventSubjects).map(([key, value]) => (
                        <div key={key} className="text-[10px]">
                          <span className="text-slate-500 uppercase text-[8px] block">{key === 'PU' ? 'Alfiere (PU)' : key}</span>
                          <span className="font-bold text-slate-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {state.celebrationTarget && (
                  <div className="bg-upda-ciano/5 p-5 rounded-xl border border-upda-ciano/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] text-upda-ciano uppercase font-mono block">Celebrazione & Decompressione</span>
                      <span className="text-xs font-bold text-upda-petrolio">{state.decompressionLevel}%</span>
                    </div>
                    <p className="text-xs font-bold text-upda-petrolio uppercase tracking-wider">
                      Target: {state.celebrationTarget} 
                      {state.eventSubjects[state.celebrationTarget] && ` (${state.eventSubjects[state.celebrationTarget]})`}
                    </p>
                    <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-upda-ciano" style={{ width: `${state.decompressionLevel}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-600 italic mt-2 leading-relaxed">
                      {state.decompressionLevel >= 70 
                        ? "Soglia di scarico emotivo raggiunta (70%). Il problema ha perso il suo potere." 
                        : "Protocollo di decompressione emotiva in corso per il superamento del sigillo."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Definizione Problema & Analisi Blocchi */}
          {(problemDefinition.sintomoManifesto || blockAnalysisState.quattroPunti.length > 0 || blockAnalysisState.analisiBlocchi.length > 0 || blockAnalysisState.analisiCause.length > 0) && (
            <div className="pt-12 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-12 print-section">
              {/* Definizione Problema */}
              <div className="space-y-6">
                <h4 className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500">Definizione Problema</h4>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <span className="text-[9px] uppercase font-mono block mb-2 text-slate-500">Tipologia & Natura</span>
                    <p className="text-xs font-bold text-slate-900">{problemDefinition.tipologia || 'N/D'} • {problemDefinition.natura || 'N/D'}</p>
                  </div>
                  {problemDefinition.sintomoManifesto && (
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                      <span className="text-[9px] uppercase font-mono block mb-2 text-slate-500">Sintomo Manifesto</span>
                      <p className="text-xs font-bold text-slate-900">{problemDefinition.sintomoManifesto}</p>
                    </div>
                  )}
                  {problemDefinition.obiettivo && (
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                      <span className="text-[9px] uppercase font-mono block mb-2 text-slate-500">Obiettivo / Domanda Magica</span>
                      <p className="text-xs font-bold text-slate-900 mb-1">Obj: {problemDefinition.obiettivo}</p>
                      <p className="text-xs text-slate-600 italic">Domanda Magica: {problemDefinition.domandaMagica || 'N/D'}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Analisi Blocchi */}
              <div className="space-y-6">
                <h4 className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500">Analisi Blocchi</h4>
                <div className="space-y-4">
                  {blockAnalysisState.quattroPunti.length > 0 && (
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                      <span className="text-[9px] uppercase font-mono block mb-2 text-slate-500">I 4 Punti</span>
                      <ul className="space-y-2 text-xs">
                        {blockAnalysisState.quattroPunti.map((pt, i) => (
                          <li key={i}>
                            <span className="font-bold text-slate-900">{pt}</span>
                            {blockAnalysisState.quattroPuntiComments[pt] && <p className="text-slate-600 italic mt-1">{blockAnalysisState.quattroPuntiComments[pt]}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {blockAnalysisState.analisiBlocchi.length > 0 && (
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                      <span className="text-[9px] uppercase font-mono block mb-2 text-slate-500">Aree di Blocco</span>
                      <ul className="space-y-2 text-xs">
                        {blockAnalysisState.analisiBlocchi.map((pt, i) => (
                          <li key={i}>
                            <span className="font-bold text-slate-900">{pt}</span>
                            {blockAnalysisState.analisiBlocchiComments[pt] && <p className="text-slate-600 italic mt-1">{blockAnalysisState.analisiBlocchiComments[pt]}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {blockAnalysisState.analisiCause.length > 0 && (
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                      <span className="text-[9px] uppercase font-mono block mb-2 text-slate-500">Cause Identificate</span>
                      <ul className="space-y-2 text-xs">
                        {blockAnalysisState.analisiCause.map((pt, i) => (
                          <li key={i}>
                            <span className="font-bold text-slate-900">{pt}</span>
                            {blockAnalysisState.analisiCauseComments[pt] && <p className="text-slate-600 italic mt-1">{blockAnalysisState.analisiCauseComments[pt]}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="pt-12 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-12 print-section print:border-slate-200">
            <div className="space-y-6">
              <h4 className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500">Confronto Energetico</h4>
              <div className="space-y-4">
                {Object.entries(KNOWLEDGE_BASE.confrontoEnergetico).map(([key, data]: [string, any]) => (
                  <div key={key} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="text-[10px] font-bold uppercase text-upda-petrolio mb-2 tracking-wider">{key.replace(/([A-Z])/g, ' $1')}</div>
                    <div className="space-y-2 text-[10px] leading-relaxed">
                      <p><span className="text-slate-500 uppercase text-[8px] mr-2">Origine:</span> {data.origine}</p>
                      <p><span className="text-slate-500 uppercase text-[8px] mr-2">Direzione:</span> {data.direzione}</p>
                      <p className="text-slate-600 italic"><span className="text-slate-500 uppercase text-[8px] not-italic mr-2">Esito:</span> {data.conseguenze}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500">Note di Protocollo</h4>
              <ul className="space-y-3" style={{ fontFamily: 'monospace', fontStyle: 'normal', color: '#334155' }}>
                {KNOWLEDGE_BASE.noteChiave.map((note, i) => {
                  const noteColors = ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b'];
                  return (
                    <li key={i} className="text-[10px] flex gap-3 items-start leading-relaxed print:text-black" style={{ color: noteColors[i % noteColors.length], fontFamily: 'monospace', fontWeight: 'bold', fontStyle: 'normal' }}>
                      <span className="text-upda-ciano font-mono text-[8px] mt-1 print:text-upda-petrolio">0{i+1}</span>
                      {note}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-200 print-section">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-[9px] font-mono uppercase text-slate-500 tracking-[0.2em]">Sintesi Professionale IA</h4>
              <button 
                onClick={fetchAiSummary}
                disabled={isAiLoading}
                className="flex items-center gap-2 text-[10px] bg-upda-ciano text-white px-4 py-2 rounded-full hover:bg-upda-petrolio transition-all disabled:opacity-50 font-bold uppercase tracking-widest shadow-md no-print"
              >
                {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                Genera Analisi
              </button>
            </div>
            <AnimatePresence mode="wait">
              {aiSummary ? (
                <div className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-upda-ciano/10/50 p-8 rounded-2xl border border-upda-ciano/10 text-[11px] leading-relaxed whitespace-pre-wrap italic text-slate-700 font-serif"
                  >
                    {aiSummary}
                  </motion.div>
                  
                  <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-[9px] font-mono uppercase text-slate-400 tracking-[0.2em]">
                      Analogista Pro Dashboard • Riservato ad uso professionale
                    </span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-slate-300 rounded-full" />
                      <div className="w-1 h-1 bg-slate-300 rounded-full" />
                      <div className="w-1 h-1 bg-slate-300 rounded-full" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl">
                  <Sparkles size={24} className="text-slate-300 mx-auto mb-4" />
                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">In attesa di elaborazione...</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-12 border-t border-slate-800/60 print-section print:border-slate-200">
            <div className="flex justify-between items-center">
              <p className="text-[8px] text-slate-600 uppercase tracking-[0.4em] print:text-slate-400">
                Analogista Pro Dashboard • Riservato ad uso professionale
              </p>
              <div className="flex gap-1 no-print">
                <div className="w-1 h-1 bg-slate-800 rounded-full" />
                <div className="w-1 h-1 bg-slate-800 rounded-full" />
                <div className="w-1 h-1 bg-slate-800 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistoryModule = () => (
    <div className="space-y-8">
      {!user ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <LogIn size={48} className="mx-auto mb-6 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Accedi per sbloccare l'archivio</h3>
          <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
            Salva le tue sessioni in modo sicuro nel cloud e accedi allo storico dei pazienti in qualsiasi momento.
          </p>
          <button 
            onClick={handleLogin}
            className="bg-upda-ciano text-white px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-upda-petrolio transition-all shadow-lg"
          >
            Accedi con Google
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {user && !user.emailVerified && (
            <div className="bg-upda-petroliomber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-4">
              <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={16} />
              <div>
                <h4 className="text-xs font-bold text-amber-200/90 uppercase tracking-tight">Email non verificata</h4>
                <p className="text-[10px] text-amber-200/70 leading-relaxed mt-1">
                  Per poter salvare i dati nell'archivio, devi verificare il tuo indirizzo email su Google. 
                  Controlla la tua posta o le impostazioni del tuo account.
                </p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedReports.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-400">
                Non hai ancora report salvati nell'archivio.
              </div>
            ) : (
              savedReports.map(report => (
                <div key={report.id} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-upda-ciano/30 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase tracking-tight">{report.subjectName}</h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">
                        {report.createdAt?.toDate ? report.createdAt.toDate().toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Data non disponibile'}
                      </p>
                    </div>
                    <button 
                      onClick={() => deleteReport(report.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <span className="text-[8px] uppercase text-slate-400 block">Conflitto</span>
                      <span className="text-[10px] font-bold text-upda-petrolio uppercase">{report.conflictType}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <span className="text-[8px] uppercase text-slate-400 block">Age</span>
                      <span className="text-[10px] font-bold text-slate-900">{report.subjectAge}y</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => loadReport(report)}
                    className="w-full py-2 bg-upda-ciano/10 text-upda-petrolio rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-upda-ciano/20 transition-all border border-upda-ciano/10"
                  >
                    Carica Sessione
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );

  const tabs = useMemo(() => {
    if (investigationMode === 'officiale') {
      return [
        { id: 1, label: 'Scheda 1 • Indagine', icon: FileText },
        { id: 2, label: 'Scheda 2 • Planning', icon: Clock },
        { id: 3, label: 'Scheda 3 • Celebrazione', icon: Sparkles },
        { id: 6, label: 'Report Ufficiale', icon: Download },
      ];
    } else if (investigationMode === 'completa') {
      return [
        { id: 1, label: 'CLIENTE', icon: User },
        { id: 2, label: 'Induttore', icon: Activity },
        { id: 3, label: 'Punti Distonici', icon: Zap },
        { id: 4, label: 'T.A.P.', icon: Activity },
        { id: 5, label: 'Time Line', icon: Clock },
      ];
    } else {
      return [
        { id: 1, label: 'CLIENTE', icon: User },
      ];
    }
  }, [investigationMode]);

  return (
    <div className="min-h-screen font-sans selection:bg-upda-ciano/30">
      {/* Banner di avviso risveglio server per i tester */}
      {showServerWakeupNotice && (
        <div className="bg-amber-500/90 text-slate-950 px-4 py-2.5 text-xs md:text-sm font-medium border-b border-amber-600 shadow-sm relative z-[60] backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Info className="w-4 h-4 text-slate-950 shrink-0 font-bold" />
              <p className="leading-snug">
                <strong>Avviso:</strong> La prima volta che aprite il link, attendete 15-20 secondi affinché il server si risvegli. Se compare la schermata 503, basta fare un semplice aggiorna pagina (F5 o ricarica).
              </p>
            </div>
            <button
              onClick={() => {
                setShowServerWakeupNotice(false);
                try {
                  sessionStorage.setItem('dismiss_wakeup_banner', 'true');
                } catch {}
              }}
              className="text-slate-900 hover:text-black hover:bg-amber-600/30 p-1 rounded-md transition-colors shrink-0"
              title="Chiudi avviso"
              aria-label="Chiudi avviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-upda-petrolio border-b border-upda-petrolio/20 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-20 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-3">
            <div className="w-12 h-12 md:w-10 md:h-10 shrink-0 aspect-square rounded-full flex items-center justify-center bg-white border border-slate-200 shadow-sm group overflow-hidden">
              <img src="/logoupda.webp" alt="UPDA Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="text-center">
              <h1 className="text-base md:text-sm font-bold tracking-tighter text-white uppercase leading-none">Assistente Analogista</h1>
              <p className="text-[6px] leading-[13.5px] font-mono text-upda-ciano mt-1 md:mt-0.5 whitespace-nowrap">© 2026 UPDA e PACommunication. Tutti i diritti riservati.</p>
              <p className="text-[9px] md:text-[8px] font-mono uppercase tracking-widest text-slate-300 mt-1 md:mt-0.5">Dedicato a Stefano Benemeglio</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[9px] uppercase font-mono text-[#ffffff]">Archivio Cloud</span>
                {user ? (
                  <span className="text-[10px] text-[#ffffff] font-bold uppercase flex items-center gap-1">
                    <div className="w-1 h-1 bg-upda-ciano rounded-full animate-pulse" />
                    Connesso
                  </span>
                ) : (
                  <span className="text-[10px] text-[#ffffff] font-bold uppercase flex items-center gap-1">
                    <div className="w-1 h-1 bg-slate-300 rounded-full" />
                    Offline
                  </span>
                )}
              </div>
            </div>
            <div className="relative">
              {!user ? (
                <button 
                  onClick={handleLogin}
                  className="flex items-center gap-2 px-4 py-2 bg-upda-ciano/10 text-upda-petrolio border border-upda-ciano/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-upda-ciano/20 transition-all"
                >
                  <LogIn size={16} className="text-[#ffffff]" />
                  <span className="hidden md:inline">Accedi</span>
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="p-1 rounded-full border border-upda-ciano/30 overflow-hidden hover:scale-105 transition-transform"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 bg-upda-ciano/10 flex items-center justify-center text-upda-ciano font-bold text-xs">
                        {user.displayName?.[0] || 'U'}
                      </div>
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl p-2 z-[100]"
                      >
                        <div className="px-3 py-2 border-b border-slate-100 mb-2">
                          <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">{user.displayName}</p>
                          <p className="text-[9px] text-upda-ciano font-mono">{user.email}</p>
                        </div>
                        <div className="space-y-1">
                          {[
                            { icon: History, label: 'Archivio Sessioni', onClick: () => { setActiveTab(7); setShowProfileMenu(false); } },
                            ...(user?.email === 'analogistabrindisi@gmail.com' ? [{ icon: MessageSquare, label: 'Feedback Admin', onClick: () => { setActiveTab(9); setShowProfileMenu(false); } }] : []),
                          ].map((item, i) => (
                            <button 
                              key={i}
                              onClick={item.onClick}
                              className="w-full flex items-center gap-3 px-3 py-2 text-[10px] text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all uppercase tracking-wider mb-1"
                            >
                              <item.icon size={14} />
                              {item.label}
                            </button>
                          ))}
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-100">
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-[10px] text-rose-600 hover:text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all uppercase tracking-wider"
                          >
                            <LogOut size={14} />
                            Log Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Horizontal Navigation */}
        <nav className="bg-upda-ciano border-t border-upda-petrolio/20 backdrop-blur-sm overflow-x-auto no-scrollbar">
          <div className="max-w-5xl mx-auto px-1 md:px-4 flex items-center justify-between w-full">
            <button
              onClick={() => {
                setInvestigationMode('none');
                setActiveTab(1);
              }}
              className="flex flex-col items-center gap-1 md:gap-1.5 py-3 md:py-4 px-1 md:px-6 transition-all relative group flex-1 md:flex-none min-w-0 md:min-w-[120px] my-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            >
              <Home size={16} className="transition-transform group-hover:scale-110 md:w-[22px] md:h-[22px] text-white/70 group-hover:text-white" />
              <span className="text-[8px] md:text-[11px] font-bold uppercase tracking-widest md:tracking-[0.2em] text-center leading-tight notranslate break-words w-full text-[#ffffff]/80 group-hover:text-white" translate="no">
                Torna in Home
              </span>
            </button>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 md:gap-1.5 py-3 md:py-4 px-1 md:px-6 transition-all relative group flex-1 md:flex-none min-w-0 md:min-w-[120px] my-1 rounded-lg",
                  activeTab === tab.id 
                    ? "text-white bg-white/20 shadow-[inset_0_0_15px_rgba(255,255,255,0.2)]" 
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                <tab.icon size={16} className={cn("transition-transform group-hover:scale-110 md:w-[22px] md:h-[22px]", activeTab === tab.id ? "text-white" : "text-white/70")} />
                <span className={cn(
                  "text-[8px] md:text-[11px] font-bold uppercase tracking-widest md:tracking-[0.2em] text-center leading-tight notranslate break-words w-full",
                  activeTab === tab.id ? "text-[#ffffff]" : "text-[#ffffff]/80"
                )} 
                
                translate="no">
                  {tab.label}
                </span>
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-upda-ciano shadow-[0_0_10px_rgba(52,168,180,0.5)]"
                  />
                )}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Content Area */}
          <div className="w-full">
            <div className="tech-card p-8 min-h-[600px] relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-upda-ciano/5 rounded-full blur-3xl pointer-events-none" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10"
                >
                  <div className="mb-10 flex flex-col items-center">
                    <div className="text-center mb-6">
                      <h2 className="text-xl md:text-2xl font-bold text-upda-ciano whitespace-nowrap tracking-tight text-center notranslate" translate="no">
                        {tabs.find(t => t.id === activeTab)?.label}
                      </h2>
                      {activeTab <= 6 && (
    <p 
      className="text-[12px] md:text-[10px] text-slate-900 uppercase font-mono tracking-[0.2em] mt-2 md:mt-1 flex items-center justify-center border border-upda-ciano/20 rounded-lg bg-upda-ciano/5 notranslate"
      style={{ height: '54px', width: '280px' }}
      translate="no"
    >
      Modulo {activeTab} di {investigationMode === 'officiale' ? 3 : investigationMode === 'completa' ? 5 : 6} • {state.subject.name || 'Nuovo Soggetto'}
    </p>
  )}
                    </div>
                    {activeTab <= (investigationMode === 'officiale' ? 3 : investigationMode === 'completa' ? 5 : 6) && <div className="flex gap-1.5">
                      {Array.from({ length: investigationMode === 'officiale' ? 3 : investigationMode === 'completa' ? 5 : 6 }, (_, idx) => idx + 1).map(i => (
                        <div 
                          key={i} 
                          className={cn(
                            "w-12 h-1.5 rounded-full transition-all duration-500", 
                            i <= activeTab 
                              ? "bg-upda-ciano shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                              : "bg-slate-200"
                          )} 
                        />
                      ))}
                    </div>}
                  </div>

                  {investigationMode !== 'none' && (
                    <div className="mb-6 p-4 bg-upda-ciano/10 border border-upda-ciano/30 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-upda-ciano animate-pulse"></span>
                        <span className="text-xs font-mono font-bold uppercase text-upda-petrolio">
                          Modalità attiva: {investigationMode === 'officiale' ? 'Indagine Ufficiale' : 'Indagine Completa'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setInvestigationMode('none');
                          setActiveTab(1);
                        }}
                        className="text-[10px] font-mono uppercase px-3 py-1.5 bg-upda-petrolio text-white hover:bg-upda-petrolio/90 rounded-lg font-bold transition-all shadow-sm"
                      >
                        Torna in Home
                      </button>
                    </div>
                  )}

                  {investigationMode !== 'officiale' && activeTab === 1 && renderSubjectModule()}
                  {investigationMode === 'completa' && activeTab === 2 && renderInductorModule()}

                  {investigationMode === 'officiale' && activeTab === 1 && (
                    <Scheda1IndagineView
                      data={officialState.scheda1}
                      onChange={updateOfficialScheda1}
                      onNext={() => setActiveTab(2)}
                    />
                  )}
                  {investigationMode === 'officiale' && activeTab === 2 && (
                    <Scheda2PlanningView
                      data={officialState.scheda2}
                      subjectAge={officialState.scheda1.eta || state.subject.age}
                      onChange={updateOfficialScheda2}
                      onPrev={() => setActiveTab(1)}
                      onNext={() => setActiveTab(3)}
                    />
                  )}
                  {investigationMode === 'officiale' && activeTab === 3 && (
                    <Scheda3CelebrazioneView
                      data={officialState.scheda3}
                      tipologiaNaturaFromScheda2={`${officialState.scheda2.tipologiaProblema} • ${officialState.scheda2.naturaProblema}`}
                      onChange={updateOfficialScheda3}
                      onPrev={() => setActiveTab(2)}
                      onComplete={() => setActiveTab(6)}
                    />
                  )}
                  {investigationMode === 'officiale' && activeTab === 6 && renderReportModule()}
                  {investigationMode === 'officiale' && activeTab === 7 && renderHistoryModule()}
                  {investigationMode === 'officiale' && activeTab === 8 && <FeedbackForm onClose={() => setActiveTab(1)} />}

                  {investigationMode === 'completa' && activeTab === 3 && renderDistonicModule()}
                  {investigationMode === 'completa' && activeTab === 4 && renderTapModule()}
                  {investigationMode === 'completa' && activeTab === 5 && renderTimelineModule()}
                  {investigationMode === 'completa' && activeTab === 6 && renderReportModule()}
                  {investigationMode === 'completa' && activeTab === 7 && renderHistoryModule()}
                  {investigationMode === 'completa' && activeTab === 8 && <FeedbackForm onClose={() => setActiveTab(1)} />}

                  {investigationMode === 'none' && activeTab === 6 && renderReportModule()}
                  {investigationMode === 'none' && activeTab === 7 && renderHistoryModule()}
                  {investigationMode === 'none' && activeTab === 8 && <FeedbackForm onClose={() => setActiveTab(1)} />}
                  {activeTab === 9 && <AdminFeedbackView onClose={() => setActiveTab(1)} />}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Footer Navigation */}
            {investigationMode !== 'none' && activeTab <= (investigationMode === 'officiale' ? 3 : 5) && (
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setActiveTab(prev => Math.max(1, prev - 1))}
                  disabled={activeTab === 1}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50 px-6 py-3 rounded-full hover:text-slate-900 hover:bg-slate-100 disabled:opacity-0 transition-all border border-slate-200 shadow-sm"
                >
                  <ChevronLeft size={14} />
                  Precedente
                </button>
                <button
                  onClick={() => {
                    const maxM = investigationMode === 'officiale' ? 3 : 5;
                    if (activeTab < maxM) {
                      setActiveTab(prev => prev + 1);
                    } else {
                      setActiveTab(6); // Go to report module
                    }
                  }}
                  className="flex items-center gap-2 bg-upda-ciano text-slate-900 px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-upda-ciano transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                  {activeTab === (investigationMode === 'officiale' ? 3 : 5) ? 'Concludi e Genera Report' : 'Successivo'}
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
            
            {activeTab >= 6 && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setActiveTab(1)}
                  className="flex items-center gap-2 bg-upda-petrolio text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-upda-petrolio/90 transition-all shadow-sm"
                >
                  Torna alla Sessione / Modulo 1
                </button>
              </div>
            )}
            
            {/* Sequenza Indagine Component */}
            {investigationMode === 'completa' && <SequenzaIndagine />}
            {investigationMode === 'officiale' && <SequenzaIndagineUfficiale />}

            {/* Utility Block - Sempre Fisso */}
            <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-2xl space-y-4 my-8">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-800">UTILITY E GESTIONE SESSIONE</h4>
                <span className="text-[10px] font-mono text-slate-400">Strumenti analogisti</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: 'Report Professionale', desc: 'Esporta e stampa il report completo', icon: FileText, tab: 6 },
                  { title: 'Archivio Cloud', desc: 'Storico sessioni e salvataggi', icon: History, tab: 7 },
                  { title: 'Feedback e Assistenza', desc: 'Invia feedback o richieste', icon: MessageSquare, tab: 8 },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(item.tab)}
                    className={cn(
                      "p-4 border rounded-xl text-left transition-all group flex items-center gap-3",
                      activeTab === item.tab
                        ? "bg-upda-ciano/10 border-upda-ciano text-upda-petrolio shadow-sm"
                        : "bg-white border-slate-200 hover:border-upda-ciano/40 text-slate-900"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform",
                      activeTab === item.tab ? "bg-upda-petrolio text-white" : "bg-upda-ciano/10 text-upda-petrolio"
                    )}>
                      <item.icon size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase">{item.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Suggestions Section (Moved to bottom) */}
          <div className="pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-4">Suggerimenti IA e Analisi</h4>
              {!aiSuggestions.length && (
                <button 
                  onClick={fetchAiSuggestions}
                  disabled={isAiLoading}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[9px] uppercase font-bold text-slate-500 hover:text-upda-petrolio transition-all flex items-center gap-2"
                >
                  {isAiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  Analizza Sessione
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2">
              {aiSuggestions.map((s, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className="p-4 bg-white border border-slate-200 rounded-xl text-[10px] leading-relaxed text-slate-600 italic shadow-sm"
                >
                  "{s}"
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 bg-[#10464e] border-t border-[#10464e]/20">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 bg-[#099da2] p-4 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 shrink-0 aspect-square rounded-full flex items-center justify-center bg-white overflow-hidden border border-slate-200">
              <img src="/logoupda.webp" alt="UPDA Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tighter text-[#f7f7f7] uppercase leading-none">Assistente Analogista</h1>
              <p className="text-[7px] text-center font-mono text-white mt-1 whitespace-nowrap">© 2026 UPDA e PACommunication. Tutti i diritti riservati.</p>
              <p className="text-[8px] font-mono uppercase tracking-widest text-[#ffffff] mt-1">in memoria di S.Benemeglio</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase font-mono text-[#ffffff]">Archivio Cloud</span>
              {user ? (
                <span className="text-[10px] text-[#ffffff] font-bold uppercase flex items-center gap-1">
                  <div className="w-1 h-1 bg-upda-ciano rounded-full animate-pulse" />
                  Connesso
                </span>
              ) : (
                <span className="text-[10px] text-[#ffffff] font-bold uppercase flex items-center gap-1">
                   <div className="w-1 h-1 bg-slate-300 rounded-full" />
                   • Offline
                </span>
              )}
            </div>

            {!user ? (
              <button 
                onClick={handleLogin}
                className="flex items-center gap-2 px-6 py-2 bg-upda-ciano/5 text-[#f5f5f5] border border-upda-ciano/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-upda-ciano/10 transition-all"
              >
                <LogIn size={14} />
                Accedi
              </button>
            ) : (
              <button 
                onClick={handleLogout}
                className="text-[10px] text-rose-500 font-bold uppercase border border-rose-200 px-4 py-2 rounded-full hover:bg-rose-50 transition-all"
              >
                Logout
              </button>
            )}
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setActiveTab(8)}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-[#099da2] text-white border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#099da2]/80 transition-all"
              >
                <Shield size={14} />
                Feedback (Admin)
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 mt-6 pt-6 border-t border-slate-100">
          <p className="text-[10px] text-[#ffffff] font-mono text-center tracking-wider uppercase">
            Analogista Pro Dashboard • Riservato ad uso professionale
          </p>
        </div>
      </footer>
    </div>
  );
}
