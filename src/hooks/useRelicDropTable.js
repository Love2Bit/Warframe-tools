import { useState, useCallback } from 'react';
import { fetchRelicDropTable, fetchItemImages } from '../services/wikiApi';

export function useRelicDropTable() {
    const [isOpen, setIsOpen] = useState(false);
    const [relicName, setRelicName] = useState('');
    const [drops, setDrops] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const openModal = useCallback(async (name) => {
        setRelicName(name);
        setIsOpen(true);
        setLoading(true);
        setError(null);
        setDrops([]);

        // Always use wiki API for drop table — it has item images
        try {
            const rawDrops = await fetchRelicDropTable(name);
            const enriched = await fetchItemImages(rawDrops);
            setDrops(enriched);
        } catch (err) {
            console.error('Relic drop table:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setRelicName('');
        setDrops([]);
        setError(null);
    }, []);

    return { isOpen, relicName, drops, loading, error, openModal, closeModal };
}
