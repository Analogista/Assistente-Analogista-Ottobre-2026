import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Star, Send, MessageSquare, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FeedbackFormProps {
  onClose?: () => void;
}

export function FeedbackForm({ onClose }: FeedbackFormProps) {
  const [ratingFunctions, setRatingFunctions] = useState<number>(5);
  const [ratingMethod, setRatingMethod] = useState<number>(5);
  const [ratingOscillation, setRatingOscillation] = useState<number>(5);
  const [ratingQuestions, setRatingQuestions] = useState<number>(5);
  
  const [feedbackInduttore, setFeedbackInduttore] = useState('');
  const [feedbackPuntiDistonici, setFeedbackPuntiDistonici] = useState('');
  const [feedbackTimeLine, setFeedbackTimeLine] = useState('');
  const [openFeedback, setOpenFeedback] = useState('');
  
  const [device, setDevice] = useState('SMARTPHONE');
  const [os, setOs] = useState('iOS');
  const [browser, setBrowser] = useState('Safari');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    
    if (!user) {
      setError("Devi essere loggato per inviare un feedback.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, 'feedback'), {
        userId: user.uid,
        userEmail: user.email || '',
        ratingFunctions,
        ratingMethod,
        ratingOscillation,
        ratingQuestions,
        deviceType: device,
        os,
        browser,
        openFeedback,
        feedbackInduttore,
        feedbackPuntiDistonici,
        feedbackTimeLine,
        createdAt: serverTimestamp(),
      });
      
      setIsSuccess(true);
      if (onClose) {
        setTimeout(onClose, 3000);
      }
    } catch (err: any) {
      console.error("Errore durante l'invio:", err);
      setError("Si è verificato un errore durante l'invio. Riprova più tardi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) => (
    <div className="flex flex-col gap-2 md:gap-4 md:flex-row md:items-center justify-between mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 transition-transform hover:scale-110 focus:outline-none"
          >
            <Star 
              size={24} 
              className={cn("transition-colors", star <= value ? "fill-amber-400 text-amber-400" : "text-slate-300")} 
            />
          </button>
        ))}
      </div>
    </div>
  );

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl shadow-sm border border-slate-200"
      >
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={40} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Grazie per il tuo feedback!</h3>
        <p className="text-slate-500 mb-8 max-w-md">Il tuo contributo è essenziale per migliorare l'Assistente Analogista e renderlo sempre più efficace.</p>
        {onClose && (
          <button onClick={onClose} className="px-6 py-3 bg-upda-petrolio text-white rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-[#0a3138] transition-colors">
            Torna alla Dashboard
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden max-w-3xl mx-auto">
      <div className="bg-upda-petrolio p-6 md:p-8 text-center text-white relative">
        <MessageSquare size={32} className="mx-auto mb-4 text-upda-ciano" />
        <h2 className="text-2xl font-bold uppercase tracking-widest mb-2">Lascia un Feedback</h2>
        <p className="text-white/80 font-mono text-sm max-w-lg mx-auto leading-relaxed">
          Aiutaci a perfezionare lo strumento. Le tue osservazioni cliniche sul campo sono fondamentali.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        
        
        {/* Dati Tecnici */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="text-sm uppercase tracking-widest font-bold text-upda-petrolio mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-upda-ciano rounded-full" />
            Specifiche Tecniche
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Dispositivo</label>
              <select 
                value={device}
                onChange={e => setDevice(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-upda-ciano/50 focus:border-upda-ciano transition-all"
              >
                <option value="SMARTPHONE">Smartphone</option>
                <option value="TABLET">Tablet</option>
                <option value="PC/MAC">PC / Mac</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Sistema Operativo</label>
              <select 
                value={os}
                onChange={e => setOs(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-upda-ciano/50 focus:border-upda-ciano transition-all"
              >
                <option value="iOS">iOS</option>
                <option value="Android">Android</option>
                <option value="macOS">macOS</option>
                <option value="Windows">Windows</option>
                <option value="Linux">Linux</option>
                <option value="Altro">Altro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Browser</label>
              <select 
                value={browser}
                onChange={e => setBrowser(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-upda-ciano/50 focus:border-upda-ciano transition-all"
              >
                <option value="Safari">Safari</option>
                <option value="Chrome">Chrome</option>
                <option value="Firefox">Firefox</option>
                <option value="Edge">Edge</option>
                <option value="Opera">Opera</option>
                <option value="Altro">Altro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Valutazioni Generali */}
        <div>
          <h3 className="text-sm uppercase tracking-widest font-bold text-upda-petrolio mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-upda-ciano rounded-full" />
            Valutazioni Generali
          </h3>
          <StarRating label="Valutazione dell'App in generale" value={ratingFunctions} onChange={setRatingFunctions} />
          <StarRating label="Valutazione del metodo proposto" value={ratingMethod} onChange={setRatingMethod} />
        </div>

        {/* Test Induttore */}
        <div>
          <h3 className="text-sm uppercase tracking-widest font-bold text-upda-petrolio mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-upda-ciano rounded-full" />
            Test Induttore
          </h3>
          <StarRating label="Sensibilità misurazione fotocamera/oscillazione" value={ratingOscillation} onChange={setRatingOscillation} />
          <div className="mt-4">
            <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Osservazioni sul Test Induttore</label>
            <textarea 
              value={feedbackInduttore}
              onChange={e => setFeedbackInduttore(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-upda-ciano/50 focus:border-upda-ciano min-h-[100px] resize-y transition-all"
              placeholder="Criticità, suggerimenti o note comportamentali durante questo test..."
            />
          </div>
        </div>

        {/* Test Punti Distonici */}
        <div>
          <h3 className="text-sm uppercase tracking-widest font-bold text-upda-petrolio mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-upda-ciano rounded-full" />
            Test Punti Distonici
          </h3>
          <div>
            <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Osservazioni sui Punti Distonici</label>
            <textarea 
              value={feedbackPuntiDistonici}
              onChange={e => setFeedbackPuntiDistonici(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-upda-ciano/50 focus:border-upda-ciano min-h-[100px] resize-y transition-all"
              placeholder="Feedback sull'interazione, la precisione dei punti o il flusso..."
            />
          </div>
        </div>

        {/* Test Time Line */}
        <div>
          <h3 className="text-sm uppercase tracking-widest font-bold text-upda-petrolio mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-upda-ciano rounded-full" />
            Test Time Line
          </h3>
          <StarRating label="Valutazione del flusso e tempistiche Domande" value={ratingQuestions} onChange={setRatingQuestions} />
          <div className="mt-4">
            <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Osservazioni sulla Time Line</label>
            <textarea 
              value={feedbackTimeLine}
              onChange={e => setFeedbackTimeLine(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-upda-ciano/50 focus:border-upda-ciano min-h-[100px] resize-y transition-all"
              placeholder="La rilevazione dei tempi morti e reazioni è accurata? Quali domande aggiungeresti?"
            />
          </div>
        </div>

        {/* Open Feedback Finale */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-sm uppercase tracking-widest font-bold text-upda-petrolio mb-3">
            Qui puoi scrivere eventuali correzioni o aggiunte da proporre in base ai test, scrivi nel dettaglio
          </label>
          <textarea 
            value={openFeedback}
            onChange={e => setOpenFeedback(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-upda-ciano/50 focus:border-upda-ciano min-h-[150px] resize-y transition-all shadow-inner"
            placeholder="Scrivi qui il tuo feedback generale, idee per nuove funzionalità o bug riscontrati..."
          />
        </div>

        {error && (
          <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium text-center border border-rose-200">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-4 bg-upda-petrolio hover:bg-[#0a3138] text-white rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-upda-petrolio disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send size={18} />
              Invia Feedback
            </>
          )}
        </button>
      </form>
    </div>
  );
}
