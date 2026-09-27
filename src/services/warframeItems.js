// Warframe Items integration - browser-safe version
// Data extracted from @wfcd/items package (node_modules/@wfcd/items/data/json/Relics.json)
// Run: node scripts/generate-relics-data.js to regenerate

import relicData from '../data/relics.json';

const CDN_BASE = 'https://cdn.warframestat.us/img';

// Build lookup maps
const relicsByName = new Map();
const allRelicNames = [];
const vaultedSet = new Set();

for (const relic of relicData) {
    relicsByName.set(relic.name, relic);
    allRelicNames.push(relic.name);
    if (relic.vaulted) {
        vaultedSet.add(relic.name);
    }
}

export function getAllRelicNames() {
    return allRelicNames;
}

export function getVaultedRelics() {
    return Array.from(vaultedSet);
}

export function isVaulted(name) {
    return vaultedSet.has(name);
}

export function getRelicData(name) {
    return relicsByName.get(name) || null;
}

export function getRelicRecord(name) {
    return getRelicData(name);
}

export function getRelicDrops(name) {
    const relic = getRelicData(name);
    if (!relic) return null;
        return relic.rewards.map(reward => ({
        name: reward.name,
        rarity: reward.rarity,
        chance: reward.chance,
        uniqueName: reward.uniqueName,
        imageName: reward.imageName || null,
    }));
}

export function getImageUrl(item) {
    if (!item || !item.imageName) return null;
    return `${CdnBase}/${item.imageName}`;
}

export function getRelicRewards(name) {
    const relic = getRelicData(name);
    if (!relic) return null;
    return relic.rewards || [];
}

export function searchRelics(query) {
    const q = query.toLowerCase();
    return allRelicNames.filter(name => name.toLowerCase().includes(q)).slice(0, 20);
}

export { relicData as relics };
