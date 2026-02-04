
import React, { useState, useEffect, useRef } from 'react';
import { GymSession, TrainingType, CardioPlan, Exercise, TimingOutcome } from '../types';
import { TRAINING_TYPES, CARDIO_PLANS } from '../constants';

interface SessionFlowProps {
  onStart?: (session: GymSession) => void;
  onFinish?: (session: GymSession) => void;
  onCancel?: () => void;
  session?: GymSession | null;
}

const SessionFlow: React.FC<SessionFlowProps> = ({ onStart, onFinish, onCancel, session: activeSession }) => {
  const [step, setStep] = useState(1);
  const [objective, setObjective] = useState('');
  const [trainingType, setTrainingType] = useState<TrainingType>('both');
  const [durationGoal, setDurationGoal] = useState(60);
  const [cardioPlan, setCardioPlan] = useState<CardioPlan>('no');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  
  // Post-Session state
  const [effortScore, setEffortScore] = useState(7);
  const [journal, setJournal] = useState({
    before: '',
    during: '',
    after: '',
    reflections: ''
  });
  const [isPublic, setIsPublic] = useState(true);

  // Timer logic
  const [secondsLeft, setSecondsLeft] = useState(0);
  // Fix: Use any for timerRef to avoid NodeJS.Timeout namespace error in browser-only TypeScript environments
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (activeSession) {
      setSecondsLeft(activeSession.durationGoal * 60);
      timerRef.current = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeSession]);

  const addExercise = () => {
    setExercises([...exercises, {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      sets: 3,
      reps: 10
    }]);
  };

  const updateExercise = (id: string, field: keyof Exercise, value: any) => {
    setExercises(exercises.map(ex => ex.id === id ? { ...ex, [field]: value } : ex));
  };

  const handleStart = () => {
    const newSession: GymSession = {
      id: Math.random().toString(36).substr(2, 9),
      objective: objective || 'Unplanned Session',
      trainingType,
      durationGoal,
      cardioPlan,
      exercises,
      creatorId: 'me',
      isPublic: false,
      startTime: Date.now(),
      journal: { before: '', during: '', after: '', reflections: '' }
    };
    onStart?.(newSession);
  };

  const handleStop = () => {
    if (!activeSession) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setStep(6); // Post-session step
  };

  const handleFinalSave = () => {
    if (!activeSession) return;
    
    const goalInSeconds = activeSession.durationGoal * 60;
    const actualDuration = goalInSeconds - secondsLeft;
    
    let outcome: TimingOutcome = 'finished_on_time';
    if (actualDuration < goalInSeconds - 10) outcome = 'finished_before_time';
    else if (actualDuration > goalInSeconds + 10) outcome = 'finished_after_time';

    const overtimeSeconds = Math.max(0, actualDuration - goalInSeconds);

    const completedSession: GymSession = {
      ...activeSession,
      endTime: Date.now(),
      actualDuration,
      overtimeSeconds,
      timingOutcome: outcome,
      effortScore,
      journal,
      isPublic
    };

    onFinish?.(completedSession);
  };

  const formatTime = (totalSeconds: number) => {
    const isNegative = totalSeconds < 0;
    const absoluteSeconds = Math.abs(totalSeconds);
    const mins = Math.floor(absoluteSeconds / 60);
    const secs = absoluteSeconds % 60;
    return `${isNegative ? '-' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ACTIVE SESSION UI
  if (activeSession && step < 6) {
    const isNegative = secondsLeft < 0;
    return (
      <div className="flex flex-col h-full bg-black animate-in fade-in duration-700">
        <div className="text-center py-10">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-white/40 mb-2">Current Mission</p>
          <h2 className="text-2xl font-athletic font-bold uppercase text-yellow-400">{activeSession.objective}</h2>
        </div>

        <div className={`flex-1 flex flex-col items-center justify-center p-8 rounded-[4rem] border-2 transition-all duration-500 ${isNegative ? 'border-red-500/30' : 'border-yellow-400/20'}`}>
          <div className={`text-7xl font-athletic font-black mb-4 tracking-tighter transition-colors ${isNegative ? 'text-red-500' : 'text-yellow-400 yellow-glow-text'}`}>
            {formatTime(secondsLeft)}
          </div>
          <p className={`text-xs font-bold uppercase tracking-widest ${isNegative ? 'text-red-500/60' : 'text-yellow-400/60'}`}>
            {isNegative ? 'OVERTIME LIMIT' : 'TIME REMAINING'}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto my-8 px-4">
          <h3 className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-4">Exercises Pipeline</h3>
          {activeSession.exercises.length > 0 ? (
            <div className="space-y-3">
              {activeSession.exercises.map((ex, idx) => (
                <div key={ex.id} className="bg-[#121212] p-4 rounded-2xl border border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-yellow-400 font-athletic text-xs mr-3">0{idx + 1}</span>
                    <span className="font-bold uppercase text-sm">{ex.name || 'Unnamed Move'}</span>
                  </div>
                  <div className="text-[10px] font-black text-white/40">
                    {ex.sets} X {ex.reps}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-white/20 text-sm italic py-10">Freeform session - No fixed exercises</p>
          )}
        </div>

        <button 
          onClick={handleStop}
          className="w-full bg-red-600 hover:bg-red-500 py-6 rounded-3xl font-athletic font-black uppercase tracking-widest transition-all yellow-glow mb-4"
        >
          Stop Session
        </button>
      </div>
    );
  }

  // POST SESSION UI
  if (step === 6) {
    return (
      <div className="space-y-8 animate-in slide-in-from-right-10 duration-500 pb-10">
        <header className="text-center">
          <h2 className="text-3xl font-athletic font-black text-yellow-400 uppercase italic">Mission Complete</h2>
          <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mt-2">Record your growth</p>
        </header>

        <section className="bg-[#121212] p-6 rounded-3xl border border-neutral-800">
          <label className="text-xs font-black uppercase tracking-widest text-white/40 mb-6 block">Effort Score (1-10)</label>
          <div className="flex justify-between mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
              <button 
                key={val}
                onClick={() => setEffortScore(val)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  effortScore === val ? 'bg-yellow-400 text-black scale-125' : 'text-white/40 bg-black/40'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <JournalInput 
            label="Condition Before?" 
            placeholder="Tired but focused..." 
            value={journal.before} 
            onChange={(v) => setJournal({...journal, before: v})} 
          />
          <JournalInput 
            label="Performance During?" 
            placeholder="Hit PBs on squats..." 
            value={journal.during} 
            onChange={(v) => setJournal({...journal, during: v})} 
          />
          <JournalInput 
            label="After Feeling?" 
            placeholder="Exhausted but proud..." 
            value={journal.after} 
            onChange={(v) => setJournal({...journal, after: v})} 
          />
          <JournalInput 
            label="Final Reflections" 
            placeholder="Need to focus more on form next time." 
            value={journal.reflections} 
            onChange={(v) => setJournal({...journal, reflections: v})} 
          />
        </section>

        <div className="flex items-center justify-between bg-[#121212] p-6 rounded-3xl border border-neutral-800">
           <div>
             <h4 className="font-bold uppercase text-sm">Community Pulse</h4>
             <p className="text-[10px] text-white/40 uppercase">Share this session with others</p>
           </div>
           <button 
            onClick={() => setIsPublic(!isPublic)}
            className={`w-14 h-8 rounded-full transition-all relative ${isPublic ? 'bg-yellow-400' : 'bg-neutral-800'}`}
           >
             <div className={`absolute top-1 w-6 h-6 rounded-full transition-all ${isPublic ? 'right-1 bg-black' : 'left-1 bg-white/20'}`} />
           </button>
        </div>

        <button 
          onClick={handleFinalSave}
          className="w-full bg-yellow-400 text-black py-6 rounded-3xl font-athletic font-black uppercase tracking-widest yellow-glow"
        >
          Save Log
        </button>
      </div>
    );
  }

  // CONFIGURATION STEPS UI
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <button onClick={onCancel} className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">CANCEL</button>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(s => (
            <div key={s} className={`h-1 w-6 rounded-full ${s <= step ? 'bg-yellow-400' : 'bg-neutral-800'}`} />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-athletic font-bold uppercase leading-tight">Define Your<br /><span className="text-yellow-400">Objective</span></h2>
          <input 
            type="text" 
            placeholder="e.g., Hypertrophy Focus"
            className="w-full bg-[#121212] border-b-2 border-neutral-800 p-4 text-xl focus:outline-none focus:border-yellow-400 transition-all font-bold"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-athletic font-bold uppercase">Training Type</h2>
          <div className="grid grid-cols-2 gap-3">
            {TRAINING_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => setTrainingType(t.id as TrainingType)}
                className={`p-4 rounded-2xl border text-sm font-black uppercase transition-all ${
                  trainingType === t.id ? 'bg-yellow-400 border-yellow-400 text-black' : 'bg-[#121212] border-neutral-800 text-white/60'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-athletic font-bold uppercase">Target Duration</h2>
          <div className="grid grid-cols-3 gap-3">
            {[30, 45, 60, 90, 120].map(m => (
              <button
                key={m}
                onClick={() => setDurationGoal(m)}
                className={`p-4 rounded-2xl border text-sm font-black transition-all ${
                  durationGoal === m ? 'bg-yellow-400 border-yellow-400 text-black' : 'bg-[#121212] border-neutral-800 text-white/60'
                }`}
              >
                {m} MIN
              </button>
            ))}
            <input 
              type="number"
              placeholder="Custom"
              className="w-full p-4 bg-[#121212] border border-neutral-800 rounded-2xl text-center font-bold"
              onChange={(e) => setDurationGoal(Number(e.target.value))}
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-athletic font-bold uppercase text-yellow-400">Cardio Strategy</h2>
          <div className="space-y-3">
            {CARDIO_PLANS.map(cp => (
              <button
                key={cp.id}
                onClick={() => setCardioPlan(cp.id as CardioPlan)}
                className={`w-full p-6 rounded-3xl border flex justify-between items-center font-black uppercase transition-all ${
                  cardioPlan === cp.id ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'bg-[#121212] border-neutral-800 text-white/40'
                }`}
              >
                {cp.label}
                <div className={`w-3 h-3 rounded-full ${cardioPlan === cp.id ? 'bg-black' : 'bg-neutral-700'}`} />
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-6 pb-20">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-athletic font-bold uppercase">Pipeline</h2>
            <button onClick={addExercise} className="bg-white/10 p-2 rounded-lg text-yellow-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            {exercises.map((ex, idx) => (
              <div key={ex.id} className="bg-[#121212] p-4 rounded-2xl border border-neutral-800 space-y-4">
                <input 
                  placeholder={`Exercise ${idx + 1}`}
                  className="bg-transparent border-b border-neutral-800 w-full py-2 font-bold uppercase text-sm focus:border-yellow-400 outline-none"
                  value={ex.name}
                  onChange={(e) => updateExercise(ex.id, 'name', e.target.value)}
                />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] uppercase font-black text-white/30">Sets</label>
                    <input type="number" className="bg-black/40 w-full p-2 rounded mt-1 font-athletic text-sm" value={ex.sets} onChange={(e) => updateExercise(ex.id, 'sets', Number(e.target.value))} />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] uppercase font-black text-white/30">Reps</label>
                    <input type="number" className="bg-black/40 w-full p-2 rounded mt-1 font-athletic text-sm" value={ex.reps} onChange={(e) => updateExercise(ex.id, 'reps', Number(e.target.value))} />
                  </div>
                </div>
              </div>
            ))}
            {exercises.length === 0 && (
              <div className="py-10 text-center border-2 border-dashed border-neutral-800 rounded-3xl text-white/20 text-sm">
                No exercises added. You can also log freely during session.
              </div>
            )}
          </div>
        </div>
      )}

      <div className="fixed bottom-10 left-0 right-0 px-8 max-w-md mx-auto z-50">
        {step < 5 ? (
          <button 
            onClick={() => setStep(step + 1)}
            className="w-full bg-white text-black py-5 rounded-3xl font-athletic font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all"
          >
            Continue
          </button>
        ) : (
          <button 
            onClick={handleStart}
            className="w-full bg-yellow-400 text-black py-5 rounded-3xl font-athletic font-black uppercase tracking-[0.2em] shadow-xl yellow-glow hover:scale-[1.02] transition-all"
          >
            Launch Session
          </button>
        )}
      </div>
    </div>
  );
};

const JournalInput = ({ label, placeholder, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">{label}</label>
    <textarea 
      placeholder={placeholder}
      className="w-full bg-[#121212] border border-neutral-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-yellow-400 min-h-[80px]"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default SessionFlow;
