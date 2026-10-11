import React from 'react';
import { X, Sparkles, Sliders, Globe, Bot, Trash2 } from 'lucide-react';
import { AppSettings } from '../types.ts';
import { PERSONAS } from '../personas.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onClearAllConversations: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearAllConversations,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Settings & Preferences</h2>
              <p className="text-xs text-slate-400">Configure AI generation parameters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Active Model Info */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white text-xs">Gemini 3.8 Flash</p>
                <p className="text-[11px] text-slate-400">Google's latest flagship multimodal model</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 font-bold">
              Active
            </span>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-white text-xs">Temperature</label>
              <span className="font-mono text-indigo-400 font-bold">{settings.temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.temperature}
              onChange={(e) => onUpdateSettings({ temperature: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.0 (Strict / Factual)</span>
              <span>0.7 (Balanced)</span>
              <span>1.0 (Creative)</span>
            </div>
          </div>

          {/* Google Search Grounding */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="space-y-0.5 max-w-[80%]">
              <p className="font-bold text-white flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Search Grounding</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Ground answers in real-time Google Search data with interactive citation links.
              </p>
            </div>
            <button
              onClick={() => onUpdateSettings({ enableGoogleSearch: !settings.enableGoogleSearch })}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                settings.enableGoogleSearch ? 'bg-indigo-600 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
            </button>
          </div>

          {/* Active Persona Selection */}
          <div className="space-y-2">
            <label className="font-bold text-white text-xs">Default AI Persona</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PERSONAS.map((p) => {
                const isSelected = settings.selectedPersonaId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onUpdateSettings({ selectedPersonaId: p.id })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <p className="font-bold text-xs">{p.name}</p>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {p.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom System Instruction */}
          <div className="space-y-1.5">
            <label className="font-bold text-white text-xs">
              Custom System Instructions (Optional)
            </label>
            <textarea
              rows={3}
              value={settings.customSystemInstruction}
              onChange={(e) => onUpdateSettings({ customSystemInstruction: e.target.value })}
              placeholder="E.g.: Always respond in bullet points, or prioritize Python examples..."
              className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
            />
          </div>

          {/* Clear All History */}
          <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
            <div>
              <p className="font-bold text-rose-400">Delete All Conversations</p>
              <p className="text-[11px] text-slate-500">Permanently clears local chat history.</p>
            </div>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete all saved conversations?')) {
                  onClearAllConversations();
                  onClose();
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-md shadow-indigo-600/20"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
