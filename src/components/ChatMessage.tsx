import { motion } from "motion/react";
import { Message, Subject } from "../types";
import { User, GraduationCap, ChevronRight, Calculator, FlaskConical, Leaf } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  
  // Try to parse subject from assistant response for styling
  const getSubjectColor = () => {
    if (message.subject === 'Biology') return 'text-neet-green border-neet-green/20 bg-neet-green/5';
    if (message.subject === 'Chemistry') return 'text-neet-blue border-neet-blue/20 bg-neet-blue/5';
    if (message.subject === 'Physics') return 'text-neet-physics border-neet-physics/20 bg-neet-physics/5';
    return 'text-slate-500 border-slate-200 bg-slate-50';
  };

  const subjectIcon = () => {
    if (message.subject === 'Biology') return <Leaf size={16} />;
    if (message.subject === 'Chemistry') return <FlaskConical size={16} />;
    if (message.subject === 'Physics') return <Calculator size={16} />;
    return <GraduationCap size={16} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 p-4 ${isAssistant ? "bg-white" : "bg-slate-50"} rounded-2xl border border-slate-100 mb-4`}
    >
      <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isAssistant ? "bg-neet-blue/10 text-neet-blue" : "bg-slate-200 text-slate-600"}`}>
        {isAssistant ? <GraduationCap size={24} /> : <User size={24} />}
      </div>
      
      <div className="flex-1 overflow-hidden">
        {isAssistant && message.content.includes("|") && (
          <div className={`inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-lg border text-xs font-semibold ${getSubjectColor()}`}>
            {subjectIcon()}
            <span>{message.content.split('\n')[0]}</span>
          </div>
        )}
        
        <div className="prose prose-slate max-w-none prose-sm leading-relaxed text-slate-700">
          {isAssistant ? (
            <div className="space-y-4">
              {message.content.split('\n').filter((_, i) => i > 0 || !message.content.includes("|")).map((line, idx) => {
                const trimmed = line.trim();
                
                // Header sections like [Concept], [Solution], etc.
                if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                  const title = trimmed.slice(1, -1);
                  const isSolution = title.toLowerCase().includes('solution') || title.toLowerCase().includes('explanation');
                  
                  return (
                    <div key={idx} className={`mt-6 mb-2 flex items-center gap-2 font-bold text-xs uppercase tracking-widest ${isSolution ? 'text-neet-blue' : 'text-slate-500'}`}>
                      <div className={`w-1 h-4 rounded-full ${isSolution ? 'bg-neet-blue' : 'bg-slate-300'}`} />
                      {title}
                    </div>
                  );
                }
                
                // Regular bullet points or text
                if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
                   return <div key={idx} className="flex gap-2 pl-2 mb-1">
                     <span className="text-neet-blue">•</span>
                     <span>{trimmed.slice(1).trim()}</span>
                   </div>;
                }

                // Bold key terms
                if (trimmed) {
                  return <div key={idx} className="mb-2">{trimmed}</div>;
                }
                
                return null;
              })}
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{message.content}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
