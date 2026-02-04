
import React, { useState } from 'react';
import { GymSession } from '../types';

interface CommunityProps {
  sessions: GymSession[];
}

const Community: React.FC<CommunityProps> = ({ sessions }) => {
  const [filter, setFilter] = useState<'feed' | 'meetups'>('feed');

  // Mock community data
  const feedItems = [
    { id: '1', user: 'IRON_MIKE', type: 'Session Finished', title: 'UPPER DESTRUCTION', time: '12m ago', rating: 4.8 },
    { id: '2', user: 'SARA_FIT', type: 'Blueprint Shared', title: 'CORE BURN 3000', time: '45m ago', rating: 4.5 },
  ];

  const meetupItems = [
    { id: 'm1', user: 'BEAST_MODE', loc: 'Gold Gym DT', type: 'Strength', time: 'NOW', participants: 3 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex gap-2 p-1 bg-[#121212] rounded-2xl border border-neutral-800">
        <button 
          onClick={() => setFilter('feed')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            filter === 'feed' ? 'bg-yellow-400 text-black shadow-lg' : 'text-white/40'
          }`}
        >
          Activity Feed
        </button>
        <button 
          onClick={() => setFilter('meetups')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            filter === 'meetups' ? 'bg-yellow-400 text-black shadow-lg' : 'text-white/40'
          }`}
        >
          Session Meetups
        </button>
      </div>

      <div className="space-y-4">
        {filter === 'feed' ? (
          <>
            {feedItems.map(item => (
              <div key={item.id} className="bg-gradient-to-br from-[#121212] to-[#080808] border border-neutral-800 rounded-3xl p-5 hover:border-yellow-400/30 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 font-black text-xs">
                        {item.user[0]}
                     </div>
                     <div>
                       <p className="text-xs font-black text-yellow-400 tracking-wider">@{item.user}</p>
                       <p className="text-[10px] text-white/40 uppercase font-bold">{item.type} • {item.time}</p>
                     </div>
                   </div>
                   <div className="bg-black/40 px-2 py-1 rounded-lg flex items-center gap-1">
                      <span className="text-yellow-400 text-[10px]">★</span>
                      <span className="text-[10px] font-black">{item.rating}</span>
                   </div>
                </div>
                <h3 className="text-xl font-athletic font-black uppercase mb-4 group-hover:text-yellow-400 transition-colors">{item.title}</h3>
                <div className="flex gap-2">
                   <button className="flex-1 bg-white/5 py-3 rounded-xl text-[10px] font-black uppercase border border-neutral-800 hover:bg-white/10">Take Session</button>
                   <button className="px-4 bg-white/5 rounded-xl border border-neutral-800">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-white/40">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0-10.628a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm0 10.628a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
                     </svg>
                   </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="space-y-4">
            <button className="w-full bg-yellow-400 text-black py-4 rounded-3xl font-athletic font-black uppercase tracking-widest text-sm yellow-glow mb-4">
              Post Availability
            </button>
            {meetupItems.map(item => (
              <div key={item.id} className="bg-[#121212] border border-neutral-800 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3">
                  <span className="text-[10px] font-black bg-red-600 text-white px-2 py-1 rounded italic animate-pulse">LIVE NOW</span>
                </div>
                <div className="mb-6">
                  <p className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-1">@{item.user} is available</p>
                  <h3 className="text-xl font-athletic font-black uppercase">{item.loc}</h3>
                  <p className="text-[10px] text-white/40 uppercase font-bold mt-1">Training: {item.type} • Goal: 60m</p>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-neutral-800 border-2 border-black flex items-center justify-center text-[10px] font-black text-white/40 uppercase">
                          U{i}
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-black flex items-center justify-center text-[10px] font-black text-black">
                        +{item.participants}
                      </div>
                   </div>
                   <button className="bg-yellow-400 text-black px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-yellow-400/20">JOIN</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
