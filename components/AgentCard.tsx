import React from 'react';
import { AgentType } from '../types';
import { Phone, Clock, CalendarCheck } from 'lucide-react';
import { AgentCardContent } from '../data/config.interface';

interface AgentCardProps {
  type: AgentType;
  content: AgentCardContent;
  btnText: string;
  onTest: (type: AgentType) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ type, content, btnText, onTest }) => {
  const isBooking = type === AgentType.BOOKING;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 flex flex-col h-full shadow-lg relative overflow-hidden group">
      
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${isBooking ? 'from-blue-500/10' : 'from-orange-500/10'} to-transparent rounded-bl-full pointer-events-none`} />

      <div className="mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${isBooking ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400'}`}>
            {isBooking ? <CalendarCheck size={24} /> : <Clock size={24} />}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{content.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{content.description}</p>
      </div>

      <div className="flex-1 space-y-3 mb-6">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Capabilities</h4>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            {content.capabilities.map((cap, i) => (
                <li key={i} className="flex items-start">
                    <span className={`mr-2 ${cap.color}`}>•</span> 
                    {cap.text}
                </li>
            ))}
        </ul>
      </div>

      <button 
        onClick={() => onTest(type)}
        className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-transform active:scale-95 ${
            isBooking 
            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30' 
            : 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-900/30'
        }`}
      >
        <Phone size={18} />
        <span>{btnText}</span>
      </button>
    </div>
  );
};

export default AgentCard;