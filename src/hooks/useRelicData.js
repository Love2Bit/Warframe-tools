import { useState, useEffect } from 'react';
import { fetchAllCategory } from '../services/wikiApi';

export function useRelicData() {
    const [vaultedSet, setVaultedSet] = useState(new Set());
    const [allRelics, setAllRelics] = useState([]);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const vaulted = await fetchAllCategory('Category:Vaulted_Relics');
                if (cancelled) return;
                const vaultedNames = new Set(vaulted.map(r => r.title));
                setVaultedSet(vaultedNames);

                const all = await fetchAllCategory('Category:Relic', 'page');
                if (cancelled) return;
                const sorted = all.map(r => r.title).sort();
                setAllRelics(sorted);
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
        allRelics,
        status,
        stats: status === 'ready'
            ? `${allRelics.length} relics · ${vaultedSet.size} vaulted · ${activeCount} active`
            : status === 'loading' ? 'Loading relic data...'
            : 'Failed to load data — try refreshing'
    };
}
