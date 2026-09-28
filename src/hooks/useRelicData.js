import { useState, useEffect } from 'react';
import { fetchAllCategory } from '../services/wikiApi';
import { getAllRelicNames, getVaultedRelics } from '../services/warframeItems';

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
                // Step 1: instant vaulted data from warframe-items
                const names = getAllRelicNames();
                const vaulted = getVaultedRelics();
                if (cancelled) return;
                setAllRelics(names.sort());
                setVaultedSet(new Set(vaulted));
                setStatus('ready');

                // Step 2: wiki background refresh — picks up relics released
                // after the generated snapshot without needing a rebuild.
                const [resurgence, wikiRelics, wikiVaulted] = await Promise.all([
                    fetchAllCategory('Category:Prime_Resurgence_Offering'),
                    fetchAllCategory('Category:Relic'),
                    fetchAllCategory('Category:Vaulted_Relics'),
                ]);
                if (cancelled) return;
                setResurgenceSet(new Set(resurgence.map(r => r.title)));

                // Wiki returns utility subpages (Void Relic/ByDucats etc.) — keep only real relics.
                const isRelicPage = t => !t.includes('/') && t !== 'Void Relic';
                const wikiNames = wikiRelics.map(r => r.title).filter(isRelicPage);

                const merged = [...new Set([...names, ...wikiNames])].sort();
                setAllRelics(merged);

                // The wiki's vaulted category is authoritative — it replaces the static
                // snapshot's flags rather than unioning with them, so relics unvaulted
                // (or vaulted) since the last data generation report correctly.
                const known = new Set(merged);
                setVaultedSet(new Set(
                    wikiVaulted
                        .map(r => r.title)
                        .filter(t => isRelicPage(t) && known.has(t))
                ));
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
