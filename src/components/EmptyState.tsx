import React from 'react';
import {
  Code2,
  Sparkles,
  Search,
  BookOpen,
  Zap,
  Cpu,
} from 'lucide-react';

interface EmptyStateProps {
  onSelectPrompt: (prompt: string, searchEnabled?: boolean) => void;
  personaName: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPrompt, personaName }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const samplePrompts = [
    {
      category: 'Coding & Architecture',
      icon: Code2,
      iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      title: 'Full-Stack Architecture',
      prompt: 'Write a clean TypeScript example of an in-memory queue with rate-limiting, retry logic, and unit tests.',
    },
    {
      category: 'Deep Understanding',
      icon: BookOpen,
      iconColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
      title: 'Explain Complex Topics',
      prompt: 'Explain how Large Language Models work from attention mechanisms to token generation, using a clear analogy.',
    },
    {
      category: 'Live Web Search',
      icon: Search,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      title: 'Live Web Grounding',
      prompt: 'Search the web for the latest announcements and features released in Google Gemini models recently.',
      enableSearch: true,
    },
    {
      category: 'System Design',
      icon: Cpu,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      title: 'Database Schema Design',
      prompt: 'Design a scalable SQL database schema for a multi-tenant SaaS application with role-based permissions.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center min-h-[70vh] text-center">
      {/* Glow orb & brand logo */}
      <div className="relative mb-6">
        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-full blur-xl opacity-75"></div>
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-xl shadow-indigo-500/25">
          <Sparkles className="w-8 h-8" />
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
        {getGreeting()}! How can I help today?
      </h1>
      <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
        Active Persona: <span className="text-indigo-400 font-semibold">{personaName}</span>. Ask any questions, brainstorm ideas, draft code, or search the live web.
      </p>

      {/* Suggestion prompt cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-8 text-left">
        {samplePrompts.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.prompt, item.enableSearch)}
              className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/40 transition-all text-left group shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <div className={`p-1.5 rounded-lg border ${item.iconColor}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.prompt}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Ask now</span>
                <Zap className="w-3 h-3" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
