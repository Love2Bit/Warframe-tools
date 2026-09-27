import { useState, useCallback } from 'react';
import { findRelic } from '../services/fuzzyMatch';
import ResultsTable from './ResultsTable';

export default function BatchCheck({ allRelics, vaultedSet, resurgenceSet, baroSet, openModal, disabled }) {
    const [inputText, setInputText] = useState('');
    const [rows, setRows] = useState([]);

    const checkBatch = useCallback(() => {
        const lines = inputText.split('\n').map(l => l.trim()).filter(Boolean);
        if (!lines.length) return;
        setRows(lines.map(input => {
            const match = findRelic(input, allRelics);
            if (!match) return { display: input, match: null, status: 'not-found', statusText: 'Not Found' };
            const vaulted = vaultedSet.has(match);
            return { display: match, match, status: vaulted ? 'vaulted' : 'active', statusText: vaulted ? 'Vaulted' : 'Active' };
        }));
    }, [inputText, allRelics, vaultedSet]);

    const vaulted = rows.filter(r => r.status === 'vaulted').length;
    const active = rows.filter(r => r.status === 'active').length;
    const notFound = rows.filter(r => r.status === 'not-found').length;

    return (
        <div className="tab-content-inner">
            <p className="batch-hint">Paste relic names, one per line</p>
            <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder={'Neo V10\nLith A1\nAxi S3\nMeso F2'} disabled={disabled} />
            <button className="btn" onClick={checkBatch} disabled={disabled} style={{ marginTop: '1rem' }}>Check All</button>
            {rows.length > 0 && <>
                <ResultsTable rows={rows} openModal={openModal} resurgenceSet={resurgenceSet} baroSet={baroSet} />
                <div className="batch-stats">
                    {vaulted > 0 && <div><span style={{ color: '#f44336' }}>{vaulted}</span> vaulted</div>}
                    {active > 0 && <div><span style={{ color: '#4caf50' }}>{active}</span> active</div>}
                    {notFound > 0 && <div><span style={{ color: '#ff9800' }}>{notFound}</span> not found</div>}
                </div>
            </>}
        </div>
    );
}
