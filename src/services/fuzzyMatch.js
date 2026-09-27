export function levenshtein(a, b) {
    const la = a.length, lb = b.length;
    const dp = Array.from({ length: la + 1 }, () => Array(lb + 1).fill(0));
    for (let i = 0; i <= la; i++) dp[i][0] = i;
    for (let j = 0; j <= lb; j++) dp[0][j] = j;
    for (let i = 1; i <= la; i++) {
        for (let j = 1; j <= lb; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
        }
    }
    return dp[la][lb];
}

export function findRelic(input, allRelics) {
    const lower = input.toLowerCase();
    if (allRelics.includes(input)) return input;
    const ci = allRelics.find(r => r.toLowerCase() === lower);
    if (ci) return ci;
    const partial = allRelics.find(r => r.toLowerCase() === lower || r.toLowerCase().startsWith(lower));
    return partial || null;
}

export function fuzzyMatchRelic(name, allRelics) {
    const exact = findRelic(name, allRelics);
    if (exact) {
        return { name: exact, original: name, corrected: false, ambiguous: false, candidates: [] };
    }

    const nameLower = name.toLowerCase();
    const tierMatch = nameLower.match(/^(axi|lith|meso|neo)\s+(.+)/);
    const tier = tierMatch ? tierMatch[1] : null;
    const suffix = tierMatch ? tierMatch[2] : nameLower;

    const candidates = allRelics
        .filter(r => {
            const rLower = r.toLowerCase();
            if (tier && !rLower.startsWith(tier)) return false;
            const rSuffix = tier ? rLower.slice(tier.length).trim() : rLower;
            return levenshtein(rSuffix, suffix) <= 1;
        })
        .sort((a, b) => {
            const aSuffix = a.toLowerCase().replace(/^(axi|lith|meso|neo)\s+/i, '');
            const bSuffix = b.toLowerCase().replace(/^(axi|lith|meso|neo)\s+/i, '');
            return levenshtein(aSuffix, suffix) - levenshtein(bSuffix, suffix);
        })
        .slice(0, 3);

    if (candidates.length > 0) {
        return { name: candidates[0], original: name, corrected: true, ambiguous: candidates.length > 1, candidates };
    }

    return null;
}

export function extractRelics(text, allRelics) {
    const results = [];
    const seen = new Set();
    const lines = text.split(/\n/);
    const relicPattern = /\b((?:Axi|Lith|Meso|Neo)\s+[A-Za-z]\d+(?:\s+Relic)?(?:\s*\[.*?\])?)\b/gi;

    for (const line of lines) {
        let match;
        while ((match = relicPattern.exec(line)) !== null) {
            const condMatch = match[1].match(/\[([^\]]+)\]/);
            const condition = condMatch ? condMatch[1].trim() : null;

            let name = match[1]
                .replace(/\s*Relic\s*/gi, ' ')
                .replace(/\s*\[.*?\]\s*/g, '')
                .replace(/\s+/g, ' ')
                .trim();
            name = name.replace(/^(axi|lith|meso|neo)/i, m => m.charAt(0).toUpperCase() + m.slice(1).toLowerCase());
            name = name.replace(/^(Axi|Lith|Meso|Neo)\s+([a-zA-Z])(\d+)/i, (_, tier, letter, num) => `${tier} ${letter.toUpperCase()}${num}`);

            const result = fuzzyMatchRelic(name, allRelics);
            if (result && !seen.has(result.name)) {
                seen.add(result.name);
                results.push({ ...result, condition });
            }
        }
    }
    return results;
}
