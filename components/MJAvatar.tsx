
import React from 'react';

interface MJAvatarProps {
  isThinking?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const MJAvatar: React.FC<MJAvatarProps> = ({ isThinking = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      <div className={`absolute inset-0 bg-blue-100 rounded-full ${isThinking ? 'animate-ping opacity-75' : 'opacity-0'}`}></div>
      <div className={`relative bg-white rounded-full border-4 border-blue-500 flex items-center justify-center shadow-lg transition-transform duration-300 ${isThinking ? 'scale-110' : 'scale-100'}`}>
         <span className="text-2xl">🤖</span>
      </div>
      {isThinking && (
        <div className="absolute -top-2 -right-2 flex space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
          <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
        </div>
      )}
    </div>
  );
};

export default MJAvatar;
