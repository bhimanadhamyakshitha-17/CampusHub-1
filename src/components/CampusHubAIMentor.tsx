import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  RotateCcw,
  Sparkles,
  Paperclip,
  Mic,
  MicOff,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Square,
  Globe,
  ThumbsUp,
  ThumbsDown,
  RotateCw,
  ExternalLink,
  X,
  User,
  Zap,
} from 'lucide-react';
import { AIChatMessage } from '../types.ts';
import { MarkdownRenderer } from './MarkdownRenderer.tsx';

interface CampusHubAIMentorProps {
  userName: string;
  userDomain: string;
  onClose?: () => void;
  isFloatingModal?: boolean;
}

export const CampusHubAIMentor: React.FC<CampusHubAIMentorProps> = ({
  userName,
  userDomain,
  onClose,
  isFloatingModal = false,
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello **${userName.split(' ')[0]}**! 👋 I am your **Gemini AI Academic Mentor** on CampusHub.

I can help you with:
- 🚀 **Hackathon Strategy & Architecture**: System design, fast MVP prototyping, and pitching.
- 💻 **Code & Debugging**: Modern TypeScript, React, Python, backend APIs, and algorithms.
- 📚 **Academic & Research Mentorship**: Research paper structuring and literature analysis.
- 🌐 **Real-time Technical Information**: Live answers with Google Search grounding.

How can I assist you with your project today?`,
      timestamp: Date.now(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [enableGoogleSearch, setEnableGoogleSearch] = useState(false);
  const [attachedImage, setAttachedImage] = useState<{
    data: string;
    mimeType: string;
    name?: string;
  } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll on new message / streaming token
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Web Speech API for voice dictation
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Speech recognition error', err);
      }
    }
  };

  const handleCopyMessage = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Code block omitted.')
      .replace(/[#*_~`]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);

    setMessages((prev) =>
      prev.map((m, idx) => (idx === prev.length - 1 ? { ...m, isStreaming: false } : m))
    );
  };

  const clearChat = () => {
    if (isStreaming) handleStopStreaming();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Chat session reset! What other questions or hackathon doubts can I help you solve?`,
        timestamp: Date.now(),
      },
    ]);
  };

  const handleSendMessage = async (promptText?: string) => {
    const textToSend = (promptText !== undefined ? promptText : input).trim();
    if (!textToSend && !attachedImage) return;

    if (isStreaming) handleStopStreaming();

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMsgId = `user-${Date.now()}`;
    const userMessage: AIChatMessage = {
      id: userMsgId,
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
      image: attachedImage || undefined,
    };

    const assistantMsgId = `assistant-${Date.now() + 1}`;
    const assistantMessage: AIChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    const newMessages = [...messages, userMessage];
    setMessages([...newMessages, assistantMessage]);
    setInput('');
    setAttachedImage(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsStreaming(true);

    const systemInstruction = `You are CampusHub's AI Academic Mentor, powered by Gemini. You assist university students like ${userName} (Domain: ${userDomain}) with their hackathons, coursework, engineering projects, and research questions. Answer like top AI systems (Google, ChatGPT, Gemini): with deep technical accuracy, clear explanations, clean code examples, and structured Markdown formatting.`;

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
            image: m.image
              ? {
                  data: m.image.data,
                  mimeType: m.image.mimeType,
                }
              : undefined,
          })),
          systemInstruction,
          enableGoogleSearch,
          temperature: 0.7,
          model: 'gemini-3.8-flash',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Streaming response body not supported.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let accumulatedText = '';
      let collectedGrounding: any[] = [];
      let collectedQueries: string[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;

          const dataStr = trimmed.replace('data: ', '').trim();
          if (dataStr === '[DONE]') break;

          try {
            const data = JSON.parse(dataStr);
            if (data.error) throw new Error(data.error);

            if (data.text) accumulatedText += data.text;
            if (data.groundingChunks) {
              collectedGrounding = [...collectedGrounding, ...data.groundingChunks];
            }
            if (data.finalGrounding) {
              collectedGrounding = data.finalGrounding;
            }
            if (data.webSearchQueries) {
              collectedQueries = [...collectedQueries, ...data.webSearchQueries];
            }
            if (data.finalQueries) {
              collectedQueries = data.finalQueries;
            }

            setMessages((prev) =>
              prev.map((m) => {
                if (m.id === assistantMsgId) {
                  return {
                    ...m,
                    content: accumulatedText,
                    groundingChunks: collectedGrounding,
                    webSearchQueries: collectedQueries,
                    isStreaming: true,
                  };
                }
                return m;
              })
            );
          } catch (e) {
            // Ignore partial SSE token parsing
          }
        }
      }

      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === assistantMsgId) {
            return {
              ...m,
              content: accumulatedText || '*(Completed)*',
              groundingChunks: collectedGrounding,
              webSearchQueries: collectedQueries,
              isStreaming: false,
            };
          }
          return m;
        })
      );
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Stream stopped by user');
      } else {
        console.error('Gemini Mentor error:', err);
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === assistantMsgId) {
              return {
                ...m,
                error: err?.message || 'Failed to receive answer from Gemini.',
                isStreaming: false,
              };
            }
            return m;
          })
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleRegenerate = () => {
    if (isStreaming) return;
    let lastUserIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserIndex = i;
        break;
      }
    }
    if (lastUserIndex === -1) return;

    const lastUserMsg = messages[lastUserIndex];
    setMessages((prev) => prev.slice(0, lastUserIndex));
    handleSendMessage(lastUserMsg.content);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage({
        data: reader.result as string,
        mimeType: file.type,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const presetPrompts = [
    'How can I structure a winning 3-minute hackathon pitch with a live demo?',
    'Explain how React state management and hooks work with practical code.',
    'What are the best open-source AI models for local hackathon deployment?',
    'Design an offline-first SQLite synchronization architecture for mobile apps.',
  ];

  return (
    <div
      className={`flex flex-col bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden ${
        isFloatingModal ? 'w-full h-[650px] max-w-3xl' : 'w-full h-full min-h-[620px]'
      }`}
    >
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-base shadow-md shadow-purple-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm text-white">Gemini AI Academic Mentor</h4>
              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase rounded-full border border-purple-500/30">
                Live Gemini 3.8
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Real-time answers for coding, coursework & hackathons • Tailored for {userDomain}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Google Search Toggle */}
          <button
            onClick={() => setEnableGoogleSearch(!enableGoogleSearch)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              enableGoogleSearch
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Google Search Grounding for live web queries"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search {enableGoogleSearch ? 'ON' : 'OFF'}</span>
          </button>

          {/* Reset Chat */}
          <button
            onClick={clearChat}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-slate-900/60">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} items-start`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 text-xs shadow-md shadow-purple-500/20 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-xs shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-100 rounded-tl-xs shadow-md'
                }`}
              >
                {/* Image if attached */}
                {m.image && (
                  <div className="mb-2 rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
                    <img
                      src={m.image.data}
                      alt={m.image.name || 'attachment'}
                      className="max-h-48 w-full object-contain"
                    />
                  </div>
                )}

                {/* Content */}
                {m.error ? (
                  <div className="text-rose-400 font-semibold">{m.error}</div>
                ) : isUser ? (
                  <div className="whitespace-pre-wrap">{m.content}</div>
                ) : (
                  <div>
                    <MarkdownRenderer content={m.content} />
                    {m.isStreaming && (
                      <div className="inline-flex items-center gap-1.5 text-purple-400 text-xs mt-2 font-mono">
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                        <span>Gemini is generating...</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Google Search Grounding Sources */}
                {!isUser && m.groundingChunks && m.groundingChunks.length > 0 && (
                  <div className="pt-3 border-t border-slate-800 space-y-1">
                    <p className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <Globe className="w-3 h-3" /> Sources from Google:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {m.groundingChunks.map((chunk, i) => {
                        if (!chunk.web?.uri) return null;
                        return (
                          <a
                            key={i}
                            href={chunk.web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] border border-slate-700"
                          >
                            <span className="truncate max-w-[150px]">{chunk.web.title || chunk.web.uri}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Assistant Toolbar */}
                {!isUser && !m.isStreaming && !m.error && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-slate-400">
                    <button
                      onClick={() => handleCopyMessage(m.id, m.content)}
                      className="p-1 hover:text-white transition-colors"
                      title="Copy response"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleSpeak(m.id, m.content)}
                      className={`p-1 hover:text-white transition-colors ${
                        speakingMessageId === m.id ? 'text-purple-400' : ''
                      }`}
                      title={speakingMessageId === m.id ? 'Stop speaking' : 'Read aloud'}
                    >
                      {speakingMessageId === m.id ? (
                        <VolumeX className="w-3.5 h-3.5" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={handleRegenerate}
                      className="p-1 hover:text-white transition-colors"
                      title="Regenerate answer"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        setMessages((prev) =>
                          prev.map((msg) =>
                            msg.id === m.id
                              ? { ...msg, feedback: msg.feedback === 'liked' ? null : 'liked' }
                              : msg
                          )
                        )
                      }
                      className={`p-1 hover:text-white transition-colors ${
                        m.feedback === 'liked' ? 'text-emerald-400' : ''
                      }`}
                      title="Helpful"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                  {userName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex gap-2 overflow-x-auto">
        {presetPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all border border-purple-500/20 shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
        {/* Attached image preview */}
        {attachedImage && (
          <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl">
            <img
              src={attachedImage.data}
              alt="preview"
              className="w-10 h-10 object-cover rounded-lg"
            />
            <span className="text-[11px] text-slate-300 truncate max-w-xs">{attachedImage.name}</span>
            <button
              onClick={() => setAttachedImage(null)}
              className="p-1 text-slate-400 hover:text-rose-400 ml-auto"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Attachment button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-purple-300 border border-slate-800 transition-colors"
            title="Attach image or diagram for AI analysis"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Speech input button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2.5 rounded-xl border border-slate-800 transition-colors ${
              isListening
                ? 'bg-rose-500/20 text-rose-400 animate-pulse border-rose-500/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-purple-300'
            }`}
            title="Voice speech-to-text"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Main prompt input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Gemini AI anything regarding hackathons, algorithms, or code..."
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />

          {/* Submit or Stop button */}
          {isStreaming ? (
            <button
              type="button"
              onClick={handleStopStreaming}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-rose-600/30"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim() && !attachedImage}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                input.trim() || attachedImage
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/25 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
