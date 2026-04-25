import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Bot, Send, CornerDownLeft } from "lucide-react";

const Chatbot = ({ isOpen, onToggle, messages, onSendMessage }) => {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === "user") {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform z-40"
        aria-label="Toggle Chatbot"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      <div
        className={`fixed bottom-24 right-6 w-[380px] h-[550px] bg-white border border-slate-300 rounded-xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out z-50 ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <div className="p-4 border-b bg-slate-50 rounded-t-xl flex items-center gap-3">
          <Bot className="h-7 w-7 text-indigo-600" />
          <div>
            <h3 className="font-bold text-lg text-slate-800">
              Health & Disaster Expert
            </h3>
            <p className="text-xs text-slate-500">Powered by Gemini</p>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-slate-100">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${msg.role === "user" ? "bg-indigo-500 text-white" : "bg-white text-slate-700 border"}`}
                >
                  <p className="text-sm">{msg.parts[0].text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-white text-slate-700 border">
                  <div className="flex items-center space-x-1">
                    <span className="h-2 w-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-slate-300 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 border-t bg-white rounded-b-xl">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
              className="w-full bg-slate-100 border-slate-300 rounded-lg py-2 pl-4 pr-12 focus:ring-indigo-500 focus:border-indigo-500"
            />

            <button
              onClick={handleSend}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            Press <CornerDownLeft size={12} className="inline-block" /> to send.
          </p>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
