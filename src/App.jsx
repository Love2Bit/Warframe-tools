import { useState, useEffect } from 'react';
import StatusBar from './components/StatusBar';
import TabBar from './components/TabBar';
import SingleCheck from './components/SingleCheck';
import BatchCheck from './components/BatchCheck';
import ScreenshotOCR from './components/ScreenshotOCR';
import RelicDropModal from './components/RelicDropModal';
import { useRelicData } from './hooks/useRelicData';
import { useRelicDropTable } from './hooks/useRelicDropTable';
import './App.css';

function App() {
    const { vaultedSet, resurgenceSet, baroSet, allRelics, status, stats } = useRelicData();
    const { isOpen, relicName, drops, loading, error, openModal, closeModal } = useRelicDropTable();
    const [activeTab, setActiveTab] = useState('single');

    useEffect(() => {
        const handleEscape = e => { if (e.key === 'Escape') closeModal(); };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [closeModal]);

    const disabled = status !== 'ready';

    return (
        <div className="app-shell">
            <main className="container">
                <h1>Warframe Relic <span>Vault Checker</span></h1>
                <p className="subtitle">Check if a Void Relic is vaulted or currently in rotation</p>
                <StatusBar status={status} stats={stats} />
                <TabBar activeTab={activeTab} onChange={setActiveTab} />

                {activeTab === 'single' && <SingleCheck allRelics={allRelics} vaultedSet={vaultedSet} resurgenceSet={resurgenceSet} baroSet={baroSet} openModal={openModal} disabled={disabled} />}
                {activeTab === 'batch' && <BatchCheck allRelics={allRelics} vaultedSet={vaultedSet} resurgenceSet={resurgenceSet} baroSet={baroSet} openModal={openModal} disabled={disabled} />}
                {activeTab === 'ocr' && <ScreenshotOCR allRelics={allRelics} vaultedSet={vaultedSet} resurgenceSet={resurgenceSet} baroSet={baroSet} openModal={openModal} disabled={disabled} />}

                <footer>Data from <a href="https://wiki.warframe.com" target="_blank" rel="noreferrer">WARFRAME Wiki</a> · Not affiliated with Digital Extremes</footer>
            </main>
            <RelicDropModal isOpen={isOpen} relicName={relicName} drops={drops} loading={loading} error={error} onClose={closeModal} />
        </div>
    );
}

export default App;
