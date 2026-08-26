import { useState, useEffect } from 'react';
import { fetchAllCategory } from '../services/wikiApi';

const BARO_RELICS = new Set(['Neo O1', 'Axi A2', 'Axi A5', 'Axi M5', 'Axi V8']);

export function useRelicData() {
    const [vaultedSet, setVaultedSet] = useState(new Set());
    const [resurgenceSet, setResurgenceSet] = useState(new Set());
    const [allRelics, setAllRelics] = useState([]);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const [vaulted, all, resurgence] = await Promise.all([
                    fetchAllCategory('Category:Vaulted_Relics'),
                    fetchAllCategory('Category:Relic', 'page'),
                    fetchAllCategory('Category:Prime_Resurgence_Offering'),
                ]);

                if (cancelled) return;
                setVaultedSet(new Set(vaulted.map(r => r.title)));
                setAllRelics(all.map(r => r.title).sort());
                setResurgenceSet(new Set(resurgence.map(r => r.title)));
                setStatus('ready');
            } catch (err) {
                console.error('Failed to load relic data:', err);
                if (!cancelled) setStatus('error');
            }
        }

        load();
        return () => { cancelled = true; };
    }, []);

    const activeCount = allRelics.length - vaultedSet.size;

    return {
        vaultedSet,
        resurgenceSet,
        baroSet: BARO_RELICS,
        allRelics,
        status,
        stats: status === 'ready'
            ? `${allRelics.length} relics · ${vaultedSet.size} vaulted · ${activeCount} active`
            : status === 'loading' ? 'Loading relic data...'
            : 'Failed to load data — try refreshing'
    };
}
