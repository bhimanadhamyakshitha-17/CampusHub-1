import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowUp,
  Square,
  Paperclip,
  Globe,
  Mic,
  MicOff,
  X,
  Image as ImageIcon,
} from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string, image?: { data: string; mimeType: string; name?: string }) => void;
  isStreaming: boolean;
  onStopStreaming: () => void;
  enableGoogleSearch: boolean;
  onToggleGoogleSearch: () => void;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isStreaming,
  onStopStreaming,
  enableGoogleSearch,
  onToggleGoogleSearch,
  placeholder = 'Ask anything... (Shift+Enter for newline)',
}) => {
  const [content, setContent] = useState('');
  const [attachedImage, setAttachedImage] = useState<{
    data: string;
    mimeType: string;
    name?: string;
  } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [content]);

  // Setup Web Speech API for voice dictation
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
        setContent((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

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
        console.error('Failed to start speech recognition', err);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (isStreaming) {
      onStopStreaming();
      return;
    }

    if (!content.trim() && !attachedImage) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    onSendMessage(content.trim(), attachedImage || undefined);
    setContent('');
    setAttachedImage(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPEG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAttachedImage({
        data: result,
        mimeType: file.type,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 pb-4">
      <div className="relative rounded-2xl bg-slate-900 border border-slate-700/80 shadow-xl focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
        {/* Attached image preview */}
        {attachedImage && (
          <div className="p-3 border-b border-slate-800 flex items-center gap-3">
            <div className="relative group w-14 h-14 rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
              <img
                src={attachedImage.data}
                alt={attachedImage.name || 'attachment'}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setAttachedImage(null)}
                className="absolute top-1 right-1 p-0.5 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors"
                title="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="text-xs">
              <p className="font-medium text-slate-200 truncate max-w-xs">{attachedImage.name}</p>
              <p className="text-[10px] text-indigo-400">Attached for multimodal reasoning</p>
            </div>
          </div>
        )}

        {/* Input Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="w-full px-4 pt-3.5 pb-2 bg-transparent text-slate-100 text-sm placeholder-slate-400 resize-none focus:outline-none max-h-48 leading-relaxed"
        />

        {/* Action Toolbar */}
        <div className="flex items-center justify-between px-3 pb-3 pt-1">
          {/* Left tools: Attachment, Web search toggle, Mic */}
          <div className="flex items-center gap-1">
            {/* File Upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
              title="Attach image for vision understanding"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Google Search Toggle */}
            <button
              type="button"
              onClick={onToggleGoogleSearch}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                enableGoogleSearch
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Search the live web using Google Grounding"
            >
              <Globe className={`w-3.5 h-3.5 ${enableGoogleSearch ? 'text-emerald-400' : ''}`} />
              <span className="text-[11px] font-semibold hidden sm:inline">
                {enableGoogleSearch ? 'Search On' : 'Search Off'}
              </span>
            </button>

            {/* Voice Dictation */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2 rounded-xl transition-colors ${
                isListening
                  ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                  : 'text-slate-400 hover:text-indigo-300 hover:bg-slate-800'
              }`}
              title={isListening ? 'Stop listening' : 'Dictate with voice'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {/* Right tools: Stop or Send */}
          <div className="flex items-center gap-2">
            {isStreaming ? (
              <button
                type="button"
                onClick={onStopStreaming}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition-all active:scale-95"
                title="Stop generation"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={!content.trim() && !attachedImage}
                className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                  content.trim() || attachedImage
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
                title="Send message (Enter)"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Real-world Disclaimer */}
      <p className="text-center text-[11px] text-slate-500 mt-2">
        Gemini 3.8 Flash can make mistakes. Consider checking important information.
      </p>
    </div>
  );
};
