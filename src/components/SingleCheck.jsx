import { useState, useCallback } from 'react';
import { findRelic } from '../services/fuzzyMatch';
import { useAutocomplete } from '../hooks/useAutocomplete';
import AutocompleteDropdown from './AutocompleteDropdown';

export default function SingleCheck({ allRelics, vaultedSet, openModal, disabled }) {
    const [result, setResult] = useState(null);
    const check = useCallback((input) => {
        if (!input?.trim()) return;
        const match = findRelic(input.trim(), allRelics);
        setResult({ input: input.trim(), match, vaulted: match ? vaultedSet.has(match) : false });
    }, [allRelics, vaultedSet]);
    const autocomplete = useAutocomplete(allRelics, check);

    return (
        <div className="tab-content-inner">
            <div className="input-group" ref={autocomplete.wrapperRef}>
                <input type="text" value={autocomplete.value} onChange={autocomplete.onChange} onKeyDown={autocomplete.onKeyDown} placeholder="e.g. Neo V10, Lith A1, Axi S3" autoComplete="off" disabled={disabled} />
                <AutocompleteDropdown matches={autocomplete.matches} show={autocomplete.showDropdown} highlightedIdx={autocomplete.highlightedIdx} vaultedSet={vaultedSet} onSelect={autocomplete.selectItem} />
            </div>
            <button className="btn" onClick={() => check(autocomplete.value)} disabled={disabled}>Check Relic</button>
            {result && (
                <div className={`result-card ${result.match ? (result.vaulted ? 'vaulted' : 'not-vaulted') : 'not-found'}`}>
                    <div className="result-icon">{result.match ? (result.vaulted ? '🔒' : '✅') : '?'}</div>
                    <div className="result-label">{result.match ? (result.vaulted ? 'VAULTED' : 'NOT VAULTED') : 'Relic Not Found'}</div>
                    <div className="result-relic">
                        {result.match ? <span className="clickable-relic" onClick={() => openModal(result.match)}>{result.match}</span> : result.input}
                    </div>
                    <div className="result-source">{result.match ? 'Data source: WARFRAME Wiki API' : 'Check the spelling and try again'}</div>
                    <a className="result-link" href={`https://wiki.warframe.com/w/${encodeURIComponent(result.match || result.input)}`} target="_blank" rel="noreferrer">View on WARFRAME Wiki →</a>
                </div>
            )}
        </div>
    );
}
