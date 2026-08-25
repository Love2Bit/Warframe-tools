import { useState, useEffect, useCallback } from 'react';

export function useAutocomplete(allRelics, onSelect) {
    const [value, setValue] = useState('');
    const [matches, setMatches] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlightedIdx, setHighlightedIdx] = useState(-1);
    const [wrapperElement, setWrapperElement] = useState(null);

    const wrapperRef = useCallback((node) => {
        setWrapperElement(node);
    }, []);

    useEffect(() => {
        function handleClickOutside(e) {
            if (wrapperElement && !wrapperElement.contains(e.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [wrapperElement]);

    const onChange = useCallback((e) => {
        const val = e.target.value;
        setValue(val);
        setHighlightedIdx(-1);
        const trimmed = val.trim().toLowerCase();
        if (!trimmed) {
            setMatches([]);
            setShowDropdown(false);
            return;
        }
        const filtered = allRelics.filter(r => r.toLowerCase().includes(trimmed)).slice(0, 15);
        setMatches(filtered);
        setShowDropdown(filtered.length > 0);
    }, [allRelics]);

    const onKeyDown = useCallback((e) => {
        if (!showDropdown || matches.length === 0) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (value.trim()) onSelect(value.trim());
            }
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIdx(prev => Math.min(prev + 1, matches.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIdx(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const selected = highlightedIdx >= 0 ? matches[highlightedIdx] : value.trim();
            if (selected) {
                setValue(selected);
                setShowDropdown(false);
                setHighlightedIdx(-1);
                onSelect(selected);
            }
        } else if (e.key === 'Escape') {
            setShowDropdown(false);
            setHighlightedIdx(-1);
        }
    }, [showDropdown, matches, highlightedIdx, value, onSelect]);

    const selectItem = useCallback((name) => {
        setValue(name);
        setShowDropdown(false);
        setHighlightedIdx(-1);
        onSelect(name);
    }, [onSelect]);

    return { value, onChange, onKeyDown, matches, showDropdown, highlightedIdx, selectItem, wrapperRef };
}
