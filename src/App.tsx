import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Message, Subject } from "./types";
import { geminiService } from "./services/geminiService";
import { ChatMessage } from "./components/ChatMessage";
import { 
  Send, 
  Sparkles, 
  BookOpen, 
  ClipboardCheck, 
  Zap, 
  Search,
  Plus,
  Stethoscope,
  Trash2,
  RefreshCcw,
  Target
} from "lucide-react";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject>('General');
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = typeof text === 'string' ? text : input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user' as const,
        parts: [{ text: m.content }]
      }));

      const aiResponse = await geminiService.generateTutorResponse(messageText, history);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse || "I'm sorry, I couldn't generate a response. Please try again.",
        timestamp: Date.now(),
        subject: detectSubject(aiResponse || "")
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Oops! Technical difficulty. Please check your connection and try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const detectSubject = (response: string): Subject => {
    const firstLine = response.split('\n')[0].toLowerCase();
    if (firstLine.includes('biology')) return 'Biology';
    if (firstLine.includes('chemistry')) return 'Chemistry';
    if (firstLine.includes('physics')) return 'Physics';
    return 'General';
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-slate-50 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-bottom border-slate-200 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-neet-blue p-2 rounded-xl text-white shadow-lg shadow-neet-blue/20">
            <Stethoscope size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">NEET Guru</h1>
            <p className="text-[10px] font-medium text-neet-blue uppercase tracking-widest">Medical Entrance Expert</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
            {[
              { id: 'General', icon: <Target size={14} />, color: 'bg-slate-100' },
              { id: 'Biology', icon: <Leaf size={14} className="text-neet-green" />, color: 'bg-neet-green/10 text-neet-green' },
              { id: 'Chemistry', icon: <FlaskConical size={14} className="text-neet-blue" />, color: 'bg-neet-blue/10 text-neet-blue' },
              { id: 'Physics', icon: <Calculator size={14} className="text-neet-physics" />, color: 'bg-neet-physics/10 text-neet-physics' }
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub.id as Subject)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedSubject === sub.id ? sub.color + " ring-1 ring-inset ring-current/20" : "bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                {sub.icon}
                {sub.id}
              </button>
            ))}
        </div>

        <button 
          onClick={clearChat}
          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          title="Clear Conversation"
        >
          <Trash2 size={20} />
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 scroll-smooth">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <WelcomeScreen onPromptClick={handleSend} />
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isLoading && (
                <div className="flex gap-4 p-4 rounded-2xl border border-slate-100 mb-4 bg-white">
                  <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-neet-blue/10 text-neet-blue flex items-center justify-center animate-pulse">
                    <GraduationCap size={24} />
                  </div>
                  <div className="flex gap-2 items-center text-slate-400 text-sm italic">
                    Analyzing NCERT concepts...
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >.</motion.span>
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    >.</motion.span>
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    >.</motion.span>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={scrollRef} className="h-4" />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-slate-200 p-4 md:p-6 pb-8">
        <div className="max-w-4xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about Bio, Chem, Phys or paste a NEET PYQ..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 pr-14 focus:outline-none focus:ring-2 focus:ring-neet-blue/20 focus:border-neet-blue transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-neet-blue text-white flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-neet-blue/20"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="max-w-4xl mx-auto text-center mt-3 text-[10px] text-slate-400 font-medium uppercase tracking-widest flex flex-col gap-1">
           <span>Physics • Chemistry • Biology • NCERT Expert AI</span>
           <span className="opacity-70">Created by Gems of Gemini</span>
        </p>
      </footer>
    </div>
  );
}

function WelcomeScreen({ onPromptClick }: { onPromptClick: (text: string) => void }) {
  const prompts = [
    { text: "Explain the Mechanism of Muscle Contraction (Bio)", icon: <Leaf className="text-neet-green" /> },
    { text: "Solve this: 2g of H2 reacts with 16g of O2. Find limiting reagent.", icon: <FlaskConical className="text-neet-blue" /> },
    { text: "Physics: Shortcut for finding Net Resistance in Infinite Grid.", icon: <Calculator className="text-neet-physics" /> },
    { text: "What is the weightage of 'Genetics' in last 5 years?", icon: <Target className="text-slate-400" /> },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl mb-4 mx-auto border border-slate-100">
           <Stethoscope size={40} className="text-neet-blue" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome, Future Doctor!</h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
          I am your personal NEET Guru. Ask me any concept, paste a PYQ, or let's solve practice MCQs together.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
        {prompts.map((p, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            onClick={() => onPromptClick(p.text)}
            className="flex items-center gap-4 p-4 text-left bg-white border border-slate-200 rounded-2xl hover:border-neet-blue hover:shadow-md transition-all group"
          >
            <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-neet-blue/5 transition-colors">
              {p.icon}
            </div>
            <span className="text-sm font-medium text-slate-600 group-hover:text-neet-blue transition-colors">{p.text}</span>
          </motion.button>
        ))}
      </div>
      
      <div className="mt-12 flex gap-8">
        <div className="text-center">
            <div className="text-2xl font-bold text-slate-700">100%</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">NCERT Aligned</div>
        </div>
        <div className="text-center border-x border-slate-200 px-8">
            <div className="text-2xl font-bold text-slate-700">2024+</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">PYQ Verified</div>
        </div>
        <div className="text-center">
            <div className="text-2xl font-bold text-slate-700">+4/-1</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Exam Ready</div>
        </div>
      </div>
    </div>
  );
}

// Re-importing Lucide icons inside components if needed for clarity
import { Leaf, FlaskConical, Calculator, GraduationCap } from "lucide-react";
