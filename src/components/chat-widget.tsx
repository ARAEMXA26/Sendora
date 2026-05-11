"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Send, Bot } from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
}

interface ChatHistory {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Halo! 👋 Saya Sendora Assistant. Saya memahami seluruh fitur dan informasi seputar platform Sendora.\n\nSilakan tanyakan apa saja — mulai dari cara kerja, harga, fitur dashboard, keamanan, hingga hal teknis lainnya!",
      timestamp: new Date(),
    },
  ]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const QUICK_ACTIONS = [
    "Apa itu Sendora?",
    "Apakah aman dari banned?",
    "Bagaimana cara kerjanya?",
    "Berapa harga paketnya?",
    "Fitur dashboard apa saja?",
    "Bagaimana cara daftar?",
  ];

  const handleSend = async (text: string = inputText) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: generateId(),
      sender: "user",
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    const newHistory: ChatHistory[] = [
      ...chatHistory,
      { role: "user", content: text },
    ];

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        const botMsg: Message = {
          id: generateId(),
          sender: "bot",
          text: data.reply,
          timestamp: new Date(),
        };

        setChatHistory([
          ...newHistory,
          { role: "assistant", content: data.reply },
        ]);
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.message || "Gagal mendapatkan respons");
      }
    } catch {
      const errorMsg: Message = {
        id: generateId(),
        sender: "bot",
        text: "Maaf, saya sedang mengalami gangguan teknis. Silakan coba lagi dalam beberapa saat. 🙏",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Jendela Chat */}
      {isOpen && (
        <div className="mb-3 w-[300px] md:w-[340px] h-[420px] max-h-[75vh] bg-white rounded-xl shadow-2xl border border-orange-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#B04C2E] to-[#9A5034] p-4 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Sendora Assistant</h3>
                <p className="text-[11px] text-orange-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
                  Online — Siap membantu
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Area Pesan */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#FDFBF8]">
            <div className="flex flex-col gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex max-w-[85%] items-end gap-2">
                    {msg.sender === "bot" && (
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mb-1">
                        <Bot className="w-3.5 h-3.5 text-[#B04C2E]" />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl text-[13px] leading-relaxed shadow-sm whitespace-pre-line
                        ${msg.sender === "user"
                          ? "bg-[#B04C2E] text-white rounded-br-sm"
                          : "bg-white border border-orange-100 text-slate-700 rounded-bl-sm"
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}

              {/* Quick Actions */}
              {messages.length < 4 && !isTyping && (
                <div className="flex flex-col gap-2 mt-2">
                  <p className="text-[11px] text-slate-400 font-medium ml-8">
                    Pertanyaan Populer:
                  </p>
                  <div className="flex flex-wrap gap-2 pl-8">
                    {QUICK_ACTIONS.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(action)}
                        className="text-left text-[11px] bg-orange-50 hover:bg-orange-100 text-[#B04C2E] border border-orange-200 px-3 py-1.5 rounded-full transition-colors"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Indikator Mengetik */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mb-1">
                      <Bot className="w-3.5 h-3.5 text-[#B04C2E]" />
                    </div>
                    <div className="bg-white border border-orange-100 p-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Area Input */}
          <div className="p-3 bg-white border-t border-orange-100 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ketik pertanyaan Anda..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-[13px] focus:outline-none focus:border-[#B04C2E] focus:bg-white transition-colors"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="bg-[#B04C2E] text-white p-2 rounded-full hover:bg-[#9A5034] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tombol Melayang (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}
          bg-gradient-to-tr from-[#9A5034] to-[#B04C2E] text-white p-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 relative group`}
      >
        <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 border-2 border-white rounded-full"></span>
        <Bot className="w-5 h-5" />
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-800 text-white text-xs px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
          Butuh bantuan?
          <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
        </div>
      </button>
    </div>
  );
}
