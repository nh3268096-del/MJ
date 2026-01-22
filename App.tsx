
import React, { useState, useRef, useEffect } from 'react';
import MJAvatar from './components/MJAvatar';
import ChatBubble from './components/ChatBubble';
import { Message, Sender, QuestionContent } from './types';
import { generateStructuredResponse } from './services/geminiService';
import { questionBank, getRandomQuestion } from './services/questionBank';

const QUICK_ACTIONS = [
  { label: "র‍্যান্ডম প্রশ্ন 🎲", query: "random_question_from_bank" },
  { label: "পদার্থবিজ্ঞান MCQ", query: "পদার্থবিজ্ঞান থেকে ১টি গুরুত্বপূর্ণ MCQ দাও" },
  { label: "গণিত CQ", query: "বীজগণিত থেকে ১টি সৃজনশীল প্রশ্ন (CQ) এবং সমাধান দাও" },
  { label: "ICT টিপস", query: "বাইনারি থেকে ডেসিমাল করার পদ্ধতি বলো" },
];

const THINKING_STEPS = [
  "MJ উত্তর তৈরি করছে... 🤖",
  "সিলেবাস যাচাই করা হচ্ছে...",
  "তথ্য বিন্যাস করা হচ্ছে...",
];

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "MJ: আমি তোমার Class 9–10 শিক্ষক 🤖\nনাহিদ, আমি তোমাকে ৯ম ও ১০ম শ্রেণীর সিলেবাস অনুযায়ী পড়াশোনায় সাহায্য করতে তৈরি হয়েছি। আজ আমরা কোন বিষয়টি আলোচনা করবো?",
      sender: Sender.MJ,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  useEffect(() => {
    let interval: any;
    if (isThinking) {
      setThinkingStep(0);
      interval = setInterval(() => {
        setThinkingStep((prev) => (prev + 1) % THINKING_STEPS.length);
      }, 1200);
    } else {
      setThinkingStep(0);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isThinking]);

  const handleSend = async (text?: string) => {
    const query = text || inputValue.trim();
    if (!query) return;

    // Add user message to UI
    if (query !== "random_question_from_bank") {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: query,
        sender: Sender.USER,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
    }

    setInputValue('');
    setIsThinking(true);

    const lowerText = query.toLowerCase();

    // 1. Random Question logic
    if (query === "random_question_from_bank") {
      setTimeout(() => {
        const content = getRandomQuestion();
        let displayText = content.question;
        if (content.type === "Normal" && content.explanation) {
          displayText = content.explanation;
        }

        const mjResponse: Message = {
          id: Date.now().toString(),
          text: displayText,
          sender: Sender.MJ,
          timestamp: new Date(),
          structuredContent: content
        };
        setMessages(prev => [...prev, mjResponse]);
        setIsThinking(false);
      }, 1000);
      return;
    }

    // 2. Simple search algorithm (as seen in user's Kotlin snippet)
    // Matches if input contains the first 8 characters of a question in the bank
    let localMatch: QuestionContent | null = null;
    for (const q of questionBank) {
      const matchCriteria = q.question.substring(0, 8);
      if (query.includes(matchCriteria)) {
        localMatch = q;
        break;
      }
    }

    if (localMatch) {
      setTimeout(() => {
        let replyText = localMatch!.question;
        if (localMatch!.type === "MCQ") {
          replyText = `${localMatch!.question}\n${localMatch!.options?.join('\n')}\n\nসঠিক উত্তর: ${localMatch!.answer}`;
        } else if (localMatch!.type === "Normal" || localMatch!.type === "CQ") {
          replyText = `${localMatch!.question}\n\nউত্তর: ${localMatch!.explanation || (localMatch!.cqParts ? 'সৃজনশীল উত্তর নিচে দেখুন' : '')}`;
        }

        const mjResponse: Message = {
          id: Date.now().toString(),
          text: replyText,
          sender: Sender.MJ,
          timestamp: new Date(),
          structuredContent: localMatch!
        };
        setMessages(prev => [...prev, mjResponse]);
        setIsThinking(false);
      }, 1000);
      return;
    }

    // 3. Local instant keyword replies
    if (lowerText.includes("তৈরি") || lowerText.includes("বানিয়ে") || lowerText.includes("বানানো") || lowerText.includes("creator")) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: "MJ: আমাকে Nahid তৈরি করেছে। আমি তার বানানো Class 9-10 এর Bangla AI helper 🤖",
          sender: Sender.MJ,
          timestamp: new Date()
        }]);
        setIsThinking(false);
      }, 800);
      return;
    }

    // 4. Gemini Fallback for general questions
    try {
      const jsonResponse = await generateStructuredResponse(query);
      const content: QuestionContent = JSON.parse(jsonResponse);

      let displayText = content.question;
      if (content.type === "Normal" && content.explanation) {
        displayText = content.explanation;
      }

      const mjResponse: Message = {
        id: Date.now().toString(),
        text: displayText,
        sender: Sender.MJ,
        timestamp: new Date(),
        structuredContent: content
      };
      setMessages(prev => [...prev, mjResponse]);
    } catch (err) {
      const errorResponse: Message = {
        id: Date.now().toString(),
        text: "ইন্টারনেট সমস্যা হচ্ছে 😢। আবার চেষ্টা করো নাহিদ।",
        sender: Sender.MJ,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white shadow-2xl overflow-hidden font-['Hind_Siliguri'] border-x border-gray-200">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <MJAvatar size="sm" isThinking={isThinking} />
          <div>
            <h1 className="text-lg font-bold text-blue-900 leading-tight">MJ - AI Teacher</h1>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
              Class 9-10 (SSC)
            </p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([{ id: 'init', text: 'MJ: চলো নতুন কোনো অধ্যায় শুরু করি! 📚', sender: Sender.MJ, timestamp: new Date() }])}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </header>

      {/* Chat Area (Android chatView mapping) */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 chat-container bg-[#F9FAFB]">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isThinking && (
          <div className="flex flex-col space-y-2 ml-2 mb-4 p-4 bg-white rounded-2xl border border-blue-100 shadow-sm max-w-[260px]">
            <div className="flex items-center space-x-2 text-blue-500 text-[10px] font-bold uppercase tracking-wider">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
              </div>
              <span>MJ বিশ্লেষণ করছে</span>
            </div>
            <p className="text-sm text-blue-800 font-medium">{THINKING_STEPS[thinkingStep]}</p>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      {/* Bottom Section (Android input/button mapping) */}
      <footer className="bg-white border-t border-gray-100 p-4">
        {/* Quick Actions */}
        <div className="flex space-x-2 overflow-x-auto pb-4 no-scrollbar">
          {QUICK_ACTIONS.map((action, i) => (
            <button
              key={i}
              onClick={() => handleSend(action.query)}
              className={`whitespace-nowrap px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-all shadow-sm active:scale-95 ${
                action.query === "random_question_from_bank" 
                ? "bg-purple-50 text-purple-800 border-purple-100 hover:bg-purple-600 hover:text-white"
                : "bg-blue-50 text-blue-800 border-blue-100 hover:bg-blue-600 hover:text-white"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* Input & Button Group */}
        <div className="flex items-center space-x-2">
          <div className="flex-1 flex items-center bg-gray-100 rounded-xl px-4 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="প্রশ্ন লিখো..."
              className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 py-3 text-sm font-medium"
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isThinking}
            className={`px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 ${
              !inputValue.trim() || isThinking 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Send
          </button>
        </div>
        <p className="text-[9px] text-center text-gray-400 mt-3 font-bold tracking-widest uppercase">
          নাহিদ-এর Bangla AI School | পাঠদান: SSC ৯-১০ শ্রেণী
        </p>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;
