"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I am the Vitapia.ai Synthetic Intelligence. How can I help you understand our population-scale prediction platform?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const formattedMessages = messages.map(m => ({ role: m.role, content: m.content }));
      formattedMessages.push({ role: "user", content: userMessage });

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: formattedMessages }),
      });

      if (!res.ok) throw new Error("API response error");

      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "assistant", content: "Systems busy. I cannot process this request at the moment. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.4)] bg-gradient-to-tr from-[#00E5FF] to-[#00FF85] hover:scale-110 transition-transform ${isOpen ? 'hidden' : ''}`}
      >
        <MessageSquare className="w-6 h-6 text-black" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-[100] w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] flex flex-col rounded-3xl border border-zinc-800 bg-zinc-950/90 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00E5FF] to-[#00FF85] p-[1px]">
                  <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-[#00E5FF]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Vitapia Intelligence</h3>
                  <p className="text-[#00FF85] text-xs font-mono tracking-widest">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                      <Bot className="w-3 h-3 text-[#00E5FF]" />
                    </div>
                  )}
                  <div 
                    className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-zinc-800 text-white rounded-br-sm' 
                        : 'bg-gradient-to-b from-[#00E5FF]/10 to-transparent border border-[#00E5FF]/20 text-zinc-300 rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start items-end gap-2">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                    <Bot className="w-3 h-3 text-[#00E5FF]" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-zinc-400 rounded-bl-sm flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 shrink-0">
              <form onSubmit={sendMessage} className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..." 
                  disabled={isLoading}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-full pl-5 pr-12 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all disabled:opacity-50"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 rounded-full text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
