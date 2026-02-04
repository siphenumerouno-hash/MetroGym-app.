
import React from 'react';
import { GymSession } from '../types';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

interface DashboardProps {
  sessions: GymSession[];
}

const Dashboard: React.FC<DashboardProps> = ({ sessions }) => {
  const streak = sessions.length > 0 ? 5 : 0; // Mock streak logic
  const sessionsThisWeek = sessions.filter(s => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return s.startTime > weekAgo;
  }).length;
  
  const avgEffort = sessions.length > 0 
    ? (sessions.reduce((acc, s) => acc + (s.effortScore || 0), 0) / sessions.length).toFixed(1)
    : "0.0";

  const chartData = [
    { day: 'M', sessions: 1 },
    { day: 'T', sessions: 0 },
    { day: 'W', sessions: 2 },
    { day: 'T', sessions: 1 },
    { day: 'F', sessions: sessionsThisWeek },
    { day: 'S', sessions: 0 },
    { day: 'S', sessions: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Current Streak" value={`${streak} DAYS`} accent />
        <StatCard label="Avg Effort" value={avgEffort} />
        <StatCard label="This Week" value={`${sessionsThisWeek} SESS`} />
        <StatCard label="Weekly Goal" value="4 / 5" />
      </div>

      {/* Weekly Activity Graph */}
      <div className="bg-[#121212] p-5 rounded-3xl border border-neutral-800 yellow-glow">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-4">Weekly Intensity</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#666', fontSize: 12, fontWeight: 700 }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(250, 204, 21, 0.05)' }}
                contentStyle={{ backgroundColor: '#121212', border: '1px solid #333', borderRadius: '12px' }}
              />
              <Bar dataKey="sessions" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.sessions > 0 ? '#FACC15' : '#262626'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Last Session Summary */}
      <div className="bg-gradient-to-br from-[#121212] to-black p-6 rounded-3xl border border-neutral-800">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">Latest Mission</h3>
            <p className="text-xl font-athletic font-bold mt-1">HYPERTROPHY X</p>
          </div>
          <div className="bg-yellow-400 text-black px-2 py-1 rounded font-black text-xs">
            COMPLETED
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <div className="flex-1">
            <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Duration</p>
            <p className="text-lg font-athletic">82:45</p>
          </div>
          <div className="flex-1 border-l border-neutral-800 pl-4">
            <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Timing</p>
            <p className="text-sm font-bold text-green-400">ON TARGET</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, accent }: { label: string, value: string, accent?: boolean }) => (
  <div className={`p-5 rounded-3xl border transition-all ${
    accent ? 'bg-yellow-400 border-yellow-400 shadow-xl' : 'bg-[#121212] border-neutral-800'
  }`}>
    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
      accent ? 'text-black/60' : 'text-white/40'
    }`}>{label}</p>
    <p className={`text-xl font-athletic font-black ${
      accent ? 'text-black' : 'text-white'
    }`}>{value}</p>
  </div>
);

export default Dashboard;
