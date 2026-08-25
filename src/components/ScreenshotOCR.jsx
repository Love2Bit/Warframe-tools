import { useState, useCallback } from 'react';
import { useOCR } from '../hooks/useOCR';

export default function ScreenshotOCR({ allRelics, vaultedSet, openModal, disabled }) {
    const { processFile, detectedRelics, removeRelic, switchCandidate, ocrState, previewUrl, progress, rawText } = useOCR(allRelics);
    const [dragover, setDragover] = useState(false);
    const [checkedRows, setCheckedRows] = useState([]);

    const onFile = useCallback((file) => {
        if (file?.type.startsWith('image/')) processFile(file);
    }, [processFile]);

    const checkDetected = () => {
        setCheckedRows(detectedRelics.map(r => {
            const vaulted = vaultedSet.has(r.name);
            return { display: r.name, match: r.name, status: vaulted ? 'vaulted' : 'active', statusText: vaulted ? 'Vaulted' : 'Active', corrected: r.corrected, original: r.original };
        }));
    };

    return (
        <div className="tab-content-inner">
            <div className={`drop-zone ${dragover ? 'dragover' : ''}`} onDragOver={e => { e.preventDefault(); setDragover(true); }} onDragLeave={() => setDragover(false)} onDrop={e => { e.preventDefault(); setDragover(false); onFile(e.dataTransfer.files[0]); }}>
                <input type="file" accept="image/*" onChange={e => onFile(e.target.files[0])} disabled={disabled} />
                <div className="drop-zone-icon">📸</div>
                <div className="drop-zone-text">Drop a screenshot or click to upload</div>
                <div className="drop-zone-hint">Supports PNG, JPG — Warframe inventory screenshots</div>
            </div>
            {previewUrl && <div className="ocr-preview show"><img src={previewUrl} alt="Screenshot preview" /></div>}
            {ocrState !== 'idle' && <div className="ocr-progress show"><div className="ocr-progress-bar"><div className="ocr-progress-fill" style={{ width: `${progress.percent}%` }} /></div><div className="ocr-progress-text">{progress.status}</div></div>}
            {rawText && <pre className="ocr-raw show">{rawText}</pre>}
            {detectedRelics.length > 0 && <div className="ocr-extracted show">
                <div className="ocr-extracted-label">Detected relics (click × to remove, then check):</div>
                <div className="ocr-tag-list">
                    {detectedRelics.map((r, idx) => {
                        const vaulted = vaultedSet.has(r.name);
                        return <span className={`ocr-tag ${vaulted ? 'matched' : 'unmatched'} ${r.ambiguous ? 'ambiguous' : ''}`} key={`${r.name}-${idx}`}>
                            {r.name} {r.condition && <span className="ocr-condition">[{r.condition}]</span>}
                            <span style={{ fontSize: '0.65rem', color: vaulted ? '#f44336' : '#4caf50' }}>{vaulted ? 'VAULTED' : 'ACTIVE'}</span>
                            {r.corrected && <span style={{ fontSize: '0.65rem', color: '#f5a623' }}>(was: {r.original})</span>}
                            <span className="ocr-tag-remove" onClick={() => removeRelic(idx)}>×</span>
                            {r.ambiguous && r.candidates?.length > 1 && <span className="ocr-candidates">Did you mean: {r.candidates.map(c => <button className="ocr-candidate" key={c} onClick={() => switchCandidate(idx, c)}>{c}</button>)}</span>}
                        </span>;
                    })}
                </div>
                <button className="btn" onClick={checkDetected}>Check Detected Relics</button>
            </div>}
            {checkedRows.length > 0 && <div className="batch-results">
                <table><thead><tr><th>Relic</th><th>Status</th></tr></thead><tbody>{checkedRows.map((r, i) => <tr key={`${r.display}-${i}`}><td><span className="clickable-relic" onClick={() => openModal(r.match)}>{r.display}</span>{r.corrected && <small> (was: {r.original})</small>}</td><td><span className={`batch-badge ${r.status}`}>{r.statusText}</span></td></tr>)}</tbody></table>
                <div className="batch-stats"><div><span style={{ color: '#f44336' }}>{checkedRows.filter(r => r.status === 'vaulted').length}</span> vaulted</div><div><span style={{ color: '#4caf50' }}>{checkedRows.filter(r => r.status === 'active').length}</span> active</div></div>
            </div>}
        </div>
    );
}
