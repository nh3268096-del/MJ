
import React from 'react';
import { Message, Sender } from '../types';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isMJ = message.sender === Sender.MJ;
  const content = message.structuredContent;

  return (
    <div className={`flex w-full mb-6 ${isMJ ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[90%] px-5 py-4 rounded-3xl shadow-sm text-sm md:text-base leading-relaxed ${
        isMJ 
          ? 'bg-white text-gray-800 rounded-tl-none border border-blue-50 shadow-[0_2px_12px_rgba(59,130,246,0.08)]' 
          : 'bg-blue-600 text-white rounded-tr-none shadow-[0_4px_12px_rgba(37,99,235,0.2)]'
      }`}>
        {isMJ && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">MJ Teacher • {content?.subject || 'সাধারণ'}</span>
            {content?.type !== 'Normal' && (
              <span className="bg-blue-100 text-blue-700 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">{content?.type}</span>
            )}
          </div>
        )}

        <div className="whitespace-pre-wrap font-medium">
          {message.text}
        </div>

        {/* Structured Content Rendering */}
        {isMJ && content && (
          <div className="mt-4 space-y-4">
            {/* MCQ Options */}
            {content.type === "MCQ" && content.options && (
              <div className="grid grid-cols-1 gap-2 mt-2">
                {content.options.map((opt, idx) => (
                  <button 
                    key={idx}
                    className="text-left px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-900 text-sm hover:bg-blue-600 hover:text-white transition-colors font-semibold"
                    onClick={() => alert(`সঠিক উত্তরটি হলো: ${content.answer}`)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* CQ Parts */}
            {content.type === "CQ" && content.cqParts && (
              <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <span className="inline-block bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded mr-2 uppercase">ক. জ্ঞানমূলক</span>
                  <p className="mt-1 text-gray-700">{content.cqParts.ka}</p>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <span className="inline-block bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded mr-2 uppercase">খ. অনুধাবনমূলক</span>
                  <p className="mt-1 text-gray-700">{content.cqParts.kha}</p>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <span className="inline-block bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded mr-2 uppercase">গ. প্রয়োগমূলক</span>
                  <p className="mt-1 text-gray-700">{content.cqParts.ga}</p>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <span className="inline-block bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded mr-2 uppercase">ঘ. বিশ্লেষণমূলক</span>
                  <p className="mt-1 text-gray-700">{content.cqParts.gha}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className={`text-[10px] mt-3 flex items-center font-bold tracking-tight ${isMJ ? 'text-gray-400' : 'text-blue-100 opacity-80'}`}>
          <svg className="w-2.5 h-2.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          {message.timestamp.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
