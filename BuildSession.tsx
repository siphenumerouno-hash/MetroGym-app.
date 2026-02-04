
import React, { useState } from 'react';
import { SessionTemplate, TrainingType, CardioPlan, Exercise } from '../types';
import { TRAINING_TYPES, CARDIO_PLANS } from '../constants';

const BuildSession: React.FC = () => {
  const [template, setTemplate] = useState<Partial<SessionTemplate>>({
    objective: '',
    trainingType: 'both',
    durationGoal: 60,
    cardioPlan: 'no',
    exercises: [],
    isPublic: false
  });

  const addExercise = () => {
    const newEx: Exercise = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      sets: 3,
      reps: 10
    };
    setTemplate({ ...template, exercises: [...(template.exercises || []), newEx] });
  };

  const handleSave = () => {
    alert("Template Saved to Personal Vault");
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-athletic font-black uppercase tracking-tighter italic">Blueprint <span className="text-yellow-400">Creator</span></h2>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Design your ultimate routine</p>
      </header>

      <div className="space-y-6">
        <div className="bg-[#121212] p-6 rounded-3xl border border-neutral-800">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Template Name</label>
          <input 
            type="text"
            className="w-full bg-transparent border-b border-neutral-800 py-3 text-lg font-bold outline-none focus:border-yellow-400 transition-all"
            placeholder="e.g. 5x5 Power Build"
            value={template.objective}
            onChange={(e) => setTemplate({...template, objective: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="bg-[#121212] p-4 rounded-3xl border border-neutral-800">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Focus Area</label>
              <select 
                className="bg-transparent w-full font-bold uppercase text-xs outline-none"
                value={template.trainingType}
                onChange={(e) => setTemplate({...template, trainingType: e.target.value as TrainingType})}
              >
                {TRAINING_TYPES.map(t => <option key={t.id} value={t.id} className="bg-black">{t.label}</option>)}
              </select>
           </div>
           <div className="bg-[#121212] p-4 rounded-3xl border border-neutral-800">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Goal (Min)</label>
              <input 
                type="number"
                className="bg-transparent w-full font-bold uppercase text-xs outline-none"
                value={template.durationGoal}
                onChange={(e) => setTemplate({...template, durationGoal: Number(e.target.value)})}
              />
           </div>
        </div>

        <div className="bg-[#121212] p-6 rounded-3xl border border-neutral-800">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-xs font-black uppercase tracking-widest">Exercise Sequence</h3>
             <button onClick={addExercise} className="bg-yellow-400 text-black px-3 py-1 rounded-lg text-[10px] font-black uppercase">Add Move</button>
          </div>
          <div className="space-y-4">
            {template.exercises?.map((ex, idx) => (
              <div key={ex.id} className="flex gap-4 items-end border-b border-neutral-800 pb-4">
                 <span className="text-white/20 font-athletic text-[10px] mb-2">{idx + 1}</span>
                 <div className="flex-1">
                   <input 
                    placeholder="Move Name" 
                    className="bg-transparent w-full text-xs font-bold uppercase outline-none focus:text-yellow-400"
                    value={ex.name}
                    onChange={(e) => {
                      const newExs = [...(template.exercises || [])];
                      newExs[idx].name = e.target.value;
                      setTemplate({...template, exercises: newExs});
                    }}
                   />
                 </div>
                 <div className="w-12 text-center">
                    <span className="text-[8px] uppercase text-white/30 block">Sets</span>
                    <input 
                      type="number" 
                      className="bg-black/40 w-full text-center text-xs p-1 rounded font-athletic" 
                      value={ex.sets}
                      onChange={(e) => {
                        const newExs = [...(template.exercises || [])];
                        newExs[idx].sets = Number(e.target.value);
                        setTemplate({...template, exercises: newExs});
                      }}
                    />
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={handleSave}
        className="w-full bg-white text-black py-5 rounded-3xl font-athletic font-black uppercase tracking-[0.2em]"
      >
        Store Blueprint
      </button>
    </div>
  );
};

export default BuildSession;
