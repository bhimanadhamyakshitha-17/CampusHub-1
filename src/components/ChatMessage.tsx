import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Copy,
  Check,
  RotateCw,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  Globe,
  ExternalLink,
  AlertCircle,
  Pencil,
} from 'lucide-react';
import { Message } from '../types.ts';
import { MarkdownRenderer } from './MarkdownRenderer.tsx';

interface ChatMessageProps {
  message: Message;
  isLastAssistant: boolean;
  onRegenerate?: () => void;
  onEdit?: (content: string) => void;
  onFeedback?: (messageId: string, type: 'liked' | 'disliked') => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLastAssistant,
  onRegenerate,
  onEdit,
  onFeedback,
}) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols for cleaner TTS speech
    const cleanText = message.content
      .replace(/```[\s\S]*?```/g, 'Code block omitted for speech.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[#*_~]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`py-5 px-4 md:px-6 transition-colors ${
        isUser ? 'bg-transparent' : 'bg-slate-900/40 border-y border-slate-800/40'
      }`}
    >
      <div className="max-w-4xl mx-auto flex gap-3.5 sm:gap-4 items-start">
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shadow-xs">
              <User className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Message Content Container */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200">
                {isUser ? 'You' : 'Gemini AI'}
              </span>
              {!isUser && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  gemini-3.8-flash
                </span>
              )}
              <span className="text-[11px] text-slate-400">{formattedTime}</span>
            </div>

            {isUser && onEdit && (
              <button
                onClick={() => onEdit(message.content)}
                className="opacity-0 group-hover:opacity-100 hover:text-indigo-400 text-slate-400 text-xs flex items-center gap-1 transition-opacity"
                title="Edit message"
              >
                <Pencil className="w-3 h-3" />
                <span className="text-[11px]">Edit</span>
              </button>
            )}
          </div>

          {/* Attached image if present */}
          {message.image && (
            <div className="my-2 max-w-sm rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
              <img
                src={message.image.data}
                alt={message.image.name || 'Uploaded content'}
                className="w-full h-auto max-h-64 object-contain"
              />
              {message.image.name && (
                <div className="px-3 py-1 bg-slate-900 text-[11px] text-slate-400 truncate">
                  {message.image.name}
                </div>
              )}
            </div>
          )}

          {/* Message Body */}
          {message.error ? (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-300">Generation Error</p>
                <p className="mt-0.5">{message.error}</p>
                {onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded-lg text-xs font-medium transition-colors"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Try again</span>
                  </button>
                )}
              </div>
            </div>
          ) : isUser ? (
            <div className="text-sm text-slate-100 whitespace-pre-wrap leading-relaxed">
              {message.content}
            </div>
          ) : (
            <div className="text-slate-100 text-sm leading-relaxed">
              <MarkdownRenderer content={message.content} />

              {/* Streaming animated indicator */}
              {message.isStreaming && (
                <div className="inline-flex items-center gap-1.5 text-indigo-400 text-xs mt-2 font-mono">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  <span>Generating response...</span>
                </div>
              )}
            </div>
          )}

          {/* Search Grounding Sources (Google Search) */}
          {!isUser && message.groundingChunks && message.groundingChunks.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sources from Google Search</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {message.groundingChunks.map((chunk: any, idx: number) => {
                  if (!chunk.web?.uri) return null;
                  return (
                    <a
                      key={idx}
                      href={chunk.web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
                      title={chunk.web.uri}
                    >
                      <span className="truncate max-w-[200px]">
                        {chunk.web.title || new URL(chunk.web.uri).hostname}
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Web Search Queries */}
          {!isUser && message.webSearchQueries && message.webSearchQueries.length > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <span className="text-slate-400">Searched:</span>
              <div className="flex flex-wrap gap-1">
                {message.webSearchQueries.map((q: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-mono text-[10px]"
                  >
                    "{q}"
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Assistant Action Bar */}
          {!isUser && !message.isStreaming && !message.error && (
            <div className="flex items-center gap-2 pt-2 text-slate-400">
              {/* Copy response */}
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                title="Copy entire response"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Text to Speech */}
              <button
                onClick={handleSpeak}
                className={`p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors ${
                  isSpeaking ? 'text-indigo-400 bg-indigo-500/10' : ''
                }`}
                title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
              >
                {isSpeaking ? (
                  <VolumeX className="w-3.5 h-3.5 text-indigo-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Regenerate (if last message) */}
              {isLastAssistant && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                  title="Regenerate response"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Thumbs up / down */}
              {onFeedback && (
                <>
                  <button
                    onClick={() => onFeedback(message.id, 'liked')}
                    className={`p-1.5 rounded-lg hover:bg-slate-800 transition-colors ${
                      message.feedback === 'liked' ? 'text-emerald-400' : 'hover:text-white'
                    }`}
                    title="Good response"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onFeedback(message.id, 'disliked')}
                    className={`p-1.5 rounded-lg hover:bg-slate-800 transition-colors ${
                      message.feedback === 'disliked' ? 'text-rose-400' : 'hover:text-white'
                    }`}
                    title="Poor response"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
