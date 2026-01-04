import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import MainEntry from './components/MainEntry';
import { DemoConfig } from './data/config.interface';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const Root = () => {
    const [selectedConfig, setSelectedConfig] = useState<DemoConfig | null>(null);

    if (selectedConfig) {
        return <App config={selectedConfig} onBack={() => setSelectedConfig(null)} />;
    }

    return <MainEntry onSelect={setSelectedConfig} />;
};

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);