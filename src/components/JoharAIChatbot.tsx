import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  MapPin,
  Compass,
  Utensils,
  Calendar,
  Languages,
  RotateCcw,
  Volume2
} from 'lucide-react';

interface JoharAIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const JoharAIChatbot: React.FC<JoharAIChatbotProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text:
        language === 'hi'
          ? 'जोहार! 🙏 मैं आपका झारखण्ड एआई पर्यटन सहायक (Johar AI) हूँ। आप मुझसे नेतरहाट, बेतला सफारी, जलप्रपातों, सोहराई कला या पारंपरिक धुस्का और रुगड़ा के बारे में कुछ भी पूछ सकते हैं।'
          : 'Johar! 🙏 I am your Johar AI Tourism Guide for Jharkhand. Ask me about waterfalls, tiger safaris, 360° sunset spots, tribal art (Dokra & Sohrai), or authentic cuisine (Dhuska & Rugra).' ,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'How do I reach Netarhat from Ranchi?',
    'What is traditional Dhuska & Rugra cuisine?',
    'Explain the Sarhul festival & Sarna faith',
    'Best waterfalls near Ranchi for day trip?',
    'How is Dokra brass metal craft made?'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const msg = textToSend || input;
    if (!msg.trim() || isLoading) return;

    const userMessage: Message = {
      sender: 'user',
      text: msg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for API
      const history = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          conversationHistory: history,
          language
        })
      });

      const contentType = res.headers.get('content-type');
      let botReplyText = 'Johar! I am ready to guide your Jharkhand exploration.';
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        botReplyText = data.reply || botReplyText;
      }

      const botMessage: Message = {
        sender: 'bot',
        text: botReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text:
            'Johar! Netarhat, Hundru Falls, and Betla National Park are wonderful places to explore in Jharkhand. Please check your network connection.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[560px] bg-stone-900 border border-stone-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-stone-100 animate-fade-in">
      {/* Chatbot Top Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 px-5 py-4 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-amber-600 flex items-center justify-center text-white shadow-md border border-emerald-400/40">
            <Bot className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-white font-serif">Johar AI Assistant</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[10px] text-emerald-300">
              {language === 'hi' ? 'स्मार्ट जनजातीय पर्यटन मार्गदर्शक' : 'Smart Jharkhand Heritage Guide'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMessages([messages[0]])}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            title="Reset Chat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-950/80">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white rounded-br-none shadow'
                  : 'bg-stone-900 border border-stone-800 text-stone-200 rounded-bl-none shadow'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
            </div>
            <span className="text-[9px] text-stone-500 mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-stone-900 rounded-2xl rounded-bl-none border border-stone-800 max-w-[70%]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span className="text-xs text-stone-400">Johar AI is consulting maps...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips Carousel */}
      <div className="p-2 bg-stone-900 border-t border-stone-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 rounded-lg bg-stone-950 text-stone-300 hover:text-white border border-stone-800 hover:border-emerald-500/50 whitespace-nowrap transition-colors flex-shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-stone-900 border-t border-stone-800 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder={
            language === 'hi'
              ? 'झारखण्ड यात्रा, मार्ग या खान-पान के बारे में पूछें...'
              : 'Ask about Netarhat, Betla, waterfalls, cuisine...'
          }
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 px-3.5 py-2.5 rounded-2xl bg-stone-950 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all shadow"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
