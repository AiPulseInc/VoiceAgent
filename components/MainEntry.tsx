import React from 'react';
import { DemoConfig } from '../data/config.interface';
import { autoServiceConfig } from '../data/autoService';
import { dentalConfig } from '../data/dentalClinic';
import { insuranceConfig } from '../data/insuranceAgency';
import { Wrench, Stethoscope, Shield, ArrowRight } from 'lucide-react';

interface MainEntryProps {
  onSelect: (config: DemoConfig) => void;
}

const ConfigCard: React.FC<{ config: DemoConfig; onClick: () => void }> = ({ config, onClick }) => {
    // Helper to resolve icon string to component
    const Icon = () => {
        if (config.theme.icon === 'Wrench') return <Wrench className="text-white" size={32} />;
        if (config.theme.icon === 'Stethoscope') return <Stethoscope className="text-white" size={32} />;
        if (config.theme.icon === 'Shield') return <Shield className="text-white" size={32} />;
        return <Wrench className="text-white" size={32} />;
    };

    return (
        <div 
            onClick={onClick}
            className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl border border-gray-800"
        >
            <div className="absolute inset-0">
                <img 
                    src={config.images.hero} 
                    alt={config.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${config.theme.primaryBg}/90 via-gray-900/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity`} />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-300 group-hover:-translate-y-2">
                <div className={`w-16 h-16 rounded-2xl ${config.theme.primaryBg} flex items-center justify-center mb-6 shadow-lg transform group-hover:rotate-6 transition-transform`}>
                    <Icon />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{config.name}</h2>
                <p className="text-gray-300 text-sm mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {config.id === 'rapidtire' ? 'Automotive Workshop Booking & Triage' : 
                     config.id === 'brightsmile' ? 'Dental Clinic Reception & Emergency' :
                     'Insurance Sales & Claims Processing'}
                </p>
                <div className="flex items-center text-white font-medium">
                    <span className="mr-2">Launch Demo</span>
                    <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform" />
                </div>
            </div>
        </div>
    );
};

const MainEntry: React.FC<MainEntryProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-7xl w-full">
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                AI Agent <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Platform</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Select an industry vertical to experience a specialized Gemini Live voice agent implementation.
            </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            <ConfigCard config={autoServiceConfig} onClick={() => onSelect(autoServiceConfig)} />
            <ConfigCard config={dentalConfig} onClick={() => onSelect(dentalConfig)} />
            <ConfigCard config={insuranceConfig} onClick={() => onSelect(insuranceConfig)} />
        </div>

        <div className="mt-20 text-center">
            <p className="text-gray-600 text-sm">Powered by Google Gemini Multimodal Live API • v2.0</p>
        </div>
      </div>
    </div>
  );
};

export default MainEntry;