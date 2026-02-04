
import React from 'react';
import { GymSession } from '../types';

interface ProfileProps {
  sessions: GymSession[];
}

const Profile: React.FC<ProfileProps> = ({ sessions }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="text-center pt-4">
         <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-yellow-400 to-yellow-600 mx-auto border-4 border-black yellow-glow flex items-center justify-center mb-4">
            <span className="text-3xl font-athletic font-black text-black">AJ</span>
         </div>
         <h2 className="text-2xl font-athletic font-black uppercase">Alpha_Junior</h2>
         <p className="text-[10px] text-yellow-400/60 font-black tracking-[0.3em] uppercase mt-1 italic">Pro Level Athlete</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
         <ProfileStat label="Sess" value={sessions.length.toString()} />
         <ProfileStat label="Score" value="2.4k" />
         <ProfileStat label="Rank" value="#12" />
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-white/30 ml-2">Recent Archives</h3>
        {sessions.length > 0 ? (
          sessions.map(s => (
            <div key={s.id} className="bg-[#121212] p-5 rounded-3xl border border-neutral-800 flex justify-between items-center group hover:border-yellow-400/40 transition-all cursor-pointer">
              <div>
                <p className="text-[10px] text-white/40 uppercase font-black">{new Date(s.startTime).toLocaleDateString()}</p>
                <h4 className="font-athletic font-bold uppercase text-sm mt-1 group-hover:text-yellow-400 transition-colors">{s.objective}</h4>
              </div>
              <div className="text-right">
                <p className="text-xs font-athletic font-black text-yellow-400">8/10</p>
                <p className="text-[10px] text-white/30 uppercase font-bold">EFFORT</p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-neutral-900 rounded-3xl">
             <p className="text-white/20 text-xs font-bold uppercase tracking-widest">No Missions Recorded Yet</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
         <ProfileLink label="Personal Bests" />
         <ProfileLink label="Biometrics" />
         <ProfileLink label="Settings & Privacy" />
         <ProfileLink label="Sign Out" danger />
      </div>
    </div>
  );
};

const ProfileStat = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-[#121212] p-4 rounded-2xl border border-neutral-800 text-center">
    <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-athletic font-black text-white">{value}</p>
  </div>
);

const ProfileLink = ({ label, danger }: { label: string, danger?: boolean }) => (
  <button className={`w-full p-5 rounded-2xl border border-neutral-800 flex justify-between items-center bg-[#080808] hover:bg-neutral-900 transition-all ${danger ? 'text-red-500' : ''}`}>
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 opacity-30">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  </button>
);

export default Profile;
