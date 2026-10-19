import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, orderBy, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { MessageSquare, Star, Smartphone, Monitor, Tablet, Trash2, RefreshCw, User, Calendar, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface FeedbackItem {
  id: string;
  userId: string;
  userEmail: string;
  ratingFunctions: number;
  ratingMethod: number;
  ratingOscillation: number;
  ratingQuestions: number;
  deviceType: string;
  os: string;
  browser: string;
  openFeedback: string;
  feedbackInduttore: string;
  feedbackPuntiDistonici: string;
  feedbackTimeLine: string;
  createdAt: Timestamp | null;
}

interface AdminFeedbackViewProps {
  onClose: () => void;
}

export function AdminFeedbackView({ onClose }: AdminFeedbackViewProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const items: FeedbackItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as FeedbackItem);
      });
      setFeedbacks(items);
    } catch (err: any) {
      console.error("Errore nel recupero dei feedback:", err);
      // Fallback senza ordinamento se l'indice manca
      try {
        const querySnapshot = await getDocs(collection(db, 'feedback'));
        const items: FeedbackItem[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as FeedbackItem);
        });
        setFeedbacks(items);
      } catch (err2: any) {
        setError("Impossibile caricare i feedback. Verifica i permessi o la connessione.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo feedback?")) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'feedback', id));
      setFeedbacks(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      console.error("Errore durante l'eliminazione del feedback:", err);
      alert("Impossibile eliminare il feedback. Riprova.");
    } finally {
      setDeletingId(null);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
        />
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-w-5xl mx-auto">
      <div className="bg-upda-petrolio p-6 md:p-8 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-upda-ciano/20 flex items-center justify-center text-upda-ciano border border-upda-ciano/30">
            <Shield size={24} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest">Pannello Amministratore - Feedback</h2>
            <p className="text-white/70 font-mono text-xs mt-1">Gestione e consultazione feedback ricevuti dagli utenti in tempo reale</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchFeedbacks}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Aggiorna
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-upda-ciano text-slate-900 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-upda-ciano/90 transition-colors"
          >
            Chiudi
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 border-4 border-upda-ciano border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase font-mono tracking-widest text-slate-400">Caricamento feedback dal cloud...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center text-rose-600 text-sm">
            {error}
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50 rounded-2xl border border-slate-100">
            <MessageSquare size={48} className="text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-700 uppercase tracking-wider">Nessun feedback ricevuto</p>
            <p className="text-xs text-slate-400 mt-1">I feedback inviati dagli utenti appariranno qui in tempo reale.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase tracking-widest pb-4 border-b border-slate-100">
              <span>Totale feedback: <strong>{feedbacks.length}</strong></span>
              <span>Ultimo aggiornamento: <strong>{new Date().toLocaleTimeString()}</strong></span>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {feedbacks.map((item, index) => (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-upda-petrolio/10 text-upda-petrolio flex items-center justify-center font-bold text-sm">
                        {item.userEmail?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{item.userEmail || 'Utente Anonimo'}</p>
                        <p className="text-[10px] text-slate-400 font-mono">ID: {item.userId || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-mono font-bold text-slate-700 flex items-center gap-1.5">
                        <Smartphone size={12} className="text-upda-petrolio" />
                        {item.deviceType || 'N/A'} ({item.os || 'N/A'} / {item.browser || 'N/A'})
                      </span>
                      {item.createdAt && (
                        <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-mono text-slate-500 flex items-center gap-1.5">
                          <Calendar size={12} />
                          {item.createdAt instanceof Timestamp ? item.createdAt.toDate().toLocaleString() : 'Data non disponibile'}
                        </span>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        title="Elimina feedback"
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors border border-rose-200 flex items-center justify-center"
                      >
                        <Trash2 size={14} className={deletingId === item.id ? "animate-spin" : ""} />
                      </button>
                    </div>
                  </div>

                  {/* Ratings Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-slate-400 block mb-1">App Generale</span>
                      {renderStars(item.ratingFunctions)}
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase text-slate-400 block mb-1">Metodo Proposto</span>
                      {renderStars(item.ratingMethod)}
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase text-slate-400 block mb-1">Test Induttore</span>
                      {renderStars(item.ratingOscillation)}
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase text-slate-400 block mb-1">Time Line & Domande</span>
                      {renderStars(item.ratingQuestions)}
                    </div>
                  </div>

                  {/* Comments / Notes */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {item.feedbackInduttore && (
                      <div className="bg-white p-4 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-mono uppercase font-bold text-upda-petrolio block mb-1">Test Induttore (Note)</span>
                        <p className="text-xs text-slate-700 italic leading-relaxed">"{item.feedbackInduttore}"</p>
                      </div>
                    )}
                    {item.feedbackPuntiDistonici && (
                      <div className="bg-white p-4 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-mono uppercase font-bold text-upda-petrolio block mb-1">Punti Distonici (Note)</span>
                        <p className="text-xs text-slate-700 italic leading-relaxed">"{item.feedbackPuntiDistonici}"</p>
                      </div>
                    )}
                    {item.feedbackTimeLine && (
                      <div className="bg-white p-4 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-mono uppercase font-bold text-upda-petrolio block mb-1">Time Line (Note)</span>
                        <p className="text-xs text-slate-700 italic leading-relaxed">"{item.feedbackTimeLine}"</p>
                      </div>
                    )}
                  </div>

                  {item.openFeedback && (
                    <div className="bg-upda-ciano/5 p-4 rounded-xl border border-upda-ciano/20">
                      <span className="text-[9px] font-mono uppercase font-bold text-upda-petrolio block mb-1">Feedback Aperto / Correzioni Proposte</span>
                      <p className="text-xs text-slate-800 leading-relaxed font-medium">{item.openFeedback}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
