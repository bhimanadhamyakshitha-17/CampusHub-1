import React from 'react';
import {
  Menu,
  Sparkles,
  Download,
  Trash2,
  Settings,
  Globe,
  Share2,
} from 'lucide-react';
import { Persona } from '../types.ts';
import { PERSONAS } from '../personas.ts';

interface ChatHeaderProps {
  title: string;
  onToggleSidebar: () => void;
  selectedPersona: Persona;
  onSelectPersona: (personaId: string) => void;
  enableGoogleSearch: boolean;
  onToggleGoogleSearch: () => void;
  onClearChat: () => void;
  onExportChat: () => void;
  onOpenSettings: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  onToggleSidebar,
  selectedPersona,
  onSelectPersona,
  enableGoogleSearch,
  onToggleGoogleSearch,
  onClearChat,
  onExportChat,
  onOpenSettings,
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-3 sm:px-5 flex items-center justify-between shrink-0 z-20">
      {/* Left: Sidebar toggle & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Toggle conversation list"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <span className="font-bold text-white text-sm truncate max-w-[140px] sm:max-w-xs md:max-w-md">
            {title || 'New Chat'}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <Sparkles className="w-2.5 h-2.5" />
            gemini-3.8-flash
          </span>
        </div>
      </div>

      {/* Right Tools */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Persona Selector */}
        <select
          value={selectedPersona.id}
          onChange={(e) => onSelectPersona(e.target.value)}
          className="bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-indigo-500 max-w-[120px] sm:max-w-[160px] truncate"
          title="Change AI assistant persona"
        >
          {PERSONAS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Web Search toggle */}
        <button
          onClick={onToggleGoogleSearch}
          className={`p-2 rounded-xl text-xs font-semibold transition-all ${
            enableGoogleSearch
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title={
            enableGoogleSearch
              ? 'Google Search Grounding is ON'
              : 'Turn ON Google Search Grounding'
          }
        >
          <Globe className="w-4 h-4" />
        </button>

        {/* Export chat */}
        <button
          onClick={onExportChat}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden sm:block"
          title="Export conversation (Markdown)"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Clear chat */}
        <button
          onClick={onClearChat}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          title="Clear current messages"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Model & System Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
