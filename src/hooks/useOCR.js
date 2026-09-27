import { useState, useCallback, useRef } from 'react';
import { preprocessImage, runTesseract } from '../services/ocrService';
import { extractRelics } from '../services/fuzzyMatch';

export function useOCR(allRelics) {
    const [ocrState, setOcrState] = useState('idle');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [progress, setProgress] = useState({ status: '', percent: 0 });
    const [rawText, setRawText] = useState('');
    const [detectedRelics, setDetectedRelics] = useState([]);
    const previewUrlRef = useRef(null);
    const processIdRef = useRef(0);

    const processFile = useCallback(async (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        const processId = ++processIdRef.current;

        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
        const nextPreviewUrl = URL.createObjectURL(file);
        previewUrlRef.current = nextPreviewUrl;
        setPreviewUrl(nextPreviewUrl);
        setOcrState('preprocessing');
        setRawText('');
        setDetectedRelics([]);
        setProgress({ status: 'Preprocessing image...', percent: 5 });

        let blob;
        try {
            blob = await preprocessImage(file);
        } catch {
            blob = file;
        }
        if (processId !== processIdRef.current) return;

        setOcrState('recognizing');
        setProgress({ status: 'Loading OCR engine...', percent: 5 });

        try {
            const { text } = await runTesseract(blob, ({ progress: pct }) => {
                if (processId === processIdRef.current) {
                    setProgress({ status: `Recognizing text... ${pct}%`, percent: 10 + pct * 0.85 });
                }
            });
            if (processId !== processIdRef.current) return;

            setRawText(text);
            setDetectedRelics(extractRelics(text, allRelics));
            setOcrState('done');
            setProgress({ status: 'Done!', percent: 100 });
        } catch (err) {
            if (processId !== processIdRef.current) return;
            setOcrState('error');
            setProgress({ status: `Error: ${err.message}`, percent: 100 });
        }
    }, [allRelics]);

    const removeRelic = useCallback((idx) => {
        setDetectedRelics(prev => prev.filter((_, i) => i !== idx));
    }, []);

    const switchCandidate = useCallback((idx, newName) => {
        setDetectedRelics(prev => {
            const copy = [...prev];
            const old = copy[idx];
            // Simple: just replace the name
            copy[idx] = { ...old, name: newName, corrected: false, ambiguous: false, candidates: [] };
            return copy;
        });
    }, []);

    return {
        processFile,
        detectedRelics,
        setDetectedRelics,
        removeRelic,
        switchCandidate,
        ocrState,
        previewUrl,
        progress,
        rawText,
    };
}
